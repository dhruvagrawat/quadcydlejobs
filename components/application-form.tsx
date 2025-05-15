"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitApplication } from "@/lib/actions"
import { Loader2, Github, Linkedin, Globe, Code } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Update the formSchema to include the new fields
const formSchema = z.object({
  resumeLink: z.string().url("Please enter a valid resume URL"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  linkedIn: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  portfolio: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  experience: z.string().min(10, "Please provide more details about your experience"),
  availability: z.enum(["immediately", "2weeks", "1month", "other"]),
  heardFrom: z.string().min(1, "Please let us know how you heard about us"),
})

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

interface ApplicationFormProps {
  job: Job
  onSubmitSuccess: () => void
}

// Common link platforms
const commonPlatforms = [
  { id: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
  { id: "portfolio", label: "Portfolio", icon: Globe, placeholder: "https://yourportfolio.com" },
  { id: "behance", label: "Behance", icon: Code, placeholder: "https://behance.net/username" },
  { id: "dribbble", label: "Dribbble", icon: Code, placeholder: "https://dribbble.com/username" },
  { id: "medium", label: "Medium", icon: Code, placeholder: "https://medium.com/@username" },
]

// Define major timezones grouped by region
const timezoneOptions = [
  { value: "us-eastern", label: "US Eastern (UTC-5/4)" },
  { value: "us-central", label: "US Central (UTC-6/5)" },
  { value: "us-mountain", label: "US Mountain (UTC-7/6)" },
  { value: "us-pacific", label: "US Pacific (UTC-8/7)" },
  { value: "europe-western", label: "Western Europe (UTC+1/2)" },
  { value: "europe-central", label: "Central Europe (UTC+1/2)" },
  { value: "europe-eastern", label: "Eastern Europe (UTC+2/3)" },
  { value: "india", label: "India (UTC+5:30)" },
  { value: "japan", label: "Japan (UTC+9)" },
  { value: "china", label: "China (UTC+8)" },
  { value: "australia-eastern", label: "Australia Eastern (UTC+10/11)" },
]

// Programming languages and skills
const skillOptions = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "React",
  "Angular",
  "Vue.js",
  "Next.js",
  "Node.js",
  "Express",
  "HTML/CSS",
  "Tailwind CSS",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Git",
  "CI/CD",
]

// Update the ApplicationForm component to include the new fields
export function ApplicationForm({ job, onSubmitSuccess }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExtraLinks, setShowExtraLinks] = useState(false)
  const [extraLinks, setExtraLinks] = useState<{ label: string; url: string }[]>([])
  const [newLinkLabel, setNewLinkLabel] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  // Determine if this is a tech job based on title or department
  const isTechJob =
    job.title.toLowerCase().includes("developer") ||
    job.title.toLowerCase().includes("engineer") ||
    job.department.toLowerCase().includes("engineering") ||
    job.title.toLowerCase().includes("tech") ||
    job.department.toLowerCase().includes("tech")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      linkedIn: "",
      portfolio: "",
      resumeLink: "",
      experience: "",
      availability: "2weeks",
      heardFrom: "",
    },
  })

  const handleAddExtraLink = () => {
    if (newLinkLabel && newLinkUrl) {
      try {
        // Basic URL validation
        new URL(newLinkUrl)

        const newLinks = [...extraLinks, { label: newLinkLabel, url: newLinkUrl }]
        setExtraLinks(newLinks)

        // Reset inputs
        setNewLinkLabel("")
        setNewLinkUrl("")
        setSelectedPlatform(null)
      } catch (e) {
        // Invalid URL
        alert("Please enter a valid URL")
      }
    }
  }

  const handleRemoveExtraLink = (index: number) => {
    const newLinks = extraLinks.filter((_, i) => i !== index)
    setExtraLinks(newLinks)
  }

  const handleTimezoneToggle = (timezone: string) => {
    setSelectedTimezones((prev) => (prev.includes(timezone) ? prev.filter((t) => t !== timezone) : [...prev, timezone]))
  }

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handlePlatformSelect = (platform: (typeof commonPlatforms)[0]) => {
    setSelectedPlatform(platform.id)
    setNewLinkLabel(platform.label)
    setNewLinkUrl("")
  }

  useEffect(() => {
    // Reset platform selection when links section is toggled
    if (!showExtraLinks) {
      setSelectedPlatform(null)
      setNewLinkLabel("")
      setNewLinkUrl("")
    }
  }, [showExtraLinks])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real app, this would upload the resume and submit the form data
      // to a database using Prisma
      await submitApplication({
        ...values,
        jobId: job.id,
        jobTitle: job.title,
        resumeLink: values.resumeLink,
        timezones: selectedTimezones,
        extraLinks: extraLinks,
        skills: selectedSkills,
      })

      onSubmitSuccess()
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormDescription>Optional, but recommended</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Portfolio</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourportfolio.com" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="resumeLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume/CV Link *</FormLabel>
              <FormControl>
                <Input placeholder="https://drive.google.com/file/d/your-resume" {...field} required />
              </FormControl>
              <FormDescription>Link to your resume (Google Drive, Dropbox, etc.)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant Experience *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your relevant experience for this position..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tech Skills Section - Only show for tech jobs */}
        {isTechJob && (
          <div>
            <FormLabel>Technical Skills</FormLabel>
            <FormDescription className="mb-3">Select all skills that apply to your experience</FormDescription>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {skillOptions.map((skill) => (
                <div
                  key={skill}
                  className={`flex items-center space-x-2 border rounded-md p-2 cursor-pointer transition-colors ${
                    selectedSkills.includes(skill) ? "bg-primary/10 border-primary" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  <Checkbox id={`skill-${skill}`} checked={selectedSkills.includes(skill)} onCheckedChange={() => {}} />
                  <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer w-full">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timezone Selection - Simplified UI */}
        <div>
          <FormLabel>Preferred Working Timezones</FormLabel>
          <FormDescription className="mb-3">Select all timezones you're comfortable working in</FormDescription>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timezoneOptions.map((timezone) => (
              <div
                key={timezone.value}
                className={`flex items-center space-x-2 border rounded-md p-2 cursor-pointer transition-colors ${
                  selectedTimezones.includes(timezone.value) ? "bg-primary/10 border-primary" : "hover:bg-gray-50"
                }`}
                onClick={() => handleTimezoneToggle(timezone.value)}
              >
                <Checkbox
                  id={timezone.value}
                  checked={selectedTimezones.includes(timezone.value)}
                  onCheckedChange={() => {}}
                />
                <label htmlFor={timezone.value} className="text-sm cursor-pointer w-full">
                  {timezone.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediately" id="immediately" />
                    <Label htmlFor="immediately">Immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2weeks" id="2weeks" />
                    <Label htmlFor="2weeks">2 Weeks Notice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1month" id="1month" />
                    <Label htmlFor="1month">1 Month Notice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extra Links Section - Improved UI */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label>Additional Links</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowExtraLinks(!showExtraLinks)}>
              {showExtraLinks ? "Hide" : "Add Links"}
            </Button>
          </div>

          {showExtraLinks && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-md">
              <FormDescription>Add links to your GitHub, projects, or other relevant profiles</FormDescription>

              {extraLinks.length > 0 && (
                <div className="space-y-2">
                  {extraLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div>
                        <span className="font-medium">{link.label}: </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          {link.url}
                        </a>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveExtraLink(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Common platforms selection */}
              <div className="mb-4">
                <Label className="mb-2 block">Choose a platform</Label>
                <div className="flex flex-wrap gap-2">
                  {commonPlatforms.map((platform) => (
                    <Button
                      key={platform.id}
                      type="button"
                      variant={selectedPlatform === platform.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlatformSelect(platform)}
                      className="flex items-center gap-1"
                    >
                      <platform.icon className="h-4 w-4" />
                      <span>{platform.label}</span>
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={selectedPlatform === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedPlatform("custom")
                      setNewLinkLabel("")
                    }}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="link-label">Link Label</Label>
                  <Input
                    id="link-label"
                    placeholder="GitHub"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    placeholder={
                      selectedPlatform
                        ? commonPlatforms.find((p) => p.id === selectedPlatform)?.placeholder || "https://"
                        : "https://"
                    }
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddExtraLink}
                disabled={!newLinkLabel || !newLinkUrl}
              >
                Add Link
              </Button>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="heardFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about us? *</FormLabel>
              <FormControl>
                <Input placeholder="LinkedIn, Job Board, Referral, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </Form>
  )
}
