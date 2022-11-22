import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <Link to="showcase">
        <button className="btn-primary">See showcase</button>
      </Link>
    </div>
  );
}
