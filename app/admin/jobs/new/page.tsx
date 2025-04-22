"use client"
import { useRouter } from "next/navigation"
import { JobEditor } from "@/components/admin/job-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateJobPage() {
  const router = useRouter()

  const handleJobCreated = () => {
    router.push("/admin")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job</CardTitle>
          <CardDescription>Fill out the form to create a new job listing</CardDescription>
        </CardHeader>
        <CardContent>
          <JobEditor
            job={null}
            onJobCreated={handleJobCreated}
            onJobUpdated={() => {}}
            onCancel={() => router.push("/admin")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
