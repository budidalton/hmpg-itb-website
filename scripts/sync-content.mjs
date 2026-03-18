import { createClient } from "@supabase/supabase-js";

import {
  seedActivities,
  seedPages,
  seedReports,
  seedSettings,
} from "../lib/data/seed.ts";

const validTargets = new Set(["settings", "pages", "activities", "reports"]);

function parseTargets(argv) {
  const explicitTargets = argv
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => arg.replace(/^--/, ""))
    .filter((arg) => validTargets.has(arg));

  if (argv.includes("--all")) {
    return ["settings", "pages", "activities", "reports"];
  }

  if (explicitTargets.length > 0) {
    return explicitTargets;
  }

  return ["settings", "pages", "activities"];
}

function assertEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function buildReportRows() {
  return seedReports.map((report) => ({
    id: report.id,
    slug: report.slug,
    title: report.title,
    excerpt: report.excerpt,
    category: report.category,
    category_label: report.categoryLabel,
    cover_image_src: report.coverImageSrc,
    card_image_src: report.cardImageSrc ?? null,
    cover_caption: report.coverCaption ?? null,
    published_at: report.publishedAt,
    year: report.year,
    period_label: report.periodLabel,
    edition_label: report.editionLabel,
    author: report.author,
    status: report.status,
    featured: report.featured,
    summary_label: report.summaryLabel ?? null,
    body_html: report.bodyHtml,
    related_slugs: report.relatedSlugs,
  }));
}

async function syncSettings(supabase) {
  const result = await supabase
    .from("site_settings")
    .upsert({
      id: 1,
      organization_name: seedSettings.organizationName,
      short_name: seedSettings.shortName,
      tagline: seedSettings.tagline,
      logo_src: seedSettings.logoSrc,
      footer_logo_src: seedSettings.footerLogoSrc,
      address_lines: seedSettings.addressLines,
      footer_address_lines: seedSettings.footerAddressLines,
      email: seedSettings.email,
      phone: seedSettings.phone,
      drive_akademik_url: seedSettings.driveAkademikUrl,
      footer_copyright: seedSettings.footerCopyright,
      social_links: seedSettings.socialLinks,
    })
    .select("id")
    .single();

  if (result.error) {
    throw result.error;
  }

  return "settings";
}

async function syncPages(supabase) {
  const rows = Object.entries(seedPages).map(([key, value]) => ({
    key,
    value,
  }));
  const result = await supabase
    .from("page_content")
    .upsert(rows, { onConflict: "key" })
    .select("key");

  if (result.error) {
    throw result.error;
  }

  return `pages (${rows.length})`;
}

async function syncActivities(supabase) {
  const rows = seedActivities.map((activity, index) => ({
    id: activity.id,
    badge: activity.badge ?? null,
    category: activity.category,
    title: activity.title,
    description: activity.description,
    image_src: activity.imageSrc,
    variant: activity.variant,
    sort_order: index,
  }));

  const result = await supabase
    .from("activity_highlights")
    .upsert(rows, { onConflict: "id" })
    .select("id");

  if (result.error) {
    throw result.error;
  }

  return `activities (${rows.length})`;
}

async function syncReports(supabase) {
  const rows = buildReportRows();
  const result = await supabase
    .from("reports")
    .upsert(rows, { onConflict: "id" })
    .select("id");

  if (result.error) {
    throw result.error;
  }

  return `reports (${rows.length})`;
}

async function main() {
  const targets = parseTargets(process.argv.slice(2));
  const supabase = createClient(
    assertEnv("NEXT_PUBLIC_SUPABASE_URL"),
    assertEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );

  const operations = {
    settings: syncSettings,
    pages: syncPages,
    activities: syncActivities,
    reports: syncReports,
  };

  const completed = [];

  for (const target of targets) {
    completed.push(await operations[target](supabase));
  }

  console.log(`Synced: ${completed.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
