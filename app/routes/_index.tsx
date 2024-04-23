import { Link } from "@remix-run/react"
import PrimaryButton from "~/components/primary-button"

export default function Index() {
  return (
    <main className="isolation flex h-full min-h-screen w-full items-center justify-center bg-gray-50 pt-20 pb-14 space-x-2">
      <Link to="/showcase" reloadDocument>
        <PrimaryButton>See showcase</PrimaryButton>
      </Link>
      <Link to="/add" reloadDocument>
        <PrimaryButton className="w-full">Create one</PrimaryButton>
      </Link>
    </main>
  )
}
