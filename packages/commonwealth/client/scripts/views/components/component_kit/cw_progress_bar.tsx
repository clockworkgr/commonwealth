/* @jsx jsx */
import React from 'react';

import {
  ClassComponent,
  ResultNode,
  render,
  setRoute,
  getRoute,
  getRouteParam,
  redraw,
  Component,
  jsx,
} from 'mithrilInterop';

import 'components/component_kit/cw_progress_bar.scss';
import { CWIcon } from './cw_icons/cw_icon';
import type { IconName } from './cw_icons/cw_icon_lookup';
import { CWText } from './cw_text';

import { getClasses } from './helpers';
import { ComponentType } from './types';

type ProgressBarStatus = 'selected' | 'neutral' | 'ongoing' | 'passed';

type ProgressBarAttrs = {
  label: string;
  progress: number; // Percentage of progress.
  progressStatus: ProgressBarStatus;
  subtext?: string;
  iconName?: IconName;
};

export class CWProgressBar extends ClassComponent<ProgressBarAttrs> {
  view(vnode: ResultNode<ProgressBarAttrs>) {
    const { label, progress, progressStatus, subtext, iconName } = vnode.attrs;

    return (
      <div className={ComponentType.ProgressBar}>
        <div className="progress-label">
          <div className="label-wrapper">
            <div className="label-display">
              {!!iconName && (
                <CWIcon
                  iconName={iconName}
                  iconSize="small"
                  className="button-icon"
                />
              )}
              <CWText>{label}</CWText>
            </div>
            {subtext && (
              <CWText className="subtext-text" type="caption">
                {subtext}
              </CWText>
            )}
          </div>
          <CWText className="progress-percentage-text" type="caption">
            {`${Math.min(100, Math.floor(progress * 1000) / 1000)}%`}
          </CWText>
        </div>
        <progress
          className={getClasses<{ progressStatus: ProgressBarStatus }>({
            progressStatus,
          })}
          max="100"
          value={Math.min(100, progress)}
        />
      </div>
    );
  }
}
