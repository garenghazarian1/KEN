import { ADMIN_PUBLIC_BASE_URL, BUSINESS_SLUG } from "@/config/constants";

/** Admin apply route rejects files larger than this. */
export const MAX_APPLY_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_APPLY_FILE_LABEL = "5 MB";

/** Same pattern the admin public job slug uses. */
export const PUBLIC_JOB_SLUG_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

const ADDRESS_KEYS = [
  "addressCountry",
  "addressCity",
  "addressArea",
  "addressStreet",
  "addressBuilding",
  "addressVilla",
  "addressZip",
];

const FIELD_KEYS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  ...ADDRESS_KEYS,
  "linkedIn",
  "website",
  "github",
  "twitter",
  "otherSocial",
  "yearsExperience",
  "currentTitle",
  "salaryExpectation",
  "noticePeriod",
  "relocation",
  "workAuthorization",
  "availability",
  "coverLetter",
];

const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone / mobile",
  addressCountry: "Country",
  addressCity: "City",
  addressArea: "Area / district",
  addressStreet: "Street",
  addressBuilding: "Building",
  addressVilla: "Villa / unit",
  addressZip: "ZIP / postal code",
  linkedIn: "LinkedIn",
  website: "Website / portfolio",
  github: "GitHub",
  twitter: "X (Twitter)",
  otherSocial: "Other social link",
  yearsExperience: "Years of experience",
  currentTitle: "Current job title",
  salaryExpectation: "Salary expectation",
  noticePeriod: "Notice period",
  relocation: "Relocation",
  workAuthorization: "Work authorization",
  availability: "Availability / start date",
  coverLetter: "Cover letter",
};

const EMPLOYMENT_LABELS = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  temporary: "Temporary",
  internship: "Internship",
  freelance: "Freelance",
};

const WORK_MODEL_LABELS = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

const ADDRESS_SET = new Set(ADDRESS_KEYS);

export function isPublicJobSlug(slug) {
  return typeof slug === "string" && slug.length <= 200 && PUBLIC_JOB_SLUG_RE.test(slug);
}

export function englishText(translations, fallback) {
  const en =
    translations && typeof translations.en === "string" ? translations.en.trim() : "";
  if (en) return en;
  return typeof fallback === "string" ? fallback.trim() : "";
}

export function countryLabel(raw) {
  if (typeof raw !== "string" || !raw.trim()) return "";
  const value = raw.trim();
  if (/^[a-z]{2}$/i.test(value)) {
    try {
      const name = new Intl.DisplayNames(["en"], { type: "region" }).of(value.toUpperCase());
      if (name && name.toUpperCase() !== value.toUpperCase()) return name;
    } catch {
      return value;
    }
  }
  return value;
}

export function locationLine(city, country) {
  return [typeof city === "string" ? city.trim() : "", countryLabel(country)]
    .filter(Boolean)
    .join(", ");
}

export function isPastDeadline(iso, now = new Date()) {
  if (!iso) return false;
  const deadline = new Date(iso);
  if (Number.isNaN(deadline.getTime())) return false;
  return now > deadline;
}

