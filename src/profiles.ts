import { eurFromUsd } from './currency'
import { FOCUS_LABELS, programs as pjPrograms } from './data/programs'
import {
  SOLANGE_FOCUS_LABELS,
  solangePrograms,
} from './data/solangePrograms'
import type { Filters, Language, Program } from './types'

export type ProfileId = 'pj' | 'solange'

export interface Profile {
  id: ProfileId
  brand: string
  tagline: string
  documentTitle: string
  favoritesKey: string
  focusLabels: Record<string, string>
  programs: Program[]
  /** Filter UI copy */
  prestigeHint: string
  pathwayCanadaHint: string
  pathwayEuropeHint: string
  summerFilterLabel: string
  summerHint: string
  summerFallbackNote: string
  travelHint: string
  prestigeFallbackNote: string
  pathwayCanadaStrong: string
  pathwayEuropeStrong: string
  pathwayBalanced: string
  /** Max full-program budget slider (USD). Higher for UK-inclusive lists. */
  budgetMaxUsd: number
  /** Default max full-program total (USD) when opening this profile. */
  defaultMaxTotalUsd: number
  /**
   * Language filter chips for this profile.
   * Solange is English-only — French / bilingual are non-starters.
   */
  languageOptions: { value: 'all' | Language; label: string }[]
  /** Default language filter when opening / resetting this profile. */
  defaultLanguage: 'all' | Language
}

function filterCountriesFor(programs: Program[]): string[] {
  const europe = [
    ...new Set(
      programs.filter((p) => p.region === 'europe').map((p) => p.country),
    ),
  ].sort()
  return ['Canada', ...europe]
}

export const PROFILES: Record<ProfileId, Profile> = {
  pj: {
    id: 'pj',
    brand: 'PJ University Chooser',
    tagline: 'Earth science · Fall 2027 · Europe + Canada',
    documentTitle: 'PJ University Chooser',
    favoritesKey: 'pj-uni-favorites',
    focusLabels: FOCUS_LABELS,
    programs: pjPrograms,
    prestigeHint:
      'Further education (Master’s/PhD) and geoscience workforce recognition',
    pathwayCanadaHint: 'Canadian MSc / geoscience jobs',
    pathwayEuropeHint: 'EU/EEA MSc / careers (incl. other countries)',
    summerFilterLabel: 'Min summer field / co-op / jobs',
    summerHint: 'Field camps, co-op, or relevant paid summer work during the degree',
    summerFallbackNote: 'Field / co-op / paid summer options',
    travelHint: 'Typical door-to-door time from Larnaca (home base)',
    prestigeFallbackNote:
      'Further education + geoscience workforce recognition',
    pathwayCanadaStrong: 'Stronger signal for Canadian MSc / geoscience jobs',
    pathwayEuropeStrong: 'Stronger signal for EU/EEA MSc / careers',
    pathwayBalanced: 'Balanced mobility for Canada and Europe next steps',
    budgetMaxUsd: 110000,
    defaultMaxTotalUsd: 100000,
    languageOptions: [
      { value: 'all', label: 'All' },
      { value: 'english', label: 'English' },
      { value: 'bilingual', label: 'FR/EN bilingual' },
      { value: 'french', label: 'French' },
    ],
    defaultLanguage: 'all',
  },
  solange: {
    id: 'solange',
    brand: 'Solange University Chooser',
    tagline:
      'Lit · Arts · Drama · Theatre · Communications · Fall 2028 · English-speaking focus',
    documentTitle: 'Solange University Chooser',
    favoritesKey: 'solange-uni-favorites',
    focusLabels: SOLANGE_FOCUS_LABELS,
    programs: solangePrograms,
    prestigeHint:
      'Further education (Master’s) and arts / humanities / performance recognition',
    pathwayCanadaHint: 'Canadian MA / arts, media, teaching, writing careers',
    pathwayEuropeHint: 'UK / Ireland / EU MA / arts and cultural careers',
    summerFilterLabel: 'Min summer arts / performance / jobs',
    summerHint:
      'Festivals, theatre, internships, or relevant paid summer work during the degree',
    summerFallbackNote: 'Arts / performance / paid summer options',
    travelHint:
      'Typical door-to-door time from Larnaca (Cyprus home base)',
    prestigeFallbackNote:
      'Further education + arts / humanities recognition',
    pathwayCanadaStrong:
      'Stronger signal for Canadian MA / arts and writing careers',
    pathwayEuropeStrong:
      'Stronger signal for UK / Ireland / EU MA / cultural careers',
    pathwayBalanced: 'Balanced mobility for Canada and Europe / UK next steps',
    // UK international Arts fees need a higher ceiling
    budgetMaxUsd: 180000,
    defaultMaxTotalUsd: 160000,
    languageOptions: [{ value: 'english', label: 'English only' }],
    defaultLanguage: 'english',
  },
}

export const PROFILE_STORAGE_KEY = 'uni-chooser-active-profile'

export function isProfileId(value: string): value is ProfileId {
  return value === 'pj' || value === 'solange'
}

export function defaultFiltersFor(profile: Profile): Filters {
  return {
    maxTotal: eurFromUsd(profile.defaultMaxTotalUsd),
    minPrestige: 5,
    minQol: 3,
    minVisaEase: 3,
    minSummer: 3,
    language: profile.defaultLanguage,
    countries: filterCountriesFor(profile.programs),
    focus: [],
    maxTravelHours: 20,
    favoritesOnly: false,
    // Solange: hide audition conservatoires by default (improv-only fit)
    hideAuditionGated: profile.id === 'solange',
  }
}

export function countriesForProfile(profile: Profile): string[] {
  return filterCountriesFor(profile.programs)
}
