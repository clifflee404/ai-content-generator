"use client"
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext"
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext"
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext"
import { Button } from "@/components/ui/button"
import { IHistory } from "@/types/common"
import { db } from "@/utils/db"
import { AIOutput, UserSubscription } from "@/utils/schema"
import { useUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import React, { useContext, useEffect, useState } from "react"

function UsageTrack() {
  const { user } = useUser()
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext)
  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  )
  const [maxWords, setMaxWords] = useState(10000)
  const {updateCreditUsage, setUpdateCreditUsage} = useContext(UpdateCreditUsageContext)


  useEffect(() => {
    if (user) {
      getData()
      isUserSubscribe()
    }
  }, [user])

  useEffect(() => {
    console.log('---[useEffect updateCreditUsage change]:', updateCreditUsage);
    user && getData()
  }, [updateCreditUsage && user])

  const getData = async () => {
    console.log('---getDate()---', );
    const userEmail = user?.primaryEmailAddress?.emailAddress
    if (!userEmail) {
      console.error("[usageTrack getData] user emailAddress is null")
      return
    }
    // @ts-ignore
    const result: IHistory[] = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, userEmail))

    getTotalUsage(result)
  }

  const getTotalUsage = (result: IHistory[]) => {
    let total: number = 0
    result.forEach((element) => {
      total = total + Number(element.aiResponse?.length)
    })

    console.log("---getTotalUsage:", total)
    setTotalUsage(total)
  }

  const isUserSubscribe = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress
    if (!userEmail) {
      return
    }
    const result = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.email, userEmail))
    console.log('---isUserSubscribe:', result);
    if (result && result.length > 0) {
      setUserSubscription(true)
      setMaxWords(1000000)
    }
  }

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{
              width: (totalUsage / maxWords) * 100 + "%",
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">{totalUsage}/{maxWords} credit used</h2>
      </div>
      <Button variant="secondary" className="w-full my-3 text-primary">
        Upgrade
      </Button>
    </div>
  )
}

export default UsageTrack
