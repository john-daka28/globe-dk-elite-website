"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ResourceFiltersProps = {
  resourceTypes: string[]
  subjects: string[]
  levels: string[]
  curricula: string[]
  initialSearch: string
  initialType: string
  initialSubject: string
  initialLevel: string
  initialCurriculum: string
  hasActiveFilters: boolean
}

export function ResourceFilters({
  resourceTypes,
  subjects,
  levels,
  curricula,
  initialSearch,
  initialType,
  initialSubject,
  initialLevel,
  initialCurriculum,
  hasActiveFilters,
}: ResourceFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(currentSearchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      const trimmedValue = value.trim()

      if (trimmedValue) {
        params.set(key, trimmedValue)
      } else {
        params.delete(key)
      }
    })

    const queryString = params.toString()
    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    )
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (search.trim() === initialSearch.trim()) {
        return
      }

      updateFilters({ search })
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [search, initialSearch])

  const clearFilters = () => {
    setSearch("")
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search resources..."
            aria-label="Search resources"
            className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={initialType}
          onChange={(event) => updateFilters({ type: event.target.value })}
          aria-label="Filter by resource type"
          className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 sm:w-40"
        >
          <option value="">All types</option>
          {resourceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={initialSubject}
          onChange={(event) => updateFilters({ subject: event.target.value })}
          aria-label="Filter by subject"
          className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 sm:w-40"
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          value={initialLevel}
          onChange={(event) => updateFilters({ level: event.target.value })}
          aria-label="Filter by level"
          className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 sm:w-36"
        >
          <option value="">All levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          value={initialCurriculum}
          onChange={(event) =>
            updateFilters({ curriculum: event.target.value })
          }
          aria-label="Filter by curriculum"
          className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 sm:w-40"
        >
          <option value="">All curricula</option>
          {curricula.map((curriculum) => (
            <option key={curriculum} value={curriculum}>
              {curriculum}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-medium transition hover:bg-muted"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
