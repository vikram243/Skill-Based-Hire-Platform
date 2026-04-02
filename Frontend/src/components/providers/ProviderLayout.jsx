import React from "react";
import { Outlet } from "react-router-dom";
import ProviderNavigation from "../../components/providers/Navigation";
import { useUI } from "../../contexts/ui-context";

export default function ProviderLayout() {
  const { isDarkMode, toggleDarkMode } = useUI();
  return (
    <div className="provider-layout">
      <ProviderNavigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode}/>

      <main className="ml-0 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
