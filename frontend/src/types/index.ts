// ─── Prediction Form ─────────────────────────────────────────────────────────
export interface PredictionForm {
  course: string;
  academic_year: string;
  percentile: number | string;
  category: string;
  gender: string;
  home_university: string;
  district: string;
  preferred_branch: string;
  cap_round: string;
}

// ─── College Result ───────────────────────────────────────────────────────────
export interface College {
  institute_code: number;
  college_name: string;
  branch: string;
  location: string;
  status_type: string;
  cap_round_1_cutoff: number | null;
  cap_round_2_cutoff: number | null;
  cap_round_3_cutoff: number | null;
  cap_round_4_cutoff?: number | null;
  cutoff_percentile: number | null;
  admission_chance: 'safe' | 'target' | 'dream' | 'unknown';
}


// ─── Prediction Response ──────────────────────────────────────────────────────
export interface FiltersMeta {
  districts: string[];
  college_types: string[];
  branches: string[];
}

export interface PredictionResult {
  total: number;
  colleges: College[];
  filters_meta: FiltersMeta;
}

// ─── Metadata (Form Options) ──────────────────────────────────────────────────
export interface Metadata {
  courses: string[];
  academic_years: string[];
  categories: string[];
  cap_rounds: string[];
  universities: string[];
  districts: string[];
  branches: string[];
  genders: string[];
}

// ─── Dashboard: Saved Prediction History ─────────────────────────────────────
export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  form: PredictionForm;
  result: PredictionResult;
}

// ─── Active Filters (Results Page) ───────────────────────────────────────────
export interface ActiveFilters {
  search: string;
  districts: string[];
  college_types: string[];
  branches: string[];
  admission_chances: Array<'safe' | 'target' | 'dream' | 'unknown'>;
  sort: 'chance' | 'cutoff_asc' | 'cutoff_desc' | 'name';
}
