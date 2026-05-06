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
  const WOS = [
    {
      id: "WO-3041", title: "Front gate operator failing intermittently", category: "Gate", urgency: "urgent",
      property: "p_canyon", unit: null, location: "Exterior — main vehicle gate",
      status: "awaiting-bid", mode: "competitive", scheduled: null, sla: { hours: 24, remaining: 6.5 },
      total: 4280, vendorId: "v_daedalus", techId: null,
      desc: "North entry vehicle gate has intermittent reverse-on-close. Hits the safety loop sporadically. Pedestrian gate functioning. Suspect bad photo eye + worn rack pinion.",
      createdBy: "Sasha Whitfield (PM)", createdAt: "2026-05-02T09:14:00",
      photos: 4, bidsCount: 3, mine: { submitted: false, draft: true },
    },
    {
      id: "WO-3038", title: "Smart lock pairing — 12 units", category: "Access Control", urgency: "routine",
      property: "p_aria", unit: "Bldg 3 (units 301–312)", location: "In-unit",
      status: "scheduled", mode: "direct", scheduled: "2026-05-06T08:00:00", sla: { hours: 96, remaining: 38.0 },
      total: 3120, vendorId: "v_daedalus", techId: "u_jc",
      desc: "Re-pair Schlage Encode Plus locks in 12 turn units after WiFi mesh cutover. Confirm Z-Wave handshake to Aria's Yardi-side IoT hub. PTE not required (vacant turn units).",
      createdBy: "Marcus Greene (PM)", createdAt: "2026-05-01T13:22:00",
      photos: 0, bidsCount: 0,
    },
    {
      id: "WO-3036", title: "Mesh AP swap — Bldg 2 amenity center", category: "WiFi", urgency: "routine",
      property: "p_oldtown", unit: "Amenity / clubhouse", location: "Common area",
      status: "on-site", mode: "direct", scheduled: "2026-05-04T10:00:00", sla: { hours: 96, remaining: 18.0 },
      total: 1860, vendorId: "v_daedalus", techId: "u_ow",
      desc: "Replace 3 EOL Ruckus APs with Cambium XV2-2T. Re-tune coverage in the gym corner. Amenity coverage trace included.",
      createdBy: "Marcus Greene (PM)", createdAt: "2026-04-30T09:00:00",
      photos: 6, bidsCount: 0,
    },
    {
      id: "WO-3033", title: "Pool gate self-closer broken (life-safety)", category: "Gate", urgency: "emergency",
      property: "p_verdant", unit: "Pool deck", location: "Exterior — pool enclosure",
      status: "completed", mode: "direct", scheduled: "2026-05-03T19:30:00", sla: { hours: 4, remaining: 0 },
      total: 612, vendorId: "v_daedalus", techId: "u_rb",
      desc: "Self-closing pool gate hardware failed. Replaced LCN 1461 closer + hinges. Re-tested at 3 lb close pull.",
      createdBy: "On-call dispatch (auto)", createdAt: "2026-05-03T18:11:00",
      photos: 8, bidsCount: 0,
    },
    {
      id: "WO-3029", title: "Camera replacements — 4 corridor cams", category: "Low-Voltage", urgency: "routine",
      property: "p_palomar", unit: "Bldg 1 corridors", location: "Common area",
      status: "invoiced", mode: "direct", scheduled: "2026-04-29T08:00:00", sla: { hours: 96, remaining: 0 },
      total: 2410, vendorId: "v_daedalus", techId: "u_mp",
      desc: "Replaced 4 Hanwha PNV-A6081R cameras with refreshed PoE drops, retuned NVR retention to 30 days.",
      createdBy: "Lila Tran (PM)", createdAt: "2026-04-26T11:40:00",
      photos: 11, bidsCount: 0,
    },
    {
      id: "WO-3026", title: "Access control reader — clubhouse main entry", category: "Access Control", urgency: "urgent",
      property: "p_solano", unit: "Clubhouse", location: "Common area",
      status: "en-route", mode: "direct", scheduled: "2026-05-04T13:00:00", sla: { hours: 24, remaining: 3.5 },
      total: 980, vendorId: "v_daedalus", techId: "u_mp",
      desc: "HID Signo reader at clubhouse main door not reading mobile credentials. Wired tested at controller, suspect reader failure.",
      createdBy: "Diego Martín (Maint Sup)", createdAt: "2026-05-04T08:42:00",
      photos: 2, bidsCount: 0,
    },
    {
      id: "WO-3024", title: "Recurring leak at gym water fountain", category: "Plumbing", urgency: "routine",
      property: "p_sage", unit: "Gym", location: "Common area",
      status: "scheduled", mode: "direct", scheduled: "2026-05-07T11:00:00", sla: { hours: 96, remaining: 70.0 },
      total: 540, vendorId: "v_daedalus", techId: "u_jc",
      desc: "Bottle-fill fountain leaking from supply elbow. Replace stop + flex line.",
      createdBy: "Heather Quinn (PM)", createdAt: "2026-05-02T16:30:00",
      photos: 1, bidsCount: 0,
    },
    {
      id: "WO-3021", title: "Doorbell cameras — 8 unit pilot", category: "IoT", urgency: "routine",
      property: "p_aria", unit: "Bldg 1 — units 101–108", location: "In-unit (door)",
      status: "unassigned", mode: "direct", scheduled: null, sla: { hours: 96, remaining: 92.0 },
      total: 1640, vendorId: "v_daedalus", techId: null,
      desc: "Install 8 Aiphone IXG-DM7 doorbell cams. Tie into resident app. PTE required for each.",
      createdBy: "Marcus Greene (PM)", createdAt: "2026-05-04T07:00:00",
      photos: 0, bidsCount: 0,
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

  return { VENDOR, TEAM, PMCS, PROPERTIES, WOS, BIDS, DOCS, ONBOARDING, TODAY_DISPATCH, INVOICE };
})();
