import { Link } from "react-router"

import PrimaryButton from "~/components/primary-button"

export default function Home() {
  return (
    <main className="isolation flex h-full min-h-screen w-full items-center justify-center bg-gray-50 space-x-2">
      <Link to="/showcase">
        <PrimaryButton>See showcase</PrimaryButton>
      </Link>
      <Link to="/add">
        <PrimaryButton>Create one</PrimaryButton>
      </Link>
    </main>
  )
}
