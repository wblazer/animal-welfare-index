import type { APIRoute } from "astro";
import { catalog } from "../lib/catalog";

export const prerender = true;

const fields = [
  "id",
  "name",
  "domain",
  "url",
  "annotation",
  "tags",
  "evidence_type",
  "access",
  "reuse",
  "license_status",
  "license_label",
  "license_scope",
  "license_evidence_url",
  "references",
  "value",
  "assessment_notes",
  "link_pattern",
] as const;

function cell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export const GET: APIRoute = () => {
  const rows = catalog.entries.map((entry) => {
    const values = {
      ...entry,
      license_status: entry.license.status,
      license_label: entry.license.label,
      license_scope: entry.license.scope,
      license_evidence_url: entry.license.evidence_url ?? "",
      tags: entry.tags.join(" | "),
      references: entry.references.map((reference) => `${reference.label}: ${reference.url}`).join(" | "),
      value: entry.assessment.value,
      assessment_notes: entry.assessment.notes ?? "",
      link_pattern: entry.link_pattern ?? "",
    };
    return fields.map((field) => cell(String(values[field]))).join(",");
  });
  const csv = [fields.map(cell).join(","), ...rows, ""].join("\n");

  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
};
