import {Request, Response } from 'express';
import Ganache from 'ganache';
import Web3 from 'web3';
import getProvider from '../utils/getProvider';
import axios from 'axios'

const getBlockInfo = async () => {
    const provider = getProvider();
    const block = await provider.eth
    .getBlock(await provider.eth.getBlockNumber())
    return block
}
export const getAccounts = async (req: Request, res: Response) => {
    const provider = getProvider();
    const accounts = await provider.eth.getAccounts()
    res.status(200).json(accounts).send()
}

export const getBlock = async (req: Request, res: Response) => {
    const block = await getBlockInfo();
    res.status(200).json(block).send() 
}

export const advanceEvmTime = async (time: number | string, blocks: number | string) => {
    const advance_secs = Web3.utils.numberToHex(time).toString()
    await axios.post(
        'http://chain:8545',
        // '{"jsonrpc": "2.0", "id": 1, "method": "evm_increaseTime", "params": ["0x15180"] }',
        {
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'evm_increaseTime',
            'params': [
                advance_secs
            ]
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    await axios.post(
        'http://chain:8545',
        {
            'jsonrpc': '2.0',
            'id': 1,
            'method': 'evm_mine',
            'params': [
                {"blocks": blocks}
            ]
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}
export const advanceTimestamp = async (req: Request, res: Response) => {
    const results = {"preTime": (await getBlockInfo()).timestamp.toString(), "postTime": "0"}
    await advanceEvmTime(req.body.seconds, 1);
    results.postTime = (await getBlockInfo()).timestamp.toString()
    res.status(200).json(results).send()
}