"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTabs, type DashboardTab } from "@/config/admin";

/** Tabs that remember the open tab in the URL (?tab=) without a reload. */
export function DashboardTabs({ initial, children }: { initial: DashboardTab; children: React.ReactNode }) {
  return (
    <Tabs
      defaultValue={initial}
      onValueChange={(tab) => {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tab);
        window.history.replaceState(null, "", url);
      }}
      className="gap-6"
    >
      <div className="-mx-5 overflow-x-auto px-5">
        <TabsList className="w-max">
          {dashboardTabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="px-3">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
