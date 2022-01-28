import {Server} from 'socket.io';
import moment from 'moment';
import {addPrefix, factory} from '../../shared/logging';
import {
    WebsocketEngineEvents,
    WebsocketMessageType,
    WebsocketNamespaces,
} from '../../shared/types';
import {authenticate} from './index';
import {DB} from '../database';

const log = factory.getLogger(addPrefix(__filename));

export function createChatNamespace(io: Server, models: DB) {
    const ChatNs = io.of('/chat');
    io.use(authenticate)

    ChatNs.on('connection', (socket) => {
        log.info(`${socket.id} connected to Chat`);

        socket.on('disconnect', () => {
            log.info(`${socket.id} disconnected from Chat`);
        });

        socket.on(WebsocketMessageType.JoinChatChannel, (chatChannelIds: number[]) => {
            if (chatChannelIds.length > 0) {
                log.info(`${socket.id} joining ${JSON.stringify(chatChannelIds)}`);
                for (const channel of chatChannelIds) socket.join(`${channel}`);
            }
        })

        socket.on(WebsocketMessageType.LeaveChatChannel, (chatChannelIds: number[]) => {
            if (chatChannelIds.length > 0) {
                log.info(`${socket.id} leaving ${JSON.stringify(chatChannelIds)}`);
                for (const channel of chatChannelIds) socket.leave(`${channel}`);
            }
        })

        socket.on(WebsocketMessageType.ChatMessage, (_message) => {
            const { message, address, chat_channel_id, now } = _message
            const now_date = moment(now).toDate()
            models.ChatMessage.create({ address, message, chat_channel_id, created_at: now_date, updated_at: now_date })
                .then((res) => {
                    const { id, created_at } = res
                    ChatNs
                      .to(`${chat_channel_id}`)
                      .emit(WebsocketMessageType.ChatMessage, { id, address, message, chat_channel_id, created_at });
                })
                .catch((e) => {
                    socket.emit('Error', e)
                })
        })
    })

    io.of(`/${WebsocketNamespaces.Chat}`).adapter.on(
        WebsocketEngineEvents.CreateRoom,
        (room) => {
            log.info(`New chat channel created: ${room}`);
        }
    );

    io.of(`/${WebsocketNamespaces.Chat}`).adapter.on(
        WebsocketEngineEvents.DeleteRoom,
        (room) => {
            log.info(`Chat channel: ${room}, was deleted`);
        }
    )

    return ChatNs
}
