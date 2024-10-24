/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../../api/index';
import * as core from '../../../../core';
import * as serializers from '../../../index';
export declare const CreateCommunityResponseCommunityDefaultPage: core.serialization.Schema<
  serializers.CreateCommunityResponseCommunityDefaultPage.Raw,
  CommonApi.CreateCommunityResponseCommunityDefaultPage
>;
export declare namespace CreateCommunityResponseCommunityDefaultPage {
  type Raw =
    | 'default_all_discussions_view'
    | 'default_summary_view'
    | 'homepage';
}
