"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Plus, ArrowUpCircle, User2 } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Incomes",
    href: "/dashboard/income",
    icon: LayoutDashboard,
  },
  {
    title: "Budgets",
    href: "/dashboard/budgets",
    icon: Plus,
  },
  {
    title: "Upgrade",
    href: "/upgrade",
    icon: ArrowUpCircle,
  },
  {
    title: "Account",
    href: "/account",
    icon: User2,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

