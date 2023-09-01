import { ChainCategoryType } from 'common-common/src/types';
import { updateActiveUser } from 'controllers/app/login';
import RecentActivityController from 'controllers/app/recent_activity';
import SnapshotController from 'controllers/chain/snapshot';
import ChainEntityController from 'controllers/server/chain_entities';
import CommunitiesController from 'controllers/server/communities';
import ContractsController from 'controllers/server/contracts';
import DiscordController from 'controllers/server/discord';
import PollsController from 'controllers/server/polls';
import { RolesController } from 'controllers/server/roles';
import SearchController from 'controllers/server/search';
import SessionsController from 'controllers/server/sessions';
import { WebSocketController } from 'controllers/server/socket';
import { UserController } from 'controllers/server/user';
import ChainInfo from 'models/ChainInfo';
import type IChainAdapter from 'models/IChainAdapter';
import NodeInfo from 'models/NodeInfo';
import NotificationCategory from 'models/NotificationCategory';
import axios from 'axios';
import { updateActiveUser } from 'controllers/app/login';
import { ChainCategoryType } from 'common-common/src/types';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import {
  FirebaseMessaging,
  GetTokenOptions,
} from '@capacitor-firebase/messaging';
import { platform } from '@todesktop/client-core';
import { ChainStore, NodeStore } from 'stores';

export enum ApiStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
}

export const enum LoginState {
  NotLoaded = 'not_loaded',
  LoggedOut = 'logged_out',
  LoggedIn = 'logged_in',
}

const firebaseConfig = {
  apiKey: 'AIzaSyA93Av0xLkOB_nP9hyzhGYg78n9JEfS1bQ',
  authDomain: 'common-staging-384806.firebaseapp.com',
  projectId: 'common-staging-384806',
  storageBucket: 'common-staging-384806.appspot.com',
  messagingSenderId: '158803639844',
  appId: '1:158803639844:web:b212938a52d995c6d862b1',
  measurementId: 'G-4PNZZQDNFE',
  vapidKey:
    'BDMNzw-2Dm1HcE9hFr3T4Li_pCp_w7L4tCcq-OETD71J1DdC0VgIogt6rC8Hh0bHtTacyZHSoQ1ax5KCU4ZjS30',
};

export interface IApp {
  socket: WebSocketController;
  chain: IChainAdapter<any, any>;
  chainEntities: ChainEntityController;

  // XXX: replace this with some app.chain helper
  activeChainId(): string;

  chainPreloading: boolean;
  chainAdapterReady: EventEmitter;
  isAdapterReady: boolean;
  runWhenReady: (cb: () => any) => void;
  chainModuleReady: EventEmitter;
  isModuleReady: boolean;

  // Polls
  polls: PollsController;

  // Proposals
  proposalEmitter: EventEmitter;

  // Search
  search: SearchController;
  searchAddressCache: any;

  // Community
  communities: CommunitiesController;

  // Contracts
  contracts: ContractsController;

  // Discord
  discord: DiscordController;

  // User
  user: UserController;
  roles: RolesController;
  recentActivity: RecentActivityController;
  sessions: SessionsController;

  // Web3
  snapshot: SnapshotController;

  sidebarRedraw: EventEmitter;

  loginState: LoginState;
  loginStateEmitter: EventEmitter;

  // stored on server-side
  config: {
    chains: ChainStore;
    nodes: NodeStore;
    notificationCategories?: NotificationCategory[];
    defaultChain: string;
    evmTestEnv?: string;
    chainCategoryMap?: { [chain: string]: ChainCategoryType[] };
  };

  firebase(): any;

  isFirebaseInitialized(): boolean;

  loginStatusLoaded(): boolean;

  isLoggedIn(): boolean;

  isProduction(): boolean;

  isNative(win): boolean;

  platform(): string;

  serverUrl(): string;

  loadingError: string;

  _customDomainId: string;

  isCustomDomain(): boolean;

  customDomainId(): string;

  setCustomDomain(d: string): void;

  // bandaid fix to skip next deinit chain on layout.tsx transition
  skipDeinitChain: boolean;
}

// INJECT DEPENDENCIES
const user = new UserController();
const roles = new RolesController(user);

