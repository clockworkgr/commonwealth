"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
const interfaces_1 = require("../../../interfaces");
const types_1 = require("../types");
/**
 * This a titler function, not to be confused with the labeler -- it takes a particular
 * kind of event, and returns a "plain english" description of that type. This is used
 * on the client to present a list of subscriptions that a user might want to subscribe to.
 */
const Title = (kind, chain) => {
    switch (kind) {
        case types_1.EventKind.ProposalCanceled: {
            return {
                title: 'Proposal cancelled',
                description: 'A proposal has been cancelled.',
            };
        }
        case types_1.EventKind.ProposalCreated: {
            return {
                title: 'Proposal created',
                description: 'A proposal has been created.',
            };
        }
        case types_1.EventKind.ProposalExecuted: {
            return {
                title: 'Proposal executed',
                description: 'A proposal has been executed.',
            };
        }
        case types_1.EventKind.ProposalQueued: {
            return {
                title: 'Proposal queued',
                description: 'A proposal has been added to the queue.',
            };
        }
        case types_1.EventKind.VoteCast: {
            return {
                title: 'Vote cast',
                description: 'A new vote has been cast.',
            };
        }
        default: {
            // ensure exhaustive matching -- gives ts error if missing cases
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _exhaustiveMatch = kind;
            throw new Error(`[${interfaces_1.SupportedNetwork.Compound}${chain ? `::${chain}` : ''}]: Unknown event type`);
        }
    }
};
exports.Title = Title;
