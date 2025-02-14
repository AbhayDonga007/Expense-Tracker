"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/dbConfig"
import { Budgets, Expenses } from "@/schema"
import toast from "react-hot-toast"
import moment from 'moment'

interface AddExpenseFormProps {
  budgetId: number;
  onRefreshData: () => void; 
}


export function AddExpenseForm({budgetId,onRefreshData}:AddExpenseFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")

  const addNewExpense =async () => {
    // e.preventDefault()
    // // Handle form submission
    // console.log({ name, amount })
    // setName("")
    // setAmount("")

    const result = await db.insert(Expenses).values({
      name:name,
      amount:amount,
      budgetId:budgetId,
      createdAt:moment().format('DD/MM/yyy')
    }).returning({insertedId:Budgets.id})

    console.log(result);
    if(result){
      toast.success("Expense Added")
      // window.location.reload()
      onRefreshData()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium">Expense Name</label>
            <Input placeholder="e.g. Bedroom Decor" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Expense Amount</label>
            <Input type="number" placeholder="e.g. 1000" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <Button onClick={()=>addNewExpense()} disabled={!(name&&amount)} type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Add New Expense
          </Button>
          </div>
        {/* </form> */}
      </CardContent>
    </Card>
  )
}

