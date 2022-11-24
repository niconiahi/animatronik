import { Link } from "@remix-run/react";
import PrimaryButton from "~/components/primary-button";

export default function Index() {
  return (
    <Link to="showcase">
      <PrimaryButton>See showcase</PrimaryButton>
    </Link>
  );
}
