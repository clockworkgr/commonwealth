/**
 * This file was auto-generated by Fern from our API Definition.
 */
/**
 * @example
 *     {
 *         topicId: 1.1,
 *         communityId: "community_id"
 *     }
 */
export interface UpdateTopicRequest {
    topicId: number;
    communityId: string;
    name?: string;
    description?: string;
    groupIds?: number[];
    telegram?: string;
    featuredInSidebar?: boolean;
    featuredInNewPost?: boolean;
    defaultOffchainTemplate?: string;
}
