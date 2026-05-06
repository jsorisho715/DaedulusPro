// Property Manager view — How the PMC side experiences Daedalus.
// Shows: portfolio dashboard, hourly PMS sync (Yardi/AppFolio/RealPage)
// scoped to WOs the PMC explicitly assigns to Daedalus Pro,
// vendor scorecards, and resident satisfaction trends.
//
// Sync model: PMC creates and assigns WOs in their existing PMS as usual.
// They mark a vendor field (e.g. "Daedalus Pro" in Yardi) for the WOs
// they want us to handle. Daedalus polls hourly + on demand and only
// pulls those qualifying WOs. Everything else stays in-house.

function PMC({ onNav }) {
  const [tab, setTab] = React.useState("portfolio");
  const [openProp, setOpenProp] = React.useState(null);
  const [openWo, setOpenWo] = React.useState(null);
  const [syncing, setSyncing] = React.useState(false);
  const lastSyncMin = 14;

  const onSyncNow = () => {
    if (syncing) return;
    setSyncing(true);
    window.toast?.({ kind: "info", title: "Syncing PMS connectors…", msg: "Polling Yardi, AppFolio, RealPage for WOs assigned to Daedalus Pro." });
    setTimeout(() => {
      setSyncing(false);
      window.toast?.({ kind: "success", title: "Sync complete", msg: "Pulled 2 new WOs · 47 unassigned WOs left in your PMS." });
    }, 1800);
  };

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      {/* Persona banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "linear-gradient(90deg, rgba(80,98,128,0.12), rgba(80,98,128,0.02))", border: "1px solid rgba(80,98,128,0.2)", borderRadius: 10, marginBottom: 18 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--slateblue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>MG</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Viewing as Marcus Greene · Director of Operations · Meridian Living</div>
          <div className="muted" style={{ fontSize: 11 }}>14 properties · 4,820 units · Yardi Voyager 8.0 · Hourly sync · Daedalus customer since Jan 2025</div>
        </div>
        <span className="pill pill-info" style={{ fontSize: 10 }}>PMC perspective</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Meridian Operations</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Real-time view of every Yardi WO your team has assigned to Daedalus Pro.</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="pill pill-success" style={{ height: 30, padding: "0 12px", fontSize: 11 }}>
            <span className="dot" style={{ animation: "fa-checkBounce 1500ms infinite" }}/>
            Synced {lastSyncMin} min ago · next at the top of the hour
          </div>
          <button className="btn btn-secondary" onClick={onSyncNow} disabled={syncing}>
            <Icon name="refresh" size={14} style={{ animation: syncing ? "fa-shimmer 800ms linear infinite" : "none" }}/> {syncing ? "Syncing…" : "Sync now"}
          </button>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Monthly report</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 18 }}>
        <KPI label="Open WOs" value="42" sub="9 SLA breach risk" pos={false}/>
        <KPI label="Avg time to resolve" value="2.4d" sub="−0.8d vs Q1"/>
        <KPI label="Resident CSAT" value="4.6 ★" sub="+0.3 since onboard" pos/>
        <KPI label="MTD spend" value="$184K" sub="On budget · 64%"/>
        <KPI label="Compliance" value="100%" sub="All vendors current" pos/>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--line)", marginBottom: 22 }}>
        {[
          { k: "portfolio", l: "Portfolio map", icon: "location" },
          { k: "feed",      l: "PMS sync", icon: "refresh" },
          { k: "vendors",   l: "Vendor scorecards", icon: "shield" },
          { k: "csat",      l: "Resident pulse", icon: "sparkles" },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: "10px 18px", border: 0, borderBottom: `2px solid ${tab === t.k ? "var(--bronze)" : "transparent"}`,
            background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600,
            color: tab === t.k ? "var(--text)" : "var(--text-3)",
            display: "flex", alignItems: "center", gap: 8, marginBottom: -1,
          }}><Icon name={t.icon} size={14}/> {t.l}</button>
        ))}
      </div>

      {tab === "portfolio" && <Portfolio onOpen={setOpenProp}/>}
      {tab === "feed"      && <SyncFeed syncing={syncing} onSyncNow={onSyncNow} lastSyncMin={lastSyncMin}/>}
      {tab === "vendors"   && <VendorScorecards/>}
      {tab === "csat"      && <ResidentPulse/>}

      {openProp && <PropertyDrawer prop={openProp} onClose={() => { setOpenProp(null); setOpenWo(null); }} onOpenWo={setOpenWo}/>}
      {openWo && <WoDetailDrawer wo={openWo} onClose={() => setOpenWo(null)}/>}
    </div>
  );
}

function KPI({ label, value, sub, pos }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, fontFamily: "var(--mono)" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: pos === true ? "var(--olive)" : pos === false ? "var(--terracotta)" : "var(--text-3)", marginTop: 2, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

// Rich WO dataset shared by PropertyDrawer (summary list) and WoDetailDrawer
// (full detail). Each WO carries the PMS lineage, assignment context, tech,
// timeline, photos, materials, comms, activity log, and cost breakdown so a
// PM clicking through gets the same depth they'd see in a real PMS+vendor
// portal trace. Everything is mock data; structure mirrors what the real
// API would return.
const WORK_ORDERS = [
  {
    id: "WO-04122", pmsId: "MAINT-7124", pms: "Yardi",
    prop: "Aria on Camelback", trade: "Gate", category: "Access Control",
    unit: "Common — Main entry", location: "Exterior · vehicle gate",
    title: "Front gate operator failing intermittently",
    desc: "North entry vehicle gate has intermittent reverse-on-close. Hits the safety loop sporadically. Pedestrian gate functioning. Suspect bad photo eye + worn rack pinion.",
    urgency: "urgent", status: "in-progress",
    sla: "Today 6:00 PM", slaRemaining: "5h 12m", slaState: "warn",
    assignedBy: "Marcus Greene", assignedAt: "Today 1:08 PM",
    syncedAt: "Today 1:14 PM", scheduled: "Today 1:30 PM",
    template: "Gate operator repair",
    techId: "u_mp", techName: "Mason P.", techRole: "Field Lead",
    tasks: { done: 5, total: 8 },
    photos: { before: 3, during: 4, after: 0 },
    materials: [
      { p: "LiftMaster CSL24 photo eye pair", qty: 1, unit: "ea", cost: 142 },
      { p: "Rack & pinion gear (steel)",        qty: 1, unit: "ea", cost: 178 },
      { p: "Mounting hardware kit",             qty: 1, unit: "kit", cost: 28 },
    ],
    timeline: [
      { at: "1:08 PM", who: "Marcus Greene · Yardi", icon: "edit",      label: "Created in Yardi (MAINT-7124)" },
      { at: "1:08 PM", who: "Marcus Greene · Yardi", icon: "shield",    label: "Vendor field set: Daedalus Pro" },
      { at: "1:14 PM", who: "Daedalus Sync",         icon: "refresh",   label: "Pulled into Daedalus (hourly poll)" },
      { at: "1:18 PM", who: "AI Match",              icon: "sparkles",  label: "Matched to Mason Padilla · 96% fit" },
      { at: "1:19 PM", who: "Mason P.",              icon: "check",     label: "Tech accepted job" },
      { at: "1:24 PM", who: "Mason P.",              icon: "car",       label: "En route · ETA 9 min" },
      { at: "1:53 PM", who: "Mason P.",              icon: "location",  label: "On-site geo-stamp · ±8m" },
      { at: "2:01 PM", who: "Mason P.",              icon: "workorder", label: "Scope started · 3 before-photos uploaded" },
    ],
    thread: [
      { at: "1:14 PM", from: "Daedalus", body: "Pulled WO-04122 from Yardi (MAINT-7124). Matching now." },
      { at: "1:19 PM", from: "Daedalus", body: "Mason P. accepted. ETA 1:33 PM. Live tracking link sent to your phone." },
      { at: "1:42 PM", from: "Marcus G.", body: "Resident in Bldg A reports the pedestrian gate is sticking too — can Mason check while on-site?" },
      { at: "1:44 PM", from: "Daedalus", body: "Confirmed — added to Mason's task list. Will quote separately if it's a new repair." },
    ],
    activity: [
      { at: "1:08 PM", e: "Yardi · WO created" },
      { at: "1:08 PM", e: "Yardi · vendor field → Daedalus Pro" },
      { at: "1:14 PM", e: "Daedalus · WO-04122 created from MAINT-7124" },
      { at: "1:18 PM", e: "AI · matched to u_mp (Mason Padilla) at 96%" },
      { at: "1:19 PM", e: "Tech · accepted" },
      { at: "1:24 PM", e: "Tech · en route" },
      { at: "1:53 PM", e: "Tech · on-site (geofence)" },
      { at: "2:01 PM", e: "Tech · scope started" },
    ],
    cost: { labor: 290, materials: 348, markup: 64, total: 702, currency: "USD" },
  },
  {
    id: "WO-04118", pmsId: "MAINT-7117", pms: "Yardi",
    prop: "Aria on Camelback", trade: "WiFi", category: "WiFi",
    unit: "Clubhouse / amenity", location: "Common · IDF closet",
    title: "Mesh access point swap — 3 EOL Ruckus units",
    desc: "Replace 3 EOL Ruckus APs in the amenity center with Cambium XV2-2T. Re-tune coverage in the gym corner. Resident complaints have spiked over the last week.",
    urgency: "routine", status: "scheduled",
    sla: "Tomorrow 12 PM", slaRemaining: "22h 18m", slaState: "ok",
    assignedBy: "Marcus Greene", assignedAt: "Yesterday 4:21 PM",
    syncedAt: "Yesterday 5:00 PM", scheduled: "Tomorrow 9:00 AM",
    template: "WiFi access point install",
    techId: "u_ow", techName: "Devin H.", techRole: "Field Tech",
    tasks: { done: 0, total: 9 },
    photos: { before: 0, during: 0, after: 0 },
    materials: [
      { p: "Cambium XV2-2T",          qty: 3, unit: "ea", cost: 314 },
      { p: "PoE+ injector (60 W)",    qty: 3, unit: "ea", cost: 32  },
      { p: "Cat6 patch cable (50 ft)",qty: 3, unit: "ea", cost: 24  },
      { p: "AP ceiling bracket",      qty: 3, unit: "ea", cost: 14  },
    ],
    timeline: [
      { at: "Yesterday 4:21 PM", who: "Marcus Greene · Yardi", icon: "edit",     label: "Created in Yardi (MAINT-7117)" },
      { at: "Yesterday 4:21 PM", who: "Marcus Greene · Yardi", icon: "shield",   label: "Vendor field set: Daedalus Pro" },
      { at: "Yesterday 5:00 PM", who: "Daedalus Sync",         icon: "refresh",  label: "Pulled into Daedalus" },
      { at: "Yesterday 5:04 PM", who: "AI Match",              icon: "sparkles", label: "Matched to Devin Howell · 91% fit" },
      { at: "Yesterday 5:18 PM", who: "Devin H.",              icon: "check",    label: "Tech accepted, scheduled tomorrow 9 AM" },
    ],
    thread: [
      { at: "Yesterday 5:01 PM", from: "Daedalus", body: "Pulled WO-04118. Matching tech for tomorrow 9 AM window." },
      { at: "Yesterday 5:18 PM", from: "Daedalus", body: "Devin H. confirmed. Materials will be on the truck — Cambium XV2-2T in stock." },
    ],
    activity: [
      { at: "Yesterday 4:21 PM", e: "Yardi · WO created" },
      { at: "Yesterday 5:00 PM", e: "Daedalus · synced from Yardi" },
      { at: "Yesterday 5:04 PM", e: "AI · matched to u_ow" },
      { at: "Yesterday 5:18 PM", e: "Tech · accepted; scheduled tomorrow 9 AM" },
    ],
    cost: { labor: 380, materials: 1110, markup: 149, total: 1639, currency: "USD" },
  },
  {
    id: "WO-04101", pmsId: "MAINT-7102", pms: "Yardi",
    prop: "Aria on Camelback", trade: "A/C", category: "HVAC",
    unit: "Unit 312 (resident occupied)", location: "In-unit · ceiling air handler",
    title: "Compressor failure · resident occupancy",
    desc: "Resident reports A/C blowing warm. Outdoor unit clicking but compressor not engaging. Resident is elderly — unit is 84°F at 11 AM. Daedalus dispatched 2 days ago, parts back-ordered.",
    urgency: "emergency", status: "breach",
    sla: "2d 4h overdue", slaRemaining: "−2d 4h", slaState: "danger",
    assignedBy: "Marcus Greene", assignedAt: "2 days ago 9:14 AM",
    syncedAt: "2 days ago 10:00 AM", scheduled: "Today 4:00 PM (revised)",
    template: "A/C compressor replacement",
    techId: "u_jc", techName: "Rosa C.", techRole: "Field Tech",
    tasks: { done: 2, total: 7 },
    photos: { before: 4, during: 0, after: 0 },
    materials: [
      { p: "Goodman GSXC18 compressor", qty: 1, unit: "ea", cost: 612, status: "back-ordered · arrives today 3 PM" },
      { p: "R-410A refrigerant",         qty: 4, unit: "lb", cost: 38  },
      { p: "Filter drier",               qty: 1, unit: "ea", cost: 28  },
    ],
    timeline: [
      { at: "Mon 9:14 AM",  who: "Marcus Greene · Yardi", icon: "edit",     label: "Created in Yardi · marked Emergency" },
      { at: "Mon 9:14 AM",  who: "Marcus Greene · Yardi", icon: "shield",   label: "Vendor: Daedalus Pro" },
      { at: "Mon 10:00 AM", who: "Daedalus Sync",         icon: "refresh",  label: "Pulled into Daedalus" },
      { at: "Mon 10:18 AM", who: "Rosa C.",               icon: "check",    label: "Tech accepted, on-site by 11:30 AM" },
      { at: "Mon 12:14 PM", who: "Rosa C.",               icon: "alert",    label: "Diagnosed: compressor failure. Parts ordered." },
      { at: "Tue 8:00 AM",  who: "Daedalus",              icon: "alert",    label: "Compressor back-ordered · ETA Wed 3 PM" },
      { at: "Today",        who: "Daedalus",              icon: "schedule", label: "Re-scheduled completion · Today 4 PM" },
    ],
    thread: [
      { at: "Mon 12:30 PM", from: "Marcus G.",  body: "Status? Resident's elderly, this is a priority." },
      { at: "Mon 12:34 PM", from: "Daedalus",  body: "Compressor back-ordered through our usual supplier. Sourcing alt now." },
      { at: "Mon 1:02 PM",  from: "Daedalus",  body: "Located at Ferguson Phoenix · arrives Wed 3 PM. Window unit deployed today as interim." },
      { at: "Tue 9:00 AM",  from: "Marcus G.",  body: "Resident reports interim AC working. Thanks." },
      { at: "Today 11 AM",  from: "Daedalus",  body: "Compressor confirmed for 3 PM delivery. Rosa scheduled 4–6 PM." },
    ],
    activity: [
      { at: "Mon 9:14 AM",  e: "Yardi · WO created (Emergency)" },
      { at: "Mon 10:00 AM", e: "Daedalus · synced" },
      { at: "Mon 10:18 AM", e: "Tech accepted" },
      { at: "Mon 11:32 AM", e: "Tech · on-site" },
      { at: "Mon 12:14 PM", e: "Diagnosis · compressor failure" },
      { at: "Mon 12:18 PM", e: "Parts ordered (Goodman GSXC18)" },
      { at: "Mon 6:00 PM",  e: "SLA breach · 4h emergency window" },
      { at: "Tue 8:00 AM",  e: "Back-order escalation · alt sourced" },
      { at: "Tue 9:30 AM",  e: "Window unit deployed (interim)" },
      { at: "Today 11 AM",  e: "Re-scheduled · Today 4 PM" },
    ],
    cost: { labor: 580, materials: 754, markup: 133, total: 1467, currency: "USD" },
  },
  {
    id: "WO-04094", pmsId: "MAINT-7090", pms: "Yardi",
    prop: "Aria on Camelback", trade: "Plumbing", category: "Plumbing",
    unit: "Unit 117", location: "In-unit · kitchen sink",
    title: "Recurring leak under kitchen sink",
    desc: "Bottle-fill fountain leaking from supply elbow. Replace stop + flex line.",
    urgency: "routine", status: "in-progress",
    sla: "Today 8:00 PM", slaRemaining: "7h 8m", slaState: "ok",
    assignedBy: "Marcus Greene", assignedAt: "Today 9:42 AM",
    syncedAt: "Today 10:00 AM", scheduled: "Today 2:30 PM",
    template: "Plumbing minor repair",
    techId: "u_ow", techName: "Devin H.", techRole: "Field Tech",
    tasks: { done: 3, total: 6 },
    photos: { before: 3, during: 1, after: 0 },
    materials: [
      { p: "1/2\" supply stop (quarter-turn)", qty: 1, unit: "ea", cost: 14 },
      { p: "Stainless braided flex line",       qty: 1, unit: "ea", cost: 12 },
      { p: "PTFE tape",                          qty: 1, unit: "ea", cost: 4  },
    ],
    timeline: [
      { at: "9:42 AM",  who: "Marcus Greene · Yardi", icon: "edit",    label: "Created in Yardi (MAINT-7090)" },
      { at: "9:42 AM",  who: "Marcus Greene · Yardi", icon: "shield",  label: "Vendor: Daedalus Pro" },
      { at: "10:00 AM", who: "Daedalus Sync",         icon: "refresh", label: "Pulled into Daedalus" },
      { at: "10:14 AM", who: "Devin H.",              icon: "check",   label: "Accepted, scheduled 2:30 PM" },
      { at: "2:38 PM",  who: "Devin H.",              icon: "location",label: "On-site" },
    ],
    thread: [
      { at: "10:00 AM", from: "Daedalus", body: "Pulled WO-04094 from Yardi. Devin H. assigned for 2:30 PM." },
      { at: "2:38 PM",  from: "Daedalus", body: "Devin on-site. PTE confirmed by resident at 2:35 PM." },
    ],
    activity: [
      { at: "9:42 AM",  e: "Yardi · WO created" },
      { at: "10:00 AM", e: "Daedalus · synced" },
      { at: "10:14 AM", e: "Tech accepted" },
      { at: "2:38 PM",  e: "Tech on-site" },
    ],
    cost: { labor: 120, materials: 30, markup: 18, total: 168, currency: "USD" },
  },
];

const PROPS = [
  { name: "Aria on Camelback",      units: 312, open: 9, sla: 2, csat: 4.4, spend: 28400, x: 28, y: 36 },
  { name: "The Marquee at Old Town",units: 244, open: 4, sla: 0, csat: 4.7, spend: 14200, x: 50, y: 28 },
  { name: "Solano Lofts",           units: 168, open: 3, sla: 1, csat: 4.5, spend: 9800,  x: 38, y: 58 },
  { name: "Camelback Heights",      units: 412, open: 8, sla: 3, csat: 4.3, spend: 32100, x: 22, y: 22 },
  { name: "Roosevelt Row Lofts",    units: 196, open: 5, sla: 1, csat: 4.6, spend: 11400, x: 54, y: 50 },
  { name: "Tempe Town Crossing",    units: 358, open: 6, sla: 0, csat: 4.8, spend: 18600, x: 70, y: 64 },
  { name: "Scottsdale Quarter Flats",units: 284, open: 2, sla: 0, csat: 4.9, spend: 7200,  x: 76, y: 32 },
  { name: "Phoenix Central Annex",  units: 224, open: 5, sla: 2, csat: 4.4, spend: 12800, x: 44, y: 44 },
];

function Portfolio({ onOpen }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
      {/* Map */}
      <div className="card" style={{ padding: 0, overflow: "hidden", aspectRatio: "1.3/1", position: "relative", background: "linear-gradient(180deg, #EDE5D2 0%, #E0D4B8 100%)" }}>
        <svg width="100%" height="100%" viewBox="0 0 600 460" preserveAspectRatio="none">
          <defs>
            <pattern id="hatch-pmc" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M-1 7L7 -1M5 9L9 5" stroke="rgba(176,134,84,0.15)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="600" height="460" fill="url(#hatch-pmc)"/>
          {/* Roads */}
          <path d="M0 200 L600 220" stroke="rgba(31,35,41,0.08)" strokeWidth="14"/>
          <path d="M260 0 L290 460" stroke="rgba(31,35,41,0.08)" strokeWidth="14"/>
          <path d="M0 320 L600 300" stroke="rgba(31,35,41,0.05)" strokeWidth="8"/>
          {PROPS.map((p, i) => {
            const cx = (p.x / 100) * 600, cy = (p.y / 100) * 460;
            const r = 8 + Math.min(20, p.units / 25);
            const dangerous = p.sla > 1;
            return (
              <g key={p.name} onClick={() => onOpen(p)} style={{ cursor: "pointer" }}>
                <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={dangerous ? "var(--terracotta)" : "var(--bronze)"} strokeWidth="1" opacity="0.4"/>
                <circle cx={cx} cy={cy} r={r} fill={dangerous ? "var(--terracotta)" : "var(--bronze)"} fillOpacity="0.25" stroke={dangerous ? "var(--terracotta)" : "var(--bronze)"} strokeWidth="1.5"/>
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={dangerous ? "var(--terracotta)" : "var(--bronze)"}>{p.open}</text>
                <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-2)">{p.name.split(" ").slice(0, 2).join(" ")}</text>
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", top: 14, left: 14, padding: "8px 12px", background: "rgba(255,255,255,0.85)", borderRadius: 8, backdropFilter: "blur(4px)", fontSize: 11 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Phoenix Metro</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--bronze)" }}/> Healthy
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--terracotta)", marginLeft: 8 }}/> SLA risk
          </div>
        </div>
      </div>

      {/* Property table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Properties · {PROPS.length}</div>
          <div className="muted" style={{ fontSize: 11 }}>Click any property for the live operations panel.</div>
        </div>
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          {PROPS.map(p => (
            <button key={p.name} onClick={() => onOpen(p)} style={{
              width: "100%", padding: 14, border: 0, borderBottom: "1px solid var(--line)",
              background: "transparent", cursor: "pointer", textAlign: "left", color: "var(--text)",
              display: "flex", alignItems: "center", gap: 12,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bronze)" }}>
                <Icon name="location" size={14}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div className="muted" style={{ fontSize: 11 }}>{p.units} units · CSAT {p.csat}★</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: p.sla > 1 ? "var(--terracotta)" : "var(--text)" }}>{p.open}</div>
                <div className="muted" style={{ fontSize: 10 }}>{p.sla > 0 ? `${p.sla} SLA` : "All on track"}</div>
              </div>
              <Icon name="chevRight" size={12} color="var(--text-3)"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PropertyDrawer({ prop, onClose, onOpenWo }) {
  // Filter the global WO list down to this property; if none match (because
  // we only built rich detail for Aria), fall back to the full set so every
  // property still demos rich connected detail.
  const matched = WORK_ORDERS.filter(w => w.prop === prop.name);
  const wos = matched.length ? matched : WORK_ORDERS;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.55)", zIndex: 100, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 560, background: "var(--bg)",
        borderLeft: "1px solid var(--line-strong)", boxShadow: "var(--shadow-lg)",
        display: "flex", flexDirection: "column", animation: "slideIn 250ms var(--ease)",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <div style={{ padding: 18, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Property</div>
            <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>{prop.name}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{prop.units} units · MTD spend ${prop.spend.toLocaleString()}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 22 }}>
            <Stat label="Open" value={prop.open}/>
            <Stat label="SLA risk" value={prop.sla} dangerous={prop.sla > 0}/>
            <Stat label="CSAT" value={`${prop.csat}★`}/>
          </div>

          <SectionTitle>Active work orders · {wos.length}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
            {wos.map(w => (
              <button key={w.id} onClick={() => onOpenWo(w)} className="card" style={{
                padding: 12, display: "flex", alignItems: "center", gap: 12,
                width: "100%", textAlign: "left", color: "var(--text)", cursor: "pointer",
                border: "1px solid var(--line)", background: "var(--surface)",
                transition: "background var(--tx-fast), border-color var(--tx-fast), transform var(--tx-fast)",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover)"; e.currentTarget.style.borderColor = "var(--bronze)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--line)"; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bronze)", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{w.trade.slice(0, 2)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="mono" style={{ color: "var(--bronze)" }}>{w.id}</span>
                    <span className="muted" style={{ fontWeight: 400 }}>·</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.unit}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>Daedalus · {w.techName}{w.tasks?.total ? ` · ${w.tasks.done}/${w.tasks.total} tasks` : ""}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span className={`pill ${w.slaState === "danger" ? "pill-danger" : w.slaState === "warn" ? "pill-warn" : w.status === "scheduled" ? "pill-info" : "pill-success"}`} style={{ fontSize: 10 }}>{w.sla}</span>
                  <Icon name="chevRight" size={12} color="var(--text-3)"/>
                </div>
              </button>
            ))}
          </div>

          <SectionTitle>Trade mix · 30 days</SectionTitle>
          <div className="card" style={{ padding: 16 }}>
            {[
              ["Gate", 28], ["A/C", 22], ["Plumbing", 18], ["WiFi", 14], ["Lighting", 10], ["Other", 8],
            ].map(([t, pct]) => (
              <div key={t} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{t}</div>
                <div style={{ height: 6, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct * 2}%`, background: "var(--bronze)", borderRadius: 999 }}/>
                </div>
                <div className="mono" style={{ fontSize: 11, textAlign: "right" }}>{pct}%</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 18, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="arrow" size={14}/> Open in Yardi</button>
          <button className="btn btn-secondary"><Icon name="mail" size={14}/> Message Daedalus</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Work-order detail drawer — slides over PropertyDrawer. Click anywhere
// outside (the dim scrim) to close just this drawer and return to the
// property summary; the back arrow does the same.
// ──────────────────────────────────────────────────────────────────────
function WoDetailDrawer({ wo, onClose }) {
  const M = window.MOCK;
  const tech = M.TEAM.find(t => t.id === wo.techId);
  const PMS_COLOR_MAP = { Yardi: "#1B4D89", AppFolio: "#1F8A5B", RealPage: "#B0463A" };
  const pmsColor = PMS_COLOR_MAP[wo.pms] || "var(--bronze)";
  const slaPillCls = wo.slaState === "danger" ? "pill-danger" : wo.slaState === "warn" ? "pill-warn" : "pill-success";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.42)", zIndex: 110, animation: "fadeUp 180ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 680, maxWidth: "calc(100vw - 80px)",
        background: "var(--bg)", borderLeft: "1px solid var(--line-strong)", boxShadow: "-30px 0 60px rgba(0,0,0,0.28)",
        display: "flex", flexDirection: "column", animation: "slideIn 260ms var(--ease)",
      }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, color: "var(--bronze)" }}>
              <Icon name="chevLeft" size={14}/> Back to {wo.prop}
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="x" size={14}/></button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span className="pill" style={{ background: pmsColor + "1F", color: pmsColor, fontSize: 10, fontWeight: 700, height: 18, padding: "0 8px" }}>{wo.pms}</span>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{wo.pmsId}</div>
            <Icon name="arrow" size={11} color="var(--text-3)"/>
            <div className="mono" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 700 }}>{wo.id}</div>
            <UrgencyPill u={wo.urgency} small/>
            <span className={`pill ${slaPillCls}`} style={{ fontSize: 10 }}>{wo.status === "breach" ? "SLA breach" : wo.status === "in-progress" ? "In progress" : wo.status === "scheduled" ? "Scheduled" : wo.status === "completed" ? "Completed" : wo.status}</span>
          </div>
          <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.25, marginTop: 4 }}>{wo.title}</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            <Icon name="location" size={11}/> {wo.prop} · {wo.unit} · {wo.location}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 22 }}>
            <Stat label="Trade" value={wo.trade}/>
            <Stat label="SLA" value={wo.slaRemaining} dangerous={wo.slaState === "danger"}/>
            <Stat label="Scheduled" value={wo.scheduled.split(" ").slice(-1)[0]} hint={wo.scheduled.split(" ").slice(0, -1).join(" ")}/>
            <Stat label="Total" value={`$${wo.cost.total.toLocaleString()}`}/>
          </div>

          {/* Description / scope */}
          <SectionTitle>Scope of work</SectionTitle>
          <div className="card" style={{ padding: 14, marginBottom: 22 }}>
            <div style={{ fontSize: 13, lineHeight: 1.55 }}>{wo.desc}</div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "var(--text-3)" }}>
              <span><strong style={{ color: "var(--text-2)" }}>Template</strong> · {wo.template}</span>
              <span><strong style={{ color: "var(--text-2)" }}>Assigned by</strong> · {wo.assignedBy} · {wo.assignedAt}</span>
              <span><strong style={{ color: "var(--text-2)" }}>Synced</strong> · {wo.syncedAt}</span>
            </div>
          </div>

          {/* Tech card */}
          <SectionTitle>Assigned tech</SectionTitle>
          <div className="card" style={{ padding: 14, marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
            {tech ? <Avatar user={tech} size={42}/> : <div style={{ width: 42, height: 42, borderRadius: 999, background: "var(--surface-3)" }}/>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{wo.techName || "Unassigned"}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{wo.techRole}{tech?.phone ? ` · ${tech.phone}` : ""}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-secondary btn-sm"><Icon name="phone" size={12}/></button>
              <button className="btn btn-secondary btn-sm"><Icon name="message" size={12}/> Message</button>
            </div>
          </div>

          {/* Checklist + photos side-by-side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div>
              <SectionTitle>Checklist</SectionTitle>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{wo.tasks.done} / {wo.tasks.total}</div>
                  <div className="mono" style={{ fontSize: 11, color: wo.tasks.done === wo.tasks.total ? "var(--olive)" : "var(--bronze)" }}>{wo.tasks.total ? Math.round(wo.tasks.done / wo.tasks.total * 100) : 0}%</div>
                </div>
                <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${wo.tasks.total ? (wo.tasks.done / wo.tasks.total) * 100 : 0}%`, background: "linear-gradient(90deg, var(--bronze), var(--brass))", transition: "width 320ms ease-out" }}/>
                </div>
                <div className="muted" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>Pulled from the {wo.template} template. Tech executes in the field app — photo, comment, measurement, scan, or simple check per step.</div>
              </div>
            </div>
            <div>
              <SectionTitle>Photos</SectionTitle>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                  {[
                    { l: "Before", v: wo.photos.before, c: "var(--slateblue)" },
                    { l: "During", v: wo.photos.during, c: "var(--bronze)" },
                    { l: "After",  v: wo.photos.after,  c: "var(--olive)" },
                  ].map(p => (
                    <div key={p.l}>
                      <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: p.c }}>{p.v}</div>
                      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>{p.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginTop: 12 }}>
                  {Array.from({ length: Math.min(8, wo.photos.before + wo.photos.during + wo.photos.after) }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: `linear-gradient(135deg, hsl(${30 + i * 22}, 22%, 28%), hsl(${22 + i * 8}, 30%, 18%))`, border: "1px solid var(--line)", position: "relative" }}>
                      <span style={{ position: "absolute", top: 2, left: 2, background: "rgba(0,0,0,0.5)", color: "white", fontSize: 8, padding: "1px 4px", borderRadius: 3 }}>EXIF</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <SectionTitle>Status timeline</SectionTitle>
          <div className="card" style={{ padding: 14, marginBottom: 22 }}>
            {wo.timeline.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 24px 1fr", gap: 10, alignItems: "flex-start", paddingBottom: i === wo.timeline.length - 1 ? 0 : 12 }}>
                <div className="mono muted" style={{ fontSize: 11, paddingTop: 4 }}>{t.at}</div>
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 999, background: i === wo.timeline.length - 1 ? "var(--bronze)" : "var(--surface-2)", color: i === wo.timeline.length - 1 ? "#FFF" : "var(--bronze)", border: i === wo.timeline.length - 1 ? 0 : "1px solid var(--line-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                    <Icon name={t.icon} size={11}/>
                  </div>
                  {i < wo.timeline.length - 1 && <div style={{ position: "absolute", top: 22, bottom: -12, width: 1, background: "var(--line)" }}/>}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{t.label}</div>
                  <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{t.who}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Materials + cost */}
          <SectionTitle>Materials & cost</SectionTitle>
          <div className="card" style={{ padding: 0, marginBottom: 22, overflow: "hidden" }}>
            <div>
              {wo.materials.map((m, i) => (
                <div key={m.p} style={{ padding: "10px 14px", borderTop: i ? "1px solid var(--line)" : 0, display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500 }}>{m.p}</div>
                    {m.status && <div style={{ fontSize: 11, color: "var(--terracotta)", marginTop: 2 }}>{m.status}</div>}
                  </div>
                  <div className="mono muted" style={{ fontSize: 11 }}>{m.qty} {m.unit}</div>
                  <div className="mono" style={{ fontSize: 12, fontWeight: 600, minWidth: 56, textAlign: "right" }}>${m.cost}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--surface-2)", padding: "12px 14px", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 11 }}>
                <div><div className="muted">Labor</div><div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>${wo.cost.labor}</div></div>
                <div><div className="muted">Materials</div><div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>${wo.cost.materials}</div></div>
                <div><div className="muted">Markup</div><div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>${wo.cost.markup}</div></div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Total estimate</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--bronze)" }}>${wo.cost.total.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Communication thread */}
          <SectionTitle>Conversation</SectionTitle>
          <div className="card" style={{ padding: 14, marginBottom: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {wo.thread.map((m, i) => {
                const fromMe = m.from === "Marcus G." || m.from.includes(wo.assignedBy?.split(" ")[0] || "");
                return (
                  <div key={i} style={{ display: "flex", justifyContent: fromMe ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "82%",
                      padding: "8px 12px", borderRadius: 12,
                      background: fromMe ? "var(--bronze)" : "var(--surface-2)",
                      color: fromMe ? "#FFF" : "var(--text)",
                      border: fromMe ? "1px solid var(--bronze-deep)" : "1px solid var(--line)",
                      borderTopRightRadius: fromMe ? 4 : 12,
                      borderTopLeftRadius: fromMe ? 12 : 4,
                    }}>
                      <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 2, display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontWeight: 600 }}>{m.from}</span>
                        <span>{m.at}</span>
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.45 }}>{m.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)", display: "flex", gap: 6 }}>
              <input className="input" placeholder="Reply to Daedalus…" style={{ flex: 1, height: 32, fontSize: 12 }}/>
              <button className="btn btn-primary btn-sm">Send</button>
            </div>
          </div>

          {/* Activity log */}
          <SectionTitle>Activity log</SectionTitle>
          <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 22 }}>
            {wo.activity.map((a, i) => (
              <div key={i} style={{ display: "flex", padding: "8px 14px", borderTop: i ? "1px solid var(--line)" : 0, gap: 12, fontSize: 11, color: "var(--text-2)" }}>
                <div className="mono muted" style={{ width: 100, flexShrink: 0 }}>{a.at}</div>
                <div style={{ flex: 1 }}>{a.e}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: 18, borderTop: "1px solid var(--line)", display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn btn-secondary"><Icon name="arrow" size={14}/> Open in {wo.pms}</button>
          <button className="btn btn-secondary"><Icon name="mail" size={14}/> Message Daedalus</button>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", color: "var(--text-3)" }}><Icon name="download" size={12}/> Export PDF</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, dangerous, hint }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 700, marginTop: 2, color: dangerous ? "var(--terracotta)" : "var(--text)" }}>{value}</div>
      {hint && <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{hint}</div>}
    </div>
  );
}
function SectionTitle({ children }) {
  return <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{children}</div>;
}

// ── PMS Sync ──
// Hourly poll of each connected PMS. Daedalus only pulls WOs the PMC has
// explicitly assigned to vendor "Daedalus Pro" (or per-PMS scope rule).
// Everything else stays in the customer's PMS for in-house techs.
const PMS_COLOR = { Yardi: "#1B4D89", AppFolio: "#1F8A5B", RealPage: "#B0463A" };

function SyncFeed({ syncing, onSyncNow, lastSyncMin }) {
  // Per-connector status. Each PMS has its own assignment-scope rule that
  // determines which of their WOs get pulled into Daedalus.
  const connectors = [
    {
      name: "Yardi Voyager 8.0",
      status: "connected",
      scopeLabel: "Vendor field equals",
      scopeValue: "Daedalus Pro",
      lastSync: "1:14 PM",
      pulled: 5,
      skipped: 47,
      hourly: true,
    },
    {
      name: "AppFolio Property Manager",
      status: "connected",
      scopeLabel: "Service-request type",
      scopeValue: "Vendor-Managed",
      lastSync: "1:14 PM",
      pulled: 1,
      skipped: 12,
      hourly: true,
    },
    {
      name: "RealPage OneSite",
      status: "connected",
      scopeLabel: "WO status",
      scopeValue: "Send to Vendor",
      lastSync: "1:14 PM",
      pulled: 1,
      skipped: 9,
      hourly: true,
    },
  ];

  // Synced events: PMS WOs the PMC assigned to Daedalus and that we pulled
  // on the most recent sync runs. Each row carries the source PMS WO ID,
  // our internal Daedalus WO ID, who marked the assignment in the PMS, and
  // the sync delta (assignment time → next hourly poll).
  const events = [
    { syncedAt: "1:14 PM", pms: "Yardi",    pmsWo: "MAINT-7124", woDpro: "WO-04129", prop: "Aria on Camelback",       trade: "Gate",     unit: "Common entry",  priority: "Urgent",   status: "Tech assigned · Mason P.",    assignedBy: "Marcus Greene", assignedAt: "1:08 PM", note: "Vendor field set on intake form." },
    { syncedAt: "1:14 PM", pms: "Yardi",    pmsWo: "MAINT-7123", woDpro: "WO-04128", prop: "Camelback Heights",       trade: "Plumbing", unit: "Unit 412",       priority: "Standard", status: "Quote requested",            assignedBy: "Marcus Greene", assignedAt: "12:42 PM", note: "Resident reported leak under sink." },
    { syncedAt: "12:14 PM",pms: "AppFolio", pmsWo: "SR-9921",    woDpro: "WO-04127", prop: "Roosevelt Row Lofts",     trade: "Lock",     unit: "Unit 218",       priority: "Standard", status: "Awaiting tech",              assignedBy: "Lila Tran",     assignedAt: "12:03 PM", note: "Lockout — resident on-site." },
    { syncedAt: "12:14 PM",pms: "RealPage", pmsWo: "WO-3318",    woDpro: "WO-04126", prop: "Tempe Town Crossing",     trade: "A/C",      unit: "Unit 308",       priority: "Urgent",   status: "Quote requested",            assignedBy: "Heather Quinn", assignedAt: "11:51 AM", note: "Compressor failure · 100°F outside." },
    { syncedAt: "11:14 AM",pms: "Yardi",    pmsWo: "MAINT-7120", woDpro: "WO-04125", prop: "The Marquee at Old Town", trade: "Lighting", unit: "Hallway 3",      priority: "Low",      status: "Scheduled · Tomorrow 10 AM", assignedBy: "Marcus Greene", assignedAt: "10:48 AM", note: "3 fixtures out — batched." },
    { syncedAt: "11:14 AM",pms: "Yardi",    pmsWo: "MAINT-7118", woDpro: "WO-04124", prop: "Aria on Camelback",       trade: "Gate",     unit: "Vehicle gate",   priority: "Urgent",   status: "Resolved · 47 min on-site",  assignedBy: "Marcus Greene", assignedAt: "9:32 AM",  note: "Gate solenoid replaced." },
  ];

  const totalPulled = connectors.reduce((s, c) => s + c.pulled, 0);
  const totalSkipped = connectors.reduce((s, c) => s + c.skipped, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Sync status hero */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
          <div>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sync status</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
              {connectors.filter(c => c.status === "connected").length} of {connectors.length} PMS connections healthy
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Last sync {lastSyncMin} min ago · pulled <strong style={{ color: "var(--olive)" }}>{totalPulled}</strong> · skipped <strong style={{ color: "var(--text-2)" }}>{totalSkipped}</strong> (not assigned to Daedalus) · next at 2:00 PM
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={onSyncNow} disabled={syncing}>
              <Icon name="refresh" size={14} style={{ animation: syncing ? "fa-shimmer 800ms linear infinite" : "none" }}/> {syncing ? "Syncing…" : "Sync now"}
            </button>
            <button className="btn btn-ghost"><Icon name="settings" size={14}/> Configure</button>
          </div>
        </div>

        {/* Per-connector grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {connectors.map(c => (
            <div key={c.name} style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: PMS_COLOR[c.name.split(" ")[0]], flexShrink: 0 }}/>
                  <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                </div>
                <span className="pill pill-success" style={{ fontSize: 9, height: 18, padding: "0 6px" }}><span className="dot"/>healthy</span>
              </div>
              <div className="muted" style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>Sync scope</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>
                <span className="muted">{c.scopeLabel}</span> <span className="mono" style={{ background: "var(--surface)", border: "1px solid var(--line)", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{c.scopeValue}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
                <div className="muted" style={{ fontSize: 11 }}>Last {c.lastSync} · {c.hourly ? "hourly" : "manual"}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--olive)" }}>+{c.pulled}</div>
                  <div className="mono muted" style={{ fontSize: 11 }}>· {c.skipped} skipped</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How sync works */}
      <div style={{ padding: 14, border: "1px solid rgba(74,99,120,0.32)", borderRadius: 10, background: "rgba(74,99,120,0.05)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--slateblue)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="info" size={14}/>
        </div>
        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.55, color: "var(--text-2)" }}>
          <strong style={{ fontSize: 13, color: "var(--text)" }}>How PMS sync works.</strong> Daedalus polls each connected PMS every hour at the top of the hour. We only pull work orders your team has explicitly assigned to vendor <span className="mono" style={{ background: "var(--surface)", border: "1px solid var(--line)", padding: "1px 6px", borderRadius: 4, fontWeight: 600, color: "var(--text)" }}>Daedalus Pro</span>. Everything else stays in your PMS for your in-house team — Daedalus never sees it. Need to dispatch sooner? Hit <strong>Sync now</strong>, or change the scope rule per connector.
        </div>
      </div>

      {/* Synced WOs list */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Synced from your PMS · last 24h</div>
            <div className="muted" style={{ fontSize: 11 }}>WOs your team assigned to Daedalus Pro and we picked up on the hourly poll.</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span className="pill pill-success" style={{ fontSize: 10 }}><Icon name="check" size={9}/> {events.length} pulled</span>
            <span className="pill pill-neutral" style={{ fontSize: 10 }}>{totalSkipped} unassigned (in-house)</span>
          </div>
        </div>
        <div>
          {events.map((e, i) => (
            <SyncedWoRow key={e.woDpro} event={e} last={i === events.length - 1}/>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid var(--line)", background: "var(--surface-2)", textAlign: "center" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--bronze)" }}>
            View full sync log <Icon name="chevRight" size={11}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function SyncedWoRow({ event: e, last }) {
  const c = PMS_COLOR[e.pms];
  return (
    <div style={{ padding: "14px 16px", borderBottom: last ? 0 : "1px solid var(--line)", display: "grid", gridTemplateColumns: "minmax(160px, auto) 1fr minmax(180px, auto)", gap: 16, alignItems: "center" }}>
      {/* Left: PMS pill + WO IDs lineage */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="pill" style={{ background: c + "1F", color: c, fontSize: 10, fontWeight: 700, alignSelf: "flex-start", height: 18, padding: "0 8px" }}>{e.pms}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }} title={`Source: ${e.pms}`}>{e.pmsWo}</div>
          <Icon name="arrow" size={10} color="var(--text-3)"/>
          <div className="mono" style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 700 }}>{e.woDpro}</div>
        </div>
      </div>

      {/* Center: prop + assignment context */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{e.prop}</span>
          <span className="muted" style={{ fontSize: 12 }}>· {e.unit}</span>
          <span className={`pill ${e.priority === "Urgent" ? "pill-danger" : e.priority === "Low" ? "pill-neutral" : "pill-info"}`} style={{ fontSize: 10 }}>{e.priority}</span>
        </div>
        <div className="muted" style={{ fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>
          {e.trade} · Assigned to Daedalus by <strong style={{ color: "var(--text-2)" }}>{e.assignedBy}</strong> at {e.assignedAt} · synced at {e.syncedAt}
        </div>
        {e.note && <div className="muted" style={{ fontSize: 11, marginTop: 2, fontStyle: "italic" }}>“{e.note}”</div>}
      </div>

      {/* Right: workflow status inside Daedalus */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: e.status.includes("Resolved") ? "var(--olive)" : "var(--text)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
          {e.status.includes("Resolved") && <Icon name="check" size={11} color="var(--olive)"/>}
          {e.status}
        </div>
      </div>
    </div>
  );
}

// ── Vendor Scorecards ──
function VendorScorecards() {
  const vendors = [
    { name: "Daedalus Trades & Tech",   tier: "Preferred", coverage: "All trades",         jobs: 1284, sla: 94, csat: 4.6, comp: 100, spend: 184000, primary: true },
    { name: "Sun Valley HVAC",           tier: "Verified",  coverage: "HVAC only",          jobs: 142,  sla: 86, csat: 4.3, comp: 100, spend: 38000 },
    { name: "Copperline Plumbing",       tier: "Verified",  coverage: "Plumbing only",      jobs: 89,   sla: 91, csat: 4.5, comp: 100, spend: 22000 },
    { name: "Western Electric Co.",      tier: "Verified",  coverage: "Electrical",         jobs: 64,   sla: 88, csat: 4.2, comp: 96,  spend: 18400 },
    { name: "Pavilion Pest Control",     tier: "Specialty", coverage: "Pest only",          jobs: 32,   sla: 95, csat: 4.7, comp: 100, spend: 9200 },
  ];
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", fontSize: 13 }}>
        <thead style={{ background: "var(--surface-2)" }}>
          <tr style={{ color: "var(--text-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Vendor</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Tier</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Coverage</th>
            <th style={{ textAlign: "right", padding: "10px 14px", fontWeight: 700 }}>Jobs (90d)</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>SLA</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>CSAT</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Compliance</th>
            <th style={{ textAlign: "right", padding: "10px 14px", fontWeight: 700 }}>YTD spend</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(v => (
            <tr key={v.name} style={{ borderTop: "1px solid var(--line)", background: v.primary ? "rgba(176,134,84,0.04)" : "transparent" }}>
              <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                {v.name} {v.primary && <span className="pill" style={{ background: "var(--bronze)", color: "white", fontSize: 9, marginLeft: 6 }}>PRIMARY</span>}
              </td>
              <td style={{ padding: "12px 14px" }}><TierBadge tier={v.tier}/></td>
              <td className="muted" style={{ padding: "12px 14px", fontSize: 12 }}>{v.coverage}</td>
              <td className="mono" style={{ padding: "12px 14px", textAlign: "right" }}>{v.jobs.toLocaleString()}</td>
              <td style={{ padding: "12px 14px" }}><MetricBar pct={v.sla} good={92}/></td>
              <td style={{ padding: "12px 14px" }}><MetricBar pct={(v.csat / 5) * 100} label={`${v.csat}★`} good={88}/></td>
              <td style={{ padding: "12px 14px" }}><MetricBar pct={v.comp} good={100}/></td>
              <td className="mono" style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>${v.spend.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricBar({ pct, label, good = 90 }) {
  const color = pct >= good ? "var(--olive)" : pct >= good - 8 ? "var(--amber)" : "var(--terracotta)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color }}/>
      </div>
      <div className="mono" style={{ fontSize: 11, fontWeight: 600, color, minWidth: 32 }}>{label || `${pct}%`}</div>
    </div>
  );
}

// ── Resident Pulse ──
function ResidentPulse() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div className="card" style={{ padding: 22 }}>
        <SectionTitle>CSAT trend · 6 months</SectionTitle>
        <div className="h-serif" style={{ fontSize: 32, fontWeight: 600, marginBottom: 4 }}>4.6 ★</div>
        <div style={{ fontSize: 12, color: "var(--olive)", fontWeight: 600, marginBottom: 18 }}>↑ +0.3 since Daedalus onboard (Jan)</div>
        <svg width="100%" height="160" viewBox="0 0 600 160">
          <defs>
            <linearGradient id="csatGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--bronze)" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="var(--bronze)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[40, 80, 120].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4"/>)}
          <path d="M0 110 L100 100 L200 80 L300 70 L400 55 L500 48 L600 44 L600 160 L0 160 Z" fill="url(#csatGrad)"/>
          <path d="M0 110 L100 100 L200 80 L300 70 L400 55 L500 48 L600 44" fill="none" stroke="var(--bronze)" strokeWidth="2.5"/>
          {[
            [0, 110, "Dec"], [100, 100, "Jan"], [200, 80, "Feb"], [300, 70, "Mar"], [400, 55, "Apr"], [500, 48, "May"], [600, 44, "Jun"],
          ].map(([x, y, m]) => (
            <g key={m}>
              <circle cx={x} cy={y} r="4" fill="var(--bronze)" stroke="white" strokeWidth="2"/>
              <text x={x} y="155" textAnchor={x === 0 ? "start" : x === 600 ? "end" : "middle"} fontSize="10" fill="var(--text-3)">{m}</text>
            </g>
          ))}
          <line x1="100" x2="100" y1="20" y2="140" stroke="var(--terracotta)" strokeDasharray="3 3" strokeWidth="1"/>
          <text x="105" y="30" fontSize="10" fill="var(--terracotta)" fontWeight="600">Daedalus onboard</text>
        </svg>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <SectionTitle>Top complaint themes · 90 days</SectionTitle>
        {[
          ["Slow response time", 8,  "−42%"],
          ["A/C downtime",        12, "−18%"],
          ["Gate access issues",  6,  "−61%"],
          ["Communication gaps",  5,  "−35%"],
          ["WiFi reliability",    9,  "+12%"],
        ].map(([k, v, delta]) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontSize: 13 }}>{k}</div>
            <div style={{ height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${v * 8}%`, background: "var(--bronze)" }}/>
            </div>
            <div className="mono" style={{ fontSize: 11, fontWeight: 700, textAlign: "right", color: delta.startsWith("−") ? "var(--olive)" : "var(--terracotta)" }}>{delta}</div>
          </div>
        ))}

        <div style={{ marginTop: 18, padding: 12, background: "rgba(122,139,76,0.08)", borderLeft: "3px solid var(--olive)", borderRadius: "0 8px 8px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--olive)" }}>↗ Insight</div>
          <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>Gate-related complaints down 61% since deploying Daedalus on-call rotation at Aria on Camelback.</div>
        </div>
      </div>
    </div>
  );
}

window.PMC = PMC;
