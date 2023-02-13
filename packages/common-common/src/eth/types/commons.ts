/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { EventFilter, Event } from "ethers";
import type { Result } from "@ethersproject/abi";

export type TypedEventFilter<_EventArgsArray, _EventArgsObject> = EventFilter

export interface TypedEvent<EventArgs extends Result> extends Event {
  args: EventArgs;
}

export type TypedListener<
  EventArgsArray extends Array<any>,
  EventArgsObject
> = (
  ...listenerArg: [
    ...EventArgsArray,
    TypedEvent<EventArgsArray & EventArgsObject>
  ]
) => void;
