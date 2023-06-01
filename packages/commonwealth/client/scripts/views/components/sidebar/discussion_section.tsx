import React from 'react';

import 'components/sidebar/index.scss';
import app from 'state';
import { handleRedirectClicks, parseCustomStages } from '../../../helpers';
import { verifyCachedToggleTree } from './helpers';
import { SidebarSectionGroup } from './sidebar_section';
import type {
  SectionGroupAttrs,
  SidebarSectionAttrs,
  SubSectionAttrs,
  ToggleTree,
} from './types';
import { useCommonNavigate } from 'navigation/helpers';
import { useLocation, matchRoutes } from 'react-router-dom';
import { ThreadStage } from 'models/types';

function setDiscussionsToggleTree(path: string, toggle: boolean) {
  let currentTree = JSON.parse(
    localStorage[`${app.activeChainId()}-discussions-toggle-tree`]
  );
  const split = path.split('.');
  for (const field of split.slice(0, split.length - 1)) {
    if (Object.prototype.hasOwnProperty.call(currentTree, field)) {
      currentTree = currentTree[field];
    } else {
      return;
    }
  }
  currentTree[split[split.length - 1]] = !toggle;
  const newTree = currentTree;
  localStorage[`${app.activeChainId()}-discussions-toggle-tree`] =
    JSON.stringify(newTree);
}

function setStageToggleState(
  topicName: string,
  stageName: string,
  toggle: boolean
) {
  const toggleTreeKey = `${app.activeChainId()}-discussions-toggle-tree`;
  let currentTree = JSON.parse(localStorage[toggleTreeKey]);

  const path = `children.${topicName}.children.${stageName}.toggledState`;
  const split = path.split('.');

  for (const field of split.slice(0, split.length - 1)) {
    if (Object.prototype.hasOwnProperty.call(currentTree, field)) {
      currentTree = currentTree[field];
    } else {
      return;
    }
  }
  currentTree[split[split.length - 1]] = !toggle;
  const newTree = currentTree;
  localStorage[toggleTreeKey] = JSON.stringify(newTree);
}

