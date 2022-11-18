import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="min-h-screen flex-col bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative flex h-[400px] w-[800px] items-center justify-center overflow-hidden">
        <Link
          className="z-10 rounded-2xl border-2 border-black bg-white p-2"
          to="animantroniks"
        >
          Animantroniks
        </Link>
      </div>
    </main>
  );
}
