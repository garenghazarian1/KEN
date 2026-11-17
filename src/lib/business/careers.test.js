import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ADMIN_PUBLIC_BASE_URL } from "@/config/constants";
import {
  absoluteAdminUrl,
  applyFields,
  careerDetailSlug,
  englishText,
  isPastDeadline,
  jobFacts,
  jobMetaDescription,
  jobSections,
  mapApplyErrors,
} from "./careers";

const NOW = new Date("2026-06-01T00:00:00.000Z");

describe("job routes", () => {
  it("reads a single job slug and ignores the board", () => {
    expect(careerDetailSlug("/careers/master-barber")).toBe("master-barber");
    expect(careerDetailSlug("/careers")).toBeNull();
    expect(careerDetailSlug("/careers/master-barber/apply")).toBeNull();
    expect(careerDetailSlug("/services")).toBeNull();
  });

  it("builds a short meta description from the summary", () => {
    expect(jobMetaDescription("Master Barber", "  Fades and beard work. ", "Ken Beauty Salon")).toBe(
      "Fades and beard work."
    );
    expect(jobMetaDescription("Master Barber", "", "Ken Beauty Salon")).toBe(
      "Apply for Master Barber at Ken Beauty Salon."
    );
    const long = "word ".repeat(80).trim();
    const description = jobMetaDescription("Master Barber", long, "Ken Beauty Salon");
    expect(description.length).toBeLessThanOrEqual(155);
    expect(description.endsWith("...")).toBe(true);
  });
});

describe("careers content helpers", () => {
  it("treats a past deadline as closed and ignores empty or invalid dates", () => {
    expect(isPastDeadline("2020-01-01T00:00:00.000Z", NOW)).toBe(true);
    expect(isPastDeadline("2099-01-01T00:00:00.000Z", NOW)).toBe(false);
    expect(isPastDeadline(null, NOW)).toBe(false);
    expect(isPastDeadline("not-a-date", NOW)).toBe(false);
  });

  it("prefers the English translation, then the plain field", () => {
    expect(englishText({ en: " Stylist ", ar: "أخرى" }, "Fallback")).toBe("Stylist");
    expect(englishText({}, "  Fallback  ")).toBe("Fallback");
    expect(englishText(null, "")).toBe("");
  });

  it("prefixes admin media paths and leaves absolute URLs unchanged", () => {
    expect(absoluteAdminUrl("/job-logos/profession-image/a.jpg")).toBe(
      `${ADMIN_PUBLIC_BASE_URL}/job-logos/profession-image/a.jpg`
    );
    expect(absoluteAdminUrl("https://res.cloudinary.com/demo/image/upload/a.jpg")).toBe(
      "https://res.cloudinary.com/demo/image/upload/a.jpg"
    );
    expect(absoluteAdminUrl(null)).toBeNull();
  });

  it("keeps admin section order and skips empty or hidden copy", () => {
    const sections = jobSections({
      summaryTranslations: { en: "A short summary" },
      description: "About the work",
      responsibilities: "",
      requirementsTranslations: { en: "A license" },
      benefits: "Staff meals",
      preferredQualifications: "This must not render",
      showScheduleOnPublic: false,
      scheduleSummary: "Sunday to Thursday",
    });

    expect(sections.map((section) => section.key)).toEqual([
      "summary",
      "about",
      "requirements",
      "benefits",
    ]);
    expect(sections[0].heading).toBeUndefined();
    expect(sections[1].heading).toBe("About the role");
  });

  it("includes schedule only when the job publishes it", () => {
    const sections = jobSections({
      showScheduleOnPublic: true,
      scheduleSummaryTranslations: { en: "Sunday to Thursday" },
    });
    expect(sections).toEqual([
      { key: "schedule", heading: "Schedule / hours", body: "Sunday to Thursday" },
    ]);
  });

  it("lists facts in order and hides salary unless showSalary is on", () => {
    const hidden = jobFacts(
      {
        employmentTypes: ["full_time", "part_time"],
        workModels: ["onsite"],
        showSalary: false,
        salaryText: "8,000 AED",
        applicationDeadline: "2026-07-01T00:00:00.000Z",
      },
      NOW
    );
    expect(hidden.map((fact) => fact.key)).toEqual(["employment", "work", "deadline"]);
    expect(hidden[0].value).toBe("Full time, Part time");
    expect(hidden[1].value).toBe("On-site");
    expect(hidden[2].label).toBe("Applies until");

    const shown = jobFacts(
      {
        showSalary: true,
        salaryTextTranslations: { en: "8,000 AED" },
        applicationDeadline: "2020-01-01T00:00:00.000Z",
      },
      NOW
    );
    expect(shown.map((fact) => fact.label)).toEqual(["Compensation", "Closed on"]);
  });

  it("walks enabled fields in admin order and groups the address", () => {
    const fields = applyFields({
      fields: {
        firstName: { enabled: true, required: true },
        email: { enabled: true, required: true },
        phone: { enabled: false, required: false },
        addressCity: { enabled: true, required: true },
        addressZip: { enabled: false, required: false },
        github: { enabled: false, required: false },
        workAuthorization: { enabled: true, required: true },
        availability: { enabled: true, required: false },
        coverLetter: { enabled: true, required: false },
      },
    });

    expect(fields.map((field) => field.key)).toEqual([
      "firstName",
      "email",
      "address",
      "workAuthorization",
      "availability",
      "coverLetter",
    ]);
    expect(fields[1].kind).toBe("email");
    expect(fields[2].fields.map((field) => field.key)).toEqual(["addressCity"]);
    expect(fields[3].kind).toBe("radio");
    expect(fields[4].kind).toBe("date");
    expect(fields[5].kind).toBe("textarea");
  });

  it("maps admin field errors onto the same field names", () => {
    const mapped = mapApplyErrors(
      {
        message: "Check the highlighted fields.",
        details: {
          fieldErrors: {
            email: "Missing required field: email",
            resume: "Resume must be a PDF.",
            extraPdf: "File is too large.",
            consent: "Required",
            screening_q1: "Missing required field: screening_q1",
          },
        },
      },
      [{ id: "q1", label: "Years in a salon" }]
    );

    expect(mapped.summary).toBe("Check the highlighted fields.");
    expect(mapped.fields.email).toBe("Email is required.");
    expect(mapped.fields.resume).toBe("Please choose a PDF file (max 5 MB).");
    expect(mapped.fields.extraPdf).toBe("File is too large. Maximum size is 5 MB.");
    expect(mapped.fields.consent).toMatch(/consent/i);
    expect(mapped.fields.screening_q1).toBe("Years in a salon is required.");
  });
});