// INITIALIZE MAIN APP
const app: IApp = {
  socket: new WebSocketController(),
  chain: null,
  chainEntities: new ChainEntityController(),
  activeChainId: () => app.chain?.id,

  chainPreloading: false,
  chainAdapterReady: new EventEmitter(),
  isAdapterReady: false,
  runWhenReady: (cb) => {
    if (app.isAdapterReady) cb();
    else app.chainAdapterReady.on('ready', cb);
  },
  // need many max listeners because every account will wait on this
  chainModuleReady: new EventEmitter().setMaxListeners(100),
  isModuleReady: false,

  // Polls
  polls: new PollsController(),

  // Proposals
  proposalEmitter: new EventEmitter(),

  // Community
  communities: new CommunitiesController(),

  // Contracts
  contracts: new ContractsController(),

  // Discord
  discord: new DiscordController(),

  // Search
  search: new SearchController(),
  searchAddressCache: {},

  // Web3
  snapshot: new SnapshotController(),

  // User
  user,
  roles,
  recentActivity: new RecentActivityController(),
  sessions: new SessionsController(),
  loginState: LoginState.NotLoaded,
  loginStateEmitter: new EventEmitter(),

  // Global nav state
  sidebarRedraw: new EventEmitter(),

  config: {
    chains: new ChainStore(),
    nodes: new NodeStore(),
    defaultChain: 'edgeware',
  },
  firebase: () => {
    if (app.isFirebaseInitialized) {
      initializeApp(firebaseConfig);
      app.isFirebaseInitialized;
    }
  },
  isFirebaseInitialized: () => false,
  // TODO: Collect all getters into an object
  loginStatusLoaded: () => app.loginState !== LoginState.NotLoaded,
  isLoggedIn: () => app.loginState === LoginState.LoggedIn,
  isNative: () => {
    const capacitor = window['Capacitor'];
    return !!(capacitor && capacitor.isNative);
  },
  platform: () => {
    // Using Desktop API to determine if the platform is desktop
    if (platform.todesktop.isDesktopApp()) {
      return 'desktop';
    } else {
      // If not desktop, get the platform from Capacitor
      return Capacitor.getPlatform();
    }
  },
  isProduction: () =>
    document.location.origin.indexOf('commonwealth.im') !== -1,
  serverUrl: () => {
    //* TODO: @ Used to store the webpack SERVER_URL, should only be set for mobile deployments */
    const mobileUrl = process.env.SERVER_URL; // Replace with your computer ip, staging, or production url

    if (app.isNative(window)) {
      return mobileUrl;
    } else {
      return '/api';
    }
  },

  loadingError: null,

  _customDomainId: null,
  isCustomDomain: () => app._customDomainId !== null,
  customDomainId: () => {
    return app._customDomainId;
  },
  setCustomDomain: (d) => {
    app._customDomainId = d;
  },
  skipDeinitChain: false,
};

// On login: called to initialize the logged-in state, available chains, and other metadata at /api/status
// On logout: called to reset everything
export async function initAppState(
  updateSelectedChain = true,
  shouldRedraw = true
): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${app.serverUrl()}/status`, { withCredentials: true })
      .then(async (response) => {
        const data = response.data;

        app.config.chains.clear();
        app.config.nodes.clear();
        app.user.notifications.clear();
        app.user.notifications.clearSubscriptions();
        app.config.evmTestEnv = data.result.evmTestEnv;

        data.result.nodes
          .sort((a, b) => a.id - b.id)
          .map((node) => {
            return app.config.nodes.add(NodeInfo.fromJSON(node));
          });

        data.result.chainsWithSnapshots
          .filter((chainsWithSnapshots) => chainsWithSnapshots.chain.active)
          .map((chainsWithSnapshots) => {
            delete chainsWithSnapshots.chain.ChainNode;
            return app.config.chains.add(
              ChainInfo.fromJSON({
                ChainNode: app.config.nodes.getById(
                  chainsWithSnapshots.chain.chain_node_id
                ),
                snapshot: chainsWithSnapshots.snapshot,
                ...chainsWithSnapshots.chain,
              })
            );
          });

        app.roles.setRoles(data.result.roles);
        app.config.notificationCategories =
          data.result.notificationCategories.map((json) =>
            NotificationCategory.fromJSON(json)
          );
        app.config.chainCategoryMap = data.result.chainCategoryMap;
        // add recentActivity
        const { recentThreads } = data.result;
        recentThreads.forEach(({ chain, count }) => {
          app.recentActivity.setCommunityThreadCounts(chain, count);
        });

        // update the login status
        updateActiveUser(data.result.user);
        app.loginState = data.result.user
          ? LoginState.LoggedIn
          : LoginState.LoggedOut;

        let tokenRefreshListener = null;
        if (app.loginState === LoginState.LoggedIn) {
          console.log('Initializing socket connection with JTW:', app.user.jwt);

          app.firebase();
          // init the websocket connection and the chain-events namespace
          app.socket.init(app.user.jwt);
          app.user.notifications.refresh(); // TODO: redraw if needed
          if (shouldRedraw) {
            app.loginStateEmitter.emit('redraw');
          }

          tokenRefreshListener = FirebaseMessaging.addListener(
            'tokenReceived',
            (token) => {
              const mechanism = app.user.notifications.deliveryMechanisms.find(
                (m) => m.type === app.platform()
              );
              // If matching mechanism found, update it on the server
              if (mechanism) {
                app.user.notifications.updateDeliveryMechanism(
                  token.token,
                  mechanism.type,
                  mechanism.enabled
                );
              }
            }
          );
        } else if (
          app.loginState === LoginState.LoggedOut &&
          app.socket.isConnected
        ) {
          // TODO: create global deinit function
          app.socket.disconnect();
          if (shouldRedraw) {
            app.loginStateEmitter.emit('redraw');
          }

          if (tokenRefreshListener) {
            tokenRefreshListener.remove();
            tokenRefreshListener = null;
          }
        }

        app.user.setStarredCommunities(
          data.result.user ? data.result.user.starredCommunities : []
        );
        // update the selectedChain, unless we explicitly want to avoid
        // changing the current state (e.g. when logging in through link_new_address_modal)
        if (
          updateSelectedChain &&
          data.result.user &&
          data.result.user.selectedChain
        ) {
          app.user.setSelectedChain(
            ChainInfo.fromJSON(data.result.user.selectedChain)
          );
        }

        resolve();
      })
      .catch((err: any) => {
        app.loadingError =
          err.responseJSON?.error || 'Error loading application state';
        reject(err);
      });
  });
}

export default app;
