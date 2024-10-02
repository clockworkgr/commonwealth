/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../../index";
import * as CommonApi from "../../../../api/index";
import * as core from "../../../../core";
import { UpdateThreadResponseCollaboratorsItemUserProfileBackgroundImage } from "./UpdateThreadResponseCollaboratorsItemUserProfileBackgroundImage";
export declare const UpdateThreadResponseCollaboratorsItemUserProfile: core.serialization.ObjectSchema<serializers.UpdateThreadResponseCollaboratorsItemUserProfile.Raw, CommonApi.UpdateThreadResponseCollaboratorsItemUserProfile>;
export declare namespace UpdateThreadResponseCollaboratorsItemUserProfile {
    interface Raw {
        name?: string | null;
        email?: string | null;
        website?: string | null;
        bio?: string | null;
        avatar_url?: string | null;
        slug?: string | null;
        socials?: string[] | null;
        background_image?: UpdateThreadResponseCollaboratorsItemUserProfileBackgroundImage.Raw | null;
    }
}
