import { JobListings } from "@/components/job-listings"

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Careers</h1>
          <p className="mt-2 text-lg text-gray-600">Join our team and help us build the future</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h2>
          <JobListings />
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
