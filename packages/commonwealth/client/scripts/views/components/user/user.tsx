import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import 'components/user/user.scss';

import { ChainBase } from 'common-common/src/types';
import useForceRerender from 'hooks/useForceRerender';
import { useCommonNavigate } from 'navigation/helpers';
import app from 'state';
import { Avatar } from 'views/components/Avatar';
import { formatAddressShort } from '../../../../../shared/utils';
import NewProfilesController from '../../../controllers/server/newProfiles';
import type Account from '../../../models/Account';
import AddressInfo from '../../../models/AddressInfo';
import MinimumProfile from '../../../models/MinimumProfile';
import Permissions from '../../../utils/Permissions';
import { BanUserModal } from '../../modals/ban_user_modal';
import { CWButton } from '../component_kit/cw_button';
import { Modal } from '../component_kit/cw_modal';
import { Popover, usePopover } from '../component_kit/cw_popover/cw_popover';
import { CWText } from '../component_kit/cw_text';
import { UserSkeleton } from './UserSkeleton';
import type { UserAttrsWithSkeletonProp } from './user.types';

export const User = ({
  avatarOnly,
  hideAvatar,
  showAddressWithDisplayName,
  user,
  linkify,
  onClick,
  popover,
  showRole,
  showAsDeleted = false,
  addressDisplayOptions,
  avatarSize: size,
  role,
  showSkeleton,
}: UserAttrsWithSkeletonProp) => {
  const avatarSize = size || 16;
  const showAvatar = user ? !hideAvatar : false;

  const popoverProps = usePopover();
  const navigate = useCommonNavigate();
  const forceRerender = useForceRerender();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    NewProfilesController.Instance.isFetched.on('redraw', () => {
      forceRerender();
    });

    NewProfilesController.Instance.isFetched.off('redraw', () => {
      forceRerender();
    });
  }, [forceRerender]);

  if (showSkeleton) {
    return (
      <UserSkeleton
        avatarOnly={avatarOnly}
        hideAvatar={hideAvatar}
        popover={popover}
        avatarSize={avatarSize}
      />
    );
  }

  const { maxCharLength } = addressDisplayOptions || {};

  let account: Account;
  let profile: MinimumProfile;
  let addrShort: string;
  let loggedInUserIsAdmin = false;
  let friendlyChainName: string | undefined;
  let adminsAndMods = [];

  if (user) {
    loggedInUserIsAdmin =
      Permissions.isSiteAdmin() || Permissions.isCommunityAdmin();

    addrShort = formatAddressShort(
      user.address,
      typeof user.chain === 'string' ? user.chain : user.chain?.id,
      true,
      maxCharLength,
      app.chain?.meta?.bech32Prefix
    );

    friendlyChainName = app.config.chains.getById(
      typeof user.chain === 'string' ? user.chain : user.chain?.id
    )?.name;

    adminsAndMods = app.chain?.meta.adminsAndMods || [];

    if (user instanceof AddressInfo) {
      const chainId = user.chain;

      const address = user.address;

      if (!chainId || !address) return;

      // only load account if it's possible to, using the current chain
      if (app.chain && app.chain.id === chainId.id) {
        try {
          account = app.chain.accounts.get(address);
        } catch (e) {
          console.log('legacy account error, carry on');
          account = null;
        }
      }

      profile = NewProfilesController.Instance.getProfile(chainId.id, address);

      if (!role) {
        role = adminsAndMods.find(
          (r) => r.address === address && r.address_chain === chainId.id
        );
      }
    } else if (user instanceof MinimumProfile) {
      profile = user;

      // only load account if it's possible to, using the current chain
      if (app.chain && app.chain.id === profile.chain) {
        try {
          account = app.chain.accounts.get(profile.address);
        } catch (e) {
          console.error(e);
          account = null;
        }
      }

      if (!role) {
        role = adminsAndMods.find(
          (r) =>
            r.address === profile.address && r.address_chain === profile.chain
        );
      }
    } else {
      account = user;
      // TODO: we should remove this, since account should always be of type Account,
      // but we currently inject objects of type 'any' on the profile page
      const chainId = account.chain.id;

      profile = NewProfilesController.Instance.getProfile(
        chainId,
        account.address
      );

      if (!role) {
        role = adminsAndMods.find(
          (r) => r.address === account.address && r.address_chain === chainId
        );
      }
    }
  }

  const getRoleTags = () => (
    <>
      {/* role in commonwealth forum */}
      {showRole && role && (
        <div className="role-tag-container">
          <CWText className="role-tag-text">{role.permission}</CWText>
        </div>
      )}
    </>
  );

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(`/profile/id/${profile.id}`, {}, null);
    }
  };

  const isSelfSelected = app.user.addresses
    .map((a) => a.address)
    .includes(account?.address);

  const userFinal = avatarOnly ? (
    <div className="User avatar-only" key={profile?.address || '-'}>
      <Avatar url={profile?.avatarUrl} size={16} address={profile?.id} />
    </div>
  ) : (
    <div
      className={`User${linkify && profile?.id ? ' linkified' : ''}`}
      key={profile?.address || '-'}
    >
      {showAvatar && (
        <Link
          to={profile ? `/profile/id/${profile.id}` : undefined}
          className="user-avatar"
          style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
        >
          <Avatar
            url={profile?.avatarUrl}
            size={avatarSize}
            address={profile?.id}
          />
        </Link>
      )}
      {
        <>
          {/* non-substrate name */}
          {linkify && profile?.id ? (
            <Link
              className="user-display-name username"
              to={profile ? `/profile/id/${profile.id}` : undefined}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <>
                {!profile ? (
                  addrShort
                ) : !showAddressWithDisplayName ? (
                  profile.name
                ) : (
                  <>
                    <div>{profile.name}</div>
                    <div className="id-short">
                      {formatAddressShort(profile.address, profile.chain)}
                    </div>
                  </>
                )}
                {getRoleTags()}
              </>
            </Link>
          ) : (
            <a className="user-display-name username">
              {!profile ? (
                showAsDeleted ? (
                  'Deleted'
                ) : (
                  'Anonymous'
                )
              ) : !profile.id ? (
                addrShort
              ) : !showAddressWithDisplayName ? (
                profile.name
              ) : (
                <>
                  {profile.name}
                  <div className="id-short">
                    {formatAddressShort(profile.address, profile.chain)}
                  </div>
                </>
              )}

              {getRoleTags()}
            </a>
          )}
          {account &&
            app.user.addresses.some(
              ({ address, ghostAddress }) =>
                account.address === address && ghostAddress
            ) && (
              <img
                alt="ghost"
                src="/static/img/ghost.svg"
                width="20px"
                style={{ display: 'inline-block' }}
              />
            )}
        </>
      }
    </div>
  );

  const userPopover = (
    <>
      {profile && (
        <div
          className="UserPopover"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="user-avatar">
            <Avatar url={profile?.avatarUrl} size={32} address={profile?.id} />
          </div>
          <div className="user-name">
            {app.chain && app.chain.base === ChainBase.Substrate && (
              <Link
                className="user-display-name substrate@"
                to={profile?.id ? `/profile/id/${profile.id}` : undefined}
              >
                {!profile || !profile?.id ? (
                  !profile?.id ? (
                    `${profile.address.slice(0, 8)}...${profile.address.slice(
                      -5
                    )}`
                  ) : (
                    addrShort
                  )
                ) : !showAddressWithDisplayName ? (
                  profile.name
                ) : (
                  <>
                    {profile.name}
                    <div className="id-short">
                      {formatAddressShort(
                        profile.address,
                        profile.chain,
                        true,
                        maxCharLength,
                        app.chain?.meta?.bech32Prefix
                      )}
                    </div>
                  </>
                )}
              </Link>
            )}
          </div>
          {profile?.address && (
            <div className="user-address">
              {formatAddressShort(
                profile.address,
                profile.chain,
                true,
                maxCharLength,
                app.chain?.meta?.bech32Prefix
              )}
            </div>
          )}
          {friendlyChainName && (
            <div className="user-chain">{friendlyChainName}</div>
          )}
          {getRoleTags()}
          {/* If Admin Allow Banning */}
          {loggedInUserIsAdmin && !isSelfSelected && (
            <div className="ban-wrapper">
              <CWButton
                onClick={() => {
                  setIsModalOpen(true);
                }}
                label="Ban User"
                buttonType="primary-red"
              />
            </div>
          )}
        </div>
      )}
      <Modal
        content={
          <BanUserModal
            profile={profile}
            onModalClose={() => setIsModalOpen(false)}
          />
        }
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
      />
    </>
  );

  return popover ? (
    <div
      className="user-popover-wrapper"
      onMouseEnter={popoverProps.handleInteraction}
      onMouseLeave={popoverProps.handleInteraction}
    >
      {userFinal}
      {user && <Popover content={userPopover} {...popoverProps} />}
    </div>
  ) : (
    userFinal
  );
};
