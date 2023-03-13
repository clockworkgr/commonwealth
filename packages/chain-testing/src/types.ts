export interface erc20BalanceReq {
  tokenAddress: string;
  address: string;
  convert?: boolean;
}

export interface erc20Transfer {
  tokenAddress: string;
  to: string;
  from?: string;
  amount: string;
  accountIndex?: number;
  fromBank?: boolean;
}

export interface erc20Approve {
  tokenAddress: string;
  spender: string;
  amount: string;
  accountIndex?: number;
}

export interface dexGetTokens {
  tokens: string[];
  value: string[];
  accountIndex?: number;
}

export interface govCompVote {
  proposalId: string | number;
  accountIndex: number;
  numberOfVotes: string;
  forAgainst: boolean;
}

export interface govCompGetVotes {
  accountIndex: number;
  numberOfVotes: string;
}
