export type Region = 'europe' | 'canada'

export type Language = 'english' | 'bilingual'

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
  /** Est. student living costs EUR/year (shared rent + food + transit/basics). */
  livingCostEur: number
  livingCostNote?: string
  /** Optional all-in package total (tuition + housing + meals), EUR/year. */
  allInclusiveTotalEur?: number
  /** Earth Sciences / geology program strength 1–10 (not overall university rank). */
  prestige: number
  /** International student quality of life, 1–5. */
  qolScore: number
  qolNotes: string[]
  /** Ease of admission (incl. grades) + visa for a Canadian passport holder, 1–5. */
  visaEaseScore: number
  visaEaseNotes: string[]
  /**
   * Summer opportunities 1–5: fieldwork, co-op, relevant paid jobs during the degree.
   */
  summerScore: number
  summerNotes: string[]
  travelHoursFromLca: number
  travelRoute: string
  focus: FocusTag[]
  focusSummary: string
  highlights: string[]
  visaEntry: string
  lat: number
  lng: number
  /** Tuition above the ~€3,400 / year target. */
  overBudget?: boolean
}

export interface Filters {
  /** Max estimated total = tuition + living (EUR/year). */
  maxTotal: number
  /** Minimum Earth Sciences program prestige (1–10). */
  minPrestige: number
  /** Minimum international student QoL (1–5). */
  minQol: number
  /** Minimum ease of admission/visa for Canadians (1–5). */
  minVisaEase: number
  /** Minimum summer/field/co-op opportunity score (1–5). */
  minSummer: number
  language: 'all' | Language
  /** Selected countries for Europe (all on by default). Ignored for Canada. */
  countries: string[]
  focus: FocusTag[]
  /** Max travel from LCA (hours) — applies to both Europe and Canada. */
  maxTravelHours: number
  /** When true, only show favorited programs. */
  favoritesOnly: boolean
}
