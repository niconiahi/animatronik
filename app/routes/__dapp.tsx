import type { Web3Provider } from "@ethersproject/providers";
import { Outlet } from "@remix-run/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { accountAtom, setAccountAtom } from "~/atoms/account";
import { providerAtom } from "~/atoms/provider";
import AddressDisplay from "~/components/address-display";
import { useConnectMetamask } from "~/utils/metamask";
import { TransactionProvider } from "~/providers/transaction-provider";
import { TransactionToastProvider } from "~/providers/transaction-toast-provider";
import { setChainReferenceAtom } from "~/atoms/chainReference";
import { big } from "~/utils/big-number";

export default function MainLayout() {
  const connectMetamask = useConnectMetamask();
  const [account] = useAtom(accountAtom);
  const [, setAccount] = useAtom(setAccountAtom);
  const [, setChainReference] = useAtom(setChainReferenceAtom);
  const [provider] = useAtom(providerAtom);

  // account
  useEffect(() => {
    if (!provider) return;

    async function getAccount(provider: Web3Provider) {
      const accounts = await provider.send("eth_accounts", []);

      setAccount(accounts[0]);
    }

    getAccount(provider);
  });

  useEffect(() => {
    if (!provider) return;

    provider.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        const [account] = accounts;

        setAccount(account);
      } else {
        setAccount(undefined);
      }
    });

    return () => {
      provider.removeListener("accountsChanged", () => {
        console.log('stop listening to "accountsChanged" event');
      });
    };
  }, [provider]);

  // chain
  useEffect(() => {
    if (!provider) return;

    async function getChainReference(provider: Web3Provider) {
      const hexChainId = await provider.send("eth_chainId", []);
      const chainReference = big(hexChainId).toNumber();

      setChainReference(chainReference);
    }

    getChainReference(provider);
  });

  useEffect(() => {
    if (!provider) return;

    provider.on("chainChanged", (hexChainId: string) => {
      const chainReference = big(hexChainId).toNumber();

      setChainReference(chainReference);
    });

    return () => {
      provider.removeListener("chainChanged", () => {
        console.log('stop listening to "chanChanged" event');
      });
    };
  }, [provider]);

  async function handleConnectMetamaskClick(): Promise<void> {
    connectMetamask();
  }

  return (
    <>
      <header className="flex justify-end border-b-2 border-black p-4">
        {account ? (
          <AddressDisplay account={account} />
        ) : (
          <button className="btn-primary" onClick={handleConnectMetamaskClick}>
            Connect
          </button>
        )}
      </header>
      <main className="min-h-screen flex-col justify-center bg-white py-20 sm:flex sm:items-center sm:justify-center">
        <TransactionProvider>
          <TransactionToastProvider>
            <Outlet />
          </TransactionToastProvider>
        </TransactionProvider>
      </main>
    </>
  );
}
