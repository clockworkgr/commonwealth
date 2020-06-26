/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface Moloch1Interface extends Interface {
  functions: {
    abortWindow: TypedFunctionDescription<{ encode([]: []): string }>;

    approvedToken: TypedFunctionDescription<{ encode([]: []): string }>;

    dilutionBound: TypedFunctionDescription<{ encode([]: []): string }>;

    gracePeriodLength: TypedFunctionDescription<{ encode([]: []): string }>;

    guildBank: TypedFunctionDescription<{ encode([]: []): string }>;

    memberAddressByDelegateKey: TypedFunctionDescription<{
      encode([]: [string]): string;
    }>;

    members: TypedFunctionDescription<{ encode([]: [string]): string }>;

    periodDuration: TypedFunctionDescription<{ encode([]: []): string }>;

    processingReward: TypedFunctionDescription<{ encode([]: []): string }>;

    proposalDeposit: TypedFunctionDescription<{ encode([]: []): string }>;

    proposalQueue: TypedFunctionDescription<{
      encode([]: [BigNumberish]): string;
    }>;

    summoningTime: TypedFunctionDescription<{ encode([]: []): string }>;

    totalShares: TypedFunctionDescription<{ encode([]: []): string }>;

    totalSharesRequested: TypedFunctionDescription<{ encode([]: []): string }>;

    votingPeriodLength: TypedFunctionDescription<{ encode([]: []): string }>;

    submitProposal: TypedFunctionDescription<{
      encode([applicant, tokenTribute, sharesRequested, details]: [
        string,
        BigNumberish,
        BigNumberish,
        string
      ]): string;
    }>;

    submitVote: TypedFunctionDescription<{
      encode([proposalIndex, uintVote]: [BigNumberish, BigNumberish]): string;
    }>;

    processProposal: TypedFunctionDescription<{
      encode([proposalIndex]: [BigNumberish]): string;
    }>;

    ragequit: TypedFunctionDescription<{
      encode([sharesToBurn]: [BigNumberish]): string;
    }>;

    abort: TypedFunctionDescription<{
      encode([proposalIndex]: [BigNumberish]): string;
    }>;

    updateDelegateKey: TypedFunctionDescription<{
      encode([newDelegateKey]: [string]): string;
    }>;

    getCurrentPeriod: TypedFunctionDescription<{ encode([]: []): string }>;

    getProposalQueueLength: TypedFunctionDescription<{
      encode([]: []): string;
    }>;

    canRagequit: TypedFunctionDescription<{
      encode([highestIndexYesVote]: [BigNumberish]): string;
    }>;

    hasVotingPeriodExpired: TypedFunctionDescription<{
      encode([startingPeriod]: [BigNumberish]): string;
    }>;

    getMemberProposalVote: TypedFunctionDescription<{
      encode([memberAddress, proposalIndex]: [string, BigNumberish]): string;
    }>;
  };

  events: {
    Abort: TypedEventDescription<{
      encodeTopics([proposalIndex, applicantAddress]: [
        BigNumberish | null,
        null
      ]): string[];
    }>;

    ProcessProposal: TypedEventDescription<{
      encodeTopics([
        proposalIndex,
        applicant,
        memberAddress,
        tokenTribute,
        sharesRequested,
        didPass
      ]: [
        BigNumberish | null,
        string | null,
        string | null,
        null,
        null,
        null
      ]): string[];
    }>;

    Ragequit: TypedEventDescription<{
      encodeTopics([memberAddress, sharesToBurn]: [
        string | null,
        null
      ]): string[];
    }>;

    SubmitProposal: TypedEventDescription<{
      encodeTopics([
        proposalIndex,
        delegateKey,
        memberAddress,
        applicant,
        tokenTribute,
        sharesRequested
      ]: [
        null,
        string | null,
        string | null,
        string | null,
        null,
        null
      ]): string[];
    }>;

    SubmitVote: TypedEventDescription<{
      encodeTopics([proposalIndex, delegateKey, memberAddress, uintVote]: [
        BigNumberish | null,
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    SummonComplete: TypedEventDescription<{
      encodeTopics([summoner, shares]: [string | null, null]): string[];
    }>;

    UpdateDelegateKey: TypedEventDescription<{
      encodeTopics([memberAddress, newDelegateKey]: [
        string | null,
        null
      ]): string[];
    }>;
  };
}

export class Moloch1 extends Contract {
  connect(signerOrProvider: Signer | Provider | string): Moloch1;
  attach(addressOrName: string): Moloch1;
  deployed(): Promise<Moloch1>;

  on(event: EventFilter | string, listener: Listener): Moloch1;
  once(event: EventFilter | string, listener: Listener): Moloch1;
  addListener(eventName: EventFilter | string, listener: Listener): Moloch1;
  removeAllListeners(eventName: EventFilter | string): Moloch1;
  removeListener(eventName: any, listener: Listener): Moloch1;

  interface: Moloch1Interface;

  functions: {
    abortWindow(): Promise<BigNumber>;

    approvedToken(): Promise<string>;

    dilutionBound(): Promise<BigNumber>;

    gracePeriodLength(): Promise<BigNumber>;

    guildBank(): Promise<string>;

    memberAddressByDelegateKey(arg0: string): Promise<string>;

    members(
      arg0: string
    ): Promise<{
      delegateKey: string;
      shares: BigNumber;
      exists: boolean;
      highestIndexYesVote: BigNumber;
      0: string;
      1: BigNumber;
      2: boolean;
      3: BigNumber;
    }>;

    periodDuration(): Promise<BigNumber>;

    processingReward(): Promise<BigNumber>;

    proposalDeposit(): Promise<BigNumber>;

    proposalQueue(
      arg0: BigNumberish
    ): Promise<{
      proposer: string;
      applicant: string;
      sharesRequested: BigNumber;
      startingPeriod: BigNumber;
      yesVotes: BigNumber;
      noVotes: BigNumber;
      processed: boolean;
      didPass: boolean;
      aborted: boolean;
      tokenTribute: BigNumber;
      details: string;
      maxTotalSharesAtYesVote: BigNumber;
      0: string;
      1: string;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
      6: boolean;
      7: boolean;
      8: boolean;
      9: BigNumber;
      10: string;
      11: BigNumber;
    }>;

    summoningTime(): Promise<BigNumber>;

    totalShares(): Promise<BigNumber>;

    totalSharesRequested(): Promise<BigNumber>;

    votingPeriodLength(): Promise<BigNumber>;

    /**
     * *************** PROPOSAL FUNCTIONS****************
     */
    submitProposal(
      applicant: string,
      tokenTribute: BigNumberish,
      sharesRequested: BigNumberish,
      details: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    submitVote(
      proposalIndex: BigNumberish,
      uintVote: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    processProposal(
      proposalIndex: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    ragequit(
      sharesToBurn: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    abort(
      proposalIndex: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    updateDelegateKey(
      newDelegateKey: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getCurrentPeriod(): Promise<BigNumber>;

    getProposalQueueLength(): Promise<BigNumber>;

    canRagequit(highestIndexYesVote: BigNumberish): Promise<boolean>;

    hasVotingPeriodExpired(startingPeriod: BigNumberish): Promise<boolean>;

    getMemberProposalVote(
      memberAddress: string,
      proposalIndex: BigNumberish
    ): Promise<number>;
  };

  abortWindow(): Promise<BigNumber>;

  approvedToken(): Promise<string>;

  dilutionBound(): Promise<BigNumber>;

  gracePeriodLength(): Promise<BigNumber>;

  guildBank(): Promise<string>;

  memberAddressByDelegateKey(arg0: string): Promise<string>;

  members(
    arg0: string
  ): Promise<{
    delegateKey: string;
    shares: BigNumber;
    exists: boolean;
    highestIndexYesVote: BigNumber;
    0: string;
    1: BigNumber;
    2: boolean;
    3: BigNumber;
  }>;

  periodDuration(): Promise<BigNumber>;

  processingReward(): Promise<BigNumber>;

  proposalDeposit(): Promise<BigNumber>;

  proposalQueue(
    arg0: BigNumberish
  ): Promise<{
    proposer: string;
    applicant: string;
    sharesRequested: BigNumber;
    startingPeriod: BigNumber;
    yesVotes: BigNumber;
    noVotes: BigNumber;
    processed: boolean;
    didPass: boolean;
    aborted: boolean;
    tokenTribute: BigNumber;
    details: string;
    maxTotalSharesAtYesVote: BigNumber;
    0: string;
    1: string;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
    6: boolean;
    7: boolean;
    8: boolean;
    9: BigNumber;
    10: string;
    11: BigNumber;
  }>;

  summoningTime(): Promise<BigNumber>;

  totalShares(): Promise<BigNumber>;

  totalSharesRequested(): Promise<BigNumber>;

  votingPeriodLength(): Promise<BigNumber>;

  /**
   * *************** PROPOSAL FUNCTIONS****************
   */
  submitProposal(
    applicant: string,
    tokenTribute: BigNumberish,
    sharesRequested: BigNumberish,
    details: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  submitVote(
    proposalIndex: BigNumberish,
    uintVote: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  processProposal(
    proposalIndex: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  ragequit(
    sharesToBurn: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  abort(
    proposalIndex: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  updateDelegateKey(
    newDelegateKey: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getCurrentPeriod(): Promise<BigNumber>;

  getProposalQueueLength(): Promise<BigNumber>;

  canRagequit(highestIndexYesVote: BigNumberish): Promise<boolean>;

  hasVotingPeriodExpired(startingPeriod: BigNumberish): Promise<boolean>;

  getMemberProposalVote(
    memberAddress: string,
    proposalIndex: BigNumberish
  ): Promise<number>;

  filters: {
    Abort(
      proposalIndex: BigNumberish | null,
      applicantAddress: null
    ): EventFilter;

    ProcessProposal(
      proposalIndex: BigNumberish | null,
      applicant: string | null,
      memberAddress: string | null,
      tokenTribute: null,
      sharesRequested: null,
      didPass: null
    ): EventFilter;

    Ragequit(memberAddress: string | null, sharesToBurn: null): EventFilter;

    SubmitProposal(
      proposalIndex: null,
      delegateKey: string | null,
      memberAddress: string | null,
      applicant: string | null,
      tokenTribute: null,
      sharesRequested: null
    ): EventFilter;

    SubmitVote(
      proposalIndex: BigNumberish | null,
      delegateKey: string | null,
      memberAddress: string | null,
      uintVote: null
    ): EventFilter;

    SummonComplete(summoner: string | null, shares: null): EventFilter;

    UpdateDelegateKey(
      memberAddress: string | null,
      newDelegateKey: null
    ): EventFilter;
  };

  estimate: {
    abortWindow(): Promise<BigNumber>;

    approvedToken(): Promise<BigNumber>;

    dilutionBound(): Promise<BigNumber>;

    gracePeriodLength(): Promise<BigNumber>;

    guildBank(): Promise<BigNumber>;

    memberAddressByDelegateKey(arg0: string): Promise<BigNumber>;

    members(arg0: string): Promise<BigNumber>;

    periodDuration(): Promise<BigNumber>;

    processingReward(): Promise<BigNumber>;

    proposalDeposit(): Promise<BigNumber>;

    proposalQueue(arg0: BigNumberish): Promise<BigNumber>;

    summoningTime(): Promise<BigNumber>;

    totalShares(): Promise<BigNumber>;

    totalSharesRequested(): Promise<BigNumber>;

    votingPeriodLength(): Promise<BigNumber>;

    submitProposal(
      applicant: string,
      tokenTribute: BigNumberish,
      sharesRequested: BigNumberish,
      details: string
    ): Promise<BigNumber>;

    submitVote(
      proposalIndex: BigNumberish,
      uintVote: BigNumberish
    ): Promise<BigNumber>;

    processProposal(proposalIndex: BigNumberish): Promise<BigNumber>;

    ragequit(sharesToBurn: BigNumberish): Promise<BigNumber>;

    abort(proposalIndex: BigNumberish): Promise<BigNumber>;

    updateDelegateKey(newDelegateKey: string): Promise<BigNumber>;

    getCurrentPeriod(): Promise<BigNumber>;

    getProposalQueueLength(): Promise<BigNumber>;

    canRagequit(highestIndexYesVote: BigNumberish): Promise<BigNumber>;

    hasVotingPeriodExpired(startingPeriod: BigNumberish): Promise<BigNumber>;

    getMemberProposalVote(
      memberAddress: string,
      proposalIndex: BigNumberish
    ): Promise<BigNumber>;
  };
}
