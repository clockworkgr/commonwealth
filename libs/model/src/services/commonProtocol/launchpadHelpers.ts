import { commonProtocol } from '@hicommonwealth/shared';
import Web3 from 'web3';
import { LPBondingCurveAbi } from './abi/LPBondingCurve';
import { createWeb3Provider } from './contractHelpers';

export async function getLaunchpadTradeTransaction({
  rpc,
  transactionHash,
}: {
  rpc: string;
  transactionHash: string;
}) {
  const web3 = new Web3(rpc);

  const txReceipt = await web3.eth.getTransactionReceipt(transactionHash);
  if (!txReceipt) {
    return;
  }

  const block = await web3.eth.getBlock(txReceipt.blockHash.toString());

  const {
    0: traderAddress,
    1: tokenAddress,
    2: isBuy,
    3: communityTokenAmount,
    4: ethAmount,
    5: protocolEthAmount,
    6: floatingSupply,
  } = web3.eth.abi.decodeParameters(
    ['address', 'address', 'bool', 'uint256', 'uint256', 'uint256', 'uint256'],
    txReceipt.logs[1].data!.toString(),
  );

  return {
    txReceipt,
    block,
    parsedArgs: {
      traderAddress: traderAddress as string,
      tokenAddress: tokenAddress as string,
      isBuy: isBuy as boolean,
      communityTokenAmount: communityTokenAmount as bigint,
      ethAmount: ethAmount as bigint,
      protocolEthAmount: protocolEthAmount as bigint,
      floatingSupply: floatingSupply as bigint,
    },
  };
}

export async function transferLiquidityToUniswap({
  rpc,
  tokenAddress,
}: {
  rpc: string;
  tokenAddress: string;
}) {
  const web3 = await createWeb3Provider(rpc);
  const contract = new web3.eth.Contract(LPBondingCurveAbi, tokenAddress);
  await commonProtocol.transferLiquidity(
    contract,
    tokenAddress,
    web3.eth.defaultAccount!,
  );
}
