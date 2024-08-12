import { ForumActions } from '@hicommonwealth/schemas';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiEndpoints, SERVER_URL } from 'state/api/config';
import { userStore } from '../../ui/user';

const REFRESH_MEMBERSHIP_STALE_TIME = 30 * 1_000; // 30 s

interface RefreshMembershipProps {
  communityId: string;
  address: string;
  topicId?: string;
  allowedActions?: ForumActions;
  apiEnabled?: boolean;
}

export interface Memberships {
  groupId: number;
  topicIds: number[];
  allowedActions: ForumActions;
  rejectReason?: string;
}

const refreshMembership = async ({
  communityId,
  address,
  topicId,
}: RefreshMembershipProps): Promise<Memberships[]> => {
  const response = await axios.put(`${SERVER_URL}/refresh-membership`, {
    jwt: userStore.getState().jwt,
    community_id: communityId,
    author_community_id: communityId,
    address,
    ...(topicId && { topic_id: topicId }),
  });

  return response?.data?.result?.map((r) => ({
    groupId: r.groupId,
    topicIds: r.topicIds,
    allowedActions: r.allowed,
    rejectReason: r.rejectReason,
  }));
};

const useRefreshMembershipQuery = ({
  communityId,
  address,
  topicId,
  allowedActions,
  apiEnabled = true,
}: RefreshMembershipProps) => {
  return useQuery({
    queryKey: [
      ApiEndpoints.REFRESH_MEMBERSHIP,
      communityId,
      address,
      topicId,
      allowedActions,
    ],
    queryFn: () => refreshMembership({ communityId, address, topicId }),
    enabled: apiEnabled,
    staleTime: REFRESH_MEMBERSHIP_STALE_TIME,
  });
};

export default useRefreshMembershipQuery;
