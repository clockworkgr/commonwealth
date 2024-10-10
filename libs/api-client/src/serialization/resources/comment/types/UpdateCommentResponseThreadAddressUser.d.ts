/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../../api/index';
import * as core from '../../../../core';
import * as serializers from '../../../index';
import { UpdateCommentResponseThreadAddressUserApiKey } from './UpdateCommentResponseThreadAddressUserApiKey';
import { UpdateCommentResponseThreadAddressUserEmailNotificationInterval } from './UpdateCommentResponseThreadAddressUserEmailNotificationInterval';
import { UpdateCommentResponseThreadAddressUserProfile } from './UpdateCommentResponseThreadAddressUserProfile';
import { UpdateCommentResponseThreadAddressUserProfileTagsItem } from './UpdateCommentResponseThreadAddressUserProfileTagsItem';
export declare const UpdateCommentResponseThreadAddressUser: core.serialization.ObjectSchema<
  serializers.UpdateCommentResponseThreadAddressUser.Raw,
  CommonApi.UpdateCommentResponseThreadAddressUser
>;
export declare namespace UpdateCommentResponseThreadAddressUser {
  interface Raw {
    id?: number | null;
    email?: string | null;
    isAdmin?: boolean | null;
    disableRichText?: boolean | null;
    emailVerified?: boolean | null;
    selected_community_id?: string | null;
    emailNotificationInterval?: UpdateCommentResponseThreadAddressUserEmailNotificationInterval.Raw | null;
    promotional_emails_enabled?: boolean | null;
    is_welcome_onboard_flow_complete?: boolean | null;
    profile: UpdateCommentResponseThreadAddressUserProfile.Raw;
    xp_points?: number | null;
    ProfileTags?:
      | UpdateCommentResponseThreadAddressUserProfileTagsItem.Raw[]
      | null;
    ApiKey?: UpdateCommentResponseThreadAddressUserApiKey.Raw | null;
    created_at?: string | null;
    updated_at?: string | null;
  }
}