export function formatDeadline(iso) {
  if (!iso) return "";
  const deadline = new Date(iso);
  if (Number.isNaN(deadline.getTime())) return "";
  return deadline.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Admin media fields are path-only. Leave absolute URLs alone. */
export function absoluteAdminUrl(path) {
  if (typeof path !== "string" || !path.trim()) return null;
  const value = path.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${ADMIN_PUBLIC_BASE_URL}${value}`;
}

function optionLabel(map, value) {
  if (typeof value !== "string" || !value) return "";
  return map[value] || value.replaceAll("_", " ");
}

function rule(fields, key) {
  const spec = fields?.[key];
  return {
    key,
    label: FIELD_LABELS[key] || key,
    required: Boolean(spec?.required),
    kind:
      key === "email"
        ? "email"
        : key === "coverLetter"
          ? "textarea"
          : key === "workAuthorization"
            ? "radio"
            : key === "availability"
              ? "date"
              : "text",
    maxLength:
      key === "addressStreet" ? 500 : key === "addressZip" ? 64 : ADDRESS_SET.has(key) ? 200 : undefined,
    autoComplete:
      key === "email"
        ? "email"
        : key === "addressCountry"
          ? "country-name"
          : key === "addressCity"
            ? "address-level2"
            : key === "addressZip"
              ? "postal-code"
              : key === "addressStreet" ||
                  key === "addressArea" ||
                  key === "addressBuilding" ||
                  key === "addressVilla"
                ? "address-line1"
                : undefined,
  };
}

/**
 * Ordered apply controls from the job API formConfig.
 * Address keys collapse into one group. Disabled keys are omitted.
 * @param {{ fields?: Record<string, { enabled?: boolean, required?: boolean }> } | null | undefined} formConfig
 */
export function applyFields(formConfig) {
  const fields = formConfig?.fields ?? {};
  const enabled = (key) => Boolean(fields[key]?.enabled);
  const list = [];

  for (const key of FIELD_KEYS) {
    if (ADDRESS_SET.has(key)) {
      if (key !== "addressCountry") continue;
      const addressFields = ADDRESS_KEYS.filter(enabled).map((addressKey) =>
        rule(fields, addressKey)
      );
      if (addressFields.length > 0) {
        list.push({ key: "address", kind: "address", label: "Address", fields: addressFields });
      }
      continue;
    }
    if (!enabled(key)) continue;
    list.push(rule(fields, key));
  }

  return list;
}

function labeledList(values, labels) {
  if (!Array.isArray(values) || values.length === 0) return "";
  return values.map((value) => optionLabel(labels, value)).filter(Boolean).join(", ");
}

/** Facts in the admin public page order. Salary only when the job says to show it. */
export function jobFacts(job, now = new Date()) {
  const facts = [];
  const employment = labeledList(job?.employmentTypes, EMPLOYMENT_LABELS);
  if (employment) facts.push({ key: "employment", label: "Employment type", value: employment });

  const work = labeledList(job?.workModels, WORK_MODEL_LABELS);
  if (work) facts.push({ key: "work", label: "Work model", value: work });

  const salary = englishText(job?.salaryTextTranslations, job?.salaryText);
  if (job?.showSalary && salary) {
    facts.push({ key: "salary", label: "Compensation", value: salary });
  }

  const deadline = formatDeadline(job?.applicationDeadline);
  if (deadline) {
    facts.push({
      key: "deadline",
      label: isPastDeadline(job.applicationDeadline, now) ? "Closed on" : "Applies until",
      value: deadline,
    });
  }

  return facts;
}

/** Reading sections in the admin public page order. Empty copy is skipped. */
export function jobSections(job) {
  const sections = [];
  const summary = englishText(job?.summaryTranslations, job?.summary);
  if (summary) sections.push({ key: "summary", body: summary });

  const description = englishText(job?.descriptionTranslations, job?.description);
  if (description) sections.push({ key: "about", heading: "About the role", body: description });

  const responsibilities = englishText(
    job?.responsibilitiesTranslations,
    job?.responsibilities
  );
  if (responsibilities) {
    sections.push({ key: "responsibilities", heading: "Responsibilities", body: responsibilities });
  }

  const requirements = englishText(job?.requirementsTranslations, job?.requirements);
  if (requirements) {
    sections.push({ key: "requirements", heading: "Requirements", body: requirements });
  }

  const benefits = englishText(job?.benefitsTranslations, job?.benefits);
  if (benefits) sections.push({ key: "benefits", heading: "Benefits", body: benefits });

  if (job?.showScheduleOnPublic) {
    const schedule = englishText(job?.scheduleSummaryTranslations, job?.scheduleSummary);
    if (schedule) sections.push({ key: "schedule", heading: "Schedule / hours", body: schedule });
  }

  return sections;
}

function friendlyFieldError(key, message, screeningQuestions) {
  if (key === "consent") {
    return "You must confirm the consent statement before submitting.";
  }
  if (key === "resume" || key === "extraPdf") {
    if (/too large/i.test(message)) {
      return `File is too large. Maximum size is ${MAX_APPLY_FILE_LABEL}.`;
    }
    if (/pdf/i.test(message)) {
      return `Please choose a PDF file (max ${MAX_APPLY_FILE_LABEL}).`;
    }
  }
  if (key.startsWith("screening_")) {
    const question = screeningQuestions.find((item) => `screening_${item.id}` === key);
    return `${question?.label || "This question"} is required.`;
  }
  if (FIELD_LABELS[key]) return `${FIELD_LABELS[key]} is required.`;
  return message || "Check this field and try again.";
}

/**
 * @param {object | null | undefined} body
 * @param {Array<{ id: string, label: string }>} [screeningQuestions]
 */
export function mapApplyErrors(body, screeningQuestions = []) {
  const raw = body?.details?.fieldErrors;
  const fields = {};
  if (raw && typeof raw === "object") {
    for (const [key, value] of Object.entries(raw)) {
      const message = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
      fields[key] = friendlyFieldError(key, message, screeningQuestions);
    }
  }
  const summary =
    (typeof body?.message === "string" && body.message.trim()) ||
    (Object.keys(fields).length > 0
      ? "Check the form and try again."
      : "Could not submit your application. Check the form and try again.");
  return { summary, fields };
}

async function errorFromResponse(res, fallback) {
  let message = fallback;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch {
    // Non-JSON body; keep the fallback.
  }
  const error = new Error(message);
  error.status = res.status;
  return error;
}

function mapCard(job, now) {
  return {
    id: job.id,
    publicSlug: job.publicSlug,
    title: englishText(job.publicTitleTranslations, job.publicTitle) || "Open role",
    location: locationLine(job.locationCity, job.locationCountry),
    applicationDeadline: job.applicationDeadline ?? null,
    deadlineLabel: formatDeadline(job.applicationDeadline),
    professionImageUrl: absoluteAdminUrl(job.professionImageUrl),
    closed: isPastDeadline(job.applicationDeadline, now),
  };
}

export async function getCareersBoard(now = new Date()) {
  const res = await fetch(
    `${ADMIN_PUBLIC_BASE_URL}/api/public/careers/company/${encodeURIComponent(BUSINESS_SLUG)}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw await errorFromResponse(res, "Could not load careers. Try again later.");
  }
  const data = await res.json();
  return {
    businessName: typeof data.businessName === "string" ? data.businessName : "",
    jobs: Array.isArray(data.jobs) ? data.jobs.map((job) => mapCard(job, now)) : [],
  };
}

