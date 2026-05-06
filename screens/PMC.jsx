// Property Manager view — How the PMC side experiences Daedalus
// Shows: portfolio dashboard, PMS-pushed work orders feed (Yardi/AppFolio/RealPage),
// vendor scorecards, and resident satisfaction trends.

function PMC({ onNav }) {
  const [tab, setTab] = React.useState("portfolio");
  const [openProp, setOpenProp] = React.useState(null);

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      {/* Persona banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "linear-gradient(90deg, rgba(80,98,128,0.12), rgba(80,98,128,0.02))", border: "1px solid rgba(80,98,128,0.2)", borderRadius: 10, marginBottom: 18 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--slateblue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>MG</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Viewing as Marcus Greene · Director of Operations · Meridian Living</div>
          <div className="muted" style={{ fontSize: 11 }}>14 properties · 4,820 units · Yardi Voyager 8.0 · Daedalus customer since Jan 2025</div>
        </div>
        <span className="pill pill-info" style={{ fontSize: 10 }}>PMC perspective</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Meridian Operations</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Real-time view of every WO Daedalus is running across your portfolio.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Monthly report</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Push WO from Yardi</button>
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
          { k: "feed",      l: "WO feed (PMS push)", icon: "workorder" },
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
      {tab === "feed"      && <PMSFeed/>}
      {tab === "vendors"   && <VendorScorecards/>}
      {tab === "csat"      && <ResidentPulse/>}

      {openProp && <PropertyDrawer prop={openProp} onClose={() => setOpenProp(null)}/>}
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

function PropertyDrawer({ prop, onClose }) {
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

          <SectionTitle>Active work orders</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
            {[
              { id: "WO-04122", trade: "Gate", unit: "Common — Main entry", sla: "Today 18:00", vendor: "Daedalus · Mason P.", status: "in-progress" },
              { id: "WO-04118", trade: "WiFi", unit: "Clubhouse",            sla: "Tomorrow",   vendor: "Daedalus · Devin H.", status: "scheduled" },
              { id: "WO-04101", trade: "A/C",  unit: "Unit 312",             sla: "2d overdue", vendor: "Daedalus · Rosa C.", status: "breach" },
              { id: "WO-04094", trade: "Plumbing", unit: "Unit 117",         sla: "Today",      vendor: "Daedalus · Devin H.", status: "in-progress" },
            ].map(w => (
              <div key={w.id} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bronze)", fontSize: 11, fontWeight: 700 }}>{w.trade.slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{w.id} · {w.unit}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{w.vendor}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={`pill ${w.status === "breach" ? "pill-danger" : w.status === "in-progress" ? "pill-warn" : "pill-info"}`} style={{ fontSize: 10 }}>{w.sla}</div>
                </div>
              </div>
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
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Push WO</button>
          <button className="btn btn-secondary"><Icon name="mail" size={14}/> Message Daedalus</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, dangerous }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 700, marginTop: 2, color: dangerous ? "var(--terracotta)" : "var(--text)" }}>{value}</div>
    </div>
  );
}
function SectionTitle({ children }) {
  return <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{children}</div>;
}

// ── PMS Feed ──
function PMSFeed() {
  const events = [
    { t: "2 min ago",  pms: "Yardi",     prop: "Aria on Camelback",       wo: "WO-04129", trade: "Gate",     unit: "Common", priority: "Urgent",  status: "Routed → Daedalus", note: "Auto-routed: gate keyword + after-hours" },
    { t: "8 min ago",  pms: "Yardi",     prop: "Camelback Heights",       wo: "WO-04128", trade: "Plumbing", unit: "Unit 412", priority: "Standard",status: "Tech assigned · Mason P.", note: "Resident reported leak under sink" },
    { t: "22 min ago", pms: "AppFolio",  prop: "Roosevelt Row Lofts",     wo: "WO-04127", trade: "Lock",     unit: "Unit 218", priority: "Standard",status: "Awaiting tech", note: "Lockout — resident on-site" },
    { t: "1h ago",     pms: "RealPage",  prop: "Tempe Town Crossing",     wo: "WO-04126", trade: "A/C",      unit: "Unit 308", priority: "Urgent",  status: "Quote requested", note: "Compressor failure — 100°F outside" },
    { t: "1h ago",     pms: "Yardi",     prop: "The Marquee at Old Town", wo: "WO-04125", trade: "Lighting", unit: "Hallway 3",priority: "Low",     status: "Scheduled · Tomorrow 10am", note: "3 fixtures out, batched" },
    { t: "2h ago",     pms: "Yardi",     prop: "Aria on Camelback",       wo: "WO-04124", trade: "Gate",     unit: "Common", priority: "Urgent",  status: "Resolved · 47 min", note: "On-site repair · gate solenoid" },
    { t: "2h ago",     pms: "AppFolio",  prop: "Phoenix Central Annex",   wo: "WO-04123", trade: "Pest",     unit: "Unit 104", priority: "Standard",status: "Routed → external (specialty)", note: "Out of Daedalus scope" },
  ];
  const PMS_COLOR = { Yardi: "#1B4D89", AppFolio: "#1F8A5B", RealPage: "#B0463A" };
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Live PMS feed</div>
          <div className="muted" style={{ fontSize: 11 }}>Yardi / AppFolio / RealPage → Daedalus auto-routing</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="pill pill-success" style={{ fontSize: 11 }}><span className="dot"/>Yardi connected</span>
          <span className="pill pill-success" style={{ fontSize: 11 }}><span className="dot"/>AppFolio connected</span>
          <span className="pill pill-success" style={{ fontSize: 11 }}><span className="dot"/>RealPage connected</span>
        </div>
      </div>
      <div>
        {events.map((e, i) => (
          <div key={i} style={{ display: "flex", padding: 14, borderBottom: i < events.length - 1 ? "1px solid var(--line)" : 0, gap: 14, alignItems: "flex-start" }}>
            <div className="muted mono" style={{ fontSize: 11, width: 70, flexShrink: 0, paddingTop: 2 }}>{e.t}</div>
            <div style={{ width: 80, flexShrink: 0 }}>
              <span className="pill" style={{ background: PMS_COLOR[e.pms] + "20", color: PMS_COLOR[e.pms], borderColor: PMS_COLOR[e.pms] + "40", fontSize: 10, fontWeight: 700 }}>{e.pms}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--bronze)" }}>{e.wo}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{e.prop}</span>
                <span className="muted" style={{ fontSize: 12 }}>· {e.unit}</span>
                <span className={`pill ${e.priority === "Urgent" ? "pill-danger" : e.priority === "Low" ? "pill-neutral" : "pill-info"}`} style={{ fontSize: 10 }}>{e.priority}</span>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{e.trade} · {e.note}</div>
            </div>
            <div style={{ width: 200, flexShrink: 0, textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: e.status.includes("Resolved") ? "var(--olive)" : e.status.includes("external") ? "var(--text-3)" : "var(--text)" }}>
                {e.status.includes("Resolved") && <Icon name="check" size={11} color="var(--olive)"/>} {e.status}
              </div>
            </div>
          </div>
        ))}
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
