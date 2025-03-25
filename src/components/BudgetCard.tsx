import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { iconMap } from "@/lib/icons";
import { Budget } from "@/interface";
interface BudgetCardProps {
  budget: Budget; 
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const IconComponent = iconMap[budget?.icon ?? "defaultIcon"] || Home;

  const getSpendingPercentage = () => {
    if (!budget?.totalSpend || !budget?.amount) return "0";
    const percentage = (budget?.totalSpend / Number(budget?.amount)) * 100;
    return percentage.toFixed(2);
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
            <h3 className="font-bold text-[18px]">{budget?.name}</h3>
            <p className="font-semibold text-[15px] text-gray-400">
              {budget?.totalItems ?? 0} Item{budget?.totalItems === 1 ? "" : "s"}
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
            ₹{budget?.totalSpend ?? 0} Spent
          </span>
          <span className="text-gray-400 font-bold text-[10px]">
            ₹{Number(budget?.amount) - (budget?.totalSpend ?? 0)} Remaining
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-400">
          <div
            className="h-2 rounded-full bg-blue-700"
            style={{ width: `${getSpendingPercentage()}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
