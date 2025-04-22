"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if admin is logged in
    const checkAuth = () => {
      const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
      const adminSession = cookies.find((cookie) => cookie.startsWith("admin_session="))

      if (adminSession && adminSession.split("=")[1] === "true") {
        setIsAuthenticated(true)
      } else if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  // If on login page, just render children
  if (pathname === "/admin/login") {
    return children
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Render admin layout with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <nav className="mt-4">
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md ${pathname === "/admin" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/jobs/new"
                  className={`px-3 py-2 rounded-md ${pathname === "/admin/jobs/new" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  Create Job
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/applications"
                  className={`px-3 py-2 rounded-md ${pathname.startsWith("/admin/applications") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  Applications
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
