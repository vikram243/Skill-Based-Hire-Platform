import React from "react";
import { Outlet } from "react-router-dom";
import ProviderNavigation from "../../components/providers/Navigation";

export default function ProviderLayout() {
  return (
    <div className="provider-layout">
      <ProviderNavigation />

      <main className="ml-0 lg:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}
