"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernorBravoDelegatorStorage__factory = void 0;
const ethers_1 = require("ethers");
class GovernorBravoDelegatorStorage__factory extends ethers_1.ContractFactory {
    constructor(signer) {
        super(_abi, _bytecode, signer);
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.GovernorBravoDelegatorStorage__factory = GovernorBravoDelegatorStorage__factory;
const _abi = [
    {
        constant: true,
        inputs: [],
        name: "admin",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "implementation",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "pendingAdmin",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b50610106806100206000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c8063267822471460415780635c60da1b14605b578063f851a440146061575b600080fd5b60476067565b6040516052919060a1565b60405180910390f35b60476076565b60476085565b6001546001600160a01b031681565b6002546001600160a01b031681565b6000546001600160a01b031681565b609b8160b3565b82525050565b6020810160ad82846094565b92915050565b60006001600160a01b03821660ad56fea365627a7a72315820d590f11729b6522b5134fec69ec792ea7f44ffaf87ce8e51f0e343c0dc79a0c06c6578706572696d656e74616cf564736f6c63430005100040";
