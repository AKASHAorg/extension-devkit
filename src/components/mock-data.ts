interface Poll {
  id: string;
  title: string;
  description: string;
  options: { id: string; value: string; percentage: number }[];
}

interface PollSelection {
  did: string;
  pollId: string;
  optionId: string;
  value: boolean;
}

const POLLS: Poll[] = [
  {
    id: 'poll_1',
    title: 'Best Programming Language?',
    description: 'Which programming language do you prefer the most?',
    options: [
      { id: 'opt_1', value: 'JavaScript', percentage: 0 },
      { id: 'opt_2', value: 'Python', percentage: 0 },
      { id: 'opt_3', value: 'Rust', percentage: 0 },
      { id: 'opt_4', value: 'Go', percentage: 0 },
    ],
  },
  {
    id: 'poll_2',
    title: 'Favorite Crypto Chain?',
    description: 'Which blockchain do you think has the most potential?',
    options: [
      { id: 'opt_5', value: 'Ethereum', percentage: 45 },
      { id: 'opt_6', value: 'Solana', percentage: 35 },
      { id: 'opt_7', value: 'SUI', percentage: 10 },
      { id: 'opt_8', value: 'Polygon', percentage: 10 },
    ],
  },
  {
    id: 'poll_3',
    title: 'Preferred Social Media Platform?',
    description: 'Which social media platform do you use the most?',
    options: [
      { id: 'opt_9', value: 'Twitter/X', percentage: 50 },
      { id: 'opt_10', value: 'Reddit', percentage: 20 },
      { id: 'opt_11', value: 'Instagram', percentage: 20 },
      { id: 'opt_12', value: 'Facebook', percentage: 10 },
    ],
  },
  {
    id: 'poll_4',
    title: 'Favorite Mobile OS?',
    description: 'Which mobile operating system do you prefer?',
    options: [
      { id: 'opt_13', value: 'iOS', percentage: 60 },
      { id: 'opt_14', value: 'Android', percentage: 40 },
    ],
  },
  {
    id: 'poll_5',
    title: 'Best AI Model?',
    description: 'Which AI model do you think is the best?',
    options: [
      { id: 'opt_15', value: 'ChatGPT', percentage: 50 },
      { id: 'opt_16', value: 'Claude', percentage: 20 },
      { id: 'opt_17', value: 'Gemini', percentage: 15 },
      { id: 'opt_18', value: 'Llama', percentage: 15 },
    ],
  },
  {
    id: 'poll_6',
    title: 'Favorite Coding Framework?',
    description: 'Which web development framework do you use the most?',
    options: [
      { id: 'opt_19', value: 'React', percentage: 50 },
      { id: 'opt_20', value: 'Vue', percentage: 20 },
      { id: 'opt_21', value: 'Angular', percentage: 15 },
      { id: 'opt_22', value: 'Svelte', percentage: 15 },
    ],
  },
  {
    id: 'poll_7',
    title: 'Best NFT Marketplace?',
    description: 'Where do you buy or sell NFTs the most?',
    options: [
      { id: 'opt_23', value: 'OpenSea', percentage: 60 },
      { id: 'opt_24', value: 'Blur', percentage: 20 },
      { id: 'opt_25', value: 'Magic Eden', percentage: 10 },
      { id: 'opt_26', value: 'Tensor', percentage: 10 },
    ],
  },
  {
    id: 'poll_8',
    title: 'Preferred Crypto Wallet?',
    description: 'Which crypto wallet do you trust the most?',
    options: [
      { id: 'opt_27', value: 'MetaMask', percentage: 40 },
      { id: 'opt_28', value: 'Phantom', percentage: 30 },
      { id: 'opt_29', value: 'Trust Wallet', percentage: 20 },
      { id: 'opt_30', value: 'Ledger', percentage: 10 },
    ],
  },
  {
    id: 'poll_9',
    title: 'Best Web3 Gaming Project?',
    description: 'Which Web3 gaming project are you most excited about?',
    options: [
      { id: 'opt_31', value: 'Illuvium', percentage: 35 },
      { id: 'opt_32', value: 'Star Atlas', percentage: 25 },
      { id: 'opt_33', value: 'Axie Infinity', percentage: 20 },
      { id: 'opt_34', value: 'The Sandbox', percentage: 20 },
    ],
  },
  {
    id: 'poll_10',
    title: 'Best Stablecoin?',
    description: 'Which stablecoin do you consider the safest?',
    options: [
      { id: 'opt_35', value: 'USDC', percentage: 50 },
      { id: 'opt_36', value: 'USDT', percentage: 40 },
      { id: 'opt_37', value: 'DAI', percentage: 10 },
    ],
  },
];

const POLL_SELECTIONS: PollSelection[] = [
  {
    did: 'did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef',
    pollId: 'poll_1',
    optionId: 'opt_1',
    value: true,
  },
  {
    did: 'did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef',
    pollId: 'poll_3',
    optionId: 'opt_10',
    value: false,
  },
  {
    did: 'did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef',
    pollId: 'poll_6',
    optionId: 'opt_19',
    value: true,
  },
  {
    did: 'did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef',
    pollId: 'poll_9',
    optionId: 'opt_32',
    value: false,
  },
];

export { POLLS, POLL_SELECTIONS };
