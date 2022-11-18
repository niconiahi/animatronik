import { Outlet } from "@remix-run/react";
import AddressDisplay from "~/components/address-display";
import { useXyz } from "~/providers/xyz-provider";
import { useConnectMetamask } from "~/utils/metamask";

export default function MainLayout() {
  const connectMetamask = useConnectMetamask();
  const { account } = useXyz();

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
        <Outlet />
      </main>
    </>
  );
}
