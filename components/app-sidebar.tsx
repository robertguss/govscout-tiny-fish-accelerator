"use client";

import * as React from "react";
import {
  IconHelp,
  IconInnerShadowTop,
  IconSettings,
  type Icon,
} from "@tabler/icons-react";
import {
  Bookmark,
  Kanban,
  LayoutDashboard,
  Map,
  Search,
  User,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: LayoutDashboard as any,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Search as any,
    },
    {
      title: "Pipeline",
      url: "/dashboard/pipeline",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Kanban as any,
    },
    {
      title: "Saved Searches",
      url: "/dashboard/saved",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Bookmark as any,
    },
    {
      title: "Coverage Map",
      url: "/dashboard/coverage",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Map as any,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: User as any,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [] as { name: string; url: string; icon: Icon }[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useQuery(api.auth.getCurrentUser);

  const user = currentUser
    ? {
        name: currentUser.name || currentUser.email,
        email: currentUser.email,
        avatar: currentUser.image || "",
      }
    : undefined;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">GovScout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
