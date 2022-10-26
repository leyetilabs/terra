import React, { createContext, useContext } from "react";
import type {
  BaseSignerWalletAdapter,
  WalletName,
  WalletReadyState,
} from "@wizard-ui/core";
import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

export interface Wallet {
  adapter: any;
  readyState: WalletReadyState;
}

export interface WalletContextState {
  autoConnect: boolean;
  wallets: Wallet[];
  wallet: Wallet | null;
  client: CosmWasmClient | null;
  signingClient: SigningCosmWasmClient | null;
  address: any | null;
  connecting: boolean;
  connected: boolean;
  disconnecting: boolean;

  select(walletName: WalletName): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendTransaction: BaseSignerWalletAdapter["sendTransaction"];
  signTransaction: BaseSignerWalletAdapter["signTransaction"];
}

const EMPTY_ARRAY: ReadonlyArray<never> = [];

const DEFAULT_CONTEXT = {
  autoConnect: false,
  connecting: false,
  connected: false,
  disconnecting: false,
  select(_name: WalletName) {
    console.error(constructMissingProviderErrorMessage("get", "select"));
  },
  connect() {
    return Promise.reject(
      console.error(constructMissingProviderErrorMessage("get", "connect"))
    );
  },
  disconnect() {
    return Promise.reject(
      console.error(constructMissingProviderErrorMessage("get", "disconnect"))
    );
  },
  sendTransaction({
    signerAddress,
    messages,
    fee,
    memo,
  }: {
    signerAddress: string;
    messages: EncodeObject[];
    fee: number | StdFee | "auto";
    memo?: string;
  }) {
    return Promise.reject(
      console.error(
        constructMissingProviderErrorMessage("get", "sendTransaction")
      )
    );
  },
  signTransaction({
    signerAddress,
    messages,
    fee,
    memo,
  }: {
    signerAddress: string;
    messages: EncodeObject[];
    fee: StdFee;
    memo: string;
  }) {
    return Promise.reject(
      console.error(
        constructMissingProviderErrorMessage("get", "signTransaction")
      )
    );
  },
} as WalletContextState;

Object.defineProperty(DEFAULT_CONTEXT, "wallets", {
  get() {
    console.error(constructMissingProviderErrorMessage("read", "wallets"));
    return EMPTY_ARRAY;
  },
});
Object.defineProperty(DEFAULT_CONTEXT, "wallet", {
  get() {
    console.error(constructMissingProviderErrorMessage("read", "wallet"));
    return null;
  },
});
Object.defineProperty(DEFAULT_CONTEXT, "client", {
  get() {
    console.error(constructMissingProviderErrorMessage("read", "client"));
    return null;
  },
});
Object.defineProperty(DEFAULT_CONTEXT, "address", {
  get() {
    console.error(constructMissingProviderErrorMessage("read", "address"));
    return null;
  },
});

function constructMissingProviderErrorMessage(
  action: string,
  valueName: string
) {
  return (
    "You have tried to " +
    ` ${action} "${valueName}"` +
    " on a WalletContext without providing one." +
    " Make sure to render a WalletProvider" +
    " as an ancestor of the component that uses " +
    "WalletContext"
  );
}

export const WalletContext = createContext<WalletContextState>(
  DEFAULT_CONTEXT as WalletContextState
);

export function useWallet(): WalletContextState {
  return useContext(WalletContext);
}
