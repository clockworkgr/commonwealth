"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
/**
 * Processes ERC721 events.
 */
const interfaces_1 = require("../../interfaces");
const logging_1 = require("../../logging");
const type_parser_1 = require("./filters/type_parser");
const enricher_1 = require("./filters/enricher");
class Processor extends interfaces_1.IEventProcessor {
    _api;
    constructor(_api) {
        super(_api);
        this._api = _api;
    }
    /**
     * Parse events out of an ethereum block and standardizes their format
     * for processing.
     * @param event
     * @param tokenName
     * @returns an array of processed events
     */
    async process(event, tokenName) {
        const log = logging_1.factory.getLogger(logging_1.addPrefix(__filename, [interfaces_1.SupportedNetwork.ERC721, tokenName]));
        const kind = type_parser_1.ParseType(event.event);
        if (!kind)
            return [];
        try {
            const cwEvent = await enricher_1.Enrich(this._api, event.blockNumber, kind, event);
            cwEvent.chain = tokenName;
            return cwEvent ? [cwEvent] : [];
        }
        catch (e) {
            log.error(`Failed to enrich event. Block number: ${event.blockNumber}, Name/Kind: ${event.event}, Error Message: ${e.message}`);
            return [];
        }
    }
}
exports.Processor = Processor;
