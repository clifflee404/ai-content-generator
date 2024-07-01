"use client"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import React, { useContext, useState } from "react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { db } from "@/utils/db"
import { UserSubscription } from "@/utils/schema"
import moment from "moment"
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext"

const Billing = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  )

  const createSubscription = () => {
    setLoading(true)
    axios.post("/api/create-subcription", {}).then(
      (resp) => {
        // get subscriptionId: resp.data.id
        console.log("[createSubscription()]", resp.data)
        onPayment(resp.data.id)
      },
      (error) => {
        setLoading(false)
      }
    )
  }

  const onPayment = (subId: string) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subId,
      name: "CliffLee AI Apps",
      description: "Monthly Subscription",
      handler: async (resp: any) => {
        //{razorpay_payment_id： "pay_0PaoCjVffvw6j",
        // razorpay_Signature： "c39bc7cbbebb70e915d64959ef5da8d87b54b1c5.
        // razorpay_subscription_id： "sub_OPZwVT8ailssrg"}
        console.log("---onPayment handler resp:", resp)
        // save payment infomation to database
        if (resp) {
          saveSubscription(resp?.razorpay_payment_id)
        }
        setLoading(false)
      },
    }

    // @ts-ignore
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const saveSubscription = async (paymentId: string) => {
    const result = await db.insert(UserSubscription).values({
      email: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      active: true,
      paymentId: paymentId,
      joinDate: moment().format("DD/MM/yyyy"),
    })

    console.log("[saveSubscription() result]:", result)

    if (result) {
      window.location.reload()
    }
  }

  return (
    <div>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="text-center font-bold text-3xl my-3">
          Upgrade With Monthly Plan
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Free<span className="sr-only">Plan</span>
              </h2>
              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  0${" "}
                </strong>
                <span className="text-sm font-medium text-gray-700">
                  /month
                </span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700"> 10,000 Words/Month </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700"> 50+ Content Templates </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700">
                  {" "}
                  Unlimted Download &amp; Copy{" "}
                </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700"> 1 Month of History </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Monthly<span className="sr-only">Plan</span>
              </h2>
              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  9.99${" "}
                </strong>
                <span className="text-sm font-medium text-gray-700">
                  /month
                </span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700"> 1,00,000 Words/Month </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700"> 50+ Template Access </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700">
                  {" "}
                  Unlimated Download &amp; Copy{" "}
                </span>
              </li>
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
                <span className="text-gray-700"> 1 Year of History </span>
              </li>
            </ul>
            <Button
              disabled={loading}
              onClick={() => createSubscription()}
              className="w-full rounded-full mt-5 p-6"
              variant="outline"
            >
              {loading && <Loader2Icon className="animate-spin" />}
              {userSubscription ? "Active Plan" : "Get Started"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing
