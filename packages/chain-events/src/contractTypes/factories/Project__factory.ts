/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Project } from "../Project";

export class Project__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Project> {
    return super.deploy(overrides || {}) as Promise<Project>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Project {
    return super.attach(address) as Project;
  }
  connect(signer: Signer): Project__factory {
    return super.connect(signer) as Project__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Project {
    return new Contract(address, _abi, signerOrProvider) as Project;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Back",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Curate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Failed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Succeeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptedToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "back",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "backersWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "beneficiary",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beneficiaryWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "curate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "curatorFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "curatorsWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "funded",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "ipfsHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "cwUrl",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProjectMetaData",
        name: "_metaData",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "address",
            name: "acceptedToken",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProjectData",
        name: "_pData",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_curatorFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_protocolFee",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_protocolFeeTo",
        type: "address",
      },
      {
        internalType: "address",
        name: "_bToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_cToken",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockedWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "metaData",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "ipfsHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "cwUrl",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeTo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_ipfsHash",
        type: "bytes32",
      },
    ],
    name: "setIpfsHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_name",
        type: "bytes32",
      },
    ],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "threshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCuratorFunding",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFunding",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611699806100206000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c8063787372b2116100b8578063baf2a4eb1161007c578063baf2a4eb14610277578063bfdc57e4146102cb578063ce525a75146102d3578063ef369252146102dc578063f3a504f2146102ef578063fe47a8a71461030357600080fd5b8063787372b21461024257806388319d2f1461024a5780638a834f3f146102535780639af6549a14610266578063b0e21e8a1461026e57600080fd5b8063451c3d801161010a578063451c3d80146101ce5780634a562885146101e15780635ac801fe146101f457806363f199361461020957806369e527da1461021c578063720481401461022f57600080fd5b8063107e88e914610147578063180f58421461017057806329dcb0cf1461019b57806338af3eed146101b257806342cde4e8146101c5575b600080fd5b600b5461015b90600160a01b900460ff1681565b60405190151581526020015b60405180910390f35b600c54610183906001600160a01b031681565b6040516001600160a01b039091168152602001610167565b6101a460065481565b604051908152602001610167565b600b54610183906001600160a01b031681565b6101a460055481565b600a54610183906001600160a01b031681565b61015b6101ef366004611404565b61030c565b610207610202366004611404565b610570565b005b610207610217366004611404565b61058c565b600d54610183906001600160a01b031681565b61015b61023d36600461141c565b6105a8565b61015b61074f565b6101a4600e5481565b61015b610261366004611404565b6109b7565b61015b610b66565b6101a460085481565b60005460015460025460035460045461029a94939291906001600160a01b031685565b6040805195865260208601949094529284019190915260608301526001600160a01b0316608082015260a001610167565b61015b610d83565b6101a4600f5481565b600954610183906001600160a01b031681565b600b5461015b90600160a81b900460ff1681565b6101a460075481565b600081600654421061035b5760405162461bcd60e51b815260206004820152601360248201527214128e88111150511312539157d41054d4d151606a1b60448201526064015b60405180910390fd5b600081116103ab5760405162461bcd60e51b815260206004820152601a60248201527f504a3a20494e56414c49445f4241434b494e475f414d4f554e540000000000006044820152606401610352565b600a546103c3906001600160a01b0316333086610fb4565b600c546040516340c10f1960e01b8152336004820152602481018590526001600160a01b03909116906340c10f1990604401600060405180830381600087803b15801561040f57600080fd5b505af1158015610423573d6000803e3d6000fd5b505050508260076000828254610439919061157b565b9091555050600a54604080513381526001600160a01b03909216602083015281018490527f128f98751c96e471a959ec31b0571f9103c9e1be924533d55b7901c6dbfc2adb9060600160405180910390a16005546007541061056757600b805460ff60a81b1916600160a81b179055600d54604080516318160ddd60e01b815290516001600160a01b03909216916318160ddd91600480820192602092909190829003018186803b1580156104ed57600080fd5b505afa158015610501573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052591906114dd565b600e556007546040805142815260208101929092527f12af11401ea608ef2bbd8912346dc2b344d8d49c3f4a6b9f65b15d3577b40f7791015b60405180910390a15b50600192915050565b6004546001600160a01b0316331461058757600080fd5b600155565b6004546001600160a01b031633146105a357600080fd5b600255565b600b54600090600160b81b900460ff16806105c25750303b155b806105d75750600b54600160b01b900460ff16155b61063a5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610352565b600b54600160b81b900460ff1615801561066457600b805461ffff60b01b191661010160b01b1790555b88516000556020808a015160015560408a015160025560608a015160035560808a0151600480546001600160a01b0319166001600160a01b0390921691909117905588516005558801516106b8904261157b565b600655600f8790556008869055600980546001600160a01b03199081166001600160a01b038881169190911790925560608a0151600a8054831691841691909117905560408a0151600b80548316918416919091179055600c80548216878416179055600d805490911691851691909117905560019150801561074357600b805460ff60b81b191690555b50979650505050505050565b60006006544210156107a35760405162461bcd60e51b815260206004820152601b60248201527f50726f6a65637420686173206e6f742079657420636c6f7365642e00000000006044820152606401610352565b600b54600160a81b900460ff166107f25760405162461bcd60e51b8152602060048201526013602482015272283937b532b1ba103737ba10333ab73232b21760691b6044820152606401610352565b600d546040516370a0823160e01b81523360048201526000916001600160a01b0316906370a082319060240160206040518083038186803b15801561083657600080fd5b505afa15801561084a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086e91906114dd565b9050600081116108b95760405162461bcd60e51b8152602060048201526016602482015275504a3a204e4f5f435552415445445f42414c414e434560501b6044820152606401610352565b6000600e54826108c99190611593565b90506000600554612710600f546108e09190611593565b6108ea91906115b3565b905060006108f882846115b3565b90506000610906858361157b565b600d5460405163079cc67960e41b8152336004820152602481018890529192506001600160a01b0316906379cc679090604401600060405180830381600087803b15801561095357600080fd5b505af1158015610967573d6000803e3d6000fd5b5050600a5461098392506001600160a01b031690503383611025565b506040805133815260208101839052600080516020611644833981519152910160405180910390a160019550505050505090565b6000816006544210610a015760405162461bcd60e51b815260206004820152601360248201527214128e88111150511312539157d41054d4d151606a1b6044820152606401610352565b60008111610a515760405162461bcd60e51b815260206004820152601a60248201527f504a3a20494e56414c49445f4241434b494e475f414d4f554e540000000000006044820152606401610352565b600b54600160a81b900460ff1615610aa05760405162461bcd60e51b815260206004820152601260248201527114128e8811955391115117d41493d29150d560721b6044820152606401610352565b600a54610ab8906001600160a01b0316333086610fb4565b600d546040516340c10f1960e01b8152336004820152602481018590526001600160a01b03909116906340c10f1990604401600060405180830381600087803b158015610b0457600080fd5b505af1158015610b18573d6000803e3d6000fd5b5050600a54604080513381526001600160a01b03909216602083015281018690527f8fbcbee4e596fce20cf7976254d23628590e6175d537641631d24636703fbcb99250606001905061055e565b600b54600090600160a01b900460ff1615610bb55760405162461bcd60e51b815260206004820152600f60248201526e504a3a2052455f574954484452415760881b6044820152606401610352565b600b805460ff60a01b1916600160a01b179055600654421015610c1a5760405162461bcd60e51b815260206004820152601b60248201527f50726f6a65637420686173206e6f742079657420636c6f7365642e00000000006044820152606401610352565b600b54600160a81b900460ff16610c695760405162461bcd60e51b8152602060048201526013602482015272283937b532b1ba103737ba10333ab73232b21760691b6044820152606401610352565b60006064600f54600554610c7d91906115b3565b610c879190611593565b905060006064600854600554610c9d91906115b3565b610ca79190611593565b905060008183600754610cba91906115d2565b610cc491906115d2565b90508115610d1f57600a54600954610ce9916001600160a01b03908116911684611025565b50600954604080516001600160a01b03909216825260208201849052600080516020611644833981519152910160405180910390a15b8015610d7957600a54600b54610d42916001600160a01b03908116911683611025565b50600b54604080516001600160a01b0390921682526020820183905260008051602061164483398151915291015b60405180910390a15b6001935050505090565b6000600654421015610dca5760405162461bcd60e51b815260206004820152601060248201526f14128e881393d517d192539254d2115160821b6044820152606401610352565b600b54600160a81b900460ff1615610e195760405162461bcd60e51b815260206004820152601260248201527114128e8811955391115117d41493d29150d560721b6044820152606401610352565b600c546040516370a0823160e01b81523360048201526000916001600160a01b0316906370a082319060240160206040518083038186803b158015610e5d57600080fd5b505afa158015610e71573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e9591906114dd565b905060008111610ee75760405162461bcd60e51b815260206004820152601860248201527f504a3a205a45524f5f425f544f4b454e5f42414c414e434500000000000000006044820152606401610352565b600060075482610ef79190611593565b600e54610f0491906115b3565b90506000610f12838361157b565b600c5460405163079cc67960e41b8152336004820152602481018690529192506001600160a01b0316906379cc679090604401600060405180830381600087803b158015610f5f57600080fd5b505af1158015610f73573d6000803e3d6000fd5b5050600a54610f8f92506001600160a01b031690503383611025565b5060408051338152602081018390526000805160206116448339815191529101610d70565b6040516001600160a01b038085166024830152831660448201526064810182905261101f9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526110d1565b50505050565b6040516370a0823160e01b815230600482015260009081906001600160a01b038616906370a082319060240160206040518083038186803b15801561106957600080fd5b505afa15801561107d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110a191906114dd565b905082808210156110af5750805b6110c36001600160a01b03871686836111a8565b6001925050505b9392505050565b6000611126826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166111d89092919063ffffffff16565b8051909150156111a3578080602001905181019061114491906113e4565b6111a35760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610352565b505050565b6040516001600160a01b0383166024820152604481018290526111a390849063a9059cbb60e01b90606401610fe8565b60606111e784846000856111ef565b949350505050565b6060824710156112505760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610352565b843b61129e5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610352565b600080866001600160a01b031685876040516112ba91906114f5565b60006040518083038185875af1925050503d80600081146112f7576040519150601f19603f3d011682016040523d82523d6000602084013e6112fc565b606091505b509150915061130c828286611317565b979650505050505050565b606083156113265750816110ca565b8251156113365782518084602001fd5b8160405162461bcd60e51b81526004016103529190611511565b803561135b8161162b565b919050565b600060808284031215611371578081fd5b6040516080810181811067ffffffffffffffff821117156113a057634e487b7160e01b83526041600452602483fd5b8060405250809150823581526020830135602082015260408301356113c48161162b565b604082015260608301356113d78161162b565b6060919091015292915050565b6000602082840312156113f5578081fd5b815180151581146110ca578182fd5b600060208284031215611415578081fd5b5035919050565b60008060008060008060008789036101c0811215611438578384fd5b60a0811215611445578384fd5b5061144e611544565b88358152602089013560208201526040890135604082015260608901356060820152608089013561147e8161162b565b608082015296506114928960a08a01611360565b9550610120880135945061014088013593506114b16101608901611350565b92506114c06101808901611350565b91506114cf6101a08901611350565b905092959891949750929550565b6000602082840312156114ee578081fd5b5051919050565b600082516115078184602087016115e9565b9190910192915050565b60208152600082518060208401526115308160408501602087016115e9565b601f01601f19169190910160400192915050565b60405160a0810167ffffffffffffffff8111828210171561157557634e487b7160e01b600052604160045260246000fd5b60405290565b6000821982111561158e5761158e611615565b500190565b6000826115ae57634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156115cd576115cd611615565b500290565b6000828210156115e4576115e4611615565b500390565b60005b838110156116045781810151838201526020016115ec565b8381111561101f5750506000910152565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038116811461164057600080fd5b5056fe884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364a2646970667358221220520577498a1ebbd9beaa3341b6c2227df458c6c4247a8b02d0b816ea37aef03c64736f6c63430008040033";
