export interface Poll {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    author: {
      id: string;
    };
    options: PollOption[];
  }
  
  export interface PollOption {
    id: string;
    name: string;
  }
  
  export interface Vote {
    id: string;
    pollID: string;
    optionID: string;
    isValid: boolean;
    createdAt: string;
    voter: {
      id: string;
    };
  }

  export interface PollWithVotes extends Poll {
    votes: Vote[];
    optionsWithVotes: (PollOption & { 
      voteCount: number;
      votes: Vote[];
    })[];
    totalVotes: number;
  }

  export interface ComposeDBResponse<T> {
    data?: T;
    errors?: any[];
  }
  
  export interface EdgeNode<T> {
    edges: {
      node: T;
    }[];
  }

  export interface PollsResponse {
    pollIndex: EdgeNode<Poll>;
  }
  
  export interface VotesResponse {
    voteIndex: EdgeNode<Vote>;
  }
  
  export interface CreatePollResponse {
    createPoll: {
      document: Poll;
    };
  }
  
  export interface CreateVoteResponse {
    createVote: {
      document: Vote;
    };
  }
  
  export interface PollsByAuthorResponse {
    node: {
      pollList: EdgeNode<Poll>;
    };
  }
  
  export interface VotesByVoterResponse {
    node: {
      voteList: EdgeNode<Vote>;
    };
  }
  
  export interface PollsWithVotesResponse {
    pollsWithVotes: PollWithVotes[];
  }

  export function isPollsResponse(response: any): response is ComposeDBResponse<PollsResponse> {
    return response?.data?.pollIndex?.edges !== undefined;
  }
  
  export function isVotesResponse(response: any): response is ComposeDBResponse<VotesResponse> {
    return response?.data?.voteIndex?.edges !== undefined;
  }
  
  export function isCreatePollResponse(response: any): response is ComposeDBResponse<CreatePollResponse> {
    return response?.data?.createPoll?.document !== undefined;
  }
  
  export function isCreateVoteResponse(response: any): response is ComposeDBResponse<CreateVoteResponse> {
    return response?.data?.createVote?.document !== undefined;
  }
  
  export function isPollsByAuthorResponse(response: any): response is ComposeDBResponse<PollsByAuthorResponse> {
    return response?.data?.node?.pollList?.edges !== undefined;
  }
  
  export function isVotesByVoterResponse(response: any): response is ComposeDBResponse<VotesByVoterResponse> {
    return response?.data?.node?.voteList?.edges !== undefined;
  }
  
  export function isPollsWithVotesResponse(response: any): response is ComposeDBResponse<PollsWithVotesResponse> {
    return response?.data?.pollsWithVotes !== undefined;
  }
  
  export function isErrorResponse(response: any): response is { error: any } {
    return response?.error !== undefined;
  }