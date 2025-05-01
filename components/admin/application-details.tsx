"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface ApplicationDetailsProps {
  application: any
  job: any
}

export function ApplicationDetails({ application, job }: ApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">
            {application.first_name} {application.last_name}
          </h3>
          <p className="text-gray-500">
            {application.email} • {application.phone}
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {job?.title || "Unknown Position"}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{application.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{application.phone}</p>
                </div>
                {application.linkedin && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                    <a
                      href={application.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {application.linkedin}
                    </a>
                  </div>
                )}
                {application.portfolio && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Portfolio</p>
                    <a
                      href={application.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {application.portfolio}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {application.resume_link && (
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <a
                    href={application.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <span>View Resume</span>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(application.resume_link)
                    }}
                  >
                    Copy Link
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden h-[400px]">
                  <iframe src={application.resume_link} className="w-full h-full" title="Resume Preview" />
                </div>
              </CardContent>
            </Card>
          )}

          {application.extra_links && application.extra_links.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {application.extra_links.map((link: any, index: number) => (
                    <li key={index}>
                      <span className="font-medium">{link.label}: </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{application.experience}</div>
            </CardContent>
          </Card>

          {application.skills && application.skills.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {application.availability === "immediately"
                    ? "Immediately"
                    : application.availability === "2weeks"
                      ? "2 Weeks Notice"
                      : application.availability === "1month"
                        ? "1 Month Notice"
                        : application.availability}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How They Heard About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{application.heard_from}</p>
              </CardContent>
            </Card>

            {application.timezones && application.timezones.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Preferred Working Timezones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {application.timezones.map((timezone: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {timezone}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
