// Source: https://github.com/Simspace/monorail/blob/master/src/metaComponents/popOver/PopOver.tsx

import {
  dropDirections,
  dropXDirectionType,
  dropYDirectionType,
  GetFunctionAttrs,
  GetFunctionXAttrs,
  GetFunctionYAttrs,
} from './types';

const getDropXAmount: (attrs: GetFunctionXAttrs) => {
  dropXAmount: number;
} = ({ dropXDirection, innerWidth, boundingRect, toSide, gap }) => {
  const isLeft = dropXDirection === dropDirections.Left;

  const dropXAmountForToSide = () =>
    isLeft
      ? boundingRect.left + boundingRect.width + gap
      : innerWidth - boundingRect.right + boundingRect.width + gap;

  const dropXAmountForNotToSide = () =>
    isLeft ? boundingRect.left : innerWidth - boundingRect.right;

  return {
    dropXAmount: toSide ? dropXAmountForToSide() : dropXAmountForNotToSide(),
  };
};

const getDropYAmount: (attrs: GetFunctionYAttrs) => {
  dropYAmount: number;
} = ({ dropYDirection, innerHeight, boundingRect, toSide, gap }) => {
  const isTop = dropYDirection === dropDirections.Top;

  const dropYAmountForToSide = () =>
    isTop ? boundingRect.top : innerHeight - boundingRect.bottom;

  const dropYAmountForNotToSide = () =>
    isTop
      ? boundingRect.top + boundingRect.height + gap
      : innerHeight - boundingRect.bottom + boundingRect.height + gap;

  return {
    dropYAmount: toSide ? dropYAmountForToSide() : dropYAmountForNotToSide(),
  };
};

const getMaxHeight: (attrs: GetFunctionYAttrs) => {
  maxHeight: number;
} = ({ dropYDirection, innerHeight, boundingRect, toSide, gap }) => {
  const isTop = dropYDirection === dropDirections.Top;

  const maxHeightForToSide = () =>
    isTop
      ? innerHeight - boundingRect.top - gap * 2
      : boundingRect.top + boundingRect.height - gap * 2;

  const maxHeightForNotToSide = () =>
    isTop
      ? innerHeight - (boundingRect.top + boundingRect.height) - gap * 2
      : boundingRect.top - gap * 2;

  return { maxHeight: toSide ? maxHeightForToSide() : maxHeightForNotToSide() };
};

const getMaxWidth: (attrs: GetFunctionXAttrs) => {
  maxWidth: number;
} = ({ dropXDirection, innerWidth, boundingRect, toSide, gap }) => {
  const isLeft = dropXDirection === dropDirections.Left;

  const maxWidthForToSide = () =>
    isLeft
      ? innerWidth - boundingRect.left - boundingRect.width - gap * 2
      : boundingRect.left - gap * 2;

  const maxWidthForNotToSide = () =>
    isLeft
      ? innerWidth - boundingRect.left - gap * 2
      : boundingRect.left + boundingRect.width - gap * 2;

  return { maxWidth: toSide ? maxWidthForToSide() : maxWidthForNotToSide() };
};

const getMaxHeightCalc: (attrs: GetFunctionYAttrs) => {
  maxHeightCalc: string;
} = ({ dropYDirection, innerHeight, boundingRect, toSide, gap }) => {
  const isTop = dropYDirection === dropDirections.Top;

  const maxHeightForToSide = () =>
    isTop
      ? `calc(100vh - ${boundingRect.bottom + gap * 2}px)`
      : `calc(100vh - ${innerHeight - boundingRect.bottom + gap}px)`;

  const maxHeightForNotToSide = () =>
    isTop
      ? `calc(100vh - ${boundingRect.bottom + gap * 2}px)`
      : `calc(100vh - ${innerHeight - boundingRect.top + gap * 2}px)`;

  return {
    maxHeightCalc: toSide ? maxHeightForToSide() : maxHeightForNotToSide(),
  };
};

const getMaxWidthCalc: (attrs: GetFunctionXAttrs) => {
  maxWidthCalc: string;
} = ({ dropXDirection, innerWidth, boundingRect, toSide, gap }) => {
  const isLeft = dropXDirection === dropDirections.Left;

  const maxWidthForToSide = () =>
    isLeft
      ? `calc(100vw - ${boundingRect.right + gap * 2}px)`
      : `calc(100vw - ${innerWidth - boundingRect.left + gap}px)`;

  const maxWidthForNotToSide = () =>
    isLeft
      ? `calc(100vw - ${boundingRect.left + gap}px)`
      : `calc(100vw - ${innerWidth - boundingRect.right + gap}px)`;

  return {
    maxWidthCalc: toSide ? maxWidthForToSide() : maxWidthForNotToSide(),
  };
};

const getDropAmounts: (attrs: GetFunctionAttrs) => {
  dropXAmount: number;
  dropYAmount: number;
  maxHeight: number;
  maxWidth: number;
  maxHeightCalc: string;
  maxWidthCalc: string;
} = ({
  dropXDirection,
  dropYDirection,
  innerHeight,
  innerWidth,
  ...otherAttrs
}) => ({
  ...getDropXAmount({ dropXDirection, innerWidth, ...otherAttrs }),
  ...getDropYAmount({ dropYDirection, innerHeight, ...otherAttrs }),
  ...getMaxHeight({ dropYDirection, innerHeight, ...otherAttrs }),
  ...getMaxWidth({ dropXDirection, innerWidth, ...otherAttrs }),
  ...getMaxHeightCalc({ dropYDirection, innerHeight, ...otherAttrs }),
  ...getMaxWidthCalc({ dropXDirection, innerWidth, ...otherAttrs }),
});

export const getPopoverPosition = ({
  target,
  gap = 8,
  toSide = false,
  xDirection,
  yDirection,
}: {
  target: Element;
  gap?: number;
  toSide?: boolean;
  xDirection?: dropXDirectionType;
  yDirection?: dropYDirectionType;
}) => {
  // Get basic dimensions about the the Toggle and the window.
  const boundingRect = target.getBoundingClientRect();
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  // Determine the direction the PopOver should go.
  const dropYDirection: dropYDirectionType =
    yDirection ||
    (innerHeight / 2 > boundingRect.top + boundingRect.height / 2
      ? dropDirections.Top
      : dropDirections.Bottom);

  const dropXDirection: dropXDirectionType =
    xDirection ||
    (innerWidth / 2 > boundingRect.left + boundingRect.width / 2
      ? dropDirections.Left
      : dropDirections.Right);

  return {
    ...getDropAmounts({
      boundingRect,
      dropXDirection,
      dropYDirection,
      gap,
      innerHeight,
      innerWidth,
      toSide,
    }),
    dropXDirection,
    dropYDirection,
    gap,
    originHeight: boundingRect.height,
    originWidth: boundingRect.width,
  };
};
