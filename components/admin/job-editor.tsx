"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createJob, updateJob } from "@/lib/actions"
import { Loader2, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const jobFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  type: z.string().min(2, "Job type must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  application_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  last_apply_date: z.date({
    required_error: "Please select a last application date",
  }),
})

type JobFormValues = z.infer<typeof jobFormSchema> & {
  requirements: string[]
}

interface JobEditorProps {
  job: any | null
  onJobCreated: (job: any) => void
  onJobUpdated: (job: any) => void
  onCancel: () => void
}

export function JobEditor({ job, onJobCreated, onJobUpdated, onCancel }: JobEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      application_url: "",
      requirements: [],
      last_apply_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    },
  })

  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        description: job.description,
        application_url: job.application_url || "",
        last_apply_date: job.last_apply_date
          ? new Date(job.last_apply_date)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      setRequirements(job.requirements || [])
    }
  }, [job, form])

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addRequirement()
    }
  }

  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true)

    try {
      const jobData = {
        ...values,
        requirements,
      }

      let result

      if (job) {
        // Update existing job
        result = await updateJob(job.id, jobData)
        if (result.success) {
          onJobUpdated(result.job)
        }
      } else {
        // Create new job
        result = await createJob(jobData)
        if (result.success) {
          onJobCreated(result.job)
        }
      }
    } catch (error) {
      console.error("Error saving job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <FormControl>
                  <Input placeholder="Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA (Remote)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="last_apply_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Application Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Applications will be accepted until this date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job role, responsibilities, and what you're looking for in a candidate..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Requirements *</FormLabel>
          <div className="flex space-x-2">
            <Input
              placeholder="Add a requirement"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={addRequirement} disabled={!newRequirement.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <FormDescription>Press Enter or click the plus button to add a requirement</FormDescription>

          {requirements.length > 0 && (
            <div className="mt-4 space-y-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-2">
                  <span>{req}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="application_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External Application URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/apply" {...field} />
              </FormControl>
              <FormDescription>Leave blank to use the built-in application form</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {job ? "Updating..." : "Creating..."}
              </>
            ) : job ? (
              "Update Job"
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
