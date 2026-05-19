import { eip155_11155111 } from "@ethernauta/chain"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import { create_signer, encode_chain_id } from "@ethernauta/transport"
import { useState } from "react"
import { Link, Outlet } from "react-router"

import AddressDisplay from "~/components/address-display"
import PrimaryButton from "~/components/primary-button"

export const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const signer = create_signer([{ chainId: CHAIN_ID }])

export type DappContext = {
  account: string | null
}

export default function Dapp() {
  const [account, set_account] = useState<string | null>(
    null,
  )

  async function handle_connect() {
    const accounts = await eth_requestAccounts()(
      signer({ chain_id: CHAIN_ID }),
    )
    set_account(accounts[0] ?? null)
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
        {account ? (
          <AddressDisplay account={account} />
        ) : (
          <PrimaryButton
            onClick={handle_connect}
            className="mr-3 py-[8px] md:mr-10 md:py-[12px]"
          >
            Connect
          </PrimaryButton>
        )}
      </header>
      <main className="isolation flex h-full min-h-screen w-full items-center justify-center bg-gray-50 pt-20 pb-14">
        <div className="flex w-full flex-col items-center justify-center self-center py-1 px-4 md:w-4/6 lg:w-3/4">
          <Outlet
            context={
              { account } satisfies DappContext
            }
          />
        </div>
      </main>
    </>
  )
}
