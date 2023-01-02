import validateChain from '../middleware/validateChain';
import { DB } from '../models';
import { AppError, ServerError } from 'common-common/src/errors';
import { VoteAttributes } from '../models/vote';
import { TypedRequestQuery, TypedResponse, success } from '../types';
import { checkReadPermitted } from '../util/roles';
import { Action } from '../../../common-common/src/permissions';

export const Errors = {
  NoPollSpecified: 'No poll has been specified',
};

type ViewVotesReq = { poll_id: string; chain_id: string };
type ViewVotesResp = VoteAttributes[];

const viewVotes = async (
  models: DB,
  req: TypedRequestQuery<ViewVotesReq>,
  res: TypedResponse<ViewVotesResp>
) => {
  // TODO: runtime validation based on params
  //   maybe something like https://www.npmjs.com/package/runtime-typescript-checker
  let chain, error;
  try {
    [chain, error] = await validateChain(models, req.query);
  } catch (err) {
    throw new AppError(err);
  }
  if (error) {
    console.log('It throws an AppError');
    throw new AppError(error);
  }

  await checkReadPermitted(
    models,
    chain.id,
    Action.VIEW_POLLS,
    req.user?.id,
  );

  if (!req.query.poll_id) {
    throw new AppError(Errors.NoPollSpecified);
  }

  try {
    const votes = await models.Vote.findAll({
      where: {
        poll_id: req.query.poll_id,
        chain_id: chain.id,
      },
    });
    return success(
      res,
      votes.map((v) => v.toJSON())
    );
  } catch (err) {
    throw new ServerError(err);
  }
};

export default viewVotes;
