import type ChainInfo from 'client/scripts/models/ChainInfo';
import { pluralizeWithoutNumberPrefix } from 'helpers';
import React from 'react';
import { CWCommunityAvatar } from '../../cw_community_avatar';
import { CWIcon } from '../../cw_icons/cw_icon';
import { CWText } from '../../cw_text';
import { ComponentType } from '../../types';
import './CWRelatedCommunityCard.scss';
import { addPeriodToText } from './utils';

type CWRelatedCommunityCardProps = {
  communityName: string;
  communityIconUrl: string;
  communityDescription: string;
  memberCount: number;
  threadCount: number;
  actions?: JSX.Element;
};

export const CWRelatedCommunityCard = ({
  communityName,
  communityIconUrl,
  communityDescription,
  memberCount,
  threadCount,
  actions,
}: CWRelatedCommunityCardProps) => {
  const communityAvatar = {
    iconUrl: communityIconUrl,
    name: communityName,
  } as ChainInfo;

  return (
    <div className={ComponentType.RelatedCommunityCard}>
      <div className="content-container">
        <div className="top-content">
          <div className="header">
            <CWCommunityAvatar community={communityAvatar} size="large" />
            <CWText type="h5" title={communityName} fontWeight="medium">
              {communityName}
            </CWText>
          </div>
          <div className="description">
            {communityDescription
              ? addPeriodToText(communityDescription)
              : null}
          </div>
        </div>
        <div className="metadata">
          <div className="member-data">
            <CWIcon iconName="users" iconSize="small" />
            <span className="count">{memberCount.toLocaleString('en-US')}</span>

            <span className="text">
              {pluralizeWithoutNumberPrefix(memberCount, 'member')}
            </span>
          </div>

          <div className="divider">
            <CWIcon iconName="dot" />
          </div>

          <div className="thread-data">
            <CWIcon iconName="notepad" />
            <span className="count">{threadCount.toLocaleString('en-US')}</span>
            <span className="text">
              {pluralizeWithoutNumberPrefix(threadCount, 'thread')}
            </span>
          </div>
        </div>

        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );
};
