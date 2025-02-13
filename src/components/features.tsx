import { Brain, Cloud, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "Smart Budgeting",
    description: "Set spending limits and track your progress effortlessly.",
    icon: Brain,
  },
  {
    name: "Real-Time Expense Tracking",
    description: "Log your transactions on the go with our user-friendly interface.",
    icon: Cloud,
  },
  {
    name: "Detailed Financial Reports",
    description: "Generate insightful reports and visualize your spending patterns.",
    icon: Shield,
  },
  {
    name: "Secure Cloud Sync",
    description: "Access your data from anywhere with seamless cloud integration..",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Features That Empower You</h2>
        <p className="mt-4 font-bold text-muted-foreground sm:text-lg">
          Discover how Amane Soft can transform your business with our innovative technologies.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

