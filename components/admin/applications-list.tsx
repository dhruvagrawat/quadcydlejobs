"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getApplicationsByJob, updateApplicationStatus } from "@/lib/actions"
import { Loader2, Eye } from "lucide-react"
import { ApplicationDetails } from "./application-details"

interface ApplicationsListProps {
  jobs: any[]
}

export function ApplicationsList({ jobs }: ApplicationsListProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(selectedJobId)
    } else {
      setApplications([])
    }
  }, [selectedJobId])

  const fetchApplications = async (jobId: string) => {
    setIsLoading(true)
    try {
      const result = await getApplicationsByJob(jobId)
      setApplications(result)
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application)
    setShowDetailsDialog(true)
  }

  const handleStatusChange = async (applicationId: string, status: string) => {
    setStatusUpdating(applicationId)
    try {
      const result = await updateApplicationStatus(applicationId, status)
      if (result.success) {
        // Update the application in the local state
        setApplications(applications.map((app) => (app.id === applicationId ? { ...app, status } : app)))
      }
    } catch (error) {
      console.error("Error updating application status:", error)
    } finally {
      setStatusUpdating(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "reviewing":
        return "secondary"
      case "interviewed":
        return "outline"
      case "rejected":
        return "destructive"
      case "hired":
        return "success"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="job-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Job
        </label>
        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
          <SelectTrigger id="job-select" className="w-full">
            <SelectValue placeholder="Select a job to view applications" />
          </SelectTrigger>
          <SelectContent>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedJobId && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No applications found for this job</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.first_name} {application.last_name}
                      </TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{formatDate(application.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          {statusUpdating === application.id ? (
                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          ) : (
                            <Select
                              value={application.status}
                              onValueChange={(value) => handleStatusChange(application.id, value)}
                            >
                              <SelectTrigger className="h-7 w-[130px] ml-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewing">Reviewing</SelectItem>
                                <SelectItem value="interviewed">Interviewed</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewApplication(application)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedApplication && formatDate(selectedApplication.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <ApplicationDetails
              application={selectedApplication}
              job={jobs.find((job) => job.id === selectedApplication.job_id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
