import Image from "next/image"
import Link from "next/link"
import type { ComponentProps } from "react"

interface BrandLinkProps extends Omit<ComponentProps<typeof Link>, "children"> {
  variant?: "header" | "mobile" | "footer"
}

const variantStyles = {
  header: "h-[3.6rem] w-[9.4rem] sm:h-[4.2rem] sm:w-[10.5rem]",
  mobile: "h-[3.25rem] w-[8.6rem] sm:h-[4rem] sm:w-[10rem]",
  footer: "h-[6rem] w-[5.1rem] sm:h-[6.8rem] sm:w-[5.7rem]",
} as const

export function BrandLink({ variant = "header", className, ...props }: BrandLinkProps) {
  const horizontal = variant !== "footer"

  return (
    <Link {...props} className={`group flex shrink-0 items-center ${variantStyles[variant]} ${className ?? ""}`}>
      <Image
        src={horizontal ? "/Logo-horizontal-original.png" : "/Logo-original-transparent.png"}
        alt="GlobeDk Elite Academy"
        width={horizontal ? 1004 : 871}
        height={horizontal ? 460 : 1022}
        className="block h-full w-full object-contain"
        priority={variant !== "footer"}
      />
    </Link>
  )
}
