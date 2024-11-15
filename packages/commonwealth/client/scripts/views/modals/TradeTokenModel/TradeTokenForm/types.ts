import { TokenView } from '@hicommonwealth/schemas';
import { ChainBase } from '@hicommonwealth/shared';
import { SupportedCurrencies } from 'helpers/currency';
import { z } from 'zod';
import useTradeTokenForm from './useTradeTokenForm';

export enum TradingMode {
  Buy = 'buy',
  Sell = 'sell',
}

export type TradeTokenFormProps = ReturnType<typeof useTradeTokenForm>;

const TokenWithCommunity = TokenView.extend({
  community_id: z.string(),
});

export type TradingConfig = {
  mode: TradingMode;
  token: z.infer<typeof TokenWithCommunity>;
  addressType: ChainBase;
};

export type UseTradeTokenFormProps = {
  tradeConfig: TradingConfig & {
    currency: SupportedCurrencies;
    presetAmounts?: number[];
  };
  addressType?: ChainBase;
  onTradeComplete?: () => void;
};

export type AddressBalanceProps = Pick<
  ReturnType<typeof useTradeTokenForm>,
  'trading' | 'addresses'
>;

export type BuyAmountSelectionProps = Pick<
  ReturnType<typeof useTradeTokenForm>,
  'trading'
>;

export type SellAmountSelectionProps = Pick<
  ReturnType<typeof useTradeTokenForm>,
  'trading'
>;

export type ReceiptDetailsProps = Pick<
  ReturnType<typeof useTradeTokenForm>,
  'trading'
>;
