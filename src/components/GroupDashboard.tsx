"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Group, GroupBalance, GroupExpense, GroupMember } from "@/interface";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from "recharts";

interface GroupDashboardProps {
  group: Group;
}

import { TooltipProps } from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md shadow-md p-3 text-white">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-sm">
            {entry.name}: {`Participated in ${entry.value} Expenses`}
          </p>
        </div>
      ))}
    </div>
  );
};

const ChartTooltipContent = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md shadow-md p-3 text-white">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-sm">
            {entry.name}:{" "}
            {(entry.value as number).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export function GroupDashboard({ group }: GroupDashboardProps) {
  const categoryData = processExpensesByCategory(group?.expenses);
  const memberContributionData = processMemberContributions(
    group?.expenses,
    group?.members
  );
  const spendingTrendData = processSpendingTrend(group?.expenses);
  const balanceData = processBalanceData(group?.balances);
  const participationData = processParticipationData(
    group?.expenses,
    group?.members
  );

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
  ];

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(153, 80%, 50%)",
    },
    expense: {
      label: "Expense",
      color: "hsl(350, 80%, 60%)",
    },
    paid: {
      label: "Paid",
      color: "#8884d8",
    },
    owed: {
      label: "Owed",
      color: "#82ca9d",
    },
    amount: {
      label: "Amount",
      color: "#8884d8",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
            <CardDescription className="text-gray-400">
              Sum of all expenses in this group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ₹
              {calculateTotalExpenses(group?.expenses)
                ? calculateTotalExpenses(group?.expenses).toLocaleString()
                : 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Per Person</CardTitle>
            <CardDescription className="text-gray-400">
              Average expense per group member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ₹
              {calculateAveragePerPerson(
                group?.expenses,
                group?.members?.length ?? 0
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Outstanding Balances</CardTitle>
            <CardDescription className="text-gray-400">
              Total money yet to be settled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ₹
              {(
                calculateTotalOutstanding(group?.balances || []) ?? 0
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of expenses across different categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Member Contributions</CardTitle>
            <CardDescription className="text-gray-400">
              How much each member has contributed
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={memberContributionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  tickFormatter={(name) => name.split(" ")[0]}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="paid"
                  name="Paid"
                  fill={chartConfig.paid.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="owed"
                  name="Owed"
                  fill={chartConfig.owed.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <CardDescription className="text-gray-400">
              Expense pattern over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={spendingTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Amount"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Outstanding Balances</CardTitle>
            <CardDescription className="text-gray-400">
              Who owes whom and how much
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={balanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  tickFormatter={(name) => {
                    const [from, to] = name
                      .split("→")
                      .map((part: string) => part.trim().split(" ")[0]);
                    return `${from[0]}. → ${to[0]}.`;
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="amount"
                  name="Amount"
                  fill={chartConfig.amount.color}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1d29] border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Participation Rate</CardTitle>
            <CardDescription className="text-gray-400">
              How often each member participates in expenses
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {participationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<CustomTooltip />} cursor={false} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function processExpensesByCategory(expenses: GroupExpense[] = []) {
  const categoryMap: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    if (!categoryMap[expense.category]) {
      categoryMap[expense.category] = 0;
    }
    categoryMap[expense.category] += amount;
  });

  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
}

function processMemberContributions(
  expenses: GroupExpense[] = [],
  members: GroupMember[] = []
) {
  const memberMap: {
    [key: string]: { name: string; paid: number; owed: number };
  } = {};

  members.forEach((member) => {
    memberMap[member.id] = {
      name: member.name,
      paid: 0,
      owed: 0,
    };
  });

  expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    if (memberMap[expense.paidById]) {
      memberMap[expense.paidById].paid += amount;
    }

    const participantIds: string[] = Array.isArray(expense.participantIds)
      ? expense.participantIds
      : JSON.parse(expense.participantIds);

    const perPersonAmount = amount / participantIds.length;

    participantIds.forEach((participantId) => {
      if (memberMap[participantId] && participantId !== expense.paidById) {
        memberMap[participantId].owed += perPersonAmount;
      }
    });
  });

  return Object.values(memberMap);
}

function processSpendingTrend(expenses: GroupExpense[] = []) {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedExpenses.map((expense) => ({
    date: formatDate(expense.date),
    amount: Number(expense.amount),
  }));
}

function processBalanceData(balances: GroupBalance[] = []) {
  return balances.map((balance) => ({
    name: `${balance.from} → ${balance.to}`,
    amount: Number(balance.amount),
  }));
}

function processParticipationData(
  expenses: GroupExpense[] = [],
  members: GroupMember[] = []
) {
  const participationCount: { [key: string]: { name: string; count: number } } =
    {};

  members.forEach((member) => {
    participationCount[member.id] = {
      name: member.name,
      count: 0,
    };
  });

  expenses.forEach((expense) => {
    const participantIds: string[] = Array.isArray(expense.participantIds)
      ? expense.participantIds
      : JSON.parse(expense.participantIds);

    participantIds.forEach((participantId) => {
      if (participationCount[participantId]) {
        participationCount[participantId].count += 1;
      }
    });
  });

  return Object.values(participationCount).sort((a, b) => b.count - a.count);
}

function calculateTotalExpenses(expenses: GroupExpense[] = []) {
  return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
}

function calculateAveragePerPerson(
  expenses: GroupExpense[] = [],
  memberCount: number
) {
  const total = calculateTotalExpenses(expenses);
  return memberCount > 0 ? Math.round(total / memberCount) : 0;
}

function calculateTotalOutstanding(balances: GroupBalance[] = []) {
  return balances.reduce((sum, balance) => sum + Number(balance.amount), 0);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}
