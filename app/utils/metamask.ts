import { useAtom } from "jotai";
import invariant from "tiny-invariant";
import { providerAtom } from "~/atoms/provider";
import { setAccountAtom } from "~/atoms/account";

export function useConnectMetamask(): () => Promise<void> {
  const [provider] = useAtom(providerAtom);
  const [_, setAccount] = useAtom(setAccountAtom);

  async function connectMetamask() {
    invariant(provider, "You need to have Metamask installed");

    await provider.send("eth_requestAccounts", []).then((accounts) => {
      const [account] = accounts;

      setAccount(account);
    });
  }

  return connectMetamask;
}
