import { AppError } from 'common-common/src/errors';
import type { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Errors from './errors';

const updateWebhook = async (
  models,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const chain = req.chain;
  // only admins should be able to update webhooks
  if (!req.user) return next(new AppError(Errors.NotLoggedIn));

  const addresses = await req.user.getAddresses();

  const adminRole = await models.Address.findOne({
    where: {
      chain: chain,
      id: {
        [Op.in]: addresses
          .filter((addr) => !!addr.verified)
          .map((addr) => addr.id),
      },
    },
    attributes: ['role'],
  });

  if (!req.user.isAdmin && adminRole?.role !== 'admin') {
    return next(new AppError(Errors.NotAdmin));
  }
  // check if webhook url exists already in the community
  if (!req.body.webhookId) {
    return next(new AppError(Errors.MissingWebhook));
  }

  const existingWebhook = await models.Webhook.findOne({
    where: {
      id: req.body.webhookId,
    },
  });

  if (!existingWebhook) {
    return next(new AppError(Errors.NoWebhookFound));
  }

  if (!req.body.categories) {
    return next(new AppError(Errors.MissingCategories));
  }

  existingWebhook.categories = req.body.categories || [];

  await existingWebhook.save();

  return res.json({ status: 'Success', result: existingWebhook.toJSON() });
};
export default updateWebhook;
