"use client"
import React, { useContext, useState } from "react"
import FormSection from "./_components/FormSection"
import OutputSection from "./_components/OutputSection"
import Templates from "@/app/(data)/Templates"
import { TEMPLATE } from "@/types/template"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { chatSession } from "@/utils/AiModal"
import { db } from "@/utils/db"
import { AIOutput } from "@/utils/schema"
import { useUser } from "@clerk/nextjs"
import moment from "moment"
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext"
import { useRouter } from "next/navigation"
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext"
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext"

interface Props {
  params: {
    "template-slug": string
  }
}
const CreateNewContent = (props: Props) => {
  // console.log('---props:', props.params);
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug == props.params["template-slug"]
  )
  const [loading, setLoading] = useState(false)
  const [aiOutput, setAIOutput] = useState<string>("")
  const { user } = useUser()
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext)
  const router = useRouter()
  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  )
  const {updateCreditUsage, setUpdateCreditUsage} = useContext(UpdateCreditUsageContext)

  // console.log('---user:', user);

  /**
   * Used to generate content from AI
   * @param formData 
   * @returns 
   */
  const GenerateAIContent = async (formData: any) => {
    if(totalUsage >= 10000 && !userSubscription){
      console.log('Please Upgrade')
      router.push('/dashboard/billing')
      return
    }
    setLoading(true)
    const SelectedPrompt = selectedTemplate?.aiPrompt

    const FinalAiPrompt = JSON.stringify(formData) + ', ' + SelectedPrompt

    const result = await chatSession.sendMessage(FinalAiPrompt)

    // console.log(result.response.text())
    setAIOutput(result?.response.text())
    await saveInDb(JSON.stringify(formData), selectedTemplate?.slug, result?.response.text())
    setLoading(false)

    setUpdateCreditUsage(Date.now())
  }

  const saveInDb = async (formData: any, slug: any, aiResponse: string) => {
    const params = {
      formData,
      templateSlug: slug,
      aiResponse,
      createdBy: user?.primaryEmailAddress?.emailAddress as string,
      createdAt: moment().format('yyyy/MM/DD')
    }
    console.log('---[saveInDb] params:', params);
    if(!params.createdBy){
      console.error('[saveInDb] user emailAddress is null');
      return
    }
    const result = await db.insert(AIOutput).values(params)
    console.log('---saveInDb:', result);
  }

  return (
    <div className="p-10">
      <Link href="/dashboard">
        <Button>
          <ArrowLeft /> Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5  py-5">
        {/* FormSection */}
        {selectedTemplate && (
          <FormSection
            selectedTemplate={selectedTemplate}
            userFormInput={(v: any) => GenerateAIContent(v)}
            loading={loading}
          />
        )}
        {/* OutputSection */}
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput}/>
        </div>
      </div>
    </div>
  )
}

export default CreateNewContent
