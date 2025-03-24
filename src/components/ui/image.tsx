"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const ImageContext = React.createContext<{
  loading: boolean;
  hasError: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
} | null>(null);

const useImageContext = () => {
  const context = React.useContext(ImageContext);
  if (!context) {
    throw new Error(
      "`useImageContext` must be used within an `ImageRoot` component"
    );
  }
  return context;
};

const ImageRoot = ({ children, ...props }: React.ComponentProps<"div">) => {
  const [loading, setLoading] = React.useState(true);
  const [hasError, setError] = React.useState(false);

  return (
    <ImageContext.Provider
      data-slot="image-root"
      value={{ loading, hasError, setLoading, setError }}
    >
      <div {...props}>{children}</div>
    </ImageContext.Provider>
  );
};

const ImageFallback = ({ children }: React.ComponentProps<"span">) => {
  const { hasError } = useImageContext();
  return hasError ? <span data-slot="image-fallback">{children}</span> : null;
};

const DelayLoad: React.FC<{
  children: React.ReactNode;
  loadAfter?: number;
}> = ({ children, loadAfter = 300 }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, loadAfter);
    return () => clearTimeout(timer);
  }, [loadAfter]);

  return <>{show ? children : null}</>;
};

const Image = ({
  alt,
  showLoadingIndicator,
  className,
  onLoad,
  onError,
  ...props
}: React.ComponentProps<"img"> & {
  showLoadingIndicator?: boolean;
}) => {
  const { setLoading, setError, loading, hasError } = useImageContext();

  React.useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  return (
    <>
      {showLoadingIndicator && loading && (
        <DelayLoad>
          <div
            data-slot="image-loader"
            className={cn("flex items-center justify-center", className)}
          >
            <Loader2 className={cn("animate-spin text-muted")} />
          </div>
        </DelayLoad>
      )}
      {!hasError && (
        <img
          data-slot="image"
          loading="lazy"
          decoding="async"
          onLoad={(event) => {
            setLoading(false);
            onLoad?.(event);
          }}
          onError={(event) => {
            setError(true);
            setLoading(false);
            onError?.(event);
          }}
          alt={alt}
          className={cn("object-contain", className)}
          {...props}
        />
      )}
    </>
  );
};

export { ImageRoot, ImageFallback, Image };
