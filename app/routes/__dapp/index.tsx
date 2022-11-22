import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="relative flex h-[400px] w-[800px] items-center justify-center overflow-hidden">
      <Link to="showcase">
        <button className="btn-primary">See the showcase</button>
      </Link>
    </div>
  );
}
