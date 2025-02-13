import { toCanvasSignedDataApiArgs } from '@hicommonwealth/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { signComment } from 'controllers/server/sessions';
import Comment from 'models/Comment';
import { ApiEndpoints, SERVER_URL } from 'state/api/config';
import useUserOnboardingSliderMutationStore from 'state/ui/userTrainingCards';
import { UserTrainingCardTypes } from 'views/components/UserTrainingSlider/types';
import { UserProfile } from '../../../models/MinimumProfile';
import { useAuthModalStore } from '../../ui/modals';
import useUserStore, { userStore } from '../../ui/user';
import { updateThreadInAllCaches } from '../threads/helpers/cache';
import useFetchCommentsQuery from './fetchComments';

interface CreateCommentProps {
  profile: UserProfile;
  threadId: number;
  communityId: string;
  unescapedText: string;
  parentCommentId: number | null;
  existingNumberOfComments: number;
  isPWA?: boolean;
}

const createComment = async ({
  communityId,
  profile,
  threadId,
  unescapedText,
  parentCommentId = null,
  isPWA,
}: CreateCommentProps) => {
  const canvasSignedData = await signComment(profile.address, {
    thread_id: threadId,
    body: unescapedText,
    parent_comment_id: parentCommentId,
  });

  const response = await axios.post(
    `${SERVER_URL}/threads/${threadId}/comments`,
    {
      author_community_id: communityId,
      community_id: communityId,
      address: profile.address,
      parent_id: parentCommentId,
      text: encodeURIComponent(unescapedText),
      jwt: userStore.getState().jwt,
      ...toCanvasSignedDataApiArgs(canvasSignedData),
    },
    {
      headers: {
        isPWA: isPWA?.toString(),
      },
    },
  );

  // map profile to server schema
  response.data.result.Address.User = {
    profile: {
      ...profile,
      avatar_url: profile.avatarUrl,
      last_active: profile.lastActive,
    },
  };
  return new Comment({ community_id: undefined, ...response.data.result });
};

const useCreateCommentMutation = ({
  communityId,
  threadId,
  existingNumberOfComments = 0,
}: Partial<CreateCommentProps>) => {
  const queryClient = useQueryClient();
  const { data: comments } = useFetchCommentsQuery({
    // @ts-expect-error StrictNullChecks
    communityId,
    // @ts-expect-error StrictNullChecks
    threadId,
  });

  const user = useUserStore();

  const { markTrainingActionAsComplete } =
    useUserOnboardingSliderMutationStore();

  const { checkForSessionKeyRevalidationErrors } = useAuthModalStore();

  return useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      // update fetch comments query state
      const key = [ApiEndpoints.FETCH_COMMENTS, communityId, threadId];
      queryClient.cancelQueries({ queryKey: key });
      queryClient.setQueryData(key, () => {
        return [...comments, newComment];
      });
      // @ts-expect-error StrictNullChecks
      updateThreadInAllCaches(communityId, threadId, {
        numberOfComments: existingNumberOfComments + 1,
      });
      updateThreadInAllCaches(
        // @ts-expect-error StrictNullChecks
        communityId,
        threadId,
        { recentComments: [newComment] },
        'combineAndRemoveDups',
      );

      const userId = user.addresses?.[0]?.profile?.userId;
      userId &&
        markTrainingActionAsComplete(
          UserTrainingCardTypes.CreateContent,
          userId,
        );

      return newComment;
    },
    onError: (error) => checkForSessionKeyRevalidationErrors(error),
  });
};

export default useCreateCommentMutation;
