"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getJobs } from "@/lib/actions"
import { JobEditor } from "@/components/admin/job-editor"
import { JobsList } from "@/components/admin/jobs-list"
import { ApplicationsList } from "@/components/admin/applications-list"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("jobs")
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await getJobs()
        setJobs(fetchedJobs)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleLogout = () => {
    // Clear the admin session cookie
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  const handleJobCreated = (newJob: any) => {
    setJobs((prevJobs) => [...prevJobs, newJob])
    setSelectedJobId(null)
  }

  const handleJobUpdated = (updatedJob: any) => {
    setJobs((prevJobs) => prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
    setSelectedJobId(null)
  }

  const handleJobDeleted = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
    setSelectedJobId(null)
  }

  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setActiveTab("create")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
          <TabsTrigger value="applications">Review Applications</TabsTrigger>
          <TabsTrigger value="create">Create/Edit Job</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>Manage your job postings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <JobsList jobs={jobs} onEdit={handleEditJob} onDelete={handleJobDeleted} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Review job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ApplicationsList jobs={jobs} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedJobId ? "Edit Job" : "Create New Job"}</CardTitle>
              <CardDescription>
                {selectedJobId ? "Update the job details below" : "Fill in the details to create a new job posting"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobEditor
                job={selectedJobId ? jobs.find((job) => job.id === selectedJobId) : null}
                onJobCreated={handleJobCreated}
                onJobUpdated={handleJobUpdated}
                onCancel={() => {
                  setSelectedJobId(null)
                  setActiveTab("jobs")
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
