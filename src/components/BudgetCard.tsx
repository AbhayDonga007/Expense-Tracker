/* 
import { Car, Plane } from "lucide-react"
import { cn } from "@/lib/utils"

interface BudgetCardProps {
  id: number,
  name: string
  icon: "car" | "travel"
  amount: number
  createdBy: string,
  totalItems: number,
  totalSpend: number,
  className?: string
}

export function BudgetCard({budget}) {
  // const remaining = amount - spent
  // const progress = (spent / amount) * 100

  return (  
    <div className={cn("rounded-lg p-4 bg-black-100 shadow-sm")}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           {icon === "travel" ? (
            <div className="rounded-full bg-blue-100 p-2">
              <Plane className="h-4 w-4 text-blue-600" />
            </div>
          ) : (
            <div className="rounded-full bg-red-100 p-2">
              <Car className="h-4 w-4 text-red-600" />
            </div>
          )} 
          <div className="rounded-full bg-blue-100 p-2">
              <Plane className="h-4 w-4 text-blue-600" />
            </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-[22px]">{budget.name}</h3>
            <p className="font-semibold text-[15px] text-gray-400">{budget.totalItems} Item</p>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-700">${budget.amount}</span>
      </div>
      <div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 font-bold text-[10px]">${budget.totalSpend?budget.totalSpend:0} Spent</span>
          <span className="text-gray-400 font-bold text-[10px]">${budget.amount - budget.totalSpend} Remaining</span>
        </div>
        <div>
          <div className="h-2 w-full rounded-full bg-slate-300">
           style={{ width: `${(budget.totalSpend / budget.amount) * 100}%` }} 
          <div className="h-2 w-[40%] rounded-full bg-red-300" />
          </div>
        </div>
      </div>
    </div>
  )
} */

import {
  Book,
  Plane,
  ShoppingBag,
  Laptop,
  Apple,
  PiggyBank,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { iconMap } from "@/lib/icons"

// interface BudgetCardProps {
//   title: string
//   icon: "books" | "fruits" | "laptop" | "loan" | "shopping" | "travel"
//   amount: number
//   spent: number
//   items?: number
//   className?: string
//   onClick?: () => void
// }

// interface BudgetCardProps {
//   id: number;
//   name: string;
//   icon: "car" | "travel";
//   amount: number;
//   createdBy: string;
//   // totalItems: number;
//   // totalSpend: number;
//   className?: string;
// }

// const icons = {
//   books: Book,
//   fruits: Apple,
//   laptop: Laptop,
//   loan: PiggyBank,
//   shopping: ShoppingBag,
//   travel: Plane,
// };

export function BudgetCard({ budget }) {
  const IconComponent = iconMap[budget?.icon] || Home;
  
  const calPer = () => {
    const per = (budget?.totalSpend / budget?.amount) * 100;
    return per.toFixed(2);
  };
  return (
    <Link
      href={`/dashboard/expenses/${budget?.id}`}
      className={cn(
        "group flex w-full h-[160px] flex-col gap-6 rounded-xl bg-white p-6 text-left transition-all hover:shadow-lg",
        "dark:bg-gray-950 dark:hover:bg-gray-700"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="items-center p-4 border rounded-full">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-[22px]">{budget?.name}</h3>
            <p className="font-semibold text-[15px] text-gray-400">
              {budget?.totalItems} Item
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-700">
          ₹{budget?.amount}
        </span>
      </div>
      <div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 font-bold text-[10px]">
            ₹{budget?.totalSpend ? budget?.totalSpend : 0} Spent
          </span>
          <span className="text-gray-400 font-bold text-[10px]">
            ₹{budget?.amount - budget?.totalSpend} Remaining
          </span>
        </div>
        <div>
          <div className="h-2 w-full rounded-full bg-slate-400">
            {/* style={{ width: `${(budget.totalSpend / budget.amount) * 100}%` }}  */}
            <div
              className="h-2 rounded-full bg-blue-700"
              style={{ width: `${calPer()}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
