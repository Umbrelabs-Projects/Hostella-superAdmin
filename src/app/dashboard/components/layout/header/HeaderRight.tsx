"use client";

import UserDropdown from "./UserDropdown";

export default function HeaderRight() {
  return (
    <div className="flex items-center gap-4">
      <UserDropdown />
    </div>
  );
}
