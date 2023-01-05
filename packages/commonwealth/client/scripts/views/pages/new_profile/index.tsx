/* @jsx m */

import m from 'mithril';
import $ from 'jquery';
import ClassComponent from 'class_component';

import 'pages/new_profile/index.scss';

import app from 'state';
import {
  Thread,
  ChainInfo,
  AddressInfo,
  NewProfile as Profile,
} from 'models';
import { modelFromServer as modelThreadFromServer } from 'controllers/server/threads';
import { modelFromServer as modelCommentFromServer } from 'controllers/server/comments';

import { NewProfileHeader } from './new_profile_header';
import Sublayout from '../../sublayout';
import { CWSpinner } from '../../components/component_kit/cw_spinner';
import { CommentWithAssociatedThread, NewProfileActivity } from './new_profile_activity';

enum ProfileError {
  None,
  NoAddressFound,
  NoProfileFound,
}

type NewProfileAttrs = {
  placeholder?: string;
};

const NoAddressFoundError = 'No address found';
const NoProfileFoundError = 'No profile found';

export default class NewProfile extends ClassComponent<NewProfileAttrs> {
  private address: string;
  private addresses: AddressInfo[];
  private chains: ChainInfo[];
  private content: m.Vnode;
  private comments: CommentWithAssociatedThread[];
  private error: ProfileError;
  private loading: boolean;
  private profile: Profile;
  private threads: Thread[];

  private getProfileData = async (address: string) => {
    try {
      const response = await $.get(`${app.serverUrl()}/profile/v2`, {
        address,
        jwt: app.user.jwt,
      });

      this.profile = new Profile(response.profile);
      this.threads = response.threads.map((t) => modelThreadFromServer(t));
      const comments = response.comments.map((c) => modelCommentFromServer(c));
      const commentsWithThread = comments.map((c) => {
        const thread = response.commentThreads.find(
          (t) => t.id === parseInt(c.rootProposal.replace('discussion_', ''), 10)
        );
        return { ...c, thread };
      })
      this.comments = commentsWithThread;
      this.chains = response.chains.map((c) => new ChainInfo(c));
      this.addresses = response.addresses.map(
        (a) =>
          new AddressInfo(
            a.id,
            a.address,
            a.chain,
            a.keytype,
            a.wallet_id,
            a.ghost_address
          )
      );
    } catch (err) {
      if (
        err.status === 500 &&
        err.responseJSON.error === NoAddressFoundError
      ) {
        this.error = ProfileError.NoAddressFound;
      }
      if (
        err.status === 500 &&
        err.responseJSON.error === NoProfileFoundError
      ) {
        this.error = ProfileError.NoProfileFound;
      }
    }
    m.redraw();
  };

  oninit() {
    this.address = m.route.param('address');
    this.loading = true;
    this.error = ProfileError.None;
    this.comments = [];
    this.threads = [];
    this.getProfileData(this.address);
    this.loading = false;
  }

  view() {
    if (this.loading)
      this.content = (
        <div class="ProfilePage">
          <div class="loading-spinner">
            <CWSpinner />
          </div>
        </div>
      );

    if (this.error === ProfileError.NoAddressFound)
      this.content = (
        <div class="ProfilePage">
          <div class="ErrorPage">
            <h3>Not on Commonwealth</h3>
            <p>
              If this is your address, sign in using your wallet to set up a
              profile.
            </p>
          </div>
        </div>
      );

    if (this.error === ProfileError.NoProfileFound)
      this.content = (
        <div class="ProfilePage">
          <div class="ErrorPage">
            <h3>No profile found</h3>
            <p>This address is not registered to Commonwealth.</p>
          </div>
        </div>
      );

    if (this.error === ProfileError.None)
      this.content = (
        <div class="ProfilePage">
          <div class="ProfilePageContainer">
            <NewProfileHeader
              profile={this.profile}
              address={this.address}
            />
            <NewProfileActivity
              threads={this.threads}
              comments={this.comments}
              chains={this.chains}
              addresses={this.addresses}
            />
          </div>
        </div>
      );

    return <Sublayout>{this.content}</Sublayout>;
  }
}
