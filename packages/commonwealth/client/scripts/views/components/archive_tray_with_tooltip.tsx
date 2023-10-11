import React from 'react';
import { CWTooltip } from './component_kit/cw_popover/cw_tooltip';
import moment from 'moment';
import { CWIcon } from './component_kit/cw_icons/cw_icon';

type ArchiveTrayWithTooltipProps = {
  archivedAt: moment.Moment;
};

export const ArchiveTrayWithTooltip = ({
  archivedAt,
}: ArchiveTrayWithTooltipProps) => {
  return (
    <CWTooltip
      hasBackground={true}
      placement="right"
      content={`Archived on ${archivedAt.format('MM/DD/YYYY')}`}
      renderTrigger={(handleInteraction) => (
        <CWIcon
          iconName="archiveTrayFilled"
          iconSize="small"
          onMouseEnter={handleInteraction}
          onMouseLeave={handleInteraction}
        />
      )}
    />
  );
};
