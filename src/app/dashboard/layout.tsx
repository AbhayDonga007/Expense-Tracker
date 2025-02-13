"use client"
import { MainNav } from '@/components/MainNav'
import Navbar from '@/components/navbar'
import { db } from '@/lib/dbConfig'
import { Budgets } from '@/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const DashboardLayout = ({children,}: { children: React.ReactNode}) => {

    const {user} = useUser()
    const router = useRouter()
    useEffect(()=>{
        if(user){
          checkUserBudget();
        }
    },[user])

    const checkUserBudget =async () => {
        const result = await db.select().from(Budgets).where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))

        console.log(result);
        if(result.length == 0){
            router.replace('/dashboard/budgets')
        }
    }
  return (
    <div className="min-h-screen flex flex-col">
      {/* <SiteHeader /> */}
      <Navbar />
      <div className="flex-1 flex">
        <aside className="w-64 border-r px-4 py-6">
          <MainNav />
        </aside>
        <main className='w-[100%]'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout