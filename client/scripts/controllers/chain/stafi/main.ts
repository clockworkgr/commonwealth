import { ChainClass, NodeInfo } from 'models';
import { IApp } from 'state';
import Substrate from '../substrate/main';

class Stafi extends Substrate {
  constructor(n: NodeInfo, app: IApp) {
    super(n, app, ChainClass.Polkadot);

    this.signaling.disable();
  }

  public async initApi() {
    await super.initApi({
      types: {
        ChainId: 'u8',
        DepositNonce: 'u64',
        ResourceId: '[u8; 32]',
      }
    });
  }
}

export default Stafi;
