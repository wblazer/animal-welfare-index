import data from "../data/catalog.json";

export type CatalogValue = "high" | "useful" | "specialized" | "unrated";

export interface CatalogCategory {
  id: string;
  title: string;
  description: string;
}

export interface CatalogReference {
  label: string;
  url: string;
}

export interface CatalogAssessment {
  value: CatalogValue;
  notes?: string;
}

export interface CatalogEntry {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  annotation: string;
  topics: string[];
  evidence_type: string;
  access: string;
  reuse: string;
  license: {
    status: "open" | "mixed" | "restricted" | "unknown";
    label: string;
    evidence_url: string | null;
    scope: string;
  };
  references: CatalogReference[];
  policy_urls?: CatalogReference[];
  assessment: CatalogAssessment;
  link_pattern?: string;
}

export interface Catalog {
  name: string;
  description: string;
  introduction: string;
  updated: string;
  categories: CatalogCategory[];
  assessment_scale: Record<CatalogValue, string>;
  entries: CatalogEntry[];
}

function validateCatalog(value: Catalog): Catalog {
  const categoryIds = new Set(value.categories.map((category) => category.id));
  const entryIds = new Set<string>();

  if (categoryIds.size !== value.categories.length) {
    throw new Error("Catalog contains duplicate category IDs");
  }

  for (const entry of value.entries) {
    if (entryIds.has(entry.id)) {
      throw new Error(`Catalog contains duplicate entry ID: ${entry.id}`);
    }
    if (!categoryIds.has(entry.category)) {
      throw new Error(`Unknown category for ${entry.id}: ${entry.category}`);
    }
    if (!entry.url.startsWith("https://")) {
      throw new Error(`Non-HTTPS primary URL for ${entry.id}`);
    }
    for (const reference of entry.references) {
      if (!reference.url.startsWith("https://")) {
        throw new Error(`Non-HTTPS reference URL for ${entry.id}: ${reference.url}`);
      }
    }
    entryIds.add(entry.id);
  }

  return value;
}

