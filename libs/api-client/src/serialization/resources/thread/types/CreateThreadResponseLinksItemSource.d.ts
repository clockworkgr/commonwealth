/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../../index";
import * as CommonApi from "../../../../api/index";
import * as core from "../../../../core";
export declare const CreateThreadResponseLinksItemSource: core.serialization.Schema<serializers.CreateThreadResponseLinksItemSource.Raw, CommonApi.CreateThreadResponseLinksItemSource>;
export declare namespace CreateThreadResponseLinksItemSource {
    type Raw = "snapshot" | "proposal" | "thread" | "web" | "template";
}
