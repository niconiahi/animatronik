import { useAtom } from "jotai";
import { providerAtom } from "~/atoms/provider";
import { setAccountAtom } from "~/atoms/account";

export function useConnectMetamask(): () => Promise<void> {
  const [provider] = useAtom(providerAtom);
  const [_, setAccount] = useAtom(setAccountAtom);

  async function connectMetamask() {
    if (!provider) {
      alert("You need Metamask to use this application");

      return;
    }

    await provider.send("eth_requestAccounts", []).then((accounts) => {
      const [account] = accounts;

      setAccount(account);
    });
  }

  return connectMetamask;
}
