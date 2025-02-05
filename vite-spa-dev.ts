import chokidar, { FSWatcher } from 'chokidar';
import { ResolvedConfig, Plugin } from 'vite';
import { WebSocketServer } from 'ws';
import { createServer, Server } from "https";
import { existsSync, statSync, createReadStream } from 'fs';
import mime from 'mime';
import path from 'path';

export type HMRPluginOptions = {
    targetFilePath: string;
    server: {
        https?: boolean;
        host: string;
        port: number;
        hmrTopic: string;
    }
}

export const ViteSpaDev = (opt: HMRPluginOptions): Plugin => {
    const options = opt;
    let config: ResolvedConfig;
    let wsServer: WebSocketServer;
    let fileWatcher: FSWatcher;
    let server: Server;
    return {
        name: 'hmr-dev',
        apply: 'build',
        configResolved(resolved: ResolvedConfig) {
            config = resolved;
        },
        async transform(code, id) {
            if (id.endsWith(options.targetFilePath)) {
                const packageJSON = await import('./package.json');
                return `
                ${code}
                if (__DEV__) {
                    const projectName = '${packageJSON.name}';
                    const wsNamespace = '${packageJSON.name}_ws';
                    const listenHMR = () => {
                        global[wsNamespace] = new WebSocket('${options.server.https ? 'wss' : 'ws'}://localhost:${options.server.port}');
                        global[wsNamespace].addEventListener('open', async () => {
                            console.info('HMR - enabled. Make sure you create an app with Extension ID: ${packageJSON.name}');
                            console.info('Please consult the docs for more info: https://docs.akasha.world/');
                        });
                        global[wsNamespace].addEventListener('error', (event) => {
                            console.warn('HMR - WebSocket failed to connect');
                        });
                        global[wsNamespace].addEventListener('message', async (event) => {
                            try {
                                const { type: evType, path: changedFile, mainFile } = JSON.parse(event.data);
                                if (evType === '${options.server.hmrTopic}') {
                                    if (System) {
                                    const sspa = await System.import(System.resolve('single-spa'));
                                    if (!sspa) {
                                        console.warn('Cannot update modules. single-spa not found');
                                        return;
                                    }
                                    
                                    System.delete(changedFile);
                                    System.import(changedFile);

                                    if (sspa.getAppStatus(projectName) === sspa.MOUNTED) {
                                        await sspa.unloadApplication(projectName);
                                    }
                                }
                            }
                            } catch(err) {
                                console.warn('HMR - failed to reload.', err);
                            }
                        });
                        global[wsNamespace].addEventListener('close', () => {
                            console.log('HMR - connection closed. will retry in 3s');
                            setTimeout(() => {
                                listenHMR();
                            }, 3000);
                        });
                    }
                        
                    if (typeof WebSocket !== 'undefined' && typeof global[wsNamespace] === 'undefined') {
                        listenHMR();
                    }
                }
          `;
            }
            return code;
        },
        closeBundle() {
            const isHTTPSServer = Boolean(options.server.https);
            const srvURI = 'localhost';
            const srvUrl = `${isHTTPSServer ? 'https://' : 'http://'}${srvURI}:${options.server.port}`;
            let { output } = config.build.rollupOptions;
            if (output && Array.isArray(output)) {
                output = output[0];
            }
            const entryFile = output?.entryFileNames;
            const outDir = config.build.outDir;

            const mainFile = `${srvUrl}/${outDir}/${entryFile}`;

            if (!wsServer) {
                server = createServer({
                    cert: config.server.https?.cert,
                    key: config.server.https?.key
                }, (req, res) => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Expires', '0');
                    if (!req.url) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        return res.end(`File not found: ${req.url}`);
                    }

                    let filePath = path.join(process.cwd(), req.url.split('?')[0]);
                    
                    if (existsSync(filePath) && statSync(filePath).isFile()) {
                        // wrong or no mimetype messes up with system (or single-spa) :|
                        res.writeHead(200, { 'Content-Type': mime.getType(filePath) || 'application/octet-stream' });

                        createReadStream(filePath)
                            .pipe(res);
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end(`File not found: ${req.url}`);
                    }
                });

                wsServer = new WebSocketServer({ server });

                const rollupOutput = config.build.rollupOptions.output;
                if (typeof rollupOutput === 'object' && !Array.isArray(rollupOutput)) {
                    fileWatcher = chokidar.watch(`${config.build.outDir}`, {
                        usePolling: true,
                        alwaysStat: true,
                        awaitWriteFinish: true,
                        interval: 50,
                    });

                    fileWatcher.on('all', (ev, path) => {
                        wsServer.clients.forEach(wsClient => {
                            if (wsClient.readyState === 1) {
                                wsClient.send(JSON.stringify({
                                    type: options.server.hmrTopic,
                                    path: `${srvUrl}/${path}`,
                                    mainFile
                                }));
                            }
                        });
                    });
                }

                process.on('SIGINT', () => {
                    console.info('\nHMR - Stopping processes');
                    fileWatcher.close();
                    wsServer.close();
                    process.exit();
                });

                server.listen(options.server.port, options.server.host, () => {
                    console.log(`
************************************************
▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖▗▄▄▄▖ ▗▄▖ ▗▖  ▗▖
▐▌    ▝▚▞▘   █  ▐▌   ▐▛▚▖▐▌▐▌     █  ▐▌ ▐▌▐▛▚▖▐▌
▐▛▀▀▘  ▐▌    █  ▐▛▀▀▘▐▌ ▝▜▌ ▝▀▚▖  █  ▐▌ ▐▌▐▌ ▝▜▌
▐▙▄▄▖▗▞▘▝▚▖  █  ▐▙▄▄▖▐▌  ▐▌▗▄▄▞▘▗▄█▄▖▝▚▄▞▘▐▌  ▐▌
                                                                             
        ▗▄▄▄  ▗▄▄▄▖▗▖  ▗▖▗▖ ▗▖▗▄▄▄▖▗▄▄▄▖
        ▐▌  █ ▐▌   ▐▌  ▐▌▐▌▗▞▘  █    █  
        ▐▌  █ ▐▛▀▀▘▐▌  ▐▌▐▛▚▖   █    █  
        ▐▙▄▄▀ ▐▙▄▄▖ ▝▚▞▘ ▐▌ ▐▌▗▄█▄▖  █  
                                
************************************************
Documentation: https://docs.akasha.world
Server: ${options.server.https ? 'https' : 'http'}://${options.server.host}:${options.server.port}
MainFile: ${mainFile}

🔴 Please open main file url in your browser to make sure that the index file loads.

************************************************
Getting started:
- create a profile on https://next.akasha-world-framework.pages.dev
- create an app on https://next.akasha-world-framework.pages.dev/@akashaorg/app-extensions/my-extensions
- go to release manager and add a new local release
- add the MainFile url from above to the local relase's source field
************************************************
                        `);
                });
            }
        }
    }
}