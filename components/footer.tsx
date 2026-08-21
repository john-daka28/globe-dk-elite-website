import Link from "next/link"
import { GraduationCap, Phone, Mail, MapPin, Facebook, Linkedin, Youtube, Twitter, Music2 } from "lucide-react"
import Image from "next/image"


export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
           <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden">
  <Image
    src="/Logo.png"
    alt="GlobeDk Elite Academy Logo"
    width={48}
    height={48}
    className="object-contain"
    priority
  />
</div>
              <span className="font-bold text-lg">GlobeDk Elite Academy</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students in Harare to excel in O-Level and A-Level examinations through expert tutoring.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Subjects
                </Link>
              </li>
              <li>
                <Link href="/timetable" className="text-muted-foreground hover:text-foreground transition-colors">
                  Timetable
                </Link>
              </li>
              <li>
                {/* <Link href="/portal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Student Portal
                </Link> */}
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            {/* <h3 className="font-semibold mb-4">Resources</h3> */}
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
               {/* <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Study Materials
                </Link> */}
              </li>
              <li>
                {/* <Link href="/payment" className="text-muted-foreground hover:text-foreground transition-colors">
                  Payment
                </Link> */}
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="space-y-1">
                  <a
                    href="tel:+263786053315"
                    className="text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    +263 78 605 3315
                  </a>
                  <a
                    href="tel:+263713225707"
                    className="text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    +263 71 322 5707
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:johnariphiosd@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                 admission@globedk.co.zw || principal@globedk.co.zw
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Epworth, Harare, Zimbabwe</span>
              </li>

              {/* Social Media */}
              <li className="pt-2">
                <div className="flex items-center gap-4">

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/profile.php?id=61582643098304"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GlobeDk Elite Academy Facebook Page"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/john-ariphios-daka-20bb79329/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="John Ariphios Daka LinkedIn"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@johnariphiosdakah?si=kzsj86fbzSmiPZTg"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="John Ariphios Daka YouTube Channel"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>

                  {/* X */}
                  <a
                    href="https://x.com/ariphiosdaka"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ariphios Daka on X"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://vm.tiktok.com/ZS9k7SWw4Bj1x-S5qbX/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ariphios Daka on TikTok"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Music2 className="h-5 w-5" />
                  </a>

                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GlobeDk Elite Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}