/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../../api/index';
import * as core from '../../../../core';
import * as serializers from '../../../index';
export declare const CreateThreadRequestKind: core.serialization.Schema<
  serializers.CreateThreadRequestKind.Raw,
  CommonApi.CreateThreadRequestKind
>;
export declare namespace CreateThreadRequestKind {
  type Raw = 'discussion' | 'link';
}
