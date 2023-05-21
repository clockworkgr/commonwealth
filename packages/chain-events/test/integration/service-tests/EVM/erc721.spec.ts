import { MockRabbitMqHandler } from '../../../../services/ChainEventsConsumer/ChainEventHandlers';
import { getRabbitMQConfig } from 'common-common/src/rabbitmq';
import {
  RascalPublications,
  RascalSubscriptions,
} from 'common-common/src/rabbitmq/types';
import { RABBITMQ_URI } from '../../../../services/config';
import { ChainBase, ChainNetwork } from 'common-common/src/types';
import { ChainTesting } from '../../../../chain-testing/sdk/chainTesting';
import { runSubscriberAsFunction } from '../../../../services/ChainSubscriber/chainSubscriber';
import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../../../../services/database/database';
import { setupChainEventConsumer } from '../../../../services/ChainEventsConsumer/chainEventsConsumer';
import { Op, Sequelize } from 'sequelize';
import { createChainEventsApp } from '../../../../services/app/Server';
import { ERC721 } from '../../../../chain-testing/sdk/nft';
import {
  EventKind,
  IErc721Contracts,
} from '../../../../src/chain-bases/EVM/erc721/types';
import { Processor, Subscriber } from '../../../../src/chain-bases/EVM/erc721';
import { Listener } from '../../../../src';
import { IListenerInstances } from '../../../../services/ChainSubscriber/types';
import { cwEventMatch, findCwEvent, waitUntilBlock } from '../../../util';
import { getErcListenerName } from 'chain-events/services/ChainSubscriber/util';

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration tests for ERC721', () => {
  const rmq = new MockRabbitMqHandler(
    getRabbitMQConfig(RABBITMQ_URI),
    RascalPublications.ChainEvents
  );

  // holds event data, so we can verify the integrity of the events across all services
  const events = {};

  let listener: Listener<
    IErc721Contracts,
    never,
    Processor,
    Subscriber,
    EventKind
  >;

  // holds the relevant entity instance - used to ensure foreign keys are applied properly
  let nft: ERC721, chain, accounts;
  const token_id = '138';
  const chainName = 'Ethereum (Ganache)';
  const randomWallet = '0xD54f2E2173D0a5eA8e0862Aed18b270aFF08389e';

  const sdk = new ChainTesting('http://127.0.0.1:3000');

  before(async () => {
    accounts = await sdk.getAccounts();
    nft = await sdk.deployNFT();
    chain = {
      base: ChainBase.Ethereum,
      network: ChainNetwork.ERC721,
      substrate_spec: null,
      contract_address: nft.address,
      verbose_logging: true,
      ChainNode: { id: 1, url: 'http://127.0.0.1:8545', name: chainName },
      origin: `${chainName}::${nft.address}`,
    };
    // initialize the mock rabbitmq controller
    await rmq.init();
  });

  describe('Tests the ERC721 event listener using the chain subscriber', async () => {
    before(async () => {
      // set up the chain subscriber
      const listeners: IListenerInstances = await runSubscriberAsFunction(
        rmq,
        chain
      );
      listener = listeners[getErcListenerName(chain)] as Listener<
        IErc721Contracts,
        never,
        Processor,
        Subscriber,
        EventKind
      >;
    });

    it('Should capture transfer events', async () => {
      await nft.mint(token_id, 1);
      const { block } = await nft.transferERC721(token_id, 2, accounts[1]);
      await waitUntilBlock(block, listener);

      events[EventKind.Transfer] = findCwEvent(
        rmq.queuedMessages[RascalSubscriptions.ChainEvents],
        {
          kind: EventKind.Transfer,
          chainName,
          blockNumber: block,
          contractAddress: chain.contract_address,
        }
      );
      cwEventMatch(events[EventKind.Transfer], {
        kind: EventKind.Transfer,
        chainName,
        blockNumber: block,
        contractAddress: chain.contract_address,
        from: accounts[1],
        to: accounts[2],
      });
    });

    it('Should capture approval events', async () => {
      const { block } = await nft.approveERC721(token_id, 3, accounts[2]);
      await waitUntilBlock(block, listener);

      events[EventKind.Approval] = findCwEvent(
        rmq.queuedMessages[RascalSubscriptions.ChainEvents],
        {
          kind: EventKind.Approval,
          chainName,
          blockNumber: block,
          contractAddress: chain.contract_address,
        }
      );
      cwEventMatch(events[EventKind.Approval], {
        kind: EventKind.Approval,
        chainName,
        blockNumber: block,
        contractAddress: chain.contract_address,
        owner: accounts[2],
        approved: accounts[3],
      });
    });
  });

  describe.skip('Tests for processing ERC721 events with the consumer', async () => {
    before(async () => {
      // set up the chain consumer - this starts the subscriptions thus processing all existing events
      await setupChainEventConsumer(rmq);
    });

    it('Should process transfer events', async () => {
      const transferEvent = await models.ChainEvent.findOne({
        where: {
          chain_name: chainName,
          event_data: {
            [Op.and]: [
              Sequelize.literal(`event_data->>'kind' = 'transfer'`),
              Sequelize.literal(`event_data->>'from' = '${accounts[1]}'`),
            ],
          },
          block_number: events['transfer'].blockNumber,
          contract_address: chain.contract_address,
        },
      });
      expect(transferEvent, 'The transfer event should be in the database').to
        .exist;
    });

    it('Should process approval events', async () => {
      const approvalEvent = await models.ChainEvent.findOne({
        where: {
          chain_name: chainName,
          event_data: {
            [Op.and]: [
              Sequelize.literal(`event_data->>'kind' = 'approval'`),
              Sequelize.literal(`event_data->>'owner' = '${accounts[2]}'`),
              Sequelize.literal(`event_data->>'approved' = '${accounts[3]}'`),
            ],
          },
          block_number: events['approval'].blockNumber,
          contract_address: chain.contract_address,
        },
      });
      expect(approvalEvent, 'The approval event should be in the database').to
        .exist;
    });
  });

  describe.skip('Tests for retrieving ERC721 events with the app', () => {
    let agent;

    before(async () => {
      const app = await createChainEventsApp();
      agent = chai.request(app).keepOpen();
    });

    after(async () => {
      agent.close();
    });

    it('Should retrieve approve events', async () => {
      const res = await agent.get(`/api/events?limit=10`);
      expect(res.status).to.equal(200);
      expect(
        res.body.result,
        'The request body should contain an array of events'
      ).to.exist;
      const event = res.body.result.find(
        (e) =>
          e.chain_name === chainName &&
          e.event_data.kind === EventKind.Approval &&
          e.event_data.owner === accounts[2] &&
          e.event_data.approved === accounts[3]
      );

      expect(event, 'The approval event should be in the response').to.exist;
    });

    it('Should retrieve transfer events', async () => {
      const res = await agent.get(`/api/events?limit=10`);
      expect(res.status).to.equal(200);
      expect(
        res.body.result,
        'The request body should contain an array of events'
      ).to.exist;

      const event = res.body.result.find(
        (e) =>
          e.chain_name === chainName &&
          e.event_data.kind === EventKind.Transfer &&
          e.event_data.from === accounts[1]
      );
      expect(event, 'The transfer event should be in the response').to.exist;
    });
  });

  after(async () => {
    await rmq.shutdown();
    await models.ChainEvent.destroy({
      where: {
        chain_name: chainName,
        contract_address: chain.contract_address,
      },
    });
  });
});
