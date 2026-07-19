import { defaultFiltersFor, PROFILES } from './profiles'
import type { Filters } from './types'

/** Default filters for the PJ profile (legacy import sites). */
export const DEFAULT_FILTERS: Filters = defaultFiltersFor(PROFILES.pj)
