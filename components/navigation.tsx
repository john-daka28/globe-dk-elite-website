"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/subjects", label: "Subjects" },
    { href: "/timetable", label: "Timetable" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ]

  // Navigate user to enroll page
  const handleEnrollClick = () => {
    router.push("/enroll")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
<Link href="/" className="flex items-center gap-2 font-bold text-xl">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary overflow-hidden">
    <Image 
      src="/Logo.png" 
      alt="GlobeDk Elite Academy Logo" 
      width={40} 
      height={40} 
      className="object-contain p-1"
      priority
    />
  </div>
  <span className="hidden sm:inline">GlobeDk Elite Academy</span>
</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <Button onClick={handleEnrollClick} size="sm" className="ml-2">
              Enroll Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/40">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Button
              onClick={() => {
                setIsOpen(false)
                handleEnrollClick()
              }}
              className="w-full"
            >
              Enroll Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
