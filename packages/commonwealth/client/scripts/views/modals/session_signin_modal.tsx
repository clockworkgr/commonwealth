import React, { useState } from 'react';
import $ from 'jquery';
import _ from 'underscore';
import { v4 as uuidv4 } from 'uuid';

import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import { Modal } from '../components/component_kit/cw_modal';
import { openConfirmation } from './confirmation_modal';

import 'modals/session_signin_modal.scss';

import app from 'state';
import { CWButton } from '../components/component_kit/cw_button';
import { CWWalletsList } from '../components/component_kit/cw_wallets_list';
import TerraWalletConnectWebWalletController from 'controllers/app/webWallets/terra_walletconnect_web_wallet';
import WalletConnectWebWalletController from 'controllers/app/webWallets/walletconnect_web_wallet';

type SessionSigninModalProps = {
  onClose: () => void;
  onVerified: () => void;
};

export const SessionSigninModal = (props: SessionSigninModalProps) => {
  const { onVerified, onClose } = props;

  const chainbase = app.chain?.meta?.base;
  const wallets = app.wallets.availableWallets(chainbase);

  const wcEnabled = _.any(
    wallets,
    (w) =>
      (w instanceof WalletConnectWebWalletController ||
        w instanceof TerraWalletConnectWebWalletController) &&
      w.enabled
  );

  return (
    <Modal
      content={

    <div
      className="SessionSigninModal"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="compact-modal-body">
        <h3>Re-connect wallet</h3>
        <p>
          Your previous login was awhile ago. Re-connect your wallet to
          continue:
        </p>
      </div>
      <div className="compact-modal-actions">
        <div>
          <CWWalletsList
            useSessionKeyLoginFlow={true}
            wallets={wallets}
            darkMode={false}
            setSelectedWallet={(wallet) => {
              /* do nothing */
            }}
            accountVerifiedCallback={() => onVerified()}
            linking={false}
            hasNoWalletsLink={false}
            showResetWalletConnect={wcEnabled}
          />
        </div>
      </div>
    </div>
      }
      onClose={onClose}
      open={true} />
  );
};

export const showSessionSigninModal = () => {
  const id = uuidv4();
  const target = document.createElement('div');
  let root: Root = null;

  target.id = id;

  root = createRoot(target);

  return new Promise((resolve) => {
    root.render(<SessionSigninModal onVerified={() => {
      resolve();
      root.unmount();
      target.remove();
    }} />);
  });
};
