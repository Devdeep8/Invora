"use client";

import { useState } from "react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  const [user] = useState({
    name: "John Doe",
    avatar: "/path/to/avatar.jpg", // Replace with your user's avatar
  });

  return (
    <header className="flex items-center w-screen justify-between p-4 bg-gray-100 dark:bg-gray-900 shadow-md">
      <div className="flex items-center space-x-4">
        {/* Sidebar trigger for mobile or collapsible sidebar */}
        <SidebarTrigger />
        <span className="text-2xl font-bold">Dashboard</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <DarkModeToggle />
        {/* Add your user dropdown here if needed */}
      </div>
    </header>
  );
}
