// Consumer Market — GC-side screen for opening their techs to homeowner jobs
// when they have idle capacity. Daedalus takes platform fee from consumer;
// after all dues are paid (tech wages, insurance, taxes), GC keeps a 5% cut.
// This screen lets the GC manage their roster, see live consumer jobs, and
// track earnings. Designed to feel like a side-hustle dashboard within the
// main vendor portal — confident but not the GC's primary focus.

const CM_TECHS = [
  { id: "t1", name: "Miguel Padilla", initials: "MP", color: "#B0463A", rating: 4.93, jobs: 412, status: "open", consent: "accepted", availableFrom: "2:00 PM today", trades: ["Locks", "Garage", "Smart home"], radius: 12, todayEarn: 84, mtdEarn: 1247, jobsToday: 2 },
  { id: "t2", name: "Devin Hayes",   initials: "DH", color: "#7A8B4C", rating: 4.87, jobs: 287, status: "busy",  consent: "accepted", availableFrom: "Tomorrow", trades: ["Plumbing", "Appliance"],  radius: 10, todayEarn: 0, mtdEarn: 612, jobsToday: 0 },
  { id: "t3", name: "Aria Chen",     initials: "AC", color: "#4A6378", rating: 4.91, jobs: 198, status: "open", consent: "accepted", availableFrom: "Now",         trades: ["Electrical", "WiFi"],   radius: 8,  todayEarn: 142, mtdEarn: 891, jobsToday: 3 },
  { id: "t4", name: "Jordan Sands",  initials: "JS", color: "#D08A2E", rating: 4.78, jobs: 89,  status: "off",  consent: "pending",  availableFrom: "—",          trades: ["Handyman"],              radius: 6,  todayEarn: 0, mtdEarn: 0, jobsToday: 0 },
  { id: "t5", name: "Renata Cole",   initials: "RC", color: "#B08654", rating: 4.95, jobs: 503, status: "open", consent: "accepted", availableFrom: "4:00 PM today", trades: ["HVAC", "Plumbing"],   radius: 15, todayEarn: 267, mtdEarn: 1832, jobsToday: 1 },
  { id: "t6", name: "Ben Okafor",    initials: "BO", color: "#5C7891", rating: 4.66, jobs: 67,  status: "off",  consent: "declined", availableFrom: "—",          trades: ["Appliance"],             radius: 0,  todayEarn: 0, mtdEarn: 0, jobsToday: 0 },
];

const CM_LIVE_JOBS = [
  { id: "CON-3247", cat: "Garage door", who: "Miguel P.", customer: "Sarah R.", area: "85018", status: "en-route", payout: 285, gcCut: 14, eta: "11 min", since: "Today, 1:42 PM" },
  { id: "CON-3244", cat: "WiFi mesh",   who: "Aria C.",   customer: "Hank D.",  area: "85016", status: "on-site",  payout: 320, gcCut: 16, eta: "—",      since: "Today, 11:20 AM" },
  { id: "CON-3241", cat: "Outlet repair", who: "Aria C.", customer: "Lisa P.",  area: "85014", status: "complete", payout: 195, gcCut: 9.75, eta: "Done · 38 min", since: "Today, 9:55 AM" },
  { id: "CON-3239", cat: "Disposal",     who: "Renata C.", customer: "Mike T.", area: "85020", status: "complete", payout: 247, gcCut: 12.35, eta: "Done · 52 min", since: "Yesterday, 4:10 PM" },
];

function ConsumerMarket({ onNav }) {
  const [tab, setTab] = React.useState("overview");
  const [enabled, setEnabled] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [techs, setTechs] = React.useState(CM_TECHS);
  const [showSettings, setShowSettings] = React.useState(false);

  const openCount = techs.filter(t => t.status === "open" && t.consent === "accepted").length;
  const acceptedCount = techs.filter(t => t.consent === "accepted").length;
  const todayEarnings = CM_LIVE_JOBS.filter(j => j.since.startsWith("Today")).reduce((s, j) => s + j.gcCut, 0);
  const mtdEarnings = techs.reduce((s, t) => s + t.mtdEarn, 0) * 0.05;

  return (
    <div style={{ padding: "24px 32px 60px", maxWidth: 1320, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 className="h-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Consumer Market</h1>
            <span className="pill pill-info" style={{ height: 22 }}>SIDE HUSTLE</span>
          </div>
          <div className="muted" style={{ fontSize: 14, maxWidth: 680, lineHeight: 1.55 }}>
            Open your idle techs to Daedalus's homeowner platform. We collect on your behalf, pay out wages + insurance + taxes, and you keep 5% of every job they complete.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setShowSettings(true)} className="btn btn-secondary"><Icon name="settings" size={13}/> Settings</button>
          <ConsumerMarketToggle enabled={enabled} onChange={setEnabled} paused={paused}/>
        </div>
      </div>

      {paused && (
        <div className="card" style={{ padding: "12px 16px", marginBottom: 18, background: "rgba(176,70,58,0.08)", borderColor: "rgba(176,70,58,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="alert" size={16} color="var(--terracotta)"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--terracotta)" }}>Emergency pause active</div>
            <div className="muted" style={{ fontSize: 12 }}>No new consumer jobs until you resume. In-progress jobs continue.</div>
          </div>
          <button onClick={() => setPaused(false)} className="btn btn-secondary btn-sm">Resume</button>
        </div>
      )}

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
        <CMKpi label="Today's cut" value={`$${todayEarnings.toFixed(2)}`} sub={`from ${CM_LIVE_JOBS.filter(j => j.since.startsWith("Today")).length} jobs`} accent="bronze"/>
        <CMKpi label="Month to date" value={`$${mtdEarnings.toFixed(0)}`} sub="+$316 vs last mo" accent="olive"/>
        <CMKpi label="Open techs" value={`${openCount}/${acceptedCount}`} sub={`${techs.length - acceptedCount} pending consent`} accent="slate"/>
        <CMKpi label="Live jobs" value={CM_LIVE_JOBS.filter(j => j.status !== "complete").length} sub="2 en route · 1 on site" accent="terracotta" pulse/>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--line)", marginBottom: 22 }}>
        {[
          { k: "overview", l: "Overview" },
          { k: "techs",    l: "My techs", n: techs.length },
          { k: "jobs",     l: "Live jobs", n: CM_LIVE_JOBS.length },
          { k: "earnings", l: "Earnings" },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: "10px 16px", border: 0, background: "transparent", cursor: "pointer",
            color: tab === t.k ? "var(--text)" : "var(--text-3)",
            fontSize: 13, fontWeight: tab === t.k ? 600 : 500,
            borderBottom: tab === t.k ? "2px solid var(--bronze)" : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
          }}>
            {t.l}
            {t.n != null && <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 999, background: tab === t.k ? "var(--bronze)" : "var(--surface-2)", color: tab === t.k ? "white" : "var(--text-3)" }}>{t.n}</span>}
          </button>
        ))}
      </div>

      {tab === "overview" && <CMOverview techs={techs} setPaused={setPaused}/>}
      {tab === "techs"    && <CMTechs techs={techs} setTechs={setTechs}/>}
      {tab === "jobs"     && <CMJobs/>}
      {tab === "earnings" && <CMEarnings techs={techs}/>}

      {showSettings && <CMSettingsModal onClose={() => setShowSettings(false)} paused={paused} setPaused={setPaused}/>}
    </div>
  );
}

function ConsumerMarketToggle({ enabled, onChange, paused }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--surface)" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Program</span>
      <button onClick={() => onChange(!enabled)} style={{
        width: 38, height: 22, borderRadius: 999, position: "relative", cursor: "pointer",
        background: paused ? "var(--terracotta)" : enabled ? "var(--olive)" : "var(--surface-3)",
        border: 0, transition: "all var(--tx-fast)",
      }}>
        <span style={{ position: "absolute", top: 2, left: enabled ? 18 : 2, width: 18, height: 18, borderRadius: 999, background: "white", transition: "all var(--tx-fast)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}/>
      </button>
      <span style={{ fontSize: 12, fontWeight: 600, color: paused ? "var(--terracotta)" : enabled ? "var(--olive)" : "var(--text-3)" }}>{paused ? "Paused" : enabled ? "ON" : "OFF"}</span>
    </div>
  );
}

