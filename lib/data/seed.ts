import type {
  ActivityHighlight,
  CmsStore,
  PageContentMap,
  ReportRecord,
  SiteSettings,
} from "@/lib/data/types";

export const seedSettings: SiteSettings = {
  organizationName: "Himpunan Mahasiswa Teknik Pangan ITB",
  shortName: "HMPG ITB",
  tagline: "Inovasi Pangan untuk Negeri",
  logoSrc: "/assets/figma/hmpg-logo-mark.png",
  footerLogoSrc: "/assets/figma/footer-logo-mark.png",
  addressLines: [
    "Gedung Labtek IIA, Kampus ITB Jatinangor",
    "Jl. Raya Bandung Sumedang KM 21,",
    "Kab. Sumedang, Jawa Barat 45363.",
  ],
  footerAddressLines: [
    "Gedung Labtek III, Kampus ITB Jatinangor.",
    "Jl. Raya Bandung Sumedang KM 21,",
    "Kab. Sumedang, Jawa Barat 45363.",
  ],
  email: "sekretariat@hmpg.itb.ac.id",
  phone: "+62 22 250 1234",
  driveAkademikUrl: "https://drive.google.com/",
  footerCopyright:
    "© 2026 Himpunan Mahasiswa Teknik Pangan ITB. All rights reserved.",
  socialLinks: [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://instagram.com/hmpgitb",
      handle: "@hmpgitb",
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/company/hmpg-itb",
      handle: "HMPG ITB",
    },
    {
      platform: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@HMPGITB",
      handle: "HMPG ITB",
    },
    {
      platform: "x",
      label: "X",
      href: "https://x.com/hmpgitb",
      handle: "@hmpgitb",
    },
  ],
};

