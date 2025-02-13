import { Button } from "@/components/ui/button"

export default function CTA2() {
  return (
    <section className="py-20 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Effortless Expense Management</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
        Track your income, expenses, and savings all in one place. Say goodbye to financial stress and hello to smart money management.
        </p>
        <Button size="lg" variant="secondary">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  )
}

