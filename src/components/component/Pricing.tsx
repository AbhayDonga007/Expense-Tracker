import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Basic",
    price: "$5",
    features: ["Track up to 50 transactions/month", "Budgeting tools", "Basic analytics", "Email support"],
  },
  {
    name: "Pro",
    price: "$15",
    features: ["Unlimited transactions", "Advanced analytics & reports", "Advanced analytics", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "$25",
    features: ["Custom features", "Dedicated account manager", "On-premise deployment", "24/7 phone support"],
  },
]

export default function Pricing2() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                {plan.price}
                <span className="text-lg font-normal text-gray-600">/month</span>
              </p>
              <ul className="mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="default">
                {index === 2 ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

