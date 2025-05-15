"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ApplicationForm } from "@/components/application-form"
import { ApplicationSuccess } from "@/components/application-success"

type Job = {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  applicationUrl: string | null
}

interface ApplicationModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmitSuccess = () => {
    setIsSubmitted(true)
    // In the future, this would update the cache with Clerk
  }

  const handleClose = () => {
    onClose()
    // Reset the form state after the dialog is closed
    setTimeout(() => {
      setIsSubmitted(false)
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isSubmitted ? "Application Submitted" : `Apply for ${job.title}`}</DialogTitle>
          <DialogDescription>
            {isSubmitted ? "Thank you for your application." : `${job.department} · ${job.location}`}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <ApplicationSuccess jobTitle={job.title} />
        ) : (
          <ApplicationForm job={job} onSubmitSuccess={handleSubmitSuccess} />
        )}
      </DialogContent>
    </Dialog>
  )
}
