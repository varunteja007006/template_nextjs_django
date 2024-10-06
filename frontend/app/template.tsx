import React from "react";

import Transition from "@/components/common/framer-motion/Transition";

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Transition>{children} </Transition>;
}
