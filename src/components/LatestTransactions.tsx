import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  name: string
  category: string
  amount: number
  date: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    name: "New Furniture",
    category: "Home Decor",
    amount: 1500,
    date: "2024-02-07",
  },
  {
    id: "2",
    name: "Plants",
    category: "Garden",
    amount: 70,
    date: "2024-02-07",
  },
  {
    id: "3",
    name: "Oil Change",
    category: "Car Maintenance",
    amount: 50,
    date: "2024-02-06",
  },
]

export function LatestTransactions({}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium">
            <div>Name</div>
            <div>Category</div>
            <div>Amount</div>
            <div>Date</div>
          </div>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="grid grid-cols-4 gap-4 border-t p-4 text-sm">
              <div>{transaction.name}</div>
              <div>{transaction.category}</div>
              <div>${transaction.amount}</div>
              <div>{new Date(transaction.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