export const DiscussionSection = () => {
  const navigate = useCommonNavigate();
  const location = useLocation();
  const matchesDiscussionsRoute = matchRoutes(
    [{ path: '/discussions' }, { path: ':scope/discussions' }],
    location
  );
  const matchesOverviewRoute = matchRoutes(
    [{ path: '/overview' }, { path: ':scope/overview' }],
    location
  );
  const matchesDiscussionsTopicRoute = matchRoutes(
    [{ path: '/discussions/:topic' }, { path: ':scope/discussions/:topic' }],
    location
  );
  const matchesSputnikDaosRoute = matchRoutes(
    [{ path: '/sputnik-daos' }, { path: ':scope/sputnik-daos' }],
    location
  );

  const topics = app.topics.store
    .getByCommunity(app.activeChainId())
    .filter((t) => t.featuredInSidebar)
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.order - b.order);

  const getStages = () => {
    const { stagesEnabled, customStages } = app.chain?.meta || {};
    if (stagesEnabled) {
      if (!customStages) {
        return [
          ThreadStage.Discussion,
          ThreadStage.ProposalInReview,
          ThreadStage.Voting,
          ThreadStage.Passed,
          ThreadStage.Failed,
        ];
      } else {
        return parseCustomStages(customStages);
      }
    }
    return [];
  };

  const stages = getStages();

  const discussionsLabel = ['vesuvius', 'olympus'].includes(app.activeChainId())
    ? 'Forum'
    : 'Discussion';

  // Build Toggle Tree
  const discussionsDefaultToggleTree: ToggleTree = {
    toggledState: false,
    children: {},
  };

  for (const topic of topics) {
    if (topic.featuredInSidebar) {
      discussionsDefaultToggleTree.children[topic.name] = {
        toggledState: true,
        children: {
          All: {
            toggledState: false,
          },
          ...(app.activeChainId() === 'near' && {
            SputnikDaos: {
              toggledState: false,
            },
          }),
        },
      };
    }
  }

  // Check if an existing toggle tree is stored
  if (!localStorage[`${app.activeChainId()}-discussions-toggle-tree`]) {
    localStorage[`${app.activeChainId()}-discussions-toggle-tree`] =
      JSON.stringify(discussionsDefaultToggleTree);
  } else if (
    !verifyCachedToggleTree('discussions', discussionsDefaultToggleTree)
  ) {
    localStorage[`${app.activeChainId()}-discussions-toggle-tree`] =
      JSON.stringify(discussionsDefaultToggleTree);
  }
  const toggleTreeState = JSON.parse(
    localStorage[`${app.activeChainId()}-discussions-toggle-tree`]
  );

  const discussionsGroupData: SectionGroupAttrs[] = [
    {
      title: 'All',
      containsChildren: false,
      hasDefaultToggle: false,
      isVisible: true,
      isUpdated: true,
      isActive: !!matchesDiscussionsRoute,
      onClick: (e, toggle: boolean) => {
        e.preventDefault();
        handleRedirectClicks(
          navigate,
          e,
          `/discussions`,
          app.activeChainId(),
          () => {
            setDiscussionsToggleTree(`children.All.toggledState`, toggle);
          }
        );
      },
      displayData: null,
    },
    {
      title: 'Overview',
      containsChildren: false,
      hasDefaultToggle: false,
      isVisible: true,
      isUpdated: true,
      isActive: !!matchesOverviewRoute,
      onClick: (e, toggle: boolean) => {
        e.preventDefault();
        handleRedirectClicks(
          navigate,
          e,
          `/overview`,
          app.activeChainId(),
          () => {
            setDiscussionsToggleTree(`children.Overview.toggledState`, toggle);
          }
        );
      },
      displayData: null,
    },
    app.activeChainId() === 'near' && {
      title: 'Sputnik Daos',
      containsChildren: false,
      hasDefaultToggle: false,
      isVisible: true,
      isUpdated: true,
      isActive:
        !!matchesSputnikDaosRoute &&
        (app.chain ? app.chain.serverLoaded : true),
      onClick: (e, toggle: boolean) => {
        e.preventDefault();
        handleRedirectClicks(
          navigate,
          e,
          `/sputnik-daos`,
          app.activeChainId(),
          () => {
            setDiscussionsToggleTree(
              `children.SputnikDAOs.toggledState`,
              toggle
            );
          }
        );
      },
      displayData: null,
    },
  ];

  for (const topic of topics) {
    if (topic.featuredInSidebar) {
      const subSections = stages.map((stage) => {
        return {
          title: stage,
          isVisible: true,
          isUpdated: true,
          isActive: matchesDiscussionsTopicRoute?.[0]?.params?.stage === stage,
          onClick: (e) => {
            e.preventDefault();
            handleRedirectClicks(
              navigate,
              e,
              `/discussions/${encodeURI(topic.name)}?stage=${encodeURI(stage)}`,
              app.activeChainId(),
              () => {
                setStageToggleState(topic.name, stage, false);
              }
            );
          },
        } as SubSectionAttrs;
      });

      const discussionSectionGroup: SectionGroupAttrs = {
        title: topic.name,
        containsChildren: true,
        hasDefaultToggle: false,
        isVisible: true,
        isUpdated: true,
        isActive:
          matchesDiscussionsTopicRoute?.[0]?.params?.topic === topic.name,
        // eslint-disable-next-line no-loop-func
        onClick: (e, toggle: boolean) => {
          e.preventDefault();
          handleRedirectClicks(
            navigate,
            e,
            `/discussions/${encodeURI(topic.name)}`,
            app.activeChainId(),
            () => {
              setDiscussionsToggleTree(
                `children.${topic.name}.toggledState`,
                toggle
              );
            }
          );
        },
        displayData: subSections,
      };
      discussionsGroupData.push(discussionSectionGroup);
    }
  }

  const sidebarSectionData: SidebarSectionAttrs = {
    title: discussionsLabel,
    className: 'DiscussionSection',
    hasDefaultToggle: toggleTreeState['toggledState'],
    onClick: (e, toggle: boolean) => {
      e.preventDefault();
      setDiscussionsToggleTree('toggledState', toggle);
    },
    displayData: discussionsGroupData,
    isActive: true,
  };

  return <SidebarSectionGroup {...sidebarSectionData} />;
};
