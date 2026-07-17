import { FILTER_COUNTRIES } from './data/programs'
import { eurFromUsd } from './currency'
import type { Filters } from './types'

export const DEFAULT_FILTERS: Filters = {
  maxTotal: eurFromUsd(30000),
  minPrestige: 5,
  minQol: 3,
  minVisaEase: 3,
  minSummer: 3,
  language: 'all',
  countries: [...FILTER_COUNTRIES],
  focus: [],
  maxTravelHours: 20,
  favoritesOnly: false,
}
