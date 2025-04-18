"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplicationModal } from "@/components/application-modal"
import { MapPin, Clock, Loader2 } from "lucide-react"
import { getJobs } from "@/lib/actions"

export function JobListings() {
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    type: "",
  })

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

  // Extract unique values for filters
  const departments = [...new Set(jobs.map((job) => job.department))]
  const locations = [...new Set(jobs.map((job) => job.location))]
  const jobTypes = [...new Set(jobs.map((job) => job.type))]

  const handleApply = (job: any) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleExternalApply = (url: string) => {
    window.open(url, "_blank")
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = filters.department === "" || job.department === filters.department
    const matchesLocation = filters.location === "" || job.location === filters.location
    const matchesType = filters.type === "" || job.type === filters.type

    return matchesSearch && matchesDepartment && matchesLocation && matchesType
  })

  const resetFilters = () => {
    setFilters({
      department: "",
      location: "",
      type: "",
    })
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for jobs..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="department-filter"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location-filter"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              id="type-filter"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(filters.department !== "" || filters.location !== "" || filters.type !== "" || searchQuery !== "") && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>

      {/* Job listings */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <Badge variant="outline">{job.type}</Badge>
                </div>
                <div className="text-sm text-gray-500">{job.department}</div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4">{job.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index} className="text-sm">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                {job.application_url ? (
                  <Button className="w-full" onClick={() => handleExternalApply(job.application_url)}>
                    Apply External
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleApply(job)}>
                    Apply Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      {selectedJob && <ApplicationModal job={selectedJob} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
