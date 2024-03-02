import { LucideIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  links: {
    name: string;
    path: string;
    icon: LucideIcon;
  }[];

  isCollapsed: boolean;
}

export default function SidebarNav({ links, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link) =>
          isCollapsed ? (
            <Tooltip key={link.path}>
              <TooltipTrigger asChild>
                <Link
                  href={link.path}
                  className={cn(
                    buttonVariants({
                      variant: link.path === pathname ? "default" : "ghost",
                      size: "icon",
                    })
                  )}
                >
                  <link.icon height={25} width={25} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center">
                {link.name}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href={link.path}
              key={link.path}
              className={cn(
                buttonVariants({
                  variant: link.path === pathname ? "default" : "ghost",
                  size: "lg",
                }),
                "justify-start"
              )}
            >
              <link.icon className="me-3" height={25} width={25} />
              {link.name}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
