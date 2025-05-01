import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals just getting started",
    price: "$5",
    period: "month",
    features: ["Track up to 50 transactions/month", "Budgeting tools", "Basic analytics", "Email support"],
    popular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses and professionals",
    price: "$15",
    period: "month",
    features: ["Unlimited transactions", "Advanced analytics & reports", "Advanced analytics", "Priority support"],
    popular: true,
    buttonText: "Get Started",
    buttonVariant: "default" as const,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: "$25",
    period: "month",
    features: ["Custom features", "Dedicated account manager", "On-premise deployment", "24/7 phone support"],
    popular: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
  },
]

export default function Pricing2() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? "border-primary shadow-lg scale-105 md:scale-110 z-10" : "hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-tl-none rounded-br-none rounded-tr-md rounded-bl-md px-3 py-1.5 bg-primary text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className={plan.popular ? "pb-8" : "pb-6"}>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground ml-1">/{plan.period}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            Need a custom solution?{" "}
            <Button variant="link" className="p-0 h-auto font-semibold">
              Contact our sales team
            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}