describe("job page prerender", () => {
  it("does not read the clock while building the meta description", () => {
    const source = readFileSync(new URL("./careers.js", import.meta.url), "utf8");
    const metaStart = source.indexOf("export async function getPublicJobMeta");
    const jobStart = source.indexOf("export async function getPublicJob");
    const metaFn = source.slice(metaStart, jobStart);
    const jobFn = source.slice(jobStart);

    expect(metaFn).not.toContain("new Date(");
    expect(jobFn.indexOf("await fetchPublicJobBody")).toBeGreaterThan(-1);
    expect(jobFn.indexOf("new Date()")).toBeGreaterThan(jobFn.indexOf("await fetchPublicJobBody"));
  });

  it("loads the job page clock only after connection()", () => {
    const page = readFileSync(
      new URL("../../app/(navPages)/careers/[slug]/page.jsx", import.meta.url),
      "utf8"
    );
    const metaStart = page.indexOf("export async function generateMetadata");
    const contentStart = page.indexOf("async function CareerJobContent");
    const metaFn = page.slice(metaStart, contentStart);

    expect(metaFn).toContain("getPublicJobMeta(");
    expect(metaFn).not.toContain("getPublicJob(");
    expect(metaFn).not.toContain("new Date(");

    const contentFn = page.slice(contentStart);
    expect(contentFn.indexOf("await connection()")).toBeGreaterThan(-1);
    expect(contentFn.indexOf("await connection()")).toBeLessThan(contentFn.indexOf("getPublicJob("));
  });
});
