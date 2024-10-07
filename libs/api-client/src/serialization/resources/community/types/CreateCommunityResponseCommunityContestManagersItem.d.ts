/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../../api/index';
import * as core from '../../../../core';
import * as serializers from '../../../index';
import { CreateCommunityResponseCommunityContestManagersItemContestsItem } from './CreateCommunityResponseCommunityContestManagersItemContestsItem';
import { CreateCommunityResponseCommunityContestManagersItemTopicsItem } from './CreateCommunityResponseCommunityContestManagersItemTopicsItem';

export declare const CreateCommunityResponseCommunityContestManagersItem: core.serialization.ObjectSchema<
  serializers.CreateCommunityResponseCommunityContestManagersItem.Raw,
  CommonApi.CreateCommunityResponseCommunityContestManagersItem
>;
export declare namespace CreateCommunityResponseCommunityContestManagersItem {
  interface Raw {
    contest_address: string;
    community_id: string;
    name: string;
    image_url?: string | null;
    funding_token_address?: string | null;
    prize_percentage?: number | null;
    payout_structure: number[];
    interval: number;
    ticker?: string | null;
    decimals?: number | null;
    created_at: string;
    cancelled?: boolean | null;
    ended?: boolean | null;
    topics?:
      | CreateCommunityResponseCommunityContestManagersItemTopicsItem.Raw[]
      | null;
    contests?:
      | CreateCommunityResponseCommunityContestManagersItemContestsItem.Raw[]
      | null;
  }
}
