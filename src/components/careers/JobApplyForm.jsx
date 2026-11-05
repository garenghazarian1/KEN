"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MAX_APPLY_FILE_BYTES,
  MAX_APPLY_FILE_LABEL,
  mapApplyErrors,
} from "@/lib/business/careers";
import styles from "./JobApplyForm.module.css";

function emptyErrors() {
  return { summary: null, fields: {} };
}

function isPdf(file) {
  if (!file || file.size === 0) return false;
  if (file.type === "application/pdf") return true;
  return (file.type === "" || file.type === "application/octet-stream") && /\.pdf$/i.test(file.name);
}

function fileProblem(file, required) {
  if (!file || file.size === 0) {
    return required ? "Resume (PDF) is required." : null;
  }
  if (file.size > MAX_APPLY_FILE_BYTES) {
    return `File is too large. Maximum size is ${MAX_APPLY_FILE_LABEL}.`;
  }
  if (!isPdf(file)) {
    return `Please choose a PDF file (max ${MAX_APPLY_FILE_LABEL}).`;
  }
  return null;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className={styles.fieldError}>{message}</p>;
}

function TextControl({ field, error }) {
  const common = {
    id: field.key,
    name: field.key,
    required: field.required,
    maxLength: field.maxLength,
    autoComplete: field.autoComplete,
    "aria-required": field.required || undefined,
    "aria-invalid": Boolean(error) || undefined,
    className: error ? `${styles.input} ${styles.inputError}` : styles.input,
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={field.key}>
        {field.label}
        {field.required ? " *" : null}
      </label>
      {field.kind === "textarea" ? (
        <textarea {...common} className={error ? `${styles.textarea} ${styles.inputError}` : styles.textarea} />
      ) : (
        <input
          {...common}
          type={field.kind === "email" ? "email" : field.kind === "date" ? "date" : "text"}
        />
      )}
      <FieldError message={error} />
    </div>
  );
}

export default function JobApplyForm({ slug, apply }) {
  const [errors, setErrors] = useState(emptyErrors);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function clearField(name) {
    setErrors((current) => {
      if (!current.fields[name]) return current;
      const fields = { ...current.fields };
      delete fields[name];
      return {
        summary: Object.keys(fields).length > 0 ? current.summary : null,
        fields,
      };
    });
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const nextFields = {};
    const resume = data.get("resume");
    const extra = data.get("extraPdf");
    const resumeError = fileProblem(resume, apply.requireResume);
    const extraError =
      apply.allowExtraPdf && extra instanceof File && extra.size > 0
        ? fileProblem(extra, false)
        : null;
    if (resumeError) nextFields.resume = resumeError;
    if (extraError) nextFields.extraPdf = extraError;
    if (!data.get("consent")) {
      nextFields.consent = "You must confirm the consent statement before submitting.";
    }

    if (Object.keys(nextFields).length > 0) {
      setErrors({ summary: "Check the form and try again.", fields: nextFields });
      return;
    }

    setSubmitting(true);
    setErrors(emptyErrors());
    try {
      const res = await fetch(`/api/careers/${encodeURIComponent(slug)}/apply`, {
        method: "POST",
        body: data,
      });
      if (res.status === 413) {
        setErrors({
          summary: `File is too large. Maximum size is ${MAX_APPLY_FILE_LABEL}.`,
          fields: {},
        });
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(mapApplyErrors(body, apply.screeningQuestions));
        return;
      }
      setDone(true);
    } catch {
      setErrors({
        summary: "Could not submit your application. Check the form and try again.",
        fields: {},
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <aside className={styles.panel} aria-live="polite">
        <h2>Thank you — we received your application.</h2>
        <p>We will contact you if your profile matches the role.</p>
      </aside>
    );
  }

  return (
    <aside className={styles.panel}>
      <form className={styles.form} noValidate encType="multipart/form-data" onSubmit={onSubmit} onChange={(event) => clearField(event.target?.name)}>
        <h2 id="apply-heading">Apply</h2>

        {apply.fields.map((field) => {
          if (field.kind === "address") {
            return (
              <fieldset key="address" className={styles.group}>
                <legend>{field.label}</legend>
                {field.fields.map((addressField) => (
                  <TextControl
                    key={addressField.key}
                    field={addressField}
                    error={errors.fields[addressField.key]}
                  />
                ))}
              </fieldset>
            );
          }

          if (field.kind === "radio") {
            const error = errors.fields[field.key];
            return (
              <fieldset key={field.key} className={styles.group}>
                <legend>
                  {field.label}
                  {field.required ? " *" : null}
                </legend>
                <div className={styles.radios}>
                  <label>
                    <input type="radio" name={field.key} value="yes" required={field.required} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" name={field.key} value="no" />
                    No
                  </label>
                </div>
                <FieldError message={error} />
              </fieldset>
            );
          }

          return (
            <TextControl key={field.key} field={field} error={errors.fields[field.key]} />
          );
        })}

        {apply.screeningQuestions.map((question) => {
          const name = `screening_${question.id}`;
          const error = errors.fields[name];
          return (
            <div key={question.id} className={styles.field}>
              <label className={styles.label} htmlFor={name}>
                {question.label}
                {question.required ? " *" : null}
              </label>
              <textarea
                id={name}
                name={name}
                required={question.required}
                aria-required={question.required || undefined}
                aria-invalid={Boolean(error) || undefined}
                className={error ? `${styles.textarea} ${styles.inputError}` : styles.textarea}
              />
              <FieldError message={error} />
            </div>
          );
        })}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="resume">
            Resume (PDF)
            {apply.requireResume ? " *" : " (optional)"}
          </label>
          <p className={styles.hint}>PDF only, max {MAX_APPLY_FILE_LABEL} per file.</p>
          <input
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf,.pdf"
            required={apply.requireResume}
            aria-invalid={Boolean(errors.fields.resume) || undefined}
            className={errors.fields.resume ? `${styles.input} ${styles.inputError}` : styles.input}
          />
          <FieldError message={errors.fields.resume} />
        </div>

        {apply.allowExtraPdf ? (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="extraPdf">
              Additional PDF (optional)
            </label>
            <p className={styles.hint}>PDF only, max {MAX_APPLY_FILE_LABEL} per file.</p>
            <input
              id="extraPdf"
              name="extraPdf"
              type="file"
              accept="application/pdf,.pdf"
              aria-invalid={Boolean(errors.fields.extraPdf) || undefined}
              className={errors.fields.extraPdf ? `${styles.input} ${styles.inputError}` : styles.input}
            />
            <FieldError message={errors.fields.extraPdf} />
          </div>
        ) : null}

        <div className={styles.field}>
          <label className={styles.check}>
            <input
              type="checkbox"
              name="consent"
              value="true"
              required
              aria-invalid={Boolean(errors.fields.consent) || undefined}
              aria-describedby={errors.fields.consent ? "consent-error" : undefined}
            />
            <span>I confirm that the information I provide is accurate.</span>
          </label>
          <p className={styles.hint}>
            I have read the <Link href="/privacy">privacy notice</Link> for this application process.
          </p>
          {errors.fields.consent ? (
            <p id="consent-error" className={styles.fieldError}>
              {errors.fields.consent}
            </p>
          ) : null}
        </div>

        <input type="hidden" name="source" value="public-careers" />
        <input type="hidden" name="applicationLocale" value="en" />

        {errors.summary ? (
          <div className={styles.summary} role="alert">
            <p>{errors.summary}</p>
          </div>
        ) : null}

        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </aside>
  );
}
