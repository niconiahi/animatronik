import { useAtom } from "jotai";
import { providerAtom } from "~/atoms/provider";
import { setAccountAtom } from "~/atoms/account";

export function useConnectMetamask(): () => Promise<void> {
  const [provider] = useAtom(providerAtom);
  const [, setAccount] = useAtom(setAccountAtom);

  async function connectMetamask() {
    if (!provider) {
      alert("You need Metamask to use this application");

      return;
    }

    await provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        const [account] = accounts;

        setAccount(account);
      })

      .catch((error) => {
        if (error.code === -32002) {
          alert(
            "You have already connected Metamask to the application. Click on the Metamask extension and type your password",
          );
        }
      });
  }

  return connectMetamask;
}