export const seedPages: PageContentMap = {
  home: {
    heroEyebrow: "HIMPUNAN MAHASISWA TEKNIK PANGAN",
    heroTitleLine1: "Inovasi Pangan",
    heroTitleLine2: "untuk Negeri",
    heroDescription:
      "Wadah kolaborasi dan pengembangan mahasiswa Teknik Pangan ITB dalam menjawab tantangan kedaulatan pangan berkelanjutan melalui sains dan teknologi.",
    heroCtaLabel: "Selengkapnya",
    heroImageSrc: "/assets/figma/home-hero-flag.png",
    summaryParagraphs: [
      "Himpunan Mahasiswa Teknik Pangan (HMPG) ITB merupakan organisasi kemahasiswaan yang menaungi seluruh mahasiswa program studi Teknik Pangan Institut Teknologi Bandung. Kami berkomitmen menjadi pusat pengembangan karakter dan kompetensi profesional.",
      "Melalui berbagai program kerja strategis, kami menghubungkan akademisi, praktisi industri, dan masyarakat untuk menciptakan ekosistem inovasi pangan yang unggul secara teknis dan berintegritas secara moral.",
    ],
    summaryTextureSrc: "/assets/figma/home-summary-texture.png",
  },
  about: {
    heroTitle: "Tentang Kami",
    heroDescription:
      "Mewadahi aspirasi, inovasi, dan dedikasi mahasiswa Teknologi Pascapanen dalam membangun kedaulatan pangan masa depan melalui keunggulan akademik.",
    heroImageSrc: "/assets/figma/about-hero-edited.png",
    historyEyebrow: "Eksistensi & Sejarah",
    historyTitle: "Himpunan Mahasiswa Teknik Pangan - HMPG ITB",
    historyParagraphs: [
      "Didirikan sebagai wadah pemersatu mahasiswa program studi Teknologi Pascapanen di Institut Teknologi Bandung, HMPG ITB telah bertransformasi menjadi pusat pengembangan kompetensi teknis dan kepemimpinan yang progresif.",
      "Kami percaya bahwa tantangan pangan global memerlukan pendekatan multidisiplin yang presisi. Melalui riset, diskusi intensif, dan pengabdian masyarakat, kami berusaha menjawab kompleksitas rantai pasok pangan dari hulu hingga hilir.",
      "HMPG bukan sekadar organisasi formal; ia adalah ruang bagi pemikiran kritis dan laboratorium sosial bagi para calon insinyur yang memiliki integritas tinggi dan visi kemanusiaan yang kuat.",
    ],
    historyImageSrc: "/assets/figma/about-campus-building-edited.png",
    vision:
      "Memaksimalkan potensi HMPG ITB dengan hal hal bermutu dan berguna demi pendewasaan diri anggota HMPG ITB",
    missions: [
      "Menjadikan HMPG ITB sebagai wadah berkumpul dan mengembangkan diri yang nyaman untuk anggota HMPG ITB",
      "Meningkatkan efisiensi linimasa kepengurusan badan pengurus HMPG ITB dengan beban kerja yang ideal dan rasional",
      "Menaungi dan memfasilitasi kebutuhan anggota HMPG ITB akan pengembangan karir dan keilmuan Teknik Pangan",
      "Menciptakan ruang lingkup yang fleksibel dan kolaboratif untuk mendukung eksplorasi anggota HMPG ITB",
    ],
    values: ["Integritas", "Sinergi", "Inovasi", "Kreatif"],
    motto: '"Pretium in Scientia, Honor in Labora"',
    logoMeaningTitle: "Labu Takar & Pangan",
    logoMeaningDescription:
      "Logo HMPG ITB merepresentasikan fusi antara sains laboratorium dengan realitas kebutuhan pangan. Beaker melambangkan ketepatan metodologi ilmiah, sementara elemen organik di dalamnya menyimbolkan komoditas pascapanen yang kami jaga kualitasnya.",
    logoShowcaseSrc: "/assets/figma/about-logo-identity.png",
    identityTextureSrc: "/assets/figma/about-canvas-texture.png",
  },
  reports: {
    heroTitle: "Portal Kegiatan & HMPG Reports",
    heroDescription:
      "Pusat dokumentasi digital untuk setiap langkah strategis, transparansi anggaran, dan dampak pengabdian Himpunan Mahasiswa Teknik Pangan ITB.",
    heroImageSrc: "/assets/figma/reports-hero-edited.png",
    driveTitle: "Drive Akademik HMPG",
    driveDescription:
      "Akses bank soal, materi kuliah, dan jurnal teknis pangan dalam satu pintu.",
    driveCtaLabel: "Buka Folder Arsip",
    featuredReportSlug: "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
  },
  contact: {
    heroEyebrow: "Hubungi Kami",
    heroTitle: "Kontak Kami",
    heroDescription:
      "Pintu kami selalu terbuka untuk kolaborasi akademis, pertanyaan seputar kemahasiswaan, dan kemitraan strategis dalam industri teknologi pangan.",
    showcaseImageSrc: "/assets/figma/contact-showcase-bg.png",
    officeTitle: "Sekretariat",
    officeAddress: "Gedung Labtek IIA, Kampus ITB Jatinangor",
  },
};

export const seedActivities: ActivityHighlight[] = [
  {
    id: "pangan-masa-depan",
    category: "PENGEMBANGAN",
    title: "Pangan Masa Depan: Seminar Nasional Teknologi Pasca Panen",
    description:
      "Mengkaji tantangan rantai pasok pangan global dan peran teknologi dalam meminimalisir food loss di Indonesia.",
    imageSrc: "/assets/figma/home-featured-seminar.png",
    variant: "feature",
  },
  {
    id: "research-grant",
    category: "PENGEMBANGAN",
    title: "HMPG Research Grant: Batch 2024 Dibuka",
    description:
      "Pendanaan riset mandiri bagi mahasiswa untuk inovasi produk berbasis bahan lokal.",
    imageSrc: "/assets/figma/home-research-grant.png",
    variant: "vertical",
  },
  {
    id: "desa-binaan",
    badge: "Terbaru",
    category: "SOSIAL",
    title: "Desa Binaan HMPG: Implementasi Sistem Irigasi Cerdas",
    description:
      "Kolaborasi dengan masyarakat Pangalengan dalam meningkatkan efisiensi penggunaan air untuk perkebunan kentang menggunakan sensor IoT sederhana.",
    imageSrc: "/assets/figma/home-desa-binaan.png",
    variant: "wide",
  },
];

