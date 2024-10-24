/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../../api/index';
import * as core from '../../../../core';
import * as serializers from '../../../index';
export declare const CreateCommentResponseThreadAddressUserProfileBackgroundImage: core.serialization.ObjectSchema<
  serializers.CreateCommentResponseThreadAddressUserProfileBackgroundImage.Raw,
  CommonApi.CreateCommentResponseThreadAddressUserProfileBackgroundImage
>;
export declare namespace CreateCommentResponseThreadAddressUserProfileBackgroundImage {
  interface Raw {
    url?: string | null;
    imageBehavior?: string | null;
  }
}
