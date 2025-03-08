"use client"
import CreateIncomeCard from "@/components/CreateIncomeCard";
import Footer from "@/components/footer";
import { IncomeTable } from "@/components/IncomeTable";
import { Income } from "@/interface";
import { db } from "@/lib/dbConfig";
import { Incomes } from "@/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";

type Props = {};

const page = (props: Props) => {
  const { user } = useUser();

  const [incomeList, setIncomeList] = useState<Income[]>([]);

  const getIncomeList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        ...getTableColumns(Incomes),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(Incomes.id));

    const formattedResult = result.map((income) => ({
      ...income,
      amount: Number(income.amount),
    }));

    setIncomeList(formattedResult);
  }, [user]);

  useEffect(() => {
    if (user) {
      getIncomeList();
    }
  }, [user, getIncomeList]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            My Incomes
          </h1>

          <CreateIncomeCard onRefreshData={getIncomeList} />
          {/* <CreateBudgetCard onRefreshData={getBudgetList} />

          <div className="grid gap-6 mt-5 sm:grid-cols-2 lg:grid-cols-3">
            {budgetList.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div> */}
          <div className="mt-8">
            <IncomeTable onRefreshData={getIncomeList} incomes={incomeList} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