const featuredBodyHtml = `
  <section>
    <h2>Latar Belakang</h2>
    <p>Ketahanan pangan di tingkat desa merupakan fondasi utama dalam menjaga stabilitas nutrisi masyarakat secara nasional. Berdasarkan pengamatan Divisi Pengabdian Masyarakat HMPG ITB di tahun 2024, terjadi pergeseran signifikan dalam pola konsumsi dan produksi pangan di wilayah Desa Binaan. Modernisasi teknologi pangan belum sepenuhnya terintegrasi dengan kearifan lokal, menciptakan celah efisiensi yang perlu segera dianalisis secara akademis.</p>
  </section>
  <blockquote>
    <p>"Inovasi pangan bukan hanya soal teknologi, melainkan bagaimana teknologi tersebut mampu beradaptasi dengan realitas sosiokultural di tingkat akar rumput."</p>
    <cite>— Dr. Ir. Ahmad Sudirjo, Pembina HMPG</cite>
  </blockquote>
  <section>
    <h2>Metodologi</h2>
    <p>Penelitian ini menggunakan pendekatan kualitatif dan kuantitatif melalui survei rumah tangga (n=150) dan Focus Group Discussion (FGD) bersama tokoh masyarakat desa. Kami membagi variabel analisis menjadi tiga pilar utama:</p>
    <ol>
      <li>Ketahanan akses pangan rumah tangga dari sisi distribusi dan harga.</li>
      <li>Keberagaman konsumsi dan peluang diversifikasi bahan pangan lokal.</li>
      <li>Kesiapan adopsi teknologi pengolahan pascapanen pada level komunitas.</li>
    </ol>
    <figure>
      <img src="/assets/figma/report-inline-field.png" alt="Observasi lapangan ketahanan pangan" />
      <figcaption>Gambar 1.2: Observasi lapangan terhadap komoditas pangan lokal di Desa Binaan Ciparay.</figcaption>
    </figure>
  </section>
  <section>
    <h2>Hasil Analisis</h2>
    <p>Temuan awal menunjukkan bahwa 65% masyarakat desa masih sangat bergantung pada satu jenis komoditas karbohidrat utama. Diversifikasi pangan terhambat oleh minimnya edukasi pengolahan bahan alternatif seperti umbi-umbian dan sorgum yang sebenarnya melimpah secara geografis di wilayah tersebut.</p>
  </section>
`;

