"use client";

import SidebarNav from "~/components/sidebar-nav";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  CircleUser,
  Home,
  LogOut,
  ReceiptText,
  User,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const userLinks = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    name: "Proveedores",
    path: "/proveedores",
    icon: User,
  },
  {
    name: "Facturas",
    path: "/facturas",
    icon: ReceiptText,
  },
  {
    name: "Pagos",
    path: "/pagos",
    icon: CircleDollarSign,
  },
];

const adminLinks = [
  {
    name: "Usuarios",
    path: "/users",
    icon: Users,
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const session = useSession();

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <div
          className={cn(
            isCollapsed && "scale-y-[40px]",
            "width-[250px] flex flex-col justify-between border-r transition-all duration-300 ease-in-out",
          )}
        >
          <div>
            <div className="m-2 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCollapsed(!isCollapsed);
                }}
              >
                {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
              </Button>
            </div>
            <SidebarNav links={userLinks} isCollapsed={isCollapsed} />
            {session.data?.user?.role === "ADMIN" && (
              <>
                <Separator />
                <SidebarNav links={adminLinks} isCollapsed={isCollapsed} />
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 p-2">
            <div className="flex items-center justify-center gap-2">
              <CircleUser width={30} height={30} />
              {!isCollapsed &&
                (session?.status === "loading" ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <div>
                    <p className="font-bold">{session?.data?.user.username}</p>
                    <p className="text-xs text-gray-400">
                      {session?.data?.user.role === "ADMIN"
                        ? "Administrador"
                        : "Gerente"}
                    </p>
                  </div>
                ))}
            </div>
            <Button
              className="w-full text-destructive hover:text-destructive"
              variant="ghost"
              onClick={() => {
                signOut();
              }}
            >
              {!isCollapsed ? (
                <>
                  <LogOut className="mr-2" />
                  Cerrar Sesión
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LogOut />
                  </TooltipTrigger>
                  <TooltipContent side="right">Cerrar Sesión</TooltipContent>
                </Tooltip>
              )}
            </Button>
          </div>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </TooltipProvider>
  );
}
