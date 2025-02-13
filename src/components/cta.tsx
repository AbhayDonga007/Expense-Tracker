"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CTA() {
  const route = useRouter()
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
        Effortless Expense Management
        </h2>
        <p className="max-w-[42rem] leading-normal font-semibold text-muted-foreground sm:text-xl sm:leading-8">
        Join thousands of users who trust our Expense Tracker to monitor their spending habits and achieve their financial goals.
        </p>
        <Button onClick={() => {route.replace('/dashboard')}} size="lg" className="mt-4">
          Get Started Today
        </Button>
      </div>
    </section>
  )
}

