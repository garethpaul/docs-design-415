import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const EXPECTED_TOPIC_COUNT = 28;

export function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseLegacySidebar(source) {
  const sectionsMatch = source.match(/const sections = (\[[\s\S]*?\n\]);/);
  assert.ok(sectionsMatch, "Sidebar must declare navigation sections");
  const sections = [];
  const sectionPattern = /title:\s*"([^"]+)",[\s\S]*?links:\s*\[([\s\S]*?)\]/g;
  for (const match of sectionsMatch[1].matchAll(sectionPattern)) {
    const links = [...match[2].matchAll(/"([^"]+)"/g)].map((link) => ({
      title: link[1],
      slug: slugify(link[1]),
      summary: "",
    }));
    sections.push({ title: match[1], slug: "", links });
  }
  return sections;
}

export function loadDeclaration(root) {
  const dataPath = join(root, "components", "docs-content.json");
  if (existsSync(dataPath)) {
    return JSON.parse(readFileSync(dataPath, "utf8")).sections;
  }
  return parseLegacySidebar(readFileSync(join(root, "components", "Sidebar.tsx"), "utf8"));
}

function normalizeDestination(destination) {
  return destination.replace(/\/+$/, "").toLowerCase();
}

function stripSourceComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

export function collectContractErrors(root) {
  const sections = loadDeclaration(root);
  const errors = [];
  const topics = sections.flatMap((section) =>
    section.links.map((topic) => ({
      ...topic,
      sectionSlug: section.slug,
      destination: section.slug
        ? `/docs/${section.slug}/${topic.slug}`
        : `/docs/${topic.slug}`,
    })),
  );

  if (topics.length !== EXPECTED_TOPIC_COUNT) {
    errors.push(`expected ${EXPECTED_TOPIC_COUNT} topics, found ${topics.length}`);
  }

  const normalizedSections = new Set();
  for (const section of sections) {
    if (!section.slug || section.slug !== slugify(section.slug)) {
      errors.push(`section ${section.title} lacks a canonical lowercase slug`);
    }
    const normalized = normalizeDestination(section.slug || "");
    if (normalizedSections.has(normalized)) {
      errors.push(`duplicate section slug: ${section.slug}`);
    }
    normalizedSections.add(normalized);
  }

  const destinations = new Map();
  for (const topic of topics) {
    if (!topic.slug || topic.slug !== slugify(topic.slug)) {
      errors.push(`topic ${topic.title} lacks a canonical lowercase slug`);
    }
    const normalized = normalizeDestination(topic.destination);
    if (topic.href !== topic.destination) {
      errors.push(`topic ${topic.title} href must equal ${topic.destination}`);
    }
    const previous = destinations.get(normalized);
    if (previous) {
      errors.push(`duplicate destination: ${previous} and ${topic.destination}`);
    }
    destinations.set(normalized, topic.destination);
    if (typeof topic.summary !== "string" || topic.summary.trim().length < 40) {
      errors.push(`topic ${topic.destination} lacks meaningful content`);
    }
    if (/\b(?:todo|tbd|placeholder|coming soon)\b/i.test(topic.summary || "")) {
      errors.push(`topic ${topic.destination} contains placeholder content`);
    }
  }

  const routePath = join(root, "pages", "docs", "[section]", "[slug].tsx");
  if (!existsSync(routePath)) {
    for (const topic of topics) errors.push(`missing destination: ${topic.destination}`);
  } else {
    const routeSource = stripSourceComments(readFileSync(routePath, "utf8"));
    for (const token of [
      "getStaticPaths",
      "fallback: false",
      "getStaticProps",
      "notFound: true",
      "docs-content.json",
      "paths: docsContent.sections.flatMap",
      "section.links.map",
      "docsContent.sections.find",
      "section?.links.find",
    ]) {
      if (!routeSource.includes(token)) errors.push(`dynamic route lacks ${token}`);
    }
  }

  const sidebarSource = stripSourceComments(
    readFileSync(join(root, "components", "Sidebar.tsx"), "utf8"),
  );
  if (existsSync(join(root, "components", "docs-content.json"))) {
    if (!sidebarSource.includes('from "./docs-content.json"')) {
      errors.push("sidebar does not consume the shared route declaration");
    }
    if (!sidebarSource.includes("href={topic.href}")) {
      errors.push("sidebar hrefs are not sourced from the shared route declaration");
    }
  }

  return errors;
}

export function verifyDocsRoutes(root) {
  const errors = collectContractErrors(root);
  assert.deepEqual(errors, [], `documentation route contract failed:\n- ${errors.join("\n- ")}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  const root = process.argv[2]
    ? resolve(process.argv[2])
    : resolve(dirname(fileURLToPath(import.meta.url)), "..");
  verifyDocsRoutes(root);
  console.log(`documentation route contract passed (${EXPECTED_TOPIC_COUNT} topics)`);
}