function screeningQuestions(formConfig) {
  if (!Array.isArray(formConfig?.screeningQuestions)) return [];
  return formConfig.screeningQuestions
    .filter((question) => question && question.id && question.label)
    .slice(0, 20)
    .map((question) => ({
      id: String(question.id),
      label: String(question.label),
      required: Boolean(question.required),
    }));
}

export async function getPublicJob(slug) {
  const now = new Date();
  if (!isPublicJobSlug(slug)) return null;
  const res = await fetch(
    `${ADMIN_PUBLIC_BASE_URL}/api/public/jobs/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw await errorFromResponse(res, "Could not load the job. Try again later.");
  }
  const job = await res.json();
  const formConfig = job.formConfig ?? {};
  return {
    id: job.id,
    publicSlug: job.publicSlug || slug,
    title: englishText(job.publicTitleTranslations, job.publicTitle) || "Open role",
    businessName: typeof job.businessName === "string" ? job.businessName : "",
    location: locationLine(job.locationCity, job.locationCountry),
    professionImageUrl: absoluteAdminUrl(job.professionImageUrl),
    closed: isPastDeadline(job.applicationDeadline, now),
    facts: jobFacts(job, now),
    sections: jobSections(job),
    apply: {
      fields: applyFields(formConfig),
      screeningQuestions: screeningQuestions(formConfig),
      requireResume: formConfig.requireResume === true,
      allowExtraPdf: formConfig.allowExtraPdf === true,
    },
  };
}
