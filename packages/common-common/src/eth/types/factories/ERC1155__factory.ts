/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { ERC1155 } from "../ERC1155";

export class ERC1155__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    uri_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC1155> {
    return super.deploy(uri_, overrides || {}) as Promise<ERC1155>;
  }
  getDeployTransaction(
    uri_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(uri_, overrides || {});
  }
  attach(address: string): ERC1155 {
    return super.attach(address) as ERC1155;
  }
  connect(signer: Signer): ERC1155__factory {
    return super.connect(signer) as ERC1155__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155 {
    return new Contract(address, _abi, signerOrProvider) as ERC1155;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "uri_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
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
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200161538038062001615833981016040819052620000349162000105565b6200003f8162000046565b5062000234565b80516200005b9060029060208401906200005f565b5050565b8280546200006d90620001e1565b90600052602060002090601f016020900481019282620000915760008555620000dc565b82601f10620000ac57805160ff1916838001178555620000dc565b82800160010185558215620000dc579182015b82811115620000dc578251825591602001919060010190620000bf565b50620000ea929150620000ee565b5090565b5b80821115620000ea5760008155600101620000ef565b600060208083850312156200011957600080fd5b82516001600160401b03808211156200013157600080fd5b818501915085601f8301126200014657600080fd5b8151818111156200015b576200015b6200021e565b604051601f8201601f19908116603f011681019083821181831017156200018657620001866200021e565b8160405282815288868487010111156200019f57600080fd5b600093505b82841015620001c35784840186015181850187015292850192620001a4565b82841115620001d55760008684830101525b98975050505050505050565b600181811c90821680620001f657607f821691505b602082108114156200021857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6113d180620002446000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461017957600080fd5b8062fdd58e1461008c57806301ffc9a7146100b25780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004610e30565b61018c565b6040519081526020015b60405180910390f35b6100c56100c0366004610f2b565b610223565b60405190151581526020016100a9565b6100e86100e3366004610f6c565b610275565b6040516100a991906110f1565b610108610103366004610ce5565b610309565b005b61011d610118366004610e5a565b6103a0565b6040516100a991906110b0565b610108610138366004610df4565b6104ca565b6100c561014b366004610cb2565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b610108610187366004610d8f565b6105a1565b60006001600160a01b0383166101fd5760405162461bcd60e51b815260206004820152602b60248201527f455243313135353a2062616c616e636520717565727920666f7220746865207a60448201526a65726f206164647265737360a81b60648201526084015b60405180910390fd5b506000908152602081815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b148061025457506001600160e01b031982166303a24d0760e21b145b8061026f57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606002805461028490611217565b80601f01602080910402602001604051908101604052809291908181526020018280546102b090611217565b80156102fd5780601f106102d2576101008083540402835291602001916102fd565b820191906000526020600020905b8154815290600101906020018083116102e057829003601f168201915b50505050509050919050565b6001600160a01b0385163314806103255750610325853361014b565b61038c5760405162461bcd60e51b815260206004820152603260248201527f455243313135353a207472616e736665722063616c6c6572206973206e6f74206044820152711bdddb995c881b9bdc88185c1c1c9bdd995960721b60648201526084016101f4565b6103998585858585610628565b5050505050565b606081518351146104055760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b60648201526084016101f4565b6000835167ffffffffffffffff811115610421576104216112c6565b60405190808252806020026020018201604052801561044a578160200160208202803683370190505b50905060005b84518110156104c25761049585828151811061046e5761046e6112b0565b6020026020010151858381518110610488576104886112b0565b602002602001015161018c565b8282815181106104a7576104a76112b0565b60209081029190910101526104bb8161127f565b9050610450565b509392505050565b336001600160a01b03831614156105355760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b60648201526084016101f4565b3360008181526001602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6001600160a01b0385163314806105bd57506105bd853361014b565b61061b5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260448201526808185c1c1c9bdd995960ba1b60648201526084016101f4565b6103998585858585610805565b815183511461068a5760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b60648201526084016101f4565b6001600160a01b0384166106b05760405162461bcd60e51b81526004016101f49061114c565b3360005b84518110156107975760008582815181106106d1576106d16112b0565b6020026020010151905060008583815181106106ef576106ef6112b0565b602090810291909101810151600084815280835260408082206001600160a01b038e16835290935291909120549091508181101561073f5760405162461bcd60e51b81526004016101f490611191565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b1682528120805484929061077c9084906111ff565b92505081905550505050806107909061127f565b90506106b4565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516107e79291906110c3565b60405180910390a46107fd81878787878761092b565b505050505050565b6001600160a01b03841661082b5760405162461bcd60e51b81526004016101f49061114c565b3361084481878761083b88610a96565b61039988610a96565b6000848152602081815260408083206001600160a01b038a168452909152902054838110156108855760405162461bcd60e51b81526004016101f490611191565b6000858152602081815260408083206001600160a01b038b81168552925280832087850390559088168252812080548692906108c29084906111ff565b909155505060408051868152602081018690526001600160a01b03808916928a821692918616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610922828888888888610ae1565b50505050505050565b6001600160a01b0384163b156107fd5760405163bc197c8160e01b81526001600160a01b0385169063bc197c819061096f908990899088908890889060040161100d565b602060405180830381600087803b15801561098957600080fd5b505af19250505080156109b9575060408051601f3d908101601f191682019092526109b691810190610f4f565b60015b610a66576109c56112dc565b806308c379a014156109ff57506109da6112f8565b806109e55750610a01565b8060405162461bcd60e51b81526004016101f491906110f1565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60648201526084016101f4565b6001600160e01b0319811663bc197c8160e01b146109225760405162461bcd60e51b81526004016101f490611104565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110610ad057610ad06112b0565b602090810291909101015292915050565b6001600160a01b0384163b156107fd5760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610b25908990899088908890889060040161106b565b602060405180830381600087803b158015610b3f57600080fd5b505af1925050508015610b6f575060408051601f3d908101601f19168201909252610b6c91810190610f4f565b60015b610b7b576109c56112dc565b6001600160e01b0319811663f23a6e6160e01b146109225760405162461bcd60e51b81526004016101f490611104565b80356001600160a01b0381168114610bc257600080fd5b919050565b600082601f830112610bd857600080fd5b81356020610be5826111db565b604051610bf28282611252565b8381528281019150858301600585901b87018401881015610c1257600080fd5b60005b85811015610c3157813584529284019290840190600101610c15565b5090979650505050505050565b600082601f830112610c4f57600080fd5b813567ffffffffffffffff811115610c6957610c696112c6565b604051610c80601f8301601f191660200182611252565b818152846020838601011115610c9557600080fd5b816020850160208301376000918101602001919091529392505050565b60008060408385031215610cc557600080fd5b610cce83610bab565b9150610cdc60208401610bab565b90509250929050565b600080600080600060a08688031215610cfd57600080fd5b610d0686610bab565b9450610d1460208701610bab565b9350604086013567ffffffffffffffff80821115610d3157600080fd5b610d3d89838a01610bc7565b94506060880135915080821115610d5357600080fd5b610d5f89838a01610bc7565b93506080880135915080821115610d7557600080fd5b50610d8288828901610c3e565b9150509295509295909350565b600080600080600060a08688031215610da757600080fd5b610db086610bab565b9450610dbe60208701610bab565b93506040860135925060608601359150608086013567ffffffffffffffff811115610de857600080fd5b610d8288828901610c3e565b60008060408385031215610e0757600080fd5b610e1083610bab565b915060208301358015158114610e2557600080fd5b809150509250929050565b60008060408385031215610e4357600080fd5b610e4c83610bab565b946020939093013593505050565b60008060408385031215610e6d57600080fd5b823567ffffffffffffffff80821115610e8557600080fd5b818501915085601f830112610e9957600080fd5b81356020610ea6826111db565b604051610eb38282611252565b8381528281019150858301600585901b870184018b1015610ed357600080fd5b600096505b84871015610efd57610ee981610bab565b835260019690960195918301918301610ed8565b5096505086013592505080821115610f1457600080fd5b50610f2185828601610bc7565b9150509250929050565b600060208284031215610f3d57600080fd5b8135610f4881611382565b9392505050565b600060208284031215610f6157600080fd5b8151610f4881611382565b600060208284031215610f7e57600080fd5b5035919050565b600081518084526020808501945080840160005b83811015610fb557815187529582019590820190600101610f99565b509495945050505050565b6000815180845260005b81811015610fe657602081850181015186830182015201610fca565b81811115610ff8576000602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0386811682528516602082015260a06040820181905260009061103990830186610f85565b828103606084015261104b8186610f85565b9050828103608084015261105f8185610fc0565b98975050505050505050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a0608082018190526000906110a590830184610fc0565b979650505050505050565b602081526000610f486020830184610f85565b6040815260006110d66040830185610f85565b82810360208401526110e88185610f85565b95945050505050565b602081526000610f486020830184610fc0565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b600067ffffffffffffffff8211156111f5576111f56112c6565b5060051b60200190565b600082198211156112125761121261129a565b500190565b600181811c9082168061122b57607f821691505b6020821081141561124c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8201601f1916810167ffffffffffffffff81118282101715611278576112786112c6565b6040525050565b60006000198214156112935761129361129a565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b600060033d11156112f55760046000803e5060005160e01c5b90565b600060443d10156113065790565b6040516003193d81016004833e81513d67ffffffffffffffff816024840111818411171561133657505050505090565b828501915081518181111561134e5750505050505090565b843d87010160208285010111156113685750505050505090565b61137760208286010187611252565b509095945050505050565b6001600160e01b03198116811461139857600080fd5b5056fea2646970667358221220e73389f42c653a691ac7ee8ccd5e58660c95618d40722b6c0d4a9ec21802941264736f6c63430008070033";
