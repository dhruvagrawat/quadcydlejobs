"use server"

import { createServerClient } from "@/lib/supabase"

// Admin authentication
export async function verifyAdminPassword(password: string): Promise<{ success: boolean }> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("admin_settings").select("password").single()

  if (error) {
    console.error("Error verifying admin password:", error)
    return { success: false }
  }

  return { success: data.password === password }
}

// Job management
export async function getJobs() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
    throw new Error("Failed to fetch jobs")
  }

  return data || []
}

export async function createJob(jobData: any) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("jobs").insert([jobData]).select()

  if (error) {
    console.error("Error creating job:", error)
    throw new Error("Failed to create job")
  }

  return { success: true, job: data[0] }
}

export async function updateJob(jobId: string, jobData: any) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("jobs").update(jobData).eq("id", jobId).select()

  if (error) {
    console.error("Error updating job:", error)
    throw new Error("Failed to update job")
  }

  return { success: true, job: data[0] }
}

export async function deleteJob(jobId: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("jobs").delete().eq("id", jobId)

  if (error) {
    console.error("Error deleting job:", error)
    throw new Error("Failed to delete job")
  }

  return { success: true }
}

// Application management
export async function submitApplication(applicationData: any) {
  const supabase = createServerClient()

  // Transform the data to match the database schema
  const dbData = {
    job_id: applicationData.jobId,
    first_name: applicationData.firstName,
    last_name: applicationData.lastName,
    email: applicationData.email,
    phone: applicationData.phone,
    linkedin: applicationData.linkedIn,
    portfolio: applicationData.portfolio,
    experience: applicationData.experience,
    availability: applicationData.availability,
    heard_from: applicationData.heardFrom,
    timezones: applicationData.timezones,
    extra_links: applicationData.extraLinks,
    skills: applicationData.skills,
    resume_file_name: applicationData.resumeFileName,
    status: "pending",
  }

  const { error } = await supabase.from("applications").insert([dbData])

  if (error) {
    console.error("Error submitting application:", error)
    throw new Error("Failed to submit application")
  }

  return { success: true }
}

export async function getApplicationsByJob(jobId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
    throw new Error("Failed to fetch applications")
  }

  return data || []
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId)

  if (error) {
    console.error("Error updating application status:", error)
    throw new Error("Failed to update application status")
  }

  return { success: true }
}
