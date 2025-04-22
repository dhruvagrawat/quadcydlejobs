"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { JobEditor } from "@/components/admin/job-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getJobs } from "@/lib/actions"
import { Loader2 } from "lucide-react"

export default function EditJobPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobs = await getJobs()
        const foundJob = jobs.find((j: any) => j.id === id)

        if (foundJob) {
          setJob(foundJob)
        } else {
          // Job not found, redirect to admin dashboard
          router.push("/admin")
        }
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [id, router])

  const handleJobUpdated = () => {
    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Job</CardTitle>
          <CardDescription>Update the job details</CardDescription>
        </CardHeader>
        <CardContent>
          {job ? (
            <JobEditor
              job={job}
              onJobCreated={() => {}}
              onJobUpdated={handleJobUpdated}
              onCancel={() => router.push("/admin")}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Job not found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
