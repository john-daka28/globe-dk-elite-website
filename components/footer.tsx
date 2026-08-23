import Link from "next/link"
import {
  ArrowUpRight,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLink } from "@/components/brand"
function handleEnrollClick() {
  const message =
    "Hello GlobeDk Elite Academy. I am interested in your online tutoring services and would like to know more about the available lessons, subjects, fees and class schedules. I would also like to know how I can enrol. Thank you."

  window.open(
    `https://wa.me/263786053315?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  )
}
const footerGroups = [
  {
    title: "Explore",
    links: [
      ["Home", "/"],
      ["About Us", "/about"],
      ["Subjects", "/subjects"],
      ["Timetable", "/timetable"],
      ["Testimonials", "/testimonials"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Get started",
    links: [
     
     
      ["Log in", "/login"],
      ["Create an account", "/signup"],
      ["Forgot password", "/forgot-password"],
      
    ],
  },
] as const

const socialLinks = [
  ["Facebook", "https://www.facebook.com/profile.php?id=61582643098304", Facebook],
  ["LinkedIn", "https://www.linkedin.com/in/john-ariphios-daka-20bb79329/", Linkedin],
  ["YouTube", "https://youtube.com/@johnariphiosdakah?si=kzsj86fbzSmiPZTg", Youtube],
  ["X", "https://x.com/ariphiosdaka", Twitter],
  ["TikTok", "https://vm.tiktok.com/ZS9k7SWw4Bj1x-S5qbX/", Music2],
] as const

export function Footer() {
  return (
    <footer className="border-t border-[#d9d3c8] bg-[#f4f1ea] text-[#14263d]">
      <div className="container py-8 sm:py-10">
        <div className="mb-10 flex flex-col justify-between gap-6 rounded-[1.5rem] bg-[#10243d] px-6 py-7 text-white shadow-xl sm:px-8 sm:py-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e3a56f]">GlobeDk Elite Academy</p>
            <h2 className="mt-2 max-w-xl font-serif text-2xl leading-tight sm:text-3xl">Excellence in Education. Success for Life.</h2>
          </div>
<Button
  onClick={handleEnrollClick}
  size="sm"
  className="cursor-pointer rounded-full bg-[#C65D3A] px-5 text-white shadow-lg shadow-[#C65D3A]/20 hover:bg-[#A94B2F]"
>
  Enroll Now
  <ArrowUpRight
    className="ml-1.5 h-3.5 w-3.5"
    aria-hidden="true"
  />
</Button>        
        </div>

        <div className="grid gap-10 md:grid-cols-[1.25fr_0.85fr_0.85fr_1.2fr] md:gap-8">
          <div className="space-y-4">
            <BrandLink href="/" variant="footer" aria-label="GlobeDk Elite Academy home" />
            <p className="max-w-sm text-sm leading-relaxed text-[#526071]">
              Empowering students in Harare to excel in O-Level and A-Level examinations through expert tutoring.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#14263d]">{group.title}</h2>
              <ul className="space-y-3 text-sm">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-[#526071] transition-colors hover:text-[#b15d2b]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#14263d]">Contact Us</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#b15d2b]" aria-hidden="true" />
                <div className="space-y-1">
                  <a href="tel:+263786053315" className="block text-[#526071] transition-colors hover:text-[#b15d2b]">+263 78 605 3315</a>
                  <a href="tel:+263713225707" className="block text-[#526071] transition-colors hover:text-[#b15d2b]">+263 71 322 5707</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#b15d2b]" aria-hidden="true" />
                <div className="space-y-1 text-[#526071]">
                  <a href="mailto:admission@globedk.co.zw" className="block transition-colors hover:text-[#b15d2b]">admission@globedk.co.zw</a>
                  <a href="mailto:principal@globedk.co.zw" className="block transition-colors hover:text-[#b15d2b]">principal@globedk.co.zw</a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-[#526071]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#b15d2b]" aria-hidden="true" />
                <span>Epworth, Harare, Zimbabwe</span>
              </li>
              <li className="pt-1">
                <div className="flex items-center gap-4">
                  {socialLinks.map(([label, href, Icon]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-[#526071] transition-colors hover:text-[#b15d2b]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#d9d3c8] pt-6 text-sm text-[#526071] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} GlobeDk Elite Academy. All rights reserved.</p>
          <p>Online O-Level &amp; A-Level Lessons</p>
        </div>
      </div>
    </footer>
  )
}
