import { JobListings } from "@/components/job-listings"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react"

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4">
                <Image src="/logo.png" alt="Quadcydle Logo" width={50} height={50} className="h-10 w-auto" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quadcydle Careers</h1>
                <p className="text-sm text-gray-600">Join our innovative team</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
                Jobs
              </Link>
              <Link
                href="https://quadcydle.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors flex items-center"
              >
                Contact Us <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-lg mb-6 max-w-2xl">
              At Quadcydle, we're building the future of technology. We're looking for passionate, talented individuals
              to help us on our mission.
            </p>
            <Link
              href="https://quadcydle.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Get in Touch <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h2>
          <JobListings />
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image src="/logo.png" alt="Quadcydle Logo" width={40} height={40} className="h-8 w-auto mr-3" />
                <span className="font-bold text-xl">Quadcydle</span>
              </div>
              <p className="text-gray-600 mb-4">Building innovative solutions for tomorrow's challenges.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  <a href="https://quadcydle.com">Quadcydle Headquarters</a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <a href="mailto:info@quadcydle.com" className="hover:text-primary">
                    hr@quadcydle.com
                  </a>
                </li>
                {/* <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-400" />
                  <span>(555) 123-4567</span>
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link
                    href="https://quadcydle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center"
                  >
                    Main Website <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://quadcydle.com/contact/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center"
                  >
                    Contact Page <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} Quadcydle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
