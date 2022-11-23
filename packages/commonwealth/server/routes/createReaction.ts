/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
import { Request, Response, NextFunction } from 'express';
import { NotificationCategories } from 'common-common/src/types';
import { factory, formatFilename } from 'common-common/src/logging';
import { TokenBalanceCache } from 'token-balance-cache/src/index';
import validateChain from '../util/validateChain';
import lookupAddressIsOwnedByUser from '../util/lookupAddressIsOwnedByUser';
import {
  getProposalUrl,
  getProposalUrlWithoutObject,
} from '../../shared/utils';
import proposalIdToEntity from '../util/proposalIdToEntity';
import { DB } from '../models';
import { mixpanelTrack } from '../util/mixpanelUtil';
import { MixpanelCommunityInteractionEvent } from '../../shared/analytics/types';
import RuleCache from '../util/rules/ruleCache';
import BanCache from '../util/banCheckCache';
import { AppError, ServerError } from '../util/errors';
import validateRestrictions from '../util/validateRestrictions';

const log = factory.getLogger(formatFilename(__filename));

export const Errors = {
  NoPostId: 'Must provide a comment or thread ID',
  NoReaction: 'Must provide a reaction',
  NoCommentMatch: 'No matching comment found',
  NoProposalMatch: 'No matching proposal found',
  InsufficientTokenBalance:
    "Users need to hold some of the community's tokens to react",
  BalanceCheckFailed: 'Could not verify user token balance',
  RuleCheckFailed: 'Rule check failed',
};

const createReaction = async (
  models: DB,
  tokenBalanceCache: TokenBalanceCache,
  ruleCache: RuleCache,
  banCache: BanCache,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [chain, error] = await validateChain(models, req.body);
  if (error) return next(new AppError(error));
  const [author, authorError] = await lookupAddressIsOwnedByUser(models, req);
  if (authorError) return next(new AppError(authorError));
  const { reaction, comment_id, proposal_id, thread_id } = req.body;

  if (!thread_id && !proposal_id && !comment_id) {
    return next(new AppError(Errors.NoPostId));
  }
  if (!reaction) {
    return next(new AppError(Errors.NoReaction));
  }

  let thread;
  if (thread_id) {
    thread = await models.Thread.findOne({
      where: { id: thread_id },
    });
  } else if (comment_id) {
    const root_id = (
      await models.Comment.findOne({ where: { id: comment_id } })
    ).root_id;
    const comment_thread_id = root_id.substring(root_id.indexOf('_') + 1);
    thread = await models.Thread.findOne({
      where: { id: comment_thread_id },
    });
  }

  if (!req.user.isAdmin) {
    await validateRestrictions(
      models,
      ruleCache,
      banCache,
      tokenBalanceCache,
      author,
      chain,
      thread?.topic_id
    );
  }

  let proposal;
  let root_type;

  const options = {
    reaction,
    address_id: author.id,
    chain: chain.id,
  };

  if (thread_id) options['thread_id'] = thread_id;
  else if (proposal_id) {
    const chainEntity = await proposalIdToEntity(models, chain.id, proposal_id);
    if (!chainEntity) return next(new AppError(Errors.NoProposalMatch));
    const [prefix, id] = proposal_id.split('_');
    proposal = { id };
    root_type = proposal_id.split('_')[0];
    options['proposal_id'] = proposal_id;
  } else if (comment_id) options['comment_id'] = comment_id;

  let finalReaction;
  let created;

  try {
    [finalReaction, created] = await models.Reaction.findOrCreate({
      where: options,
      defaults: options,
      include: [models.Address],
    });

    if (created)
      finalReaction = await models.Reaction.findOne({
        where: options,
        include: [models.Address],
      });
  } catch (err) {
    return next(new ServerError(err));
  }

  let comment;
  let cwUrl;
  if (comment_id) {
    comment = await models.Comment.findByPk(Number(comment_id));
    if (!comment) return next(new AppError(Errors.NoCommentMatch));

    // Test on variety of comments to ensure root relation + type
    const [prefix, id] = comment.root_id.split('_');
    if (prefix === 'discussion') {
      proposal = await models.Thread.findOne({
        where: { id },
      });
      cwUrl = getProposalUrl(prefix, proposal, comment);
    } else if (
      prefix.includes('proposal') ||
      prefix.includes('referendum') ||
      prefix.includes('motion')
    ) {
      cwUrl = getProposalUrlWithoutObject(prefix, chain.id, id, comment);
      proposal = id;
    } else {
      proposal = undefined;
    }
    root_type = prefix;
  } else if (thread_id) {
    proposal = await models.Thread.findByPk(Number(thread_id));
    if (!proposal) return next(new AppError(Errors.NoProposalMatch));
    cwUrl = getProposalUrl('discussion', proposal, comment);
    root_type = 'discussion';
  }

  const root_title = typeof proposal === 'string' ? '' : proposal.title || '';

  // dispatch notifications
  const notification_data = {
    created_at: new Date(),
    root_id: comment
      ? comment.root_id.split('_')[1]
      : proposal instanceof models.Thread
      ? proposal.id
      : proposal?.root_id,
    root_title,
    root_type,
    chain_id: finalReaction.chain,
    author_address: finalReaction.Address.address,
    author_chain: finalReaction.Address.chain,
  };

  if (comment_id) {
    notification_data['comment_id'] = Number(comment.id);
    notification_data['comment_text'] = comment.text;
  }

  const location = thread_id
    ? `discussion_${thread_id}`
    : proposal_id || `comment-${comment_id}`;

  models.Subscription.emitNotifications(
    models,
    NotificationCategories.NewReaction,
    location,
    notification_data,
    {
      user: finalReaction.Address.address,
      author_chain: finalReaction.Address.chain,
      url: cwUrl,
      title: proposal.title || '',
      chain: finalReaction.chain,
      body: comment_id ? comment.text : '',
    },
    req.wss,
    [finalReaction.Address.address]
  );

  // update author.last_active (no await)
  author.last_active = new Date();
  author.save();

  if (process.env.NODE_ENV !== 'test') {
    mixpanelTrack({
      event: MixpanelCommunityInteractionEvent.CREATE_REACTION,
      community: chain.id,
      isCustomDomain: null,
    });
  }

  return res.json({ status: 'Success', result: finalReaction.toJSON() });
};

export default createReaction;
