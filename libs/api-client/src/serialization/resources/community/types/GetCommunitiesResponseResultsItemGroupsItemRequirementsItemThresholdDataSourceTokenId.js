/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as core from '../../../../core';
import { GetCommunitiesResponseResultsItemGroupsItemRequirementsItemThresholdDataSourceTokenIdSourceType } from './GetCommunitiesResponseResultsItemGroupsItemRequirementsItemThresholdDataSourceTokenIdSourceType';
export const GetCommunitiesResponseResultsItemGroupsItemRequirementsItemThresholdDataSourceTokenId =
  core.serialization.object({
    sourceType: core.serialization.property(
      'source_type',
      GetCommunitiesResponseResultsItemGroupsItemRequirementsItemThresholdDataSourceTokenIdSourceType,
    ),
    evmChainId: core.serialization.property(
      'evm_chain_id',
      core.serialization.number(),
    ),
    contractAddress: core.serialization.property(
      'contract_address',
      core.serialization.string(),
    ),
    tokenId: core.serialization.property(
      'token_id',
      core.serialization.string().optional(),
    ),
  });
