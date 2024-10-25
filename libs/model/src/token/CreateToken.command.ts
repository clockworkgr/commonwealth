import { type Command } from '@hicommonwealth/core';
import * as schemas from '@hicommonwealth/schemas';
import { commonProtocol } from '@hicommonwealth/shared';
import Web3 from 'web3';
import { models } from '../database';
import { AuthContext, isAuthorized } from '../middleware';
import { mustExist } from '../middleware/guards';

export async function createTokenHandler(
  chainNodeId: number,
  tokenAddress: string,
  description?: string,
  iconUrl?: string,
) {
  const chainNode = await models.ChainNode.findOne({
    where: { id: chainNodeId },
    attributes: ['eth_chain_id', 'url', 'private_url'],
  });

  mustExist('Chain Node', chainNode);

  const web3 = new Web3(chainNode.private_url || chainNode.url);

  const contracts =
    commonProtocol.factoryContracts[
      chainNode.eth_chain_id as commonProtocol.ValidChains
    ];
  const tokenManagerAddress = contracts.tokenCommunityManager;
  const tokenManagerContract = new web3.eth.Contract(
    tokenCommunityManagerAbi,
    tokenManagerAddress,
  );

  let namespace: string;
  try {
    namespace = await tokenManagerContract.methods
      .namespaceForToken(tokenAddress)
      .call();
  } catch (error) {
    throw Error(`Failed to get namespace for token ${tokenAddress}`);
  }

  const erc20Contract = new web3.eth.Contract(erc20Abi, tokenAddress);

  let name: string;
  let symbol: string;
  let totalSupply: number;

  try {
    name = await erc20Contract.methods.name().call();
    symbol = await erc20Contract.methods.symbol().call();
    totalSupply = await erc20Contract.methods.totalSupply().call();
  } catch (e) {
    throw Error(
      `Failed to get erc20 token properties for token ${tokenAddress}`,
    );
  }

  const token = await models.Token.create({
    token_address: tokenAddress,
    namespace,
    name,
    symbol,
    initial_supply: totalSupply,
    chain_node_id: chainNodeId,
    is_locked: false,
    description: description ?? null,
    icon_url: iconUrl ?? null,
  });

  return token!.toJSON();
}

export function CreateToken(): Command<
  typeof schemas.CreateToken,
  AuthContext
> {
  return {
    ...schemas.CreateToken,
    auth: [isAuthorized({ roles: ['admin'] })],
    body: async ({ payload }) => {
      const { chain_node_id, transaction_hash, description, icon_url } =
        payload;

      console.log('here');

      const tokenAddress = '';

      return createTokenHandler(
        chain_node_id,
        tokenAddress,
        description!,
        icon_url!,
      );
    },
  };
}
