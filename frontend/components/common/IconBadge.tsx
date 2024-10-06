import Link from "next/link";
import React from "react";

export default function IconBadge() {
  return (
    <Link href={"/"}>
      <div className="flex items-center flex-col font-semibold text-xl">UI</div>
    </Link>
  );
}
