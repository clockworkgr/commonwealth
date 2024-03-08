import { IDiscordMeta } from '@hicommonwealth/core';
import { ThreadAttributes } from '@hicommonwealth/model';
import { CreateThreadOptions } from 'server/controllers/server_threads_methods/create_thread';
import { isCanvasSignedDataApiArgs } from 'shared/canvas/types';
import { verifyThread } from '../../../shared/canvas/serverVerify';
import { ServerControllers } from '../../routing/router';
import { TypedRequestBody, TypedResponse, success } from '../../types';

type CreateThreadRequestBody = {
  topic_id: string;
  topic_name: string;
  title: string;
  body: string;
  kind: string;
  stage: string;
  url?: string;
  readOnly: boolean;
  canvas_action?: any;
  canvas_session?: any;
  canvas_hash?: any;
  discord_meta?: IDiscordMeta;
};
type CreateThreadResponse = ThreadAttributes;

export const createThreadHandler = async (
  controllers: ServerControllers,
  req: TypedRequestBody<CreateThreadRequestBody>,
  res: TypedResponse<CreateThreadResponse>,
) => {
  const { user, address, community } = req;
  const {
    topic_id: topicId,
    title,
    body,
    kind,
    stage,
    url,
    readOnly,
    canvas_action: canvasAction,
    canvas_session: canvasSession,
    canvas_hash: canvasHash,
    discord_meta,
  } = req.body;

  const threadFields: CreateThreadOptions = {
    user,
    address,
    community,
    title,
    body,
    kind,
    readOnly,
    topicId: parseInt(topicId, 10) || undefined,
    stage,
    url,
    discordMeta: discord_meta,
  };

  if (process.env.ENFORCE_SESSION_KEYS === 'true') {
    if (isCanvasSignedDataApiArgs(req.body)) {
      await verifyThread(canvasAction, canvasSession, canvasHash, {
        title,
        body,
        address: address.address,
        community: community.id,
        topic: topicId ? parseInt(topicId, 10) : null,
      });
      threadFields.canvasAction = req.body.canvas_action;
      threadFields.canvasSession = req.body.canvas_session;
      threadFields.canvasHash = req.body.canvas_hash;
    }
  }

  const [thread, notificationOptions, analyticsOptions] =
    await controllers.threads.createThread(threadFields);

  for (const n of notificationOptions) {
    controllers.notifications.emit(n).catch(console.error);
  }

  controllers.analytics.track(analyticsOptions, req).catch(console.error);

  return success(res, thread);
};
