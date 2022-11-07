import {assert} from 'chai';
import {CWEvent} from 'chain-events/src';
import {RabbitMqHandler} from '../../../server/eventHandlers/rabbitMQ';
import {RascalPublications, RascalSubscriptions, getRabbitMQConfig} from "common-common/src/rabbitmq";
import {RABBITMQ_URI} from "../../../server/config";

describe.skip('RabbitMQ producer integration tests', () => {
  let controller

  beforeEach('Initialize RabbitMQ Controller', () => {
    controller = new RabbitMqHandler(getRabbitMQConfig(RABBITMQ_URI), RascalPublications.ChainEvents);
  })

  it('should initialize a RabbitMQ producer with the default config', async function () {
    await controller.init();
    assert.isNotNull(controller.broker);
  });

  it('should publish a CWEvent to a queue', async function () {
    await controller.init();
    const sub = await controller.startSubscription(
    async (event: CWEvent) => {
      assert.equal(event.blockNumber, 10);
      assert.deepEqual(event.data, {} as any);
      assert.equal(event.chain, 'polkadot');
      assert.equal(event.network, 'substrate');
      assert.equal(event.received, 123);
    }, RascalSubscriptions.ChainEvents);

    controller.handle({
      blockNumber: 10,
      data: {},
      chain: 'polkadot',
      network: 'substrate',
      received: 123,
    });
  });

  xit('should prevent excluded events from being published', async function () {
    await controller.init();
    const sub = await controller.startSubscription(
      async (event: CWEvent) => {
      assert.equal(event.blockNumber, 10);
      assert.equal(event.data, {} as any);
      assert.equal(event.chain, 'polkadot');
      assert.equal(event.network, 'substrate');
      assert.equal(event.received, 123);
    }, RascalSubscriptions.ChainEvents);

    controller.handle({
      blockNumber: 10,
      data: {
        kind: 'dont-skip',
      },
      network: 'substrate',
      chain: 'polkadot',
      received: 123,
    });

    controller.handle({
      blockNumber: 99,
      data: {
        kind: 'skip',
      },
      network: 'substrate',
      chain: 'polkadot',
      received: 77,
    });
  });
});
