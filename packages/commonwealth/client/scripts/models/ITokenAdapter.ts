import type { Coin } from 'adapters/currency';
import BN from 'bn.js';
import { IChainAdapter } from '.';
import AddressAccount from "models/Address";

// Extension of IChainAdapter to support Token functionality
// See controller/ethereum/tokenAdapter for example usage
export default abstract class ITokenAdapter extends IChainAdapter<
  Coin,
  AddressAccount
> {
  public readonly contractAddress: string;
  public contractApi?: unknown; // type-specific by implementation
  public hasToken = false;
  public tokenBalance: BN = new BN(0);

  public abstract activeAddressHasToken(
    activeAddress?: string
  ): Promise<boolean>;

  public static instanceOf(
    adapter: IChainAdapter<Coin, AddressAccount>
  ): adapter is ITokenAdapter {
    return !!adapter && 'hasToken' in adapter;
  }
}
