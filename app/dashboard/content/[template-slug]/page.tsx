"use client"
import React from "react"
import FormSection from "./_components/FormSection"
import OutputSection from "./_components/OutputSection"
import Templates from "@/app/(data)/Templates"
import { TEMPLATE } from "@/types/template"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

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

  const handleGenerateAIContent = (formData: any) => {}

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
            userFormInput={(v: any) => handleGenerateAIContent(v)}
          />
        )}
        {/* OutputSection */}
        <div className="col-span-2">
          <OutputSection />
        </div>
      </div>
    </div>
  )
}

export default CreateNewContent