export const seedReports: ReportRecord[] = [
  {
    id: "report-1",
    slug: "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
    title: "Evaluasi Strategis & Pencapaian Tahunan HMPG ITB",
    excerpt:
      "Dokumen komprehensif yang merangkum seluruh kegiatan, audit keuangan, dan evaluasi performa divisi sepanjang periode 2023.",
    category: "laporan-akhir-tahun",
    categoryLabel: "Laporan Akhir Tahun 2023",
    coverImageSrc: "/assets/figma/report-detail-hero.png",
    cardImageSrc: "/assets/figma/reports-featured-terrace.png",
    publishedAt: "2026-03-12T00:00:00.000Z",
    year: "2026",
    periodLabel: "Maret 2026",
    editionLabel: "Laporan Akhir Tahun",
    author: "Divisi Pengabdian Masyarakat",
    status: "published",
    featured: true,
    coverCaption:
      "Gambar 1.1: Observasi lapangan terhadap komoditas pangan lokal di Desa Binaan Ciparay.",
    bodyHtml: featuredBodyHtml,
    relatedSlugs: [
      "manajemen-limbah-organik-di-pasar-induk-caringin",
      "implementasi-panel-surya-pada-pengolahan-pasca-panen",
      "digitalisasi-rantai-pasok-pangan-di-jawa-barat",
    ],
  },
  {
    id: "report-2",
    slug: "laporan-kajian-geospasial-perkotaan-bandung",
    title: "Laporan Kajian Geospasial Perkotaan Bandung",
    excerpt:
      "Analisis mendalam mengenai perubahan tata guna lahan di kawasan Bandung Utara menggunakan data satelit.",
    category: "keilmuan",
    categoryLabel: "Keilmuan",
    coverImageSrc: "/assets/figma/reports-card-keilmuan.png",
    cardImageSrc: "/assets/figma/reports-card-keilmuan.png",
    publishedAt: "2023-11-20T00:00:00.000Z",
    year: "2023",
    periodLabel: "Nov 2023",
    editionLabel: "VOL. 08 / NOV 2024",
    author: "Divisi Keilmuan",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Analisis geospasial ini mengevaluasi dinamika penggunaan lahan dan dampaknya terhadap rantai pasok pangan perkotaan.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-3",
    slug: "dokumentasi-desa-binaan-pemetaan-partisipatif",
    title: "Dokumentasi Desa Binaan: Pemetaan Partisipatif",
    excerpt:
      "Laporan pelaksanaan kegiatan pemetaan batas desa bersama masyarakat lokal di Sumedang.",
    category: "pengmas",
    categoryLabel: "Pengmas",
    coverImageSrc: "/assets/figma/reports-card-pengmas.png",
    cardImageSrc: "/assets/figma/reports-card-pengmas.png",
    publishedAt: "2023-10-10T00:00:00.000Z",
    year: "2023",
    periodLabel: "Okt 2023",
    editionLabel: "Laporan Pengmas",
    author: "Divisi Pengabdian Masyarakat",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Dokumentasi kegiatan pemetaan partisipatif yang menitikberatkan pada kolaborasi lapangan bersama warga.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-4",
    slug: "evaluasi-program-orientasi-anggota-muda",
    title: "Evaluasi Program Orientasi Anggota Muda",
    excerpt:
      "Analisis keberhasilan kurikulum kaderisasi dan tingkat partisipasi mahasiswa baru.",
    category: "kaderisasi",
    categoryLabel: "Kaderisasi",
    coverImageSrc: "/assets/figma/reports-card-kaderisasi.png",
    cardImageSrc: "/assets/figma/reports-card-kaderisasi.png",
    publishedAt: "2023-09-14T00:00:00.000Z",
    year: "2023",
    periodLabel: "Sep 2023",
    editionLabel: "Laporan Kaderisasi",
    author: "Divisi Kaderisasi",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Evaluasi menyeluruh terhadap pengalaman orientasi dan kurikulum pendewasaan anggota baru.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-5",
    slug: "analisis-media-komunikasi-publik-triwulan-ii",
    title: "Analisis Media & Komunikasi Publik Triwulan II",
    excerpt:
      "Data reach dan engagement platform digital HMPG ITB selama tiga bulan terakhir.",
    category: "keuangan",
    categoryLabel: "Keuangan",
    coverImageSrc: "/assets/figma/reports-card-keuangan.png",
    cardImageSrc: "/assets/figma/reports-card-keuangan.png",
    publishedAt: "2023-08-22T00:00:00.000Z",
    year: "2023",
    periodLabel: "Agu 2023",
    editionLabel: "Laporan Keuangan",
    author: "Divisi Media",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Ikhtisar performa komunikasi publik HMPG ITB beserta rekomendasi editorial untuk kanal digital.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-6",
    slug: "audit-inventaris-alat-survey-laboratorium",
    title: "Audit Inventaris Alat Survey & Laboratorium",
    excerpt:
      "Laporan kondisi terkini alat survey milik himpunan dan rencana pemeliharaan rutin.",
    category: "inventaris",
    categoryLabel: "Inventaris",
    coverImageSrc: "/assets/figma/reports-card-inventaris.png",
    cardImageSrc: "/assets/figma/reports-card-inventaris.png",
    publishedAt: "2023-06-02T00:00:00.000Z",
    year: "2023",
    periodLabel: "Jun 2023",
    editionLabel: "Laporan Inventaris",
    author: "Divisi Inventaris",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Audit tahunan untuk aset lapangan dan laboratorium sebagai dasar pembenahan inventaris kerja.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-7",
    slug: "prosiding-seminar-nasional-geodesi-itb",
    title: "Prosiding Seminar Nasional Geodesi ITB",
    excerpt:
      "Kumpulan abstrak dan materi pemaparan dari praktisi industri geospasial.",
    category: "seminar",
    categoryLabel: "Seminar",
    coverImageSrc: "/assets/figma/reports-card-seminar.png",
    cardImageSrc: "/assets/figma/reports-card-seminar.png",
    publishedAt: "2023-05-18T00:00:00.000Z",
    year: "2023",
    periodLabel: "Mei 2023",
    editionLabel: "Laporan Seminar",
    author: "Divisi Seminar",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Prosiding kegiatan seminar nasional sebagai arsip resmi materi dan catatan pembicara.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-8",
    slug: "manajemen-limbah-organik-di-pasar-induk-caringin",
    title: "Manajemen Limbah Organik di Pasar Induk Caringin",
    excerpt:
      "Studi kasus pengolahan limbah organik untuk meningkatkan efisiensi rantai distribusi pascapanen.",
    category: "studi-kasus",
    categoryLabel: "Studi Kasus",
    coverImageSrc: "/assets/figma/report-related-waste.png",
    publishedAt: "2024-02-05T00:00:00.000Z",
    year: "2024",
    periodLabel: "Feb 2024",
    editionLabel: "Studi Kasus",
    author: "Tim Kajian",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Laporan ini memetakan proses pemanfaatan limbah organik di pusat distribusi pangan perkotaan.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-9",
    slug: "implementasi-panel-surya-pada-pengolahan-pasca-panen",
    title: "Implementasi Panel Surya pada Pengolahan Pasca Panen",
    excerpt:
      "Laporan teknis penerapan energi terbarukan dalam sistem pengeringan komoditas.",
    category: "laporan-teknis",
    categoryLabel: "Laporan Teknis",
    coverImageSrc: "/assets/figma/report-related-solar.png",
    publishedAt: "2024-01-20T00:00:00.000Z",
    year: "2024",
    periodLabel: "Jan 2024",
    editionLabel: "Laporan Teknis",
    author: "Tim Teknologi",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Eksperimen teknis yang membahas kelayakan panel surya untuk mendukung pengolahan pascapanen skala komunitas.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-10",
    slug: "digitalisasi-rantai-pasok-pangan-di-jawa-barat",
    title: "Digitalisasi Rantai Pasok Pangan di Jawa Barat",
    excerpt:
      "Editorial mengenai peluang digitalisasi distribusi pangan dan koordinasi lintas pelaku.",
    category: "editorial",
    categoryLabel: "Editorial",
    coverImageSrc: "/assets/figma/report-related-digital.png",
    publishedAt: "2024-01-10T00:00:00.000Z",
    year: "2024",
    periodLabel: "Jan 2024",
    editionLabel: "Editorial",
    author: "Tim Editorial",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Tinjauan editorial atas peluang dan tantangan digitalisasi rantai pasok pangan di Jawa Barat.</p></section>",
    relatedSlugs: [],
  },
];

export const seedStore: CmsStore = {
  settings: seedSettings,
  pages: seedPages,
  activities: seedActivities,
  reports: seedReports,
};