// Public navigation tags are curated separately from the historical audit keywords.
const tagVocabulary = [
  "Ethics", "Sentience", "Speciesism", "Farmed animals", "Aquatic animals",
  "Invertebrates", "Wild animals", "Companion animals", "Animal research",
  "Welfare measurement", "Positive welfare", "Suffering", "Scale and statistics",
  "Law", "Economics", "Future welfare",
] as const;
type Tag = typeof tagVocabulary[number];
const sourceTags: Record<string, Tag[]> = {
  "alice-crary": ["Ethics", "Speciesism"],
  "andy-masley": ["Ethics", "Suffering", "Scale and statistics"],
  "stanford-animal-consciousness": ["Sentience", "Ethics"],
  "animal-studies-journal": ["Ethics", "Speciesism", "Law"],
  "between-the-species": ["Ethics", "Speciesism"],
  "bold-reasoning-with-peter-singer": ["Ethics", "Speciesism", "Farmed animals"],
  "good-thoughts": ["Ethics", "Suffering"],
  "josh-milburn": ["Ethics", "Farmed animals"],
  "moral-circulation": ["Ethics", "Speciesism"],
  "moral-law-within": ["Ethics", "Farmed animals"],
  "new-york-declaration": ["Sentience", "Invertebrates"],
  "oxford-centre-for-animal-ethics": ["Ethics", "Speciesism"],
  "relations-beyond-anthropocentrism": ["Ethics", "Speciesism", "Wild animals"],
  "searching-animal-sentience": ["Sentience", "Suffering", "Positive welfare"],
  "sentience-institute": ["Speciesism", "Ethics", "Farmed animals"],
  "shadow-price": ["Economics", "Farmed animals", "Ethics"],
  "animal-welfare": ["Welfare measurement", "Suffering", "Positive welfare"],
  "frontiers-in-veterinary-science-animal-behavior-and-welfare": ["Welfare measurement", "Positive welfare"],
  "massey-animal-welfare-science-and-bioethics-centre": ["Welfare measurement", "Positive welfare", "Suffering"],
  "our-world-in-data": ["Scale and statistics", "Farmed animals", "Aquatic animals"],
  "fao": ["Scale and statistics", "Farmed animals", "Aquatic animals"],
  "faunalytics": ["Farmed animals", "Wild animals", "Speciesism"],
  "coefficient-giving-farm-animal-welfare-newsletter": ["Farmed animals", "Economics", "Law"],
  "inside-animal-ag": ["Farmed animals", "Suffering"],
  "marina-bolotnikova": ["Farmed animals", "Ethics", "Law"],
  "open-philanthropy-farm-animal-welfare": ["Farmed animals", "Economics"],
  "rspca-welfare-standards": ["Farmed animals", "Aquatic animals", "Positive welfare"],
  "sentient-media": ["Farmed animals", "Aquatic animals", "Law"],
  "welfare-footprint": ["Welfare measurement", "Suffering", "Farmed animals"],
  "animal-welfare-observatory": ["Aquatic animals", "Farmed animals", "Law"],
  "aquatic-life-institute": ["Aquatic animals", "Farmed animals", "Law"],
  "crustacean-compassion": ["Invertebrates", "Aquatic animals", "Sentience", "Law"],
  "fish-welfare-initiative": ["Aquatic animals", "Farmed animals", "Welfare measurement"],
  "fishcount": ["Aquatic animals", "Scale and statistics", "Suffering"],
  "fishethogroup": ["Aquatic animals", "Farmed animals", "Positive welfare"],
  "insect-welfare-research-society": ["Invertebrates", "Sentience", "Farmed animals"],
  "rethink-priorities-animal-welfare": ["Welfare measurement", "Invertebrates", "Sentience", "Ethics"],
  "rethinking-insects-as-alternative-protein": ["Invertebrates", "Farmed animals", "Ethics"],
  "shrimp-welfare-project": ["Invertebrates", "Aquatic animals", "Farmed animals", "Suffering"],
  "the-welfare-of-farmed-nile-tilapia": ["Aquatic animals", "Farmed animals", "Welfare measurement", "Positive welfare"],
  "bentham-s-newsletter": ["Ethics", "Wild animals", "Invertebrates", "Farmed animals"],
  "wild-animal-initiative": ["Wild animals", "Welfare measurement", "Positive welfare"],
  "wild-animal-welfare-committee": ["Wild animals", "Welfare measurement", "Law"],
  "avma-animal-welfare": ["Companion animals", "Suffering"],
  "canadian-council-on-animal-care-handbooks": ["Animal research", "Welfare measurement"],
  "eu-alures": ["Animal research", "Scale and statistics", "Suffering"],
  "eurl-ecvam": ["Animal research", "Law"],
  "nc3rs": ["Animal research", "Welfare measurement"],
  "prepare-guidelines": ["Animal research", "Ethics"],
  "welfare-assessment-for-laboratory-animals": ["Animal research", "Welfare measurement", "Suffering"],
  "animal-legal-historical-center": ["Law", "Companion animals", "Farmed animals"],
  "nonhuman-rights-project": ["Law", "Ethics", "Sentience"],
  "better-life-better-world": ["Ethics", "Farmed animals"],
  "effective-altruism-forum-animal-welfare": ["Ethics", "Economics", "Welfare measurement"],
  "sentientism": ["Ethics", "Sentience", "Speciesism"],
  "animal-ethics": ["Ethics", "Speciesism", "Wild animals", "Sentience"],
  "center-for-reducing-suffering": ["Ethics", "Suffering", "Wild animals", "Future welfare"],
  "jeff-sebo": ["Ethics", "Sentience", "Future welfare"],
  "reducing-suffering": ["Suffering", "Wild animals", "Invertebrates", "Ethics"],
  "magnus-vinding": ["Suffering", "Speciesism", "Wild animals", "Future welfare"],
  "simon-knutsson": ["Suffering", "Invertebrates", "Ethics"],
  "manu-herran": ["Sentience", "Suffering", "Wild animals"],
  "wild-animal-suffering": ["Wild animals", "Suffering", "Scale and statistics"],
  "wild-animal-welfare-bibliography": ["Wild animals", "Ethics"],
  "timeline-wild-animal-suffering": ["Wild animals", "Ethics"],
  "food-impacts": ["Farmed animals", "Welfare measurement", "Scale and statistics"],
  "socrethics": ["Suffering", "Sentience", "Ethics"],
  "importance-of-wild-animal-suffering": ["Wild animals", "Suffering", "Scale and statistics"],
  "hedweb": ["Suffering", "Future welfare", "Positive welfare", "Ethics"],
};
const { categories, entries, ...metadata } = validateCatalog(data as Catalog);
export const catalog = {
  ...metadata,
  entries: entries.map(({ category, topics, ...entry }) => {
    const tags = sourceTags[entry.id];
    if (!tags || tags.length < 2 || tags.length > 4 || new Set(tags).size !== tags.length || tags.some(tag => !tagVocabulary.includes(tag))) {
      throw new Error(`Assign 2–4 distinct vocabulary tags to ${entry.id}`);
    }
    return { ...entry, tags };
  }),
};
