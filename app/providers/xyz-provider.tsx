import type EventEmitter from "events";
import type { ReactNode } from "react";
import { useState, useEffect, useContext, createContext } from "react";
import type { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import { Web3Provider } from "@ethersproject/providers";
import { getRpcProvider } from "~/utils/provider";
import { big } from "~/utils/big-number";

export enum ChainReference {
  Mainnet = 1,
  Localhost = 539,
  OptimismGoerli = 420,
}

type XyzContextValues = {
  set: (nextValue: XyzNextValue) => void;
  signer?: JsonRpcSigner;
  account?: string;
  provider?: Provider;
  chainReference?: ChainReference;
};

export enum XyzNextValueType {
  Account = "ACCOUNT",
}

type XyzNextValue = {
  type: XyzNextValueType;
  value: string;
};

enum ProviderType {
  Rpc = "RPC",
  Metamask = "METAMASK",
}

type Provider =
  | {
      type: ProviderType.Metamask;
      provider: Web3Provider;
    }
  | {
      type: ProviderType.Rpc;
      provider: JsonRpcProvider;
    };

// @ts-expect-error no initial state required
const XyzContext = createContext<XyzContextValues>({});

export function XyzProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  console.log("provider", provider);
  const [chainReference, setChainReference] = useState<
    ChainReference | undefined
  >(undefined);

  useEffect(() => {
    if (typeof window === "undefined" || provider) return;

    // @ts-expect-error to check later
    if (window?.ethereum !== undefined) {
      // Set Metamask if window available
      setProvider({
        provider: new Web3Provider((window as any).ethereum),
        type: ProviderType.Metamask,
      });
    } else {
      // Set an RPC if window is not available
      setProvider({
        provider: getRpcProvider({ chainReference }),
        type: ProviderType.Rpc,
      });
    }
  }, [provider]);

  // Get initial accounts
  useEffect(() => {
    if (!provider) return;

    async function getAccount({ provider }: Provider) {
      const accounts = await provider.send("eth_accounts", []);

      setAccount(accounts[0]);
    }

    getAccount(provider);
  }, [provider]);

  // Get initial chain id
  useEffect(() => {
    if (!provider) return;

    async function getChainReference({ provider }: Provider) {
      const hexChainId = await provider.send("eth_chainId", []);
      const chainReference = big(hexChainId).toNumber();

      setChainReference(chainReference);
    }

    getChainReference(provider);
  }, [provider]);

  // Get signer
  useEffect(() => {
    if (!provider) return;

    function getSigner({ provider }: Provider) {
      setSigner(provider.getSigner());
    }

    getSigner(provider);
  }, [provider, account]);

  // Listen for changes on accounts
  useEffect(() => {
    if (!provider || provider.type !== ProviderType.Metamask) return;

    console.log("started listening to accounts");
    provider.provider.on("accountsChanged", (accounts) => {
      console.log("provider.provider.on ~ accounts", accounts);
      if (accounts.length > 0) {
        const [account] = accounts;

        setAccount(account);
      } else {
        setAccount(undefined);
      }
    });

    return () => {
      provider.provider.removeListener("accountsChanged", () => {
        console.log('stop listening to "accountsChanged" event');
      });
    };
  }, [provider]);

  // Listen for changes on chain
  useEffect(() => {
    if (!provider || provider.type !== ProviderType.Metamask) return;

    console.log("started listening to chains");
    provider.provider.on("chainChanged", (hexChainId: string) => {
      console.log("provider.provider.on ~ hexChainId", hexChainId);
      const chainReference = big(hexChainId).toNumber();

      setChainReference(chainReference);
    });

    return () => {
      provider.provider.removeListener("chainChanged", () => {
        console.log('stop listening to "chanChanged" event');
      });
    };
  }, [provider]);

  function set(nextValue: XyzNextValue) {
    switch (nextValue.type) {
      case XyzNextValueType.Account: {
        setAccount(nextValue.value);
        break;
      }
    }
  }

  return (
    <XyzContext.Provider
      value={{
        set,
        provider,
        account,
        chainReference,
        signer,
      }}
    >
      {children}
    </XyzContext.Provider>
  );
}

export function useXyz(): XyzContextValues {
  const web3Context = useContext(XyzContext);

  if (!web3Context) {
    throw new Error("You forgot to use your useWeb3hook within a Web3Provider");
  }

  return web3Context;
}
