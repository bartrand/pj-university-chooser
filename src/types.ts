export type Region = 'europe' | 'canada'

export type Language = 'english' | 'bilingual' | 'french'

/** How hard entry is for applicants with little/no stage experience. */
export type EntryBarrier = 'open' | 'portfolio' | 'audition'

/** Focus tags vary by profile (Earth Science vs Lit/Arts/Drama). */
export type FocusTag =
  | 'paleontology'
  | 'fieldwork'
  | 'petrology'
  | 'geochemistry'
  | 'geophysics'
  | 'climatology'
  | 'geohazards'
  | 'mapping'
  | 'geoarchaeology'
  | 'marine'
  | 'literature'
  | 'creative-writing'
  | 'drama'
  | 'theatre'
  | 'film-media'
  | 'communications'
  | 'arts-general'
  | 'performance'

export interface Program {
  id: string
  region: Region
  university: string
  city: string
  country: string
  /** Wikimedia Commons filename for a campus photo (no "File:" prefix). */
  universityPhoto: string
  /** Wikimedia Commons filename for a city/area photo (no "File:" prefix). */
  cityPhoto: string
  program: string
  language: Language
  tuitionEurMin: number
  tuitionEurMax: number
  tuitionNote?: string
  /**
   * Optional: same-province college/CEGEP feeder tuition for years 1–2
   * (domestic Canadian citizen ballpark), if a 2+2-style path is used.
   */
  collegeFeederTuitionNote?: string
  /** Est. student living costs EUR/year (shared rent + food + transit/basics). */
  livingCostEur: number
  livingCostNote?: string
  /** Optional all-in package total (tuition + housing + meals), EUR/year. */
  allInclusiveTotalEur?: number
  /**
   * Prestige 1–10: field recognition for further education and relevant careers.
   * Meaning is profile-specific (e.g. geoscience vs arts/humanities).
   */
  prestige: number
  /**
   * Pathway strength 1–10: how well this bachelor sets up a Master’s / first career step.
   * Canada / Europe / Overall meanings are profile-specific in the UI.
   */
  pathwayCanada: number
  pathwayEurope: number
  pathwayOverall: number
  /** International student quality of life, 1–5. */
  qolScore: number
  qolNotes: string[]
  /** Ease of admission (incl. grades) + visa for a Canadian passport holder, 1–5. */
  visaEaseScore: number
  visaEaseNotes: string[]
  /**
   * Summer opportunities 1–5: field/co-op/arts/performance/relevant paid jobs.
   */
  summerScore: number
  summerNotes: string[]
  travelHoursFromLca: number
  travelRoute: string
  /**
   * Optional: entry barrier for performance programs (Solange).
   * Omitted on pure academics / PJ geoscience rows.
   */
  entryBarrier?: EntryBarrier
  /** One-line note shown next to the entry badge. */
  entryBarrierNote?: string
  focus: FocusTag[]
  focusSummary: string
  highlights: string[]
  visaEntry: string
  /** Official university program page (best available English landing page). */
  programUrl: string
  lat: number
  lng: number
}

export interface Filters {
  /** Max estimated full-program total = (tuition + living) × years (EUR). */
  maxTotal: number
  /** Minimum prestige for further education + field recognition (1–10). */
  minPrestige: number
  /** Minimum international student QoL (1–5). */
  minQol: number
  /** Minimum ease of admission/visa for Canadians (1–5). */
  minVisaEase: number
  /** Minimum summer/field/co-op opportunity score (1–5). */
  minSummer: number
  language: 'all' | Language
  /** Selected countries (all on by default, including Canada). */
  countries: string[]
  focus: FocusTag[]
  /** Max travel from LCA (hours) — applies to both Europe and Canada. */
  maxTravelHours: number
  /** When true, only show favorited programs. */
  favoritesOnly: boolean
  /**
   * Solange: hide conservatoire / audition-gated programs.
   * Ignored for programs without entryBarrier (e.g. PJ).
   */
  hideAuditionGated: boolean
}
