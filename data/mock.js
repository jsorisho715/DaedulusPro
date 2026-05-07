// Mock data for the Daedalus Pro vendor portal pilot.
// Single pilot vendor: "Daedalus Trades & Technology" — full-stack contractor in Phoenix metro.

window.MOCK = (function () {
  const VENDOR = {
    id: "v_daedalus",
    legalName: "Daedalus Trades & Technology, LLC",
    dba: "Daedalus",
    ein: "87-2349911",
    structure: "LLC",
    yearFounded: 2019,
    hq: "1820 W Roosevelt St, Phoenix, AZ 85007",
    employees: 24,
    revenueBand: "$3M – $7M",
    description:
      "Full-spectrum contractor for multifamily: access control, IoT, low-voltage, gates, lighting, WiFi, locksmithing, and general repairs. Phoenix–Scottsdale metro.",
    tier: "Preferred", // Applicant | Verified | Preferred | Elite
    score: 87,
    trades: [
      { name: "Access Control", depth: "Expert" },
      { name: "Low-Voltage", depth: "Expert" },
      { name: "IoT Installer", depth: "Expert" },
      { name: "Locksmith", depth: "Proficient" },
      { name: "Gate Tech", depth: "Proficient" },
      { name: "WiFi / Networking", depth: "Expert" },
      { name: "Electrical", depth: "Proficient" },
      { name: "Plumbing", depth: "Familiar" },
      { name: "General Contractor", depth: "Proficient" },
    ],
    serviceArea: {
      hubs: ["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler", "Glendale"],
      radiusMiles: 35,
    },
    scoreBreakdown: {
      compliance: 96,
      jobPerformance: 88,
      financial: 82,
      longevity: 71,
    },
  };

  const TEAM = [
    { id: "u_jm",  name: "Johnathan Marquez",  role: "Owner / Principal", initials: "JM", color: "#B08654", phone: "(602) 555-0118", email: "j.marquez@daedalus.work", trades: ["GC", "Low-Voltage"] },
    { id: "u_ka",  name: "Kara Alvarez",       role: "Operations Admin",  initials: "KA", color: "#7A8B4C", phone: "(602) 555-0144", email: "k.alvarez@daedalus.work" },
    { id: "u_dr",  name: "Devin Rojas",        role: "Dispatcher",        initials: "DR", color: "#4A6378", phone: "(602) 555-0102", email: "d.rojas@daedalus.work" },
    { id: "u_es",  name: "Elena Sato",         role: "Estimator",         initials: "ES", color: "#D08A2E", phone: "(602) 555-0177", email: "e.sato@daedalus.work" },
    { id: "u_mp",  name: "Miguel Padilla",     role: "Field Lead",        initials: "MP", color: "#B0463A", phone: "(602) 555-0163", trades: ["Access Control", "Low-Voltage"] },
    { id: "u_th",  name: "Tasha Holt",         role: "Field Lead",        initials: "TH", color: "#8E6A3F", phone: "(602) 555-0151", trades: ["IoT", "WiFi"] },
    { id: "u_rb",  name: "Ricky Bennett",      role: "Field Tech",        initials: "RB", color: "#7B94A8", phone: "(602) 555-0185", trades: ["Locksmith", "Gate"] },
    { id: "u_jc",  name: "Jada Carter",        role: "Field Tech",        initials: "JC", color: "#A4B27A", phone: "(602) 555-0192", trades: ["IoT", "Electrical"] },
    { id: "u_ow",  name: "Owen Whitaker",      role: "Field Tech",        initials: "OW", color: "#C99E72", phone: "(602) 555-0139", trades: ["Low-Voltage", "WiFi"] },
    { id: "u_pn",  name: "Priya Nair",         role: "Bookkeeper",        initials: "PN", color: "#4A6378", phone: "(602) 555-0167", email: "p.nair@daedalus.work" },
  ];

  const PMCS = [
    { id: "pmc_meridian",  name: "Meridian Living",        properties: 14, logo: "ML" },
    { id: "pmc_solana",    name: "Solana Residential",     properties:  9, logo: "SR" },
    { id: "pmc_redrock",   name: "Red Rock Capital Mgmt",  properties: 22, logo: "RR" },
    { id: "pmc_palmcrest", name: "Palmcrest Properties",   properties:  6, logo: "PC" },
  ];

  const PROPERTIES = [
    { id: "p_aria",     name: "Aria on Camelback",        pmc: "pmc_meridian",  units: 312, addr: "4150 N Camelback Rd, Phoenix, AZ 85018",   year: 2018 },
    { id: "p_solano",   name: "Solano Lofts",             pmc: "pmc_solana",    units: 168, addr: "210 E Roosevelt St, Phoenix, AZ 85004",     year: 2014 },
    { id: "p_oldtown",  name: "The Marquee at Old Town",  pmc: "pmc_meridian",  units: 244, addr: "7150 E Camelback Rd, Scottsdale, AZ 85251", year: 2020 },
    { id: "p_palomar",  name: "Palomar Heights",          pmc: "pmc_redrock",   units: 196, addr: "1900 W Baseline Rd, Tempe, AZ 85283",       year: 2016 },
    { id: "p_canyon",   name: "Canyon Ridge Apartments",  pmc: "pmc_redrock",   units: 288, addr: "5400 E Bell Rd, Scottsdale, AZ 85254",      year: 2011 },
    { id: "p_verdant",  name: "Verdant at Tempe Town",    pmc: "pmc_solana",    units: 220, addr: "660 N Mill Ave, Tempe, AZ 85281",           year: 2019 },
    { id: "p_sage",     name: "Sage at Chandler Heights", pmc: "pmc_palmcrest", units: 144, addr: "2950 S Alma School Rd, Chandler, AZ 85248", year: 2017 },
  ];

  // statuses: unassigned, awaiting-bid, scheduled, en-route, on-site, completed, on-hold, awaiting-approval, invoiced, paid
  // urgency: emergency, urgent, routine, scheduled
  // bidStatus (vendor pipeline, PRD §3.3.6): null | drafting | submitted | countered | awarded | lost | expired
  // aiEstimate (PRD §3.3.5): { confidence, total, labor, materials, travel, markupPct, netToVendor, version, generatedAt, callouts, flaggedForReview, source }
  const WOS = [
    {
      id: "WO-3041", title: "Front gate operator failing intermittently", category: "Gate", urgency: "urgent",
      property: "p_canyon", unit: null, location: "Exterior — main vehicle gate",
      status: "awaiting-bid", mode: "competitive", scheduled: null, sla: { hours: 24, remaining: 6.5 },
      total: 4280, vendorId: "v_daedalus", techId: null,
      desc: "North entry vehicle gate has intermittent reverse-on-close. Hits the safety loop sporadically. Pedestrian gate functioning. Suspect bad photo eye + worn rack pinion.",
      createdBy: "Sasha Whitfield (PM)", createdAt: "2026-05-02T09:14:00",
      photos: 4, bidsCount: 3, mine: { submitted: false, draft: true },
      bidStatus: "drafting", bidExpiresAt: "2026-05-06T17:00:00", myBidAmount: 4280, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "high", version: 2, generatedAt: "2026-05-02T09:18:00",
        labor: 1440, materials: 1255, travel: 265, markupPct: 12, total: 4280, netToVendor: 3850,
        flaggedForReview: false, source: "Photos · gate operator template · RSMeans 85254 · 14 prior gate jobs",
        callouts: [
          { x: 0.30, y: 0.42, label: "fractured photo eye lens" },
          { x: 0.62, y: 0.71, label: "worn rack pinion gear" },
        ],
      },
    },
    {
      id: "WO-3038", title: "Smart lock pairing — 12 units", category: "Access Control", urgency: "routine",
      property: "p_aria", unit: "Bldg 3 (units 301–312)", location: "In-unit",
      status: "scheduled", mode: "direct", scheduled: "2026-05-06T08:00:00", sla: { hours: 96, remaining: 38.0 },
      total: 3120, vendorId: "v_daedalus", techId: "u_jc",
      desc: "Re-pair Schlage Encode Plus locks in 12 turn units after WiFi mesh cutover. Confirm Z-Wave handshake to Aria's Yardi-side IoT hub. PTE not required (vacant turn units).",
      createdBy: "Marcus Greene (PM)", createdAt: "2026-05-01T13:22:00",
      photos: 0, bidsCount: 0,
      bidStatus: "awarded", bidExpiresAt: null, myBidAmount: 3120, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "high", version: 1, generatedAt: "2026-05-01T13:30:00",
        labor: 1620, materials: 1080, travel: 120, markupPct: 11, total: 3120, netToVendor: 2810,
        flaggedForReview: false, source: "Access-control template · 12-unit batch · Aria Yardi IoT hub",
        callouts: [],
      },
    },
    {
      id: "WO-3036", title: "Mesh AP swap — Bldg 2 amenity center", category: "WiFi", urgency: "routine",
      property: "p_oldtown", unit: "Amenity / clubhouse", location: "Common area",
      status: "on-site", mode: "direct", scheduled: "2026-05-04T10:00:00", sla: { hours: 96, remaining: 18.0 },
      total: 1860, vendorId: "v_daedalus", techId: "u_ow",
      desc: "Replace 3 EOL Ruckus APs with Cambium XV2-2T. Re-tune coverage in the gym corner. Amenity coverage trace included.",
      createdBy: "Marcus Greene (PM)", createdAt: "2026-04-30T09:00:00",
      photos: 6, bidsCount: 0,
      bidStatus: "awarded", bidExpiresAt: null, myBidAmount: 1860, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "high", version: 1, generatedAt: "2026-04-30T09:08:00",
        labor: 720, materials: 940, travel: 80, markupPct: 10, total: 1860, netToVendor: 1690,
        flaggedForReview: false, source: "WiFi AP install template · Cambium XV2-2T price feed",
        callouts: [],
      },
    },
    {
      id: "WO-3033", title: "Pool gate self-closer broken (life-safety)", category: "Gate", urgency: "emergency",
      property: "p_verdant", unit: "Pool deck", location: "Exterior — pool enclosure",
      status: "completed", mode: "direct", scheduled: "2026-05-03T19:30:00", sla: { hours: 4, remaining: 0 },
      total: 612, vendorId: "v_daedalus", techId: "u_rb",
      desc: "Self-closing pool gate hardware failed. Replaced LCN 1461 closer + hinges. Re-tested at 3 lb close pull.",
      createdBy: "On-call dispatch (auto)", createdAt: "2026-05-03T18:11:00",
      photos: 8, bidsCount: 0,
      bidStatus: "awarded", bidExpiresAt: null, myBidAmount: 612, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "high", version: 1, generatedAt: "2026-05-03T18:14:00",
        labor: 290, materials: 220, travel: 80, markupPct: 8, total: 612, netToVendor: 565,
        flaggedForReview: false, source: "Emergency gate-closer template · life-safety SLA premium",
        callouts: [],
      },
    },
    {
      id: "WO-3029", title: "Camera replacements — 4 corridor cams", category: "Low-Voltage", urgency: "routine",
      property: "p_palomar", unit: "Bldg 1 corridors", location: "Common area",
      status: "invoiced", mode: "direct", scheduled: "2026-04-29T08:00:00", sla: { hours: 96, remaining: 0 },
      total: 2410, vendorId: "v_daedalus", techId: "u_mp",
      desc: "Replaced 4 Hanwha PNV-A6081R cameras with refreshed PoE drops, retuned NVR retention to 30 days.",
      createdBy: "Lila Tran (PM)", createdAt: "2026-04-26T11:40:00",
      photos: 11, bidsCount: 0,
      bidStatus: "awarded", bidExpiresAt: null, myBidAmount: 2410, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "high", version: 1, generatedAt: "2026-04-26T11:48:00",
        labor: 960, materials: 1248, travel: 0, markupPct: 8, total: 2410, netToVendor: 2160,
        flaggedForReview: false, source: "Camera-replace template · Hanwha PNV-A6081R catalog",
        callouts: [],
      },
    },
    {
      id: "WO-3026", title: "Access control reader — clubhouse main entry", category: "Access Control", urgency: "urgent",
      property: "p_solano", unit: "Clubhouse", location: "Common area",
      status: "en-route", mode: "direct", scheduled: "2026-05-04T13:00:00", sla: { hours: 24, remaining: 3.5 },
      total: 980, vendorId: "v_daedalus", techId: "u_mp",
      desc: "HID Signo reader at clubhouse main door not reading mobile credentials. Wired tested at controller, suspect reader failure.",
      createdBy: "Diego Martín (Maint Sup)", createdAt: "2026-05-04T08:42:00",
      photos: 2, bidsCount: 0,
      bidStatus: "awarded", bidExpiresAt: null, myBidAmount: 980, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "high", version: 1, generatedAt: "2026-05-04T08:46:00",
        labor: 360, materials: 420, travel: 80, markupPct: 12, total: 980, netToVendor: 880,
        flaggedForReview: false, source: "Access-reader template · HID Signo 20 catalog",
        callouts: [
          { x: 0.50, y: 0.45, label: "reader LED dark" },
        ],
      },
    },
    {
      id: "WO-3024", title: "Recurring leak at gym water fountain", category: "Plumbing", urgency: "routine",
      property: "p_sage", unit: "Gym", location: "Common area",
      status: "scheduled", mode: "direct", scheduled: "2026-05-07T11:00:00", sla: { hours: 96, remaining: 70.0 },
      total: 540, vendorId: "v_daedalus", techId: "u_jc",
      desc: "Bottle-fill fountain leaking from supply elbow. Replace stop + flex line.",
      createdBy: "Heather Quinn (PM)", createdAt: "2026-05-02T16:30:00",
      photos: 1, bidsCount: 0,
      bidStatus: "awarded", bidExpiresAt: null, myBidAmount: 540, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "medium", version: 1, generatedAt: "2026-05-02T16:34:00",
        labor: 240, materials: 180, travel: 60, markupPct: 14, total: 540, netToVendor: 470,
        flaggedForReview: false, source: "Plumbing template · only 1 photo — wall conditions unknown",
        callouts: [
          { x: 0.45, y: 0.66, label: "supply elbow drip" },
        ],
      },
    },
    {
      id: "WO-3021", title: "Doorbell cameras — 8 unit pilot", category: "IoT", urgency: "routine",
      property: "p_aria", unit: "Bldg 1 — units 101–108", location: "In-unit (door)",
      status: "unassigned", mode: "direct", scheduled: null, sla: { hours: 96, remaining: 92.0 },
      total: 1640, vendorId: "v_daedalus", techId: null,
      desc: "Install 8 Aiphone IXG-DM7 doorbell cams. Tie into resident app. PTE required for each.",
      createdBy: "Marcus Greene (PM)", createdAt: "2026-05-04T07:00:00",
      photos: 0, bidsCount: 0,
      bidStatus: "submitted", bidExpiresAt: "2026-05-08T17:00:00", myBidAmount: 1640, aiVsMineDelta: 0,
      aiEstimate: {
        confidence: "low", version: 1, generatedAt: "2026-05-04T07:08:00",
        labor: 720, materials: 760, travel: 60, markupPct: 12, total: 1640, netToVendor: 1480,
        flaggedForReview: true, source: "IoT template — 0 photos available, awaiting PM intake images",
        callouts: [],
      },
    },
  ];

  // BIDS_PIPELINE — historical / closed-out vendor bid pipeline entries that
  // round out the Bids tab beyond the live WOs above. Lost / expired / awarded
  // bids that no longer have a live WO record but still belong in the pipeline.
  const BIDS_PIPELINE = [
    {
      id: "BP-2204", woRef: "WO-3018", title: "Garage roll-up door operator service",
      property: "p_canyon", category: "Gate", urgency: "routine",
      bidStatus: "lost", submittedAt: "2026-04-22T11:14:00", decidedAt: "2026-04-25T09:00:00",
      myBidAmount: 2840, aiEstimateTotal: 2960, winningBidAmount: 2410, winner: "Apex Mechanical",
      qualityScore: 88, expiresAt: null, lossReason: "Underbid by 15% — Apex absorbed travel.",
    },
    {
      id: "BP-2196", woRef: "WO-3014", title: "Boiler room access door — re-key + master",
      property: "p_palomar", category: "Locksmith", urgency: "urgent",
      bidStatus: "awarded", submittedAt: "2026-04-19T08:42:00", decidedAt: "2026-04-19T15:30:00",
      myBidAmount: 1180, aiEstimateTotal: 1180, winningBidAmount: 1180, winner: "Daedalus",
      qualityScore: 94, expiresAt: null, lossReason: null,
    },
    {
      id: "BP-2189", woRef: "WO-3009", title: "Mailroom CCTV NVR upgrade",
      property: "p_oldtown", category: "Low-Voltage", urgency: "routine",
      bidStatus: "expired", submittedAt: null, decidedAt: null,
      myBidAmount: null, aiEstimateTotal: 4120, winningBidAmount: null, winner: null,
      qualityScore: null, expiresAt: "2026-04-12T17:00:00", lossReason: "Bid window closed before draft submitted.",
    },
    {
      id: "BP-2182", woRef: "WO-3004", title: "Building 2 secondary entry intercom",
      property: "p_solano", category: "Access Control", urgency: "routine",
      bidStatus: "countered", submittedAt: "2026-04-10T14:22:00", decidedAt: null,
      myBidAmount: 3640, aiEstimateTotal: 3450, winningBidAmount: null, winner: null,
      qualityScore: 86, expiresAt: "2026-05-09T17:00:00",
      lossReason: null, counterAmount: 3300, counterNote: "PM countered at $3,300; awaiting our response.",
    },
  ];

  // ESTIMATES_QUEUE — vendor-side AI estimates queue (PRD §3.3.5 vendor POV).
  // estStatus: ai-generating | draft | pending-review | ready-to-send | sent | change-order
  const ESTIMATES_QUEUE = [
    {
      id: "EST-4012", woRef: "WO-3041", title: "Front gate operator — competitive bid draft",
      property: "p_canyon", category: "Gate",
      estStatus: "ready-to-send", confidence: "high", total: 4280, netToVendor: 3850,
      lastRevisionAt: "2026-05-03T18:42:00", revisionAuthor: "Elena Sato (Estimator)", version: 2,
      flaggedForReview: false,
    },
    {
      id: "EST-4011", woRef: "WO-3021", title: "Doorbell cameras — pilot install",
      property: "p_aria", category: "IoT",
      estStatus: "pending-review", confidence: "low", total: 1640, netToVendor: 1480,
      lastRevisionAt: "2026-05-04T07:08:00", revisionAuthor: "Daedalus AI", version: 1,
      flaggedForReview: true, flagReason: "Confidence below threshold — 0 photos uploaded yet.",
    },
    {
      id: "EST-4009", woRef: "WO-3024", title: "Gym water-fountain recurring leak",
      property: "p_sage", category: "Plumbing",
      estStatus: "sent", confidence: "medium", total: 540, netToVendor: 470,
      lastRevisionAt: "2026-05-02T16:34:00", revisionAuthor: "Daedalus AI", version: 1,
      flaggedForReview: false,
    },
    {
      id: "EST-4007", woRef: "WO-3036", title: "Amenity AP swap — change order delta",
      property: "p_oldtown", category: "WiFi",
      estStatus: "change-order", confidence: "medium", total: 410, netToVendor: 360,
      lastRevisionAt: "2026-05-04T11:20:00", revisionAuthor: "Owen Whitaker (tech)", version: 2,
      flaggedForReview: false,
      coDelta: 410, coReason: "Discovered failed PoE injector in IDF — needs replacement to complete.",
    },
    {
      id: "EST-4006", woRef: null, title: "Solano clubhouse — reader retrofit (pre-bid draft)",
      property: "p_solano", category: "Access Control",
      estStatus: "draft", confidence: "medium", total: 2240, netToVendor: 2010,
      lastRevisionAt: "2026-05-04T16:10:00", revisionAuthor: "Elena Sato (Estimator)", version: 1,
      flaggedForReview: false,
    },
    {
      id: "EST-4005", woRef: null, title: "Verdant pool deck — emergency lighting refresh",
      property: "p_verdant", category: "Electrical",
      estStatus: "ai-generating", confidence: "—", total: null, netToVendor: null,
      lastRevisionAt: "2026-05-05T09:02:00", revisionAuthor: "Daedalus AI", version: 0,
      flaggedForReview: false,
    },
  ];

  // Bid leveling — three bids on WO-3041
  const BIDS = [
    {
      id: "b_dae",  woId: "WO-3041", vendorId: "v_daedalus",
      vendor: "Daedalus", tier: "Preferred", isMine: true,
      total: 4280,
      schedule: { startEarliest: "2026-05-06", durationDays: 1 },
      qualityScore: 92,
      lines: [
        { scope: "Photo eye replacement (pair)",            qty: 1, unit: "ea", unitCost: 285,  total: 285  },
        { scope: "Rack pinion gear replacement",            qty: 1, unit: "ea", unitCost: 410,  total: 410  },
        { scope: "Loop detector recalibration",             qty: 1, unit: "ea", unitCost: 180,  total: 180  },
        { scope: "Gate operator full PM service",           qty: 1, unit: "ea", unitCost: 320,  total: 320  },
        { scope: "Labor — senior gate tech",                qty: 6, unit: "hr", unitCost: 145,  total: 870  },
        { scope: "Labor — assist tech",                     qty: 6, unit: "hr", unitCost: 95,   total: 570  },
        { scope: "Materials & misc hardware",               qty: 1, unit: "ls", unitCost: 380,  total: 380  },
        { scope: "Travel & after-hours (urgent surcharge)", qty: 1, unit: "ls", unitCost: 265,  total: 265  },
        { scope: "Markup (12%)",                            qty: 1, unit: "ls", unitCost: 1000, total: 1000 },
      ],
      notes: "Bid assumes existing 24V supply is healthy (verified at intake). 90-day warranty on components, 1-year on labor.",
      flags: [],
    },
    {
      id: "b_ironcrest", woId: "WO-3041", vendorId: "v_iron",
      vendor: "Ironcrest Gate Co.", tier: "Verified", isMine: false,
      total: 5720,
      schedule: { startEarliest: "2026-05-08", durationDays: 1 },
      qualityScore: 78,
      lines: [
        { scope: "Photo eye replacement (pair)",  qty: 1, unit: "ea", unitCost: 340,  total: 340  },
        { scope: "Rack pinion gear replacement",  qty: 1, unit: "ea", unitCost: 520,  total: 520  },
        { scope: "Loop detector recalibration",   qty: 1, unit: "ea", unitCost: 0,    total: 0    },
        { scope: "Gate operator full PM service", qty: 1, unit: "ea", unitCost: 410,  total: 410  },
        { scope: "Labor — senior gate tech",      qty: 8, unit: "hr", unitCost: 165,  total: 1320 },
        { scope: "Labor — assist tech",           qty: 8, unit: "hr", unitCost: 110,  total: 880  },
        { scope: "Materials & misc hardware",     qty: 1, unit: "ls", unitCost: 720,  total: 720  },
        { scope: "Travel & after-hours",          qty: 1, unit: "ls", unitCost: 280,  total: 280  },
        { scope: "Markup (22%)",                  qty: 1, unit: "ls", unitCost: 1250, total: 1250 },
      ],
      notes: "Schedule slip 48 hours, requires gate down 6 hours minimum.",
      flags: ["missing_scope:loop_detector", "labor_high"],
    },
    {
      id: "b_apex", woId: "WO-3041", vendorId: "v_apex",
      vendor: "Apex Mechanical", tier: "Verified", isMine: false,
      total: 3260,
      schedule: { startEarliest: "2026-05-09", durationDays: 1 },
      qualityScore: 64,
      lines: [
        { scope: "Photo eye replacement (pair)",   qty: 1, unit: "ea", unitCost: 220, total: 220 },
        { scope: "Rack pinion gear replacement",   qty: 0, unit: "ea", unitCost: 0,   total: 0   },
        { scope: "Loop detector recalibration",    qty: 1, unit: "ea", unitCost: 140, total: 140 },
        { scope: "Gate operator full PM service",  qty: 0, unit: "ea", unitCost: 0,   total: 0   },
        { scope: "Labor — senior gate tech",       qty: 4, unit: "hr", unitCost: 125, total: 500 },
        { scope: "Labor — assist tech",            qty: 4, unit: "hr", unitCost: 75,  total: 300 },
        { scope: "Materials & misc hardware",      qty: 1, unit: "ls", unitCost: 240, total: 240 },
        { scope: "Travel & after-hours",           qty: 1, unit: "ls", unitCost: 180, total: 180 },
        { scope: "Markup (28%)",                   qty: 1, unit: "ls", unitCost: 680, total: 680 },
      ],
      notes: "Cannot guarantee permanent fix without rack/pinion replacement; recommends future PM scope.",
      flags: ["missing_scope:rack_pinion", "missing_scope:pm_service", "low_total"],
    },
  ];

  // Compliance vault — documents
  const DOCS = [
    { id: "d_coi",    type: "COI",          name: "ACORD 25 — General Liability + Auto",  carrier: "Travelers", uploaded: "2026-01-12", expires: "2026-12-31", status: "current",  size: "412 KB" },
    { id: "d_coi_um", type: "COI",          name: "ACORD 25 — $5M Umbrella",                carrier: "Travelers", uploaded: "2026-01-12", expires: "2026-12-31", status: "current",  size: "298 KB" },
    { id: "d_w9",     type: "W-9",          name: "W-9 — Daedalus Trades & Tech, LLC",      carrier: null,        uploaded: "2026-01-08", expires: "2027-01-08", status: "current",  size: "62 KB" },
    { id: "d_lic_az", type: "License",      name: "AZ ROC — KB-2 Dual Licensed",            carrier: "AZ ROC",    uploaded: "2025-08-04", expires: "2026-05-21", status: "expiring", size: "188 KB" },
    { id: "d_lic_lv", type: "License",      name: "AZ ROC — CR-67 Low Voltage",             carrier: "AZ ROC",    uploaded: "2025-08-04", expires: "2026-08-04", status: "current",  size: "172 KB" },
    { id: "d_epa",    type: "Certification",name: "EPA Section 608 — Universal",            carrier: "EPA",       uploaded: "2024-06-11", expires: "Lifetime",   status: "current",  size: "84 KB" },
    { id: "d_osha",   type: "Certification",name: "OSHA 30 — Construction (Marquez)",       carrier: "OSHA",      uploaded: "2024-09-22", expires: "2027-09-22", status: "current",  size: "112 KB" },
    { id: "d_bond",   type: "License",      name: "Contractor Bond — $25K",                  carrier: "Merchants",uploaded: "2025-07-01", expires: "2026-07-01", status: "current",  size: "240 KB" },
    { id: "d_lien",   type: "Lien Waiver",  name: "AZ Conditional Final — WO-3029",         carrier: null,        uploaded: "2026-04-30", expires: null,         status: "current",  size: "48 KB" },
    { id: "d_bgc",    type: "Background",   name: "Checkr report — M. Padilla",             carrier: "Checkr",    uploaded: "2025-11-02", expires: "2026-11-02", status: "current",  size: "96 KB" },
    { id: "d_bgc2",   type: "Background",   name: "Checkr report — J. Carter",              carrier: "Checkr",    uploaded: "2024-12-18", expires: "2025-12-18", status: "expired",  size: "94 KB" },
    { id: "d_drug",   type: "Drug Screen",  name: "Drug screens — All field staff (Q2)",    carrier: "Quest",     uploaded: "2026-04-04", expires: "2026-10-04", status: "current",  size: "210 KB" },
  ];

  // Onboarding — application status
  const ONBOARDING = {
    submittedAt: "2026-04-22T11:30:00",
    stages: [
      { key: "submitted",  label: "Submitted",            done: true,  on: "2026-04-22" },
      { key: "compliance", label: "Compliance Review",    done: true,  on: "2026-04-25" },
      { key: "background", label: "Background Checks",    done: true,  on: "2026-04-29" },
      { key: "references", label: "References Contacted", done: true,  on: "2026-05-01" },
      { key: "decision",   label: "Decision",             done: false, on: null, active: true },
    ],
    specialist: { name: "Anya Kowalski", title: "Compliance Specialist", initials: "AK", email: "a.kowalski@daedalus.work", phone: "(602) 555-0188" },
    checklist: [
      { label: "Company information", done: true },
      { label: "Service area mapped (Phoenix metro, 35-mi radius)", done: true },
      { label: "9 trades + 27 sub-skills", done: true },
      { label: "AZ ROC dual license verified", done: true },
      { label: "$2M / $5M COI on file", done: true },
      { label: "W-9 on file (TIN match passed)", done: true },
      { label: "10 team members onboarded", done: true },
      { label: "Background checks: 9 of 10 cleared", done: false },
      { label: "Drug screens: complete", done: true },
      { label: "5 references contacted, 4 returned", done: false },
      { label: "Pricing acknowledgment signed", done: true },
    ],
    eta: "Typical review: 5–7 business days. You're on day 12 — Decision review now.",
  };

  // Dispatcher columns
  const TODAY_DISPATCH = {
    "Unassigned":     ["WO-3021"],
    "Assigned":       ["WO-3038", "WO-3024"],
    "En Route":       ["WO-3026"],
    "On Site":        ["WO-3036"],
    "Completed Today":["WO-3033"],
  };

  // Invoice
  const INVOICE = {
    id: "INV-1078",
    woId: "WO-3029",
    issued: "2026-04-30",
    due: "2026-05-30",
    status: "Sent",
    pmc: "Red Rock Capital Mgmt",
    property: "Palomar Heights",
    propertyAddr: "1900 W Baseline Rd, Tempe, AZ 85283",
    poRef: "RR-PO-22408",
    bill_to: "Red Rock Capital Mgmt — AP\n4500 N Central Ave, Suite 1200\nPhoenix, AZ 85012",
    lines: [
      { code: "27 41 33", desc: "Hanwha PNV-A6081R IP camera",       qty: 4, unit: "ea", price: 312, ext: 1248 },
      { code: "27 11 00", desc: "PoE drop labor / cert",              qty: 4, unit: "ea", price: 95,  ext: 380  },
      { code: "27 41 33", desc: "Mounting hardware kit",               qty: 4, unit: "ea", price: 28,  ext: 112  },
      { code: "01 31 00", desc: "Senior tech labor",                   qty: 4, unit: "hr", price: 145, ext: 580  },
      { code: "01 31 00", desc: "Assist tech labor",                   qty: 4, unit: "hr", price: 95,  ext: 380  },
      { code: "00 73 00", desc: "NVR retention recon. & system test",  qty: 1, unit: "ls", price: 240, ext: 240  },
      { code: "01 21 00", desc: "Markup (8%)",                          qty: 1, unit: "ls", price: 195, ext: 195  },
    ],
    subtotal: 3135,
    tax: 0,
    retainage: -156, // 5%
    total: 2979, // after retainage hold
    grossTotal: 3135,
    daedalusFee: -250, // 8% platform fee approximate
    netToVendor: 2729,
    factoringEligible: true,
    factoringFee: 41,
    factoringNet: 2688,
  };

  // ──────────────────────────────────────────────────────────────────────
  // FIELD APP DATA — templates, queue, time tracking, gamification, settings
  // Drives screens/Field.jsx mobile app. Each work order in the field is
  // backed by a template that defines the checklist + close-out method per
  // task (check / photo / comment / measurement / scan).
  // ──────────────────────────────────────────────────────────────────────

  const FIELD_TEMPLATES = {
    // --- Access Control: HID Signo reader replacement (matches WO-3026) ---
    "tpl_access_reader": {
      id: "tpl_access_reader", category: "Access Control",
      label: "Access control reader — replace",
      color: "var(--bronze)", icon: "key",
      duration: "75 min",
      materials: [
        { p: "HID Signo 20 — Mullion",   qty: 1, unit: "ea",  cost: 248 },
        { p: "Wiegand 22/6 cable",        qty: 8, unit: "ft",  cost: 22  },
        { p: "Tap connectors",            qty: 4, unit: "ea",  cost: 6   },
        { p: "Mullion mount kit",         qty: 1, unit: "ea",  cost: 32  },
      ],
      tasks: [
        { id: "t1", kind: "check",       label: "Confirm reader make/model on site",                  required: true,  hint: "HID Signo 20, P/N 20NKS-T0" },
        { id: "t2", kind: "measurement", label: "Test failed reader at controller (multimeter)",      required: true,  hint: "Expect 12 VDC ± 0.5",  unit: "VDC", expect: "12 ± 0.5" },
        { id: "t3", kind: "photo",       label: "Photo of existing wiring before disconnect",         required: true,  count: 2 },
        { id: "t4", kind: "check",       label: "De-energize circuit at controller",                  required: true },
        { id: "t5", kind: "comment",     label: "Note any unusual conditions found",                  required: false, hint: "Corrosion, water ingress, prior splice…" },
        { id: "t6", kind: "check",       label: "Pull replacement HID Signo from truck",              required: true },
        { id: "t7", kind: "check",       label: "Mount, terminate Wiegand + 12V power",               required: true },
        { id: "t8", kind: "photo",       label: "Photo of new install (front + back)",                required: true,  count: 2 },
        { id: "t9", kind: "scan",        label: "Test mobile credential read (3 cards)",              required: true,  count: 3 },
        { id: "t10", kind: "check",      label: "Reactivate door in C•Cure 9000",                     required: true },
      ],
    },
    // --- IoT: Smart thermostat / IoT hub install (matches WO-3021 doorbell-cam vibe) ---
    "tpl_iot_thermostat": {
      id: "tpl_iot_thermostat", category: "IoT",
      label: "IoT thermostat install + pair",
      color: "var(--slateblue)", icon: "chip",
      duration: "60 min",
      materials: [
        { p: "ecobee SmartThermostat",    qty: 1, unit: "ea",  cost: 218 },
        { p: "Power adapter (24 VAC)",    qty: 1, unit: "ea",  cost: 18  },
        { p: "Wall plate trim",           qty: 1, unit: "ea",  cost: 12  },
        { p: "Wire labels (kit)",         qty: 1, unit: "kit", cost: 4   },
      ],
      tasks: [
        { id: "t1", kind: "photo",       label: "Photo of existing thermostat + wiring",              required: true,  count: 1 },
        { id: "t2", kind: "check",       label: "Power off HVAC at breaker",                          required: true,  hint: "Test with non-contact tester before touching wires" },
        { id: "t3", kind: "comment",     label: "Identify wire colors (R / W / Y / G / C)",            required: true,  hint: "Type out the mapping you see" },
        { id: "t4", kind: "check",       label: "Mount new device, level",                            required: true },
        { id: "t5", kind: "photo",       label: "Photo of completed install",                         required: true,  count: 1 },
        { id: "t6", kind: "scan",        label: "Pair device to Daedalus IoT cloud",                  required: true,  hint: "Scan QR on back of unit", count: 1 },
        { id: "t7", kind: "measurement", label: "Test heat call → measure temp rise (10 min)",        required: true,  unit: "°F", expect: "+2.0 to +4.0" },
        { id: "t8", kind: "measurement", label: "Test cool call → measure temp drop (10 min)",        required: true,  unit: "°F", expect: "-2.0 to -4.0" },
        { id: "t9", kind: "check",       label: "Confirm app shows live readings on resident phone",  required: true },
        { id: "t10", kind: "comment",    label: "Customer-facing summary (auto-sent to resident)",    required: false },
      ],
    },
    // --- WiFi: Access point install (PRD template "WiFi access point install") ---
    "tpl_wifi_ap": {
      id: "tpl_wifi_ap", category: "WiFi",
      label: "WiFi access point install",
      color: "var(--olive)", icon: "wifi",
      duration: "90 min",
      materials: [
        { p: "Ubiquiti U7 Pro WiFi 7",    qty: 1, unit: "ea",  cost: 279 },
        { p: "PoE+ injector (60 W)",      qty: 1, unit: "ea",  cost: 32  },
        { p: "Cat6 patch cable (50 ft)",  qty: 1, unit: "ea",  cost: 24  },
        { p: "AP ceiling bracket",        qty: 1, unit: "ea",  cost: 14  },
      ],
      tasks: [
        { id: "t1", kind: "photo",       label: "Photo of mounting location pre-install",             required: true,  count: 1 },
        { id: "t2", kind: "check",       label: "Pull Cat6 from IDF to AP location",                  required: true },
        { id: "t3", kind: "measurement", label: "Cable test — continuity, length, attenuation",       required: true,  unit: "ft / dB", expect: "≤ 295 ft, ≤ 3 dB" },
        { id: "t4", kind: "check",       label: "Mount AP to ceiling, terminate Cat6, plug PoE",      required: true },
        { id: "t5", kind: "scan",        label: "Adopt AP in UniFi controller",                       required: true,  hint: "Scan device QR or enter MAC", count: 1 },
        { id: "t6", kind: "measurement", label: "Signal strength at 6 reference points",              required: true,  unit: "dBm", expect: "≥ -65 dBm at 25 ft" },
        { id: "t7", kind: "photo",       label: "Heatmap screenshot from UniFi mobile",               required: true,  count: 1 },
        { id: "t8", kind: "check",       label: "Disable old AP in controller",                       required: true },
        { id: "t9", kind: "comment",     label: "Customer-facing summary",                            required: false },
      ],
    },
  };

  // Today's dispatch queue for the active tech (Miguel Padilla).
  // Each entry references a template + a property + the WO ID.
  const FIELD_QUEUE = [
    { id: "WO-3026", template: "tpl_access_reader",  property: "p_solano",  scheduled: "2026-05-06T13:00:00", urgency: "urgent",  status: "active",    distanceMi: 3.4,  etaMin: 9,  contact: "Diego Martín · Maint Sup", phone: "(602) 555-0211", note: "Clubhouse main entry. Fob box on side wall." },
    { id: "WO-3038", template: "tpl_iot_thermostat", property: "p_aria",    scheduled: "2026-05-06T15:30:00", urgency: "routine", status: "scheduled", distanceMi: 7.8,  etaMin: 22, contact: "Marcus Greene · PM",       phone: "(602) 555-0144", note: "Vacant turn unit 304. Lockbox 4231." },
    { id: "WO-3036", template: "tpl_wifi_ap",        property: "p_oldtown", scheduled: "2026-05-06T17:00:00", urgency: "routine", status: "scheduled", distanceMi: 12.1, etaMin: 31, contact: "Marcus Greene · PM",       phone: "(602) 555-0144", note: "Amenity center IDF — keys at concierge." },
    { id: "WO-3033", template: "tpl_access_reader",  property: "p_verdant", scheduled: "2026-05-06T11:00:00", urgency: "routine", status: "completed", distanceMi: 0,    etaMin: 0,  contact: "Heather Quinn · PM",       phone: "(602) 555-0167", note: "Completed 11:42 AM. Sign-off Diego M." },
  ];

  const FIELD_TIME = {
    today: { worked: 4.7, billable: 4.2, breakMin: 28 },
    week:  { worked: 31.4, billable: 28.1, target: 40 },
    activeTimer: { woId: "WO-3026", startedAt: "2026-05-06T08:14:00", elapsedSec: 17640 }, // 4h54m
    entries: [
      { id: "te1", woId: "WO-3033", label: "Pool gate self-closer", clockIn: "07:32", clockOut: "08:04", durMin: 32, kind: "job" },
      { id: "te2", woId: null,        label: "Travel to Solano Lofts",  clockIn: "08:04", clockOut: "08:14", durMin: 10, kind: "travel" },
      { id: "te3", woId: "WO-3026", label: "Access reader — Solano",  clockIn: "08:14", clockOut: null,     durMin: 294, kind: "job", active: true },
      { id: "te4", woId: null,        label: "Lunch break",             clockIn: "11:48", clockOut: "12:16", durMin: 28, kind: "break" },
    ],
  };

  // Gamification — badges, ranks, cash rewards, weekly quest.
  // Cash rewards apply on unlock; net-payable to tech via Daedalus AR.
  const FIELD_BADGES = [
    { id: "b_first_signoff", name: "First Sign-Off",        desc: "Complete your first customer-signed job.",                    icon: "medal",     color: "var(--bronze)",     reward: 25,  unlocked: true,  earnedAt: "2025-11-14", progress: { c: 1,  r: 1  } },
    { id: "b_perfect_week",   name: "Perfect Week",          desc: "5 jobs in a week, all on-time, all 5-star resident scores.", icon: "trophy",    color: "var(--amber)",      reward: 100, unlocked: true,  earnedAt: "2026-02-08", progress: { c: 5,  r: 5  } },
    { id: "b_photo_pro",      name: "Photo Pro",             desc: "Submit 100 jobs with all required photos on first try.",     icon: "camera",    color: "var(--olive)",      reward: 50,  unlocked: true,  earnedAt: "2026-03-22", progress: { c: 100, r: 100 } },
    { id: "b_iot_specialist", name: "IoT Specialist",        desc: "Complete 25 IoT-template jobs.",                              icon: "chip",      color: "var(--slateblue)",  reward: 75,  unlocked: false, progress: { c: 18, r: 25 } },
    { id: "b_wifi_whisperer", name: "WiFi Whisperer",        desc: "Pass cable-test threshold on 50 WiFi installs.",              icon: "wifi",      color: "var(--olive)",      reward: 75,  unlocked: false, progress: { c: 31, r: 50 } },
    { id: "b_emergency_ace",  name: "Emergency Ace",         desc: "Respond to 10 emergency dispatches under 90 min ETA.",       icon: "bolt",      color: "var(--terracotta)", reward: 150, unlocked: false, progress: { c: 7,  r: 10 } },
    { id: "b_streak_30",      name: "30-Day Streak",         desc: "Work 30 consecutive days with at least one closed job.",      icon: "flame",     color: "var(--amber)",      reward: 200, unlocked: false, progress: { c: 22, r: 30 } },
    { id: "b_zero_callback",  name: "Zero Callback",         desc: "100 closed jobs with zero callbacks within warranty.",        icon: "shield",    color: "var(--olive)",      reward: 250, unlocked: false, progress: { c: 64, r: 100 } },
    { id: "b_mentor",         name: "Mentor",                desc: "Train 3 new techs through their first 10 jobs.",              icon: "users",     color: "var(--bronze)",     reward: 300, unlocked: false, progress: { c: 1,  r: 3  } },
    { id: "b_mythic",         name: "Mythic",                desc: "Reach Elite tier with 500 lifetime closed jobs.",             icon: "wing",      color: "var(--bronze-deep)",reward: 1000, unlocked: false, progress: { c: 312, r: 500 }, special: true },
  ];

  const FIELD_LEADERBOARD = [
    { id: "u_mp",  name: "Miguel Padilla",   metro: "Phoenix",   jobs30: 64, onTime: 0.97, csat: 4.92, you: true },
    { id: "u_th",  name: "Tasha Holt",       metro: "Phoenix",   jobs30: 61, onTime: 0.95, csat: 4.88 },
    { id: "u_jc",  name: "Jada Carter",      metro: "Phoenix",   jobs30: 58, onTime: 0.94, csat: 4.91 },
    { id: "u_ow",  name: "Owen Whitaker",    metro: "Phoenix",   jobs30: 52, onTime: 0.93, csat: 4.85 },
    { id: "u_rb",  name: "Ricky Bennett",    metro: "Phoenix",   jobs30: 49, onTime: 0.91, csat: 4.79 },
  ];

  // The active "quest of the week" — extra cash bonus on top of base pay.
  const FIELD_QUEST = {
    id: "qw_iot_blitz",
    label: "IoT Blitz",
    desc: "Complete 5 IoT-template jobs by Sunday 11:59 PM.",
    progress: { c: 3, r: 5 },
    reward: 50,
    expires: "2026-05-10T23:59:00",
  };

  // Push-notification stream replayed in the phone frame demo.
  // `at` is the elapsed-seconds since the demo "starts" — Field.jsx uses
  // it to choreograph the slide-ins. Order matters.
  const FIELD_NOTIFS = [
    { id: "pn1", at: 2,  kind: "job",      icon: "workorder", color: "var(--bronze)",     title: "New job assigned",       body: "WO-3038 · Aria on Camelback · Smart lock pairing", route: "queue" },
    { id: "pn2", at: 8,  kind: "message",  icon: "message",   color: "var(--slateblue)",  title: "Diego Martín · Solano",  body: "We left you the side door propped — see you in 10",  route: "job" },
    { id: "pn3", at: 16, kind: "badge",    icon: "trophy",    color: "var(--amber)",      title: "Badge progress · 7/10",  body: "Emergency Ace — 3 more sub-90-min jobs to unlock $150",  route: "profile" },
    { id: "pn4", at: 26, kind: "stock",    icon: "truck",     color: "var(--terracotta)", title: "Truck stock low",        body: "HID Signo 20 — 1 left. Reorder before next emergency.", route: "more" },
    { id: "pn5", at: 38, kind: "schedule", icon: "schedule",  color: "var(--olive)",      title: "Tomorrow's schedule",    body: "4 jobs queued. Optimized route saves 32 min vs. raw order.", route: "queue" },
  ];

  // Tech profile — Miguel Padilla. Powers the gamified Profile page.
  const FIELD_PROFILE = {
    techId: "u_mp",
    tier: "Preferred",                  // current tier
    tierProgressToNext: 0.72,           // 72% to Elite
    nextTier: "Elite",
    rank: 1,                            // metro rank
    rankOf: 47,
    stats: {
      jobs30: 64,
      jobsLifetime: 312,
      onTimeRate: 0.97,
      csat: 4.92,
      photoQuality: 0.98,
      callbackRate: 0.012,
      avgMinutesPerJob: 64,
      streakDays: 22,
    },
    cash: {
      lifetimeEarned: 1450,
      pendingThisMonth: 175,
      lastPayout: { amount: 100, date: "2026-04-30" },
    },
    redemptions: [
      { id: "r1", date: "2026-04-30", amount: 100, label: "Perfect Week × 4 (April)",            status: "paid" },
      { id: "r2", date: "2026-03-22", amount: 50,  label: "Photo Pro unlock",                     status: "paid" },
      { id: "r3", date: "2026-02-08", amount: 100, label: "Perfect Week",                         status: "paid" },
      { id: "r4", date: "2025-11-14", amount: 25,  label: "First Sign-Off",                       status: "paid" },
    ],
  };

  // Default state for the in-app Settings page.
  const FIELD_SETTINGS_DEFAULT = {
    push: {
      master: true,
      newJobs: true,
      customerMessages: true,
      dispatcherAlerts: true,
      badgeUpdates: true,
      stockLow: true,
    },
    quietHours: { enabled: true, from: "21:00", to: "06:00" },
    sound: true,
    haptics: true,
    biometric: true,
    language: "en",
    units: "imperial",
    photoQuality: "hd",
    offlinePack: "auto",
    mapProvider: "google",
    appearance: "system",
    highContrast: false,
    largeText: false,
    truckAutoDeduct: true,
  };

  return {
    VENDOR, TEAM, PMCS, PROPERTIES, WOS, BIDS, BIDS_PIPELINE, ESTIMATES_QUEUE, DOCS, ONBOARDING, TODAY_DISPATCH, INVOICE,
    FIELD_TEMPLATES, FIELD_QUEUE, FIELD_TIME, FIELD_BADGES, FIELD_LEADERBOARD, FIELD_QUEST,
    FIELD_NOTIFS, FIELD_PROFILE, FIELD_SETTINGS_DEFAULT,
  };
})();
