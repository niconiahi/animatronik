import { useAtom } from "jotai"

import { setAccountAtom } from "~/atoms/account"
import { providerAtom } from "~/atoms/provider"

export function useConnectMetamask(): () => Promise<void> {
  const [provider] = useAtom(providerAtom)
  const [, setAccount] = useAtom(setAccountAtom)

  async function connectMetamask() {
    if (!provider) {
      // eslint-disable-next-line no-alert
      alert("You need Metamask to use this application")

      return
    }

    await provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        const [account] = accounts

        setAccount(account)
      })

      .catch((error) => {
        if (error.code === -32002) {
          // eslint-disable-next-line no-alert
          alert(
            "You have already connected Metamask to the application. Click on the Metamask extension and type your password",
          )
        }
      })
  }

  return connectMetamask
}
