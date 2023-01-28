/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type {
  ethers,
  Signer,
  BigNumber,
  PopulatedTransaction,
  ContractTransaction,
  Overrides,
  CallOverrides} from "ethers";
import {
  Contract
} from "ethers";
import type { BytesLike } from "@ethersproject/bytes";
import type { Listener, Provider } from "@ethersproject/providers";
import type { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface GovernorBravoDelegatorInterface extends ethers.utils.Interface {
  functions: {
    "_setImplementation(address)": FunctionFragment;
    "admin()": FunctionFragment;
    "implementation()": FunctionFragment;
    "pendingAdmin()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "_setImplementation",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "implementation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pendingAdmin",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "_setImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "implementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pendingAdmin",
    data: BytesLike
  ): Result;

  events: {
    "NewAdmin(address,address)": EventFragment;
    "NewImplementation(address,address)": EventFragment;
    "NewPendingAdmin(address,address)": EventFragment;
    "ProposalCanceled(uint256)": EventFragment;
    "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)": EventFragment;
    "ProposalExecuted(uint256)": EventFragment;
    "ProposalQueued(uint256,uint256)": EventFragment;
    "ProposalThresholdSet(uint256,uint256)": EventFragment;
    "VoteCast(address,uint256,uint8,uint256,string)": EventFragment;
    "VotingDelaySet(uint256,uint256)": EventFragment;
    "VotingPeriodSet(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NewAdmin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewImplementation"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewPendingAdmin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalCanceled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalQueued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalThresholdSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VoteCast"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VotingDelaySet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VotingPeriodSet"): EventFragment;
}

export class GovernorBravoDelegator extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: GovernorBravoDelegatorInterface;

  functions: {
    _setImplementation(
      implementation_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "_setImplementation(address)"(
      implementation_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    "admin()"(overrides?: CallOverrides): Promise<[string]>;

    implementation(overrides?: CallOverrides): Promise<[string]>;

    "implementation()"(overrides?: CallOverrides): Promise<[string]>;

    pendingAdmin(overrides?: CallOverrides): Promise<[string]>;

    "pendingAdmin()"(overrides?: CallOverrides): Promise<[string]>;
  };

  _setImplementation(
    implementation_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "_setImplementation(address)"(
    implementation_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  admin(overrides?: CallOverrides): Promise<string>;

  "admin()"(overrides?: CallOverrides): Promise<string>;

  implementation(overrides?: CallOverrides): Promise<string>;

  "implementation()"(overrides?: CallOverrides): Promise<string>;

  pendingAdmin(overrides?: CallOverrides): Promise<string>;

  "pendingAdmin()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    _setImplementation(
      implementation_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "_setImplementation(address)"(
      implementation_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    admin(overrides?: CallOverrides): Promise<string>;

    "admin()"(overrides?: CallOverrides): Promise<string>;

    implementation(overrides?: CallOverrides): Promise<string>;

    "implementation()"(overrides?: CallOverrides): Promise<string>;

    pendingAdmin(overrides?: CallOverrides): Promise<string>;

    "pendingAdmin()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    NewAdmin(
      oldAdmin: null,
      newAdmin: null
    ): TypedEventFilter<
      [string, string],
      { oldAdmin: string; newAdmin: string }
    >;

    NewImplementation(
      oldImplementation: null,
      newImplementation: null
    ): TypedEventFilter<
      [string, string],
      { oldImplementation: string; newImplementation: string }
    >;

    NewPendingAdmin(
      oldPendingAdmin: null,
      newPendingAdmin: null
    ): TypedEventFilter<
      [string, string],
      { oldPendingAdmin: string; newPendingAdmin: string }
    >;

    ProposalCanceled(
      id: null
    ): TypedEventFilter<[BigNumber], { id: BigNumber }>;

    ProposalCreated(
      id: null,
      proposer: null,
      targets: null,
      values: null,
      signatures: null,
      calldatas: null,
      startBlock: null,
      endBlock: null,
      description: null
    ): TypedEventFilter<
      [
        BigNumber,
        string,
        string[],
        BigNumber[],
        string[],
        string[],
        BigNumber,
        BigNumber,
        string
      ],
      {
        id: BigNumber;
        proposer: string;
        targets: string[];
        values: BigNumber[];
        signatures: string[];
        calldatas: string[];
        startBlock: BigNumber;
        endBlock: BigNumber;
        description: string;
      }
    >;

    ProposalExecuted(
      id: null
    ): TypedEventFilter<[BigNumber], { id: BigNumber }>;

    ProposalQueued(
      id: null,
      eta: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { id: BigNumber; eta: BigNumber }
    >;

    ProposalThresholdSet(
      oldProposalThreshold: null,
      newProposalThreshold: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { oldProposalThreshold: BigNumber; newProposalThreshold: BigNumber }
    >;

    VoteCast(
      voter: string | null,
      proposalId: null,
      support: null,
      votes: null,
      reason: null
    ): TypedEventFilter<
      [string, BigNumber, number, BigNumber, string],
      {
        voter: string;
        proposalId: BigNumber;
        support: number;
        votes: BigNumber;
        reason: string;
      }
    >;

    VotingDelaySet(
      oldVotingDelay: null,
      newVotingDelay: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { oldVotingDelay: BigNumber; newVotingDelay: BigNumber }
    >;

    VotingPeriodSet(
      oldVotingPeriod: null,
      newVotingPeriod: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { oldVotingPeriod: BigNumber; newVotingPeriod: BigNumber }
    >;
  };

  estimateGas: {
    _setImplementation(
      implementation_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "_setImplementation(address)"(
      implementation_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    "admin()"(overrides?: CallOverrides): Promise<BigNumber>;

    implementation(overrides?: CallOverrides): Promise<BigNumber>;

    "implementation()"(overrides?: CallOverrides): Promise<BigNumber>;

    pendingAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    "pendingAdmin()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    _setImplementation(
      implementation_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "_setImplementation(address)"(
      implementation_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "admin()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    implementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "implementation()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pendingAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "pendingAdmin()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
