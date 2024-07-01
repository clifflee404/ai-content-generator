'use client'
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext"
import { Button } from "@/components/ui/button"
import { IHistory } from "@/types/common"
import { db } from "@/utils/db"
import { AIOutput } from "@/utils/schema"
import { useUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import React, { useContext, useEffect, useState } from "react"

function UsageTrack (){
  const {user} = useUser()
  const {totalUsage, setTotalUsage} = useContext(TotalUsageContext)

  useEffect(() => {
    user && getData()
  }, [user])
  
  const getData = async () => { 
    const userEmail = user?.primaryEmailAddress?.emailAddress
    if(!userEmail){
      console.error('[usageTrack getData] user emailAddress is null')
      return
    }
    // @ts-ignore
    const result: IHistory[] = await db.select().from(AIOutput).where(eq(AIOutput.createdBy, userEmail))

    getTotalUsage(result)
   }

   const getTotalUsage = (result: IHistory[]) => { 
      let total: number = 0
      result.forEach(element => {
        total = total + Number(element.aiResponse?.length)
      })

      console.log('---getTotalUsage:', total);
      setTotalUsage(total)
    }

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{
              width: (totalUsage/10000)*100 + '%',
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">{totalUsage}/10,000 Credit used</h2>
      </div>
      <Button variant="secondary" className="w-full my-3 text-primary">Upgrade</Button>
    </div>
  )
}

export default UsageTrack
