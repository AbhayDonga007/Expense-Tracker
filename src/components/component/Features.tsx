import { CheckCircle, Zap, Users, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Multi-Account Management",
    description: "Track multiple bank accounts and wallets in one dashboard.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Expense Categories & Tags",
    description: "Organize your expenses for better insights and planning.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Automated Expense Analysis",
    description: "Our AI-powered system categorizes expenses and provides recommendations.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Custom Alerts & Reminders",
    description: "Stay on top of your bills and avoid late fees with timely reminders.",
  },
]

export default function Features2() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

