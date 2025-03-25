import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { GroupBalance } from "@/interface";

interface BalancesSummaryProps {
  balances: GroupBalance[];
}

export function BalancesSummary({ balances }: BalancesSummaryProps) {
  if (!balances || balances.length === 0) {
    return (
      <Card className="bg-[#1a1d29] border-gray-800 text-white">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Settled Up!</h3>
          <p className="text-gray-400 text-center">
            Everyone is square. There are no outstanding balances.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#1a1d29] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription className="text-gray-400">
            Simplified balances between group members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balances.map((balance: GroupBalance, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#21253a] rounded-lg">
                <div className="flex items-center">
                  <div className="font-medium">{balance.from}</div>
                  <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
                  <div className="font-medium">{balance.to}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-bold">₹{balance.amount.toLocaleString()}</div>
                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                    <CheckCircle className="mr-2 h-3 w-3" />
                    Settle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1d29] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Settlement Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use UPI, bank transfers, or cash to settle balances</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                After paying, the person who received the money should mark it as settled
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>All members will be notified when a balance is settled</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
