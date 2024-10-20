import React from "react";
import BasicProfile from "./sections/basic-profile";

export default function UserProfileMain() {
  return (
    <div className="p-2 md:p-10 max-w-[280px] md:max-w-[600px] mx-auto">
      <BasicProfile />
    </div>
  );
}
