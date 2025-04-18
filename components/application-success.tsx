"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplicationSuccessProps {
  jobTitle: string
}

export function ApplicationSuccess({ jobTitle }: ApplicationSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h3 className="text-xl font-medium mb-2">Application Submitted!</h3>

      <p className="text-gray-600 mb-6">
        Thank you for applying to the <span className="font-medium">{jobTitle}</span> position. We've received your
        application and will review it shortly.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
        <h4 className="font-medium mb-2">What happens next?</h4>
        <ol className="text-left text-sm space-y-2">
          <li className="flex items-start">
            <span className="font-medium mr-2">1.</span>
            <span>Our team will review your application (typically within 5-7 business days)</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">2.</span>
            <span>If your qualifications match our needs, we'll contact you for an initial interview</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">3.</span>
            <span>You can check the status of your application in your account once you sign in</span>
          </li>
        </ol>
      </div>

      <div className="flex gap-4 w-full">
        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
          View More Jobs
        </Button>
      </div>
    </div>
  )
}
