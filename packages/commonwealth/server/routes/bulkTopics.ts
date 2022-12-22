import { Request, Response, NextFunction } from 'express';
import { factory, formatFilename } from 'common-common/src/logging';
import { AppError, ServerError } from 'common-common/src/errors';
import validateChain from '../middleware/validateChain';
import { DB } from '../models';
import { checkReadPermitted } from '../util/roles';
import { Action } from '../../../common-common/src/permissions';

const log = factory.getLogger(formatFilename(__filename));

export const Errors = {};

const bulkTopics = async (
  models: DB,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [chain, error] = await validateChain(models, req.query);
  if (error) return next(new AppError(error));

  await checkReadPermitted(
    models,
    chain.id,
    Action.VIEW_TOPICS,
    req.user?.id,
  );

  const topics = await models.Topic.findAll({
    where: { chain_id: chain.id },
  });

  return res.json({ status: 'Success', result: topics.map((c) => c.toJSON()) });
};

export default bulkTopics;
