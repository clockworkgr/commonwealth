/* eslint-disable no-mixed-operators */
import 'pages/commonwealth/projects/view.scss';

import m from 'mithril';
import { utils } from 'ethers';

import app from 'state';
import Sublayout from 'views/sublayout';
import PageLoading from 'views/pages/loading';
import ActionModule from 'views/components/commonwealth/actions/action_card';
import { CMNProject } from 'models';
import { connectionReady } from './index';

function secondsToDhms(seconds) {
  seconds = Number(seconds);

  if (seconds >= 0) {
    const dd = Math.floor(seconds / (3600 * 24));
    const hh = Math.floor(seconds % (3600 * 24) / 3600);
    const mm = Math.floor(seconds % 3600 / 60);
    const ss = Math.floor(seconds % 60);

    const dDisplay = dd > 0 ? dd + (dd === 1 ? ' day, ' : ' days, ') : '';
    const hDisplay = hh > 0 ? hh + (hh === 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = mm > 0 ? mm + (mm === 1 ? ' minute, ' : ' minutes ') : '';
    const sDisplay = ss > 0 ? ss + (ss === 1 ? ' second' : ' seconds') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
  return '0 seconds';
}

const ProjectContentModule: m.Component<{
  project: CMNProject,
  leftInSeconds: number,
  forceUpdateStatus: () => void,
}, {}> = {
  oncreate: async (vnode) => {
    if (vnode.attrs.leftInSeconds > 0) {
      setTimeout(() => { m.redraw(); }, 1000 * 60);
    } else {
      await vnode.attrs.forceUpdateStatus();
    }
  },
  view: (vnode) => {
    const { project, leftInSeconds } = vnode.attrs;
    const leftTime = project.status === 'In Progress' ? `${secondsToDhms(leftInSeconds)} left` : project.status;
    const textColorStyle = {
      color: project.status === 'In Progress' ? 'blue' : project.status === 'Successed' ? 'green' : 'red'
    };

    return m('.row .content-area', [
      m('.col-lg-12', [
        m('div.project-name', project.name),
        m('div.project-text', [
          m('span', 'A project by created by'),
          m('span.bold', ` ${project.beneficiary}`),
        ]),
        m('div.project-description', { style: textColorStyle }, leftTime),
        m('div.project-description', project.description)
      ])
    ]);
  }
};

const TokenHolders: m.Component<{
  holders: {
    balance: number;
    address: string;
  }[],
  token: string
}, {}> = {
  view: (vnode) => {
    const { holders, token } = vnode.attrs;
    const holderContent = holders.map((holder) => m('.member', [
      m('.text', holder.address),
      m('.text', holder.balance),
    ]));
    return m('div', [ m('p', token), holderContent ]);
  }
};

const ViewProjectPage: m.Component<{
  projectHash: string
},
{
  initialized: boolean,
  project: CMNProject,
  curators: any,
  backers: any
}> = {
  oncreate: async (vnode) => {
    vnode.state.initialized = false;
  },
  onupdate: async (vnode) => {
    if (!connectionReady()) return;
    if (vnode.state.initialized) return;

    const project_protocol = app.cmnProtocol.project_protocol;
    const projects = await project_protocol.syncProjects();
    const project = projects.filter((item) => item.projectHash === vnode.attrs.projectHash)[0];
    const members = await project_protocol.syncMembers(project);

    vnode.state.backers = members ? members.backers : [];
    vnode.state.curators = members ? members.curators : [];
    vnode.state.project = project;
    vnode.state.initialized = true;
    m.redraw();
  },
  view: (vnode) => {
    const { project, initialized, curators, backers } = vnode.state;

    if (!initialized) return m(PageLoading);

    const project_protocol = app.cmnProtocol.project_protocol;
    const { bTokens, cTokens, endTime } = project;
    const startTime = new Date();
    const leftInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    // const backersContent = project.acceptedTokens.map((token) => m(
    //   TokenHolders,
    //   { holders: backers[token], token: bTokens[token] }
    // ));
    // const curatorsContent = project.acceptedTokens.map((token) => m(
    //   TokenHolders, { holders: curators[token], token: cTokens[token] }
    // ));

    return m(Sublayout, {
      class: 'ProjectPage',
      title: 'Projects',
      showNewProposalButton: true,
    }, [
      m('.container', [
        m(ProjectContentModule, {
          project,
          leftInSeconds,
          forceUpdateStatus: async () => {
            vnode.state.initialized = false;
            await project_protocol.syncProjects();
            vnode.state.initialized = true;
          }
        }),
        m(ActionModule, { project, project_protocol, backers, curators }),
        m('.row .members-card', [
          m('.col-lg-6', [
            m('.title', 'Backers'),
            m('.text .mt-10px', 'Backer funds will go to the project if the funding threshold is reached.'),
            // backersContent
          ]),
          m('.col-lg-6', [
            m('.title', 'Curator'),
            m(
              '.text .mt-10px',
              'Curators received 5% of the total raise if the project is successful. You should curate.'
            ),
            // curatorsContent,
          ])
        ])
      ]),
    ]);
  }
};

export default ViewProjectPage;
