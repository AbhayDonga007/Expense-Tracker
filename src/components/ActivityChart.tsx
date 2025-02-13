"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  {
    name: "Home Decor",
    totalSpend: 1500,
    amount: 3500,
  },
  {
    name: "Garden",
    totalSpend: 200,
    amount: 1300,
  },
  {
    name: "Car Maintenance",
    totalSpend: 500,
    amount: 2300,
  },
  {
    name: "Youtube Earning",
    totalSpend: 1000,
    amount: 5000,
  },
]

export function ActivityChart({budgetList}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={budgetList}>
            <XAxis dataKey="name" stroke="#e5e9f6" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#e5e9f6"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSpend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="amount" fill="#8338e8" radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

