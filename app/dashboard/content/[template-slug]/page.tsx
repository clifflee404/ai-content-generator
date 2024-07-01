"use client"
import React, { useState } from "react"
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

  const GenerateAIContent = async (formData: any) => {
    setLoading(true)
    const SelectedPrompt = selectedTemplate?.aiPrompt

    const FinalAiPrompt = JSON.stringify(formData) + ', ' + SelectedPrompt

    const result = await chatSession.sendMessage(FinalAiPrompt)

    // console.log(result.response.text())
    setAIOutput(result?.response.text())
    await saveInDb(JSON.stringify(formData), selectedTemplate?.slug, result?.response.text())
    setLoading(false)
  }

  const saveInDb = async (formData: any, slug: any, aiResponse: string) => {
    const result = await db.insert(AIOutput).values({
      formData,
      templateSlug: slug,
      aiResponse,
      createdBy: user?.primaryEmailAddress?.emailAddress as string,
      createdAt: moment().format('yyyy/MM/DD')

    })
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
