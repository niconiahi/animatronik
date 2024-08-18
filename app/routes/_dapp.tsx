import type { Web3Provider } from "@ethersproject/providers"
import { Link, Outlet } from "@remix-run/react"
import { useAtom } from "jotai"
import { useEffect } from "react"

import { accountAtom, setAccountAtom } from "~/atoms/account"
import { setChainReferenceAtom } from "~/atoms/chainReference"
import { providerAtom } from "~/atoms/provider"
import AddressDisplay from "~/components/address-display"
import PrimaryButton from "~/components/primary-button"
import { TransactionProvider } from "~/providers/transaction-provider"
import { TransactionToastProvider } from "~/providers/transaction-toast-provider"
import { big } from "~/utils/big-number"
import { useConnectMetamask } from "~/utils/metamask"

export default function MainLayout() {
  const connectMetamask = useConnectMetamask()
  const [account] = useAtom(accountAtom)
  const [, setAccount] = useAtom(setAccountAtom)
  const [, setChainReference] = useAtom(setChainReferenceAtom)
  const [provider] = useAtom(providerAtom)

  // account
  useEffect(() => {
    if (!provider) {
      return
    }

    async function getAccount(provider: Web3Provider) {
      const accounts = await provider.send("eth_accounts", [])

      setAccount(accounts[0])
    }

    getAccount(provider)
  })

  useEffect(() => {
    if (!provider) {
      return
    }

    provider.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        const [account] = accounts

        setAccount(account)
      } else {
        setAccount(undefined)
      }
    })

    return () => {
      provider.removeListener("accountsChanged", () => {

      })
    }
  }, [provider])

  // chain
  useEffect(() => {
    if (!provider) {
      return
    }

    async function getChainReference(provider: Web3Provider) {
      const hexChainId = await provider.send("eth_chainId", [])
      const chainReference = big(hexChainId).toNumber()

      setChainReference(chainReference)
    }

    getChainReference(provider)
  })

  useEffect(() => {
    if (!provider) {
      return
    }

    provider.on("chainChanged", (hexChainId: string) => {
      const chainReference = big(hexChainId).toNumber()

      setChainReference(chainReference)
    })

    return () => {
      provider.removeListener("chainChanged", () => {

      })
    }
  }, [provider])

  async function handleConnectMetamaskClick(): Promise<void> {
    connectMetamask()
  }

  return (
    <>
      <header className="fixed inset-x-0 z-20 flex items-center justify-between py-4">
        <Link
          to="/"
          className="rounded-r-2xl border-t-2 border-b-2 border-r-2 border-gray-700 bg-white py-1.5 px-3"
        >
          <h1 className="font-rubik text-shadow text-lg text-gray-50 md:text-3xl">
            Animatronik
          </h1>
        </Link>
        {account
          ? (
            <AddressDisplay account={account} />
            )
          : (
            <PrimaryButton
              onClick={handleConnectMetamaskClick}
              className="md: py:auto mr-3 py-[8px] md:mr-10 md:py-[12px]"
            >
              Connect
            </PrimaryButton>
            )}
      </header>
      <main className="isolation flex h-full min-h-screen w-full items-center justify-center bg-gray-50 pt-20 pb-14">
        <div className="flex w-full flex-col items-center justify-center self-center py-1 px-4 md:w-4/6 lg:w-3/4">
          <TransactionProvider>
            <TransactionToastProvider>
              <Outlet />
            </TransactionToastProvider>
          </TransactionProvider>
        </div>
      </main>
    </>
  )
}