function CMKpi({ label, value, sub, accent, pulse }) {
  const colorMap = { bronze: "var(--bronze)", olive: "var(--olive)", slate: "var(--slateblue)", terracotta: "var(--terracotta)" };
  return (
    <div className="card" style={{ padding: 18, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
        {pulse && <span style={{ width: 6, height: 6, borderRadius: 999, background: colorMap[accent], animation: "pulse 1.4s infinite" }}/>}
      </div>
      <div className="mono" style={{ fontSize: 30, fontWeight: 700, marginTop: 6, color: colorMap[accent], letterSpacing: "-0.01em" }}>{value}</div>
      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{sub}</div>
      <div style={{ position: "absolute", right: -10, bottom: -10, width: 60, height: 60, borderRadius: 999, background: colorMap[accent], opacity: 0.05 }}/>
    </div>
  );
}

function CMOverview({ techs, setPaused }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
      {/* Left: how it works */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>How the math works</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { n: 1, l: "Customer pays Daedalus", v: "$285.00", c: "var(--text)" },
            { n: 2, l: "− Tech wages (1099 share)", v: "−$142.50", c: "var(--text-2)" },
            { n: 3, l: "− Insurance & coverage", v: "−$22.80", c: "var(--text-2)" },
            { n: 4, l: "− Daedalus platform fee", v: "−$45.60", c: "var(--text-2)" },
            { n: 5, l: "− Materials & taxes", v: "−$59.85", c: "var(--text-2)" },
            { n: 6, l: "Net pool", v: "$14.25", c: "var(--text-3)" },
            { n: 7, l: "Your 5% cut", v: "+$14.25", c: "var(--bronze)", strong: true },
          ].map(r => (
            <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 14, padding: r.strong ? "12px 14px" : 0, background: r.strong ? "rgba(176,134,84,0.10)" : "transparent", borderRadius: r.strong ? 10 : 0, borderLeft: r.strong ? "3px solid var(--bronze)" : 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: r.strong ? "var(--bronze)" : "var(--surface-2)", color: r.strong ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{r.n}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: r.strong ? 600 : 500, color: r.c }}>{r.l}</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: r.strong ? 700 : 500, color: r.c }}>{r.v}</div>
            </div>
          ))}
        </div>
        <div className="muted" style={{ fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
          You only earn after wages, insurance, materials, and platform fees are paid. No upside but also no downside — even if the job goes sideways, your tech gets paid and you don't owe Daedalus anything.
        </div>
      </div>

      {/* Right: trend + quick actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Earnings · last 14 days</div>
            <span className="mono" style={{ fontSize: 11, color: "var(--olive)", fontWeight: 600 }}>+38% wow</span>
          </div>
          <Sparkline/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14, fontSize: 11 }}>
            <Mini label="Avg job" value="$12.80"/>
            <Mini label="Best day" value="Tue · $48"/>
            <Mini label="Top tech" value="Renata C."/>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <QuickAction icon="users" label="Invite techs to opt in" sub={`${techs.filter(t => t.consent === "pending").length} pending consent`}/>
            <QuickAction icon="location" label="Adjust service area" sub="Currently 3 ZIPs in 85018-85020"/>
            <QuickAction icon="alert" label="Emergency pause" sub="Halts new jobs in 1 click" onClick={() => setPaused(true)} danger/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function QuickAction({ icon, label, sub, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10,
      border: "1px solid var(--line)", background: "var(--surface)", textAlign: "left",
      cursor: "pointer", color: "var(--text)", width: "100%",
    }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: danger ? "rgba(176,70,58,0.10)" : "var(--surface-2)", color: danger ? "var(--terracotta)" : "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={14}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: danger ? "var(--terracotta)" : "var(--text)" }}>{label}</div>
        <div className="muted" style={{ fontSize: 11 }}>{sub}</div>
      </div>
      <Icon name="chevRight" size={12} color="var(--text-3)"/>
    </button>
  );
}

function Sparkline() {
  const pts = [12, 18, 8, 22, 16, 28, 14, 32, 26, 38, 30, 42, 36, 48];
  const max = Math.max(...pts);
  const w = 320, h = 60;
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - (p / max) * h}`).join(" L ");
  const fillPath = `M 0,${h} L ${path} L ${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 60 }}>
      <defs>
        <linearGradient id="cm-spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--bronze)" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="var(--bronze)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#cm-spark)"/>
      <path d={`M ${path}`} stroke="var(--bronze)" strokeWidth="2" fill="none"/>
      <circle cx={w} cy={h - (pts[pts.length - 1] / max) * h} r="3" fill="var(--bronze)"/>
    </svg>
  );
}

function CMTechs({ techs, setTechs }) {
  const toggle = id => setTechs(arr => arr.map(t => t.id === id ? { ...t, status: t.status === "open" ? "off" : "open" } : t));
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
        <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <tr>
            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700 }}>Tech</th>
            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700 }}>Trades</th>
            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700 }}>Available</th>
            <th style={{ textAlign: "right", padding: "12px 16px", fontWeight: 700 }}>Today</th>
            <th style={{ textAlign: "right", padding: "12px 16px", fontWeight: 700 }}>MTD (your cut)</th>
            <th style={{ textAlign: "center", padding: "12px 16px", fontWeight: 700 }}>Open to consumer</th>
          </tr>
        </thead>
        <tbody>
          {techs.map(t => (
            <tr key={t.id} style={{ borderTop: "1px solid var(--line)" }}>
              <td style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: t.color, color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>★ {t.rating} · {t.jobs} jobs</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {t.trades.map(tr => <span key={tr} className="pill" style={{ fontSize: 10, background: "var(--surface-2)", color: "var(--text-2)", height: 20 }}>{tr}</span>)}
                </div>
              </td>
              <td style={{ padding: "14px 16px", color: t.availableFrom === "Now" ? "var(--olive)" : "var(--text-2)", fontWeight: t.availableFrom === "Now" ? 600 : 500 }}>{t.availableFrom}</td>
              <td style={{ padding: "14px 16px", textAlign: "right" }} className="mono">${(t.todayEarn * 0.05).toFixed(2)}</td>
              <td style={{ padding: "14px 16px", textAlign: "right" }} className="mono">${(t.mtdEarn * 0.05).toFixed(2)}</td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                {t.consent === "accepted" ? (
                  <button onClick={() => toggle(t.id)} style={{
                    width: 38, height: 22, borderRadius: 999, position: "relative", cursor: "pointer",
                    background: t.status === "open" ? "var(--olive)" : "var(--surface-3)", border: 0, transition: "all var(--tx-fast)",
                  }}>
                    <span style={{ position: "absolute", top: 2, left: t.status === "open" ? 18 : 2, width: 18, height: 18, borderRadius: 999, background: "white", transition: "all var(--tx-fast)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}/>
                  </button>
                ) : t.consent === "pending" ? (
                  <span className="pill" style={{ background: "rgba(208,138,46,0.12)", color: "#7A4F1B", fontSize: 10, height: 20 }}>Awaiting consent</span>
                ) : (
                  <span className="muted" style={{ fontSize: 11 }}>Declined</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CMJobs() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {CM_LIVE_JOBS.map(j => (
        <div key={j.id} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(176,134,84,0.10)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="workorder" size={16}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{j.id}</div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{j.cat}</span>
              <CMJobStatus status={j.status}/>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{j.who} → {j.customer} · ZIP {j.area} · {j.since}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="mono" style={{ fontSize: 13, color: "var(--text-3)" }}>${j.payout}</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--bronze)", marginTop: 2 }}>+${j.gcCut.toFixed(2)}</div>
          </div>
          <div style={{ minWidth: 90, textAlign: "right" }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{j.eta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CMJobStatus({ status }) {
  const map = {
    "en-route":   { l: "En route",  c: "var(--bronze)",     bg: "rgba(176,134,84,0.12)" },
    "on-site":    { l: "On site",   c: "var(--slateblue)",  bg: "rgba(74,99,120,0.12)" },
    "complete":   { l: "Complete",  c: "var(--olive)",      bg: "rgba(122,139,76,0.12)" },
  };
  const m = map[status];
  return <span className="pill" style={{ fontSize: 10, background: m.bg, color: m.c, height: 20 }}><span className="dot" style={{ background: m.c }}/>{m.l}</span>;
}

function CMEarnings({ techs }) {
  const totalMTD = techs.reduce((s, t) => s + t.mtdEarn * 0.05, 0);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>October 2025</div>
        <div className="mono" style={{ fontSize: 36, fontWeight: 700, marginTop: 6, color: "var(--bronze)", letterSpacing: "-0.01em" }}>${totalMTD.toFixed(2)}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Auto-deposits to your operating account on the 1st</div>
        <div style={{ height: 1, background: "var(--line)", margin: "18px 0" }}/>
        <Mini label="Last payout" value="Sep 1 · $1,124.50"/>
        <div style={{ marginTop: 12 }}><Mini label="YTD" value="$8,847.20"/></div>
        <div style={{ marginTop: 12 }}><Mini label="Avg per tech / mo" value="$184"/></div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", fontSize: 13, fontWeight: 600 }}>By tech · MTD</div>
        {techs.filter(t => t.mtdEarn > 0).sort((a, b) => b.mtdEarn - a.mtdEarn).map(t => {
          const cut = t.mtdEarn * 0.05;
          const max = Math.max(...techs.map(x => x.mtdEarn * 0.05));
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderTop: "1px solid var(--line)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: t.color, color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 999, marginTop: 5, overflow: "hidden" }}>
                  <div style={{ width: `${(cut / max) * 100}%`, height: "100%", background: "var(--bronze)", borderRadius: 999 }}/>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--bronze)", minWidth: 70, textAlign: "right" }}>${cut.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CMSettingsModal({ onClose, paused, setPaused }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(31,35,41,0.6)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 40, overflow: "auto" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 720, padding: 0, animation: "slideUp 240ms var(--ease)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="h-serif" style={{ fontSize: 20, fontWeight: 600 }}>Consumer Market settings</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Configure scope, coverage, and emergency controls.</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Geographic limits */}
          <SettingSection title="Geographic limits" icon="location">
            <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>Only accept consumer jobs within this radius of each tech's home base.</div>
            <div style={{ position: "relative", height: 140, borderRadius: 10, overflow: "hidden", background: "linear-gradient(180deg, #EDE5D2, #DFD4B8)", marginBottom: 12 }}>
              <svg width="100%" height="100%" viewBox="0 0 600 140" preserveAspectRatio="none">
                <defs>
                  <pattern id="cm-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(31,35,41,0.06)" strokeWidth="1"/></pattern>
                </defs>
                <rect width="600" height="140" fill="url(#cm-grid)"/>
                <circle cx="300" cy="70" r="60" fill="rgba(176,134,84,0.18)" stroke="var(--bronze)" strokeWidth="1.5" strokeDasharray="3 3"/>
                <circle cx="300" cy="70" r="4" fill="var(--bronze)"/>
              </svg>
              <div style={{ position: "absolute", bottom: 8, left: 10, padding: "4px 10px", background: "var(--surface)", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>📍 Phoenix HQ · 12 mi</div>
              <div style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, padding: "3px 8px", background: "rgba(255,255,255,0.85)", borderRadius: 4, color: "var(--text-3)", fontStyle: "italic" }}>placeholder map</div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="muted" style={{ fontSize: 12 }}>Radius</span>
              <input type="range" min="3" max="40" defaultValue="12" style={{ flex: 1, accentColor: "var(--bronze)" }}/>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>12 mi</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["85016","85018","85020","85021","85028","85032"].map(z => (
                <span key={z} className="pill" style={{ background: "var(--surface-2)", color: "var(--text-2)", fontSize: 11, height: 22 }}>{z}</span>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ height: 22, padding: "0 8px", fontSize: 11 }}>+ Add ZIP</button>
            </div>
          </SettingSection>

          {/* Insurance */}
          <SettingSection title="Insurance & coverage" icon="shield">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <CoverageCard label="General liability" value="$2M aggregate" provider="Hiscox" status="active"/>
              <CoverageCard label="Daedalus consumer add-on" value="$1M / job" provider="auto-applied" status="active"/>
              <CoverageCard label="Workers' comp" value="Statewide AZ" provider="Travelers" status="active"/>
              <CoverageCard label="Bond" value="$25K" provider="Surety One" status="active"/>
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
              Daedalus auto-applies a $1M/job consumer add-on to every consumer-market job at no cost — your existing policies cover the rest. <a style={{ color: "var(--bronze)", textDecoration: "none" }}>How coverage stacks ↗</a>
            </div>
          </SettingSection>

          {/* Pause */}
          <SettingSection title="Emergency pause" icon="alert">
            <div className="muted" style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
              Halt all new consumer jobs immediately. In-progress jobs continue to completion. Use for storms, equipment shortages, or staffing emergencies.
            </div>
            <button onClick={() => { setPaused(!paused); onClose(); }} className={paused ? "btn btn-secondary" : "btn-secondary"} style={{
              padding: "10px 16px", borderRadius: 10, border: paused ? "1px solid var(--line)" : "1.5px solid var(--terracotta)",
              background: paused ? "var(--surface)" : "rgba(176,70,58,0.06)", color: paused ? "var(--text)" : "var(--terracotta)",
              fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            }}>
              <Icon name={paused ? "play" : "alert"} size={14}/> {paused ? "Resume program" : "Pause new consumer jobs"}
            </button>
          </SettingSection>
        </div>
      </div>
    </div>
  );
}

function SettingSection({ title, icon, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--surface-2)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={13}/>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function CoverageCard({ label, value, provider, status }) {
  return (
    <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--olive)" }}/>
        <span className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{provider}</div>
    </div>
  );
}

window.ConsumerMarket = ConsumerMarket;
