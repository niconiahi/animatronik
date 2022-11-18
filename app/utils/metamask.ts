import invariant from "tiny-invariant";
import { useXyz, XyzNextValueType } from "~/providers/xyz-provider";

export function useConnectMetamask(): () => Promise<void> {
  const { provider, set } = useXyz();

  async function connectMetamask() {
    invariant(provider, "You need to have Metamask installed");

    await provider.provider.send("eth_requestAccounts", []).then((accounts) => {
      const [account] = accounts;

      set({ type: XyzNextValueType.Account, value: account });
    });
  }

  return connectMetamask;
}
