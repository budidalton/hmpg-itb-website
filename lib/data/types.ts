export type PageContentKey = "home" | "about" | "reports" | "contact";

export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "youtube"
  | "x"
  | "tiktok";

export type ReportStatus = "draft" | "published";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  handle: string;
}

export interface SiteSettings {
  organizationName: string;
  shortName: string;
  tagline: string;
  logoSrc: string;
  footerLogoSrc: string;
  addressLines: string[];
  footerAddressLines: string[];
  email: string;
  driveAkademikUrl: string;
  footerCopyright: string;
  socialLinks: SocialLink[];
}

export interface HomePageContent {
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroCtaLabel: string;
  heroImageSrc: string;
  summaryParagraphs: string[];
  summaryTextureSrc: string;
}

export interface ActivityHighlight {
  id: string;
  badge?: string;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  variant: "wide" | "feature" | "vertical";
}

export interface AboutPageContent {
  heroTitle: string;
  heroImageSrc: string;
  historyEyebrow: string;
  historyTitle: string;
  historyParagraphs: string[];
  historyImageSrc: string;
  vision: string;
  missions: string[];
  values: string[];
  logoMeaningTitle: string;
  logoMeaningDescription: string;
  logoShowcaseSrc: string;
  identityTextureSrc: string;
}

export interface ReportsPageContent {
  heroTitle: string;
  heroDescription: string;
  heroImageSrc: string;
  driveTitle: string;
  driveCtaLabel: string;
  featuredReportSlug: string;
}

export interface ContactPageContent {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  showcaseImageSrc: string;
  officeTitle: string;
  officeAddress: string;
}

export interface ReportRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  coverImageSrc: string;
  coverCaption?: string;
  cardImageSrc?: string;
  publishedAt: string;
  year: string;
  periodLabel: string;
  editionLabel: string;
  author: string;
  status: ReportStatus;
  featured: boolean;
  summaryLabel?: string;
  bodyHtml: string;
  relatedSlugs: string[];
}

export interface PageContentMap {
  home: HomePageContent;
  about: AboutPageContent;
  reports: ReportsPageContent;
  contact: ContactPageContent;
}

export type PageContent<Key extends PageContentKey> = PageContentMap[Key];

export interface CmsStore {
  settings: SiteSettings;
  pages: PageContentMap;
  activities: ActivityHighlight[];
  reports: ReportRecord[];
}

export interface ReportFilters {
  query?: string;
  year?: string;
  period?: string;
  category?: string;
  status?: ReportStatus | "all";
}
