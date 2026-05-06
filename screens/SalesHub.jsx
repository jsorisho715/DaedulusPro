// Sales Hub — outbound pipeline, accounts, property signals, AI outreach
// Tabs: Pipeline · Accounts · Property Signals · Outreach · Monitor · Settings

function SalesHub({ onNav }) {
  const [tab, setTab] = React.useState("pipeline");
  const [openAccount, setOpenAccount] = React.useState(null);
  const [pitchProp, setPitchProp] = React.useState(null); // property to pitch

  // global AI outreach settings (mock-persisted in component)
  const [aiCfg, setAiCfg] = React.useState({
    enabled: true,
    sources: { google: true, yelp: true, reddit: true, apartmentRatings: true, nextdoor: false, bbb: true },
    cadence: "balanced", // gentle / balanced / aggressive
    tradeFocus: ["Gate", "WiFi", "A/C", "Plumbing"],
    minSignals: 8,
    radiusMi: 25,
    pretendCoincidence: true,
    autoSendDrip: false,
    senderPersona: "concierge",
    suppressIfWon: true,
  });

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
        <div>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Daedalus Ops · Outbound</div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: "4px 0", fontWeight: 600 }}>Sales Hub</h1>
          <div className="muted" style={{ fontSize: 13 }}>Pipeline, accounts, and property-level signal intelligence — never used to cold-pitch residents.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Log activity</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, margin: "22px 0 18px" }}>
        <KPI label="Pipeline value" value="$1.84M" delta="+12%" pos/>
        <KPI label="Active accounts" value="38" delta="+4 this wk"/>
        <KPI label="Properties tracked" value="412" delta="78 with hot signals"/>
        <KPI label="Demo → Won" value="34%" delta="+5pt vs Q1" pos/>
        <KPI label="Avg cycle" value="42d" delta="−6d" pos/>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--line)", marginBottom: 22, overflowX: "auto" }}>
        {[
          { k: "pipeline", l: "Pipeline", icon: "bid" },
          { k: "accounts", l: "Accounts", icon: "users" },
          { k: "signals",  l: "Property Signals", icon: "flag" },
          { k: "outreach", l: "AI Outreach", icon: "mail" },
          { k: "monitor",  l: "Monitor", icon: "eye" },
          { k: "settings", l: "AI Settings", icon: "settings" },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: "10px 18px", border: 0, borderBottom: `2px solid ${tab === t.k ? "var(--bronze)" : "transparent"}`,
            background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600,
            color: tab === t.k ? "var(--text)" : "var(--text-3)",
            display: "flex", alignItems: "center", gap: 8, marginBottom: -1, whiteSpace: "nowrap",
          }}>
            <Icon name={t.icon} size={14}/> {t.l}
          </button>
        ))}
      </div>

      {tab === "pipeline" && <Pipeline/>}
      {tab === "accounts" && <Accounts onOpen={setOpenAccount}/>}
      {tab === "signals"  && <PropertySignals onPitch={setPitchProp}/>}
      {tab === "outreach" && <AIOutreach aiCfg={aiCfg} onPitch={setPitchProp}/>}
      {tab === "monitor"  && <OutreachMonitor aiCfg={aiCfg}/>}
      {tab === "settings" && <AISettings cfg={aiCfg} setCfg={setAiCfg}/>}

      {openAccount && <AccountDrawer acct={openAccount} onClose={() => setOpenAccount(null)} onPitch={(prop) => { setOpenAccount(null); setPitchProp(prop); }}/>}
      {pitchProp && <PitchPropertyModal property={pitchProp} aiCfg={aiCfg} onClose={() => setPitchProp(null)}/>}
    </div>
  );
}

function KPI({ label, value, delta, pos }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, fontFamily: "var(--mono)" }}>{value}</div>
      {delta && <div style={{ fontSize: 11, color: pos ? "var(--olive)" : "var(--text-3)", marginTop: 2, fontWeight: 600 }}>{delta}</div>}
    </div>
  );
}

// ── Pipeline ──
const PIPELINE = {
  Prospect:  [
    { id: "d1", pmc: "Vista Pacific Living",   props: 11, value: 380_000, days: 8,  rep: "ES", contact: "Maya Holloway",  signal: 14 },
    { id: "d2", pmc: "Copperline Residential", props: 6,  value: 160_000, days: 5,  rep: "JM", contact: "Owen Park",      signal: 9  },
    { id: "d3", pmc: "Sage Hill Asset Mgmt",   props: 18, value: 540_000, days: 12, rep: "ES", contact: "Renée Vasquez",  signal: 22 },
  ],
  Engaged:   [
    { id: "d4", pmc: "Greystone Multifamily",  props: 24, value: 720_000, days: 21, rep: "JM", contact: "Trent McAllister", signal: 31 },
    { id: "d5", pmc: "Olive Branch Properties",props: 9,  value: 240_000, days: 14, rep: "ES", contact: "Priya Shankar",  signal: 18 },
  ],
  Demo:      [
    { id: "d6", pmc: "Northcrest Capital",     props: 32, value: 920_000, days: 28, rep: "JM", contact: "Damon Whitley",  signal: 42 },
  ],
  Proposal:  [
    { id: "d7", pmc: "Solana Residential",     props: 9,  value: 260_000, days: 41, rep: "ES", contact: "Lila Tran",      signal: 11 },
    { id: "d8", pmc: "Palmcrest Properties",   props: 6,  value: 180_000, days: 36, rep: "JM", contact: "Heather Quinn",  signal: 7  },
  ],
  Won:       [
    { id: "d9",  pmc: "Meridian Living",       props: 14, value: 460_000, days: 0,  rep: "JM", contact: "Marcus Greene",  signal: 0, won: true },
    { id: "d10", pmc: "Red Rock Capital Mgmt", props: 22, value: 680_000, days: 0,  rep: "ES", contact: "Sasha Whitfield",signal: 0, won: true },
  ],
  Lost:      [
    { id: "d11", pmc: "Foothills REIT",        props: 12, value: 320_000, days: 0,  rep: "ES", contact: "Brent Hollis",   signal: 0, lost: true, reason: "Tied to incumbent" },
  ],
};

function Pipeline() {
  const stages = ["Prospect", "Engaged", "Demo", "Proposal", "Won", "Lost"];
  const stageColors = {
    Prospect: "var(--text-3)", Engaged: "var(--slateblue)", Demo: "var(--amber)",
    Proposal: "var(--bronze)", Won: "var(--olive)", Lost: "var(--terracotta)",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(220px, 1fr))", gap: 12, overflowX: "auto" }}>
      {stages.map(s => {
        const items = PIPELINE[s] || [];
        const total = items.reduce((a, b) => a + b.value, 0);
        return (
          <div key={s} style={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderTop: `2px solid ${stageColors[s]}`, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s}</div>
                <div className="muted mono" style={{ fontSize: 11, marginTop: 1 }}>{items.length} · {fmt$(total)}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map(d => (
                <div key={d.id} className="card" style={{ padding: 12, cursor: "pointer", transition: "all var(--tx-fast)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{d.pmc}</div>
                  <div className="muted" style={{ fontSize: 11, marginBottom: 8 }}>{d.contact} · {d.props} properties</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: stageColors[s] }}>{fmt$(d.value)}</div>
                    {d.signal > 0 && <span className="pill pill-warn" style={{ fontSize: 10 }}><Icon name="flag" size={10}/> {d.signal}</span>}
                    {d.won && <span className="pill pill-success" style={{ fontSize: 10 }}>Closed</span>}
                  </div>
                  {d.reason && <div className="muted" style={{ fontSize: 11, marginTop: 8, padding: "6px 8px", background: "var(--surface-2)", borderRadius: 6 }}>{d.reason}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: "var(--bronze)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{d.rep}</div>
                    {d.days > 0 && <div className="muted" style={{ fontSize: 10 }}>{d.days}d in stage</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Accounts ──
const ACCOUNTS = [
  { name: "Meridian Living",        props: 14, status: "Customer", spend: 460_000, signals: 12, last: "2d ago", contact: "Marcus Greene",   stage: "Won" },
  { name: "Red Rock Capital Mgmt",  props: 22, status: "Customer", spend: 680_000, signals: 8,  last: "1d ago", contact: "Sasha Whitfield", stage: "Won" },
  { name: "Solana Residential",     props: 9,  status: "Active",   spend: 260_000, signals: 11, last: "3d ago", contact: "Lila Tran",       stage: "Proposal" },
  { name: "Palmcrest Properties",   props: 6,  status: "Active",   spend: 180_000, signals: 7,  last: "1w ago", contact: "Heather Quinn",   stage: "Proposal" },
  { name: "Greystone Multifamily",  props: 24, status: "Active",   spend: 0,       signals: 31, last: "4d ago", contact: "Trent McAllister",stage: "Engaged" },
  { name: "Northcrest Capital",     props: 32, status: "Active",   spend: 0,       signals: 42, last: "Today",  contact: "Damon Whitley",   stage: "Demo" },
  { name: "Sage Hill Asset Mgmt",   props: 18, status: "Prospect", spend: 0,       signals: 22, last: "5d ago", contact: "Renée Vasquez",   stage: "Prospect" },
  { name: "Vista Pacific Living",   props: 11, status: "Prospect", spend: 0,       signals: 14, last: "1w ago", contact: "Maya Holloway",   stage: "Prospect" },
  { name: "Olive Branch Properties",props: 9,  status: "Active",   spend: 0,       signals: 18, last: "2d ago", contact: "Priya Shankar",   stage: "Engaged" },
  { name: "Copperline Residential", props: 6,  status: "Prospect", spend: 0,       signals: 9,  last: "3d ago", contact: "Owen Park",       stage: "Prospect" },
];

function Accounts({ onOpen }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", fontSize: 13 }}>
        <thead style={{ background: "var(--surface-2)" }}>
          <tr style={{ color: "var(--text-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>PMC</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Status</th>
            <th style={{ textAlign: "right", padding: "10px 14px", fontWeight: 700 }}>Properties</th>
            <th style={{ textAlign: "right", padding: "10px 14px", fontWeight: 700 }}>Annual spend</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Hot signals</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Primary contact</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Last touch</th>
            <th style={{ width: 32 }}></th>
          </tr>
        </thead>
        <tbody>
          {ACCOUNTS.map((a, i) => (
            <tr key={a.name} onClick={() => onOpen(a)} style={{ borderTop: "1px solid var(--line)", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ padding: "12px 14px", fontWeight: 600 }}>{a.name}</td>
              <td style={{ padding: "12px 14px" }}>
                <span className={`pill ${a.status === "Customer" ? "pill-success" : a.status === "Active" ? "pill-info" : "pill-neutral"}`}>{a.status}</span>
              </td>
              <td className="mono" style={{ padding: "12px 14px", textAlign: "right" }}>{a.props}</td>
              <td className="mono" style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>{a.spend ? fmt$(a.spend) : "—"}</td>
              <td style={{ padding: "12px 14px" }}>
                {a.signals > 0 ? <SignalBar count={a.signals} max={50}/> : <span className="muted" style={{ fontSize: 11 }}>—</span>}
              </td>
              <td style={{ padding: "12px 14px" }}>{a.contact}</td>
              <td className="muted" style={{ padding: "12px 14px", fontSize: 12 }}>{a.last}</td>
              <td style={{ padding: "12px 14px", textAlign: "right" }}><Icon name="chevRight" size={14} color="var(--text-3)"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SignalBar({ count, max }) {
  const pct = Math.min(1, count / max);
  const color = count > 25 ? "var(--terracotta)" : count > 10 ? "var(--amber)" : "var(--olive)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: color }}/>
      </div>
      <div className="mono" style={{ fontSize: 11, fontWeight: 600, color, minWidth: 24 }}>{count}</div>
    </div>
  );
}

function AccountDrawer({ acct, onClose, onPitch }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.55)", backdropFilter: "blur(2px)", zIndex: 100, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 640, background: "var(--bg)",
        borderLeft: "1px solid var(--line-strong)", boxShadow: "var(--shadow-lg)",
        display: "flex", flexDirection: "column", animation: "slideIn 250ms var(--ease)",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>PMC Account</div>
            <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>{acct.name}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
            <Stat label="Stage" value={acct.stage}/>
            <Stat label="Properties" value={acct.props}/>
            <Stat label="Hot signals" value={acct.signals}/>
          </div>

          <SectionTitle>Top property signals</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
            {[
              { name: "Aria on Camelback", pmc: acct.name, units: 312, total: 47, gate: 12, wifi: 9, ac: 8, plumbing: 6, lighting: 4, gym: 5, other: 3, trade: "Gate", count: 12, gist: "Mentions of broken main entry gate, pedestrian access only" },
              { name: "Solano Lofts",      pmc: acct.name, units: 168, total: 11, gate: 2,  wifi: 4, ac: 1, plumbing: 1, lighting: 1, gym: 1, other: 1, trade: "WiFi", count: 4,  gist: "Internet drops constantly in clubhouse" },
              { name: "The Marquee",       pmc: acct.name, units: 244, total: 9,  gate: 1,  wifi: 1, ac: 3, plumbing: 2, lighting: 1, gym: 0, other: 1, trade: "Access", count: 2, gist: "Smart lock pairing complaints, after Yardi cutover" },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: 12, cursor: "pointer" }} onClick={() => onPitch?.(s)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                  <span className="pill pill-warn" style={{ fontSize: 10 }}>{s.trade} · {s.count}</span>
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{s.gist}"</div>
              </div>
            ))}
          </div>

          <SectionTitle>Activity timeline</SectionTitle>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div style={{ position: "absolute", top: 4, bottom: 4, left: 8, width: 1, background: "var(--line)" }}/>
            {[
              { t: "Today",     k: "call",  msg: "Discovery call with Marcus — pain on gate ops across 3 properties." },
              { t: "Yesterday", k: "email", msg: "Sent CIO at Meridian a property scorecard sample." },
              { t: "3 days ago",k: "demo",  msg: "Demo: Compliance Vault + Bid Leveling. Strong reaction to factoring." },
              { t: "1 week ago",k: "intel", msg: "12 new gate-related signals detected at Aria on Camelback." },
            ].map((a, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 14 }}>
                <div style={{ position: "absolute", left: -22, top: 4, width: 14, height: 14, borderRadius: 999, background: "var(--bronze)", border: "2px solid var(--bg)" }}/>
                <div className="muted" style={{ fontSize: 11, marginBottom: 2 }}>{a.t} · {a.k}</div>
                <div style={{ fontSize: 13 }}>{a.msg}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 18, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
          <button className="btn btn-primary"><Icon name="mail" size={14}/> Email contact</button>
          <button className="btn btn-secondary"><Icon name="phone" size={14}/> Log call</button>
          <button className="btn btn-secondary"><Icon name="plus" size={14}/> Create deal</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{children}</div>
      {action}
    </div>
  );
}

// ── Property Signals ──
const SIGNAL_PROPS = [
  { name: "Aria on Camelback",       pmc: "Meridian Living",    units: 312, total: 47, gate: 12, wifi: 9, ac: 8, plumbing: 6, lighting: 4, gym: 5, other: 3, trend: "+18%", hot: true },
  { name: "Northcrest Towers",        pmc: "Northcrest Capital", units: 426, total: 42, gate: 4,  wifi: 18,ac: 6, plumbing: 5, lighting: 5, gym: 2, other: 2, trend: "+24%", hot: true },
  { name: "Greystone Pavilion",      pmc: "Greystone Multifamily",units: 388,total: 31, gate: 3, wifi: 7, ac: 12,plumbing: 4, lighting: 2, gym: 1, other: 2, trend: "+9%",  hot: true },
  { name: "Solano Lofts",             pmc: "Solana Residential", units: 168, total: 11, gate: 2,  wifi: 4, ac: 1, plumbing: 1, lighting: 1, gym: 1, other: 1, trend: "−4%",  hot: false },
  { name: "The Marquee at Old Town", pmc: "Meridian Living",     units: 244, total: 9,  gate: 1,  wifi: 1, ac: 3, plumbing: 2, lighting: 1, gym: 0, other: 1, trend: "−12%", hot: false },
];

function PropertySignals({ onPitch }) {
  const [selected, setSelected] = React.useState(SIGNAL_PROPS[0]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden", maxHeight: 720 }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="h-serif" style={{ fontSize: 16 }}>Properties under watch</div>
            <div className="muted" style={{ fontSize: 11 }}>Last 90 days · Google, Yelp, Reddit, ApartmentRatings</div>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon name="refresh" size={11}/> Sync</button>
        </div>
        <div style={{ overflowY: "auto", maxHeight: 660 }}>
          {SIGNAL_PROPS.map(p => {
            const isSel = selected.name === p.name;
            return (
              <button key={p.name} onClick={() => setSelected(p)} style={{
                width: "100%", padding: 14, border: 0, borderBottom: "1px solid var(--line)",
                background: isSel ? "rgba(176,134,84,0.08)" : "transparent", cursor: "pointer",
                textAlign: "left", color: "var(--text)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: p.hot ? "var(--terracotta)" : "var(--text-3)" }}>{p.total}</div>
                </div>
                <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>{p.pmc} · {p.units} units</div>
                <SignalSpark p={p}/>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <div className="muted" style={{ fontSize: 10 }}>90-day trend</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: p.trend.startsWith("+") ? "var(--terracotta)" : "var(--olive)" }}>{p.trend}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Property signal report</div>
            <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>{selected.name}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{selected.pmc} · {selected.units} units</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onPitch(selected)}><Icon name="mail" size={12}/> Pitch this property</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Issues by trade · last 90 days</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
            {[
              ["Gate",     selected.gate,     "var(--terracotta)"],
              ["WiFi",     selected.wifi,     "var(--bronze)"],
              ["A/C",      selected.ac,       "var(--amber)"],
              ["Plumbing", selected.plumbing, "var(--slateblue)"],
              ["Lighting", selected.lighting, "var(--olive)"],
              ["Gym",      selected.gym,      "var(--bronze-deep)"],
              ["Other",    selected.other,    "var(--text-3)"],
            ].map(([n, c, color]) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ height: 80, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div style={{ width: 22, background: color, borderRadius: "4px 4px 0 0", height: `${Math.min(100, (c / 18) * 100)}%`, minHeight: 4 }}/>
                </div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>{c}</div>
                <div className="muted" style={{ fontSize: 10 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>

        <SectionTitle>Recent sample quotes</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { src: "Google Reviews", date: "May 2", trade: "Gate", text: "The main vehicle gate has been broken for over a week again. Office acts surprised every time.", rating: 2 },
            { src: "Reddit",         date: "May 1", trade: "WiFi", text: "Anyone else with the new mesh WiFi having drops in the gym/clubhouse area? Worse than before they upgraded.", rating: null },
            { src: "ApartmentRatings",date:"Apr 28",trade: "Gate", text: "Vehicle gate stuck open for 3 days. Doesn't feel safe at night.", rating: 1 },
            { src: "Yelp",           date: "Apr 24",trade: "A/C",  text: "Maintenance took 6 days to look at our A/C in 100° weather.", rating: 2 },
          ].map((q, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 8, background: "var(--surface-2)", borderLeft: `3px solid var(--bronze)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{q.src} · {q.date}</div>
                <span className="pill pill-warn" style={{ fontSize: 10 }}>{q.trade}</span>
              </div>
              <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--text-2)", lineHeight: 1.5 }}>"{q.text}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignalSpark({ p }) {
  const max = Math.max(p.gate, p.wifi, p.ac, p.plumbing, p.lighting, p.gym, p.other);
  const bars = [p.gate, p.wifi, p.ac, p.plumbing, p.lighting, p.gym, p.other];
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 18 }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, height: `${(b / max) * 100}%`, minHeight: 2, background: b > 6 ? "var(--terracotta)" : b > 3 ? "var(--amber)" : "var(--olive)", borderRadius: "2px 2px 0 0" }}/>
      ))}
    </div>
  );
}

// ── Pitch Property Modal ─────────────────────────────────────
// Branded email templates + AI-drafted follow-up sequence
const PITCH_TEMPLATES = [
  {
    id: "soft-touch",
    name: "Soft Touch · concierge intro",
    tone: "warm, no specific complaints called out",
    subject: "Quick note about {{property}}",
    body: `Hi {{firstName}},\n\nMy name is {{rep}} from Daedalus — we operate a vetted vendor network across {{metro}} (gate, low-voltage, HVAC, smart access).\n\nWe noticed {{property}} sits in a corridor where we already service three sister assets. If you ever want a second-look quote on a stuck repair or a scorecard of your last 90 days of resident comments, I can have one ready in 24 hours — no pitch deck required.\n\nWorth a 15-minute call next week?\n\n{{rep}}\nDaedalus Trades & Technology`,
  },
  {
    id: "specific-trade",
    name: "Specific Trade · gate / WiFi / HVAC pain",
    tone: "names the trade pattern but not the resident",
    subject: "{{trade}} reliability across {{property}}",
    body: `Hi {{firstName}},\n\nWe've been tracking publicly visible {{trade}} sentiment across multifamily in {{metro}} and {{property}} keeps surfacing in our weekly reports — {{count}} mentions in the last 90 days.\n\nWe're not pitching a rip-and-replace. Most of what we do is a one-truck-roll diagnostic, a tier-1 vendor scorecard, and a fixed-fee remediation plan you can hand to your incumbent.\n\nIf it'd help, I can drop a one-page property scorecard in your inbox tomorrow morning. Yes / no — that's the whole ask.\n\n— {{rep}}`,
  },
  {
    id: "exec-brief",
    name: "Executive Brief · scorecard attached",
    tone: "data-forward, for VP Ops / Asset Mgmt",
    subject: "{{property}} · 90-day vendor exposure brief",
    body: `{{firstName}} —\n\nAttached: a 90-day public-signal brief on {{property}}. Top exposures:\n\n  • {{trade}}: {{count}} resident mentions, +{{trend}}% vs prior period\n  • Avg complaint-to-resolution narrative: 5–7 days\n  • Estimated lease-renewal drag: {{drag}}\n\nDaedalus runs a managed vendor network in {{metro}}. Most of our PMC customers use us as a second-source on stubborn trades, not a full replacement.\n\nHappy to walk the brief Friday or next Mon.\n\n{{rep}}\nDaedalus Trades & Technology`,
  },
];

function PitchPropertyModal({ property, aiCfg, onClose }) {
  const [tplId, setTplId] = React.useState("specific-trade");
  const tpl = PITCH_TEMPLATES.find(t => t.id === tplId);
  const [firstName, setFirstName] = React.useState("Marcus");
  const [contactEmail, setContactEmail] = React.useState("marcus.greene@meridianliving.com");
  const [rep, setRep] = React.useState("Elena Soto");
  const [trade, setTrade] = React.useState(property.trade || "Gate");
  const [count, setCount] = React.useState(property.count || property.gate || 12);
  const [followups, setFollowups] = React.useState([
    { id: 1, day: 4,  open: true, subject: "Re: " + ("Quick note about " + property.name), preview: "Just floating this back up — no pressure. If you want, I can send the 1-page brief regardless and you decide if it's worth a call." },
    { id: 2, day: 11, open: true, subject: "One more — then I'll stop", preview: "Last note from me. Two recent reviews touched on gate access at the building. Brief is attached. Hope it's useful even if we never work together." },
    { id: 3, day: 23, open: false, subject: "Q3 vendor refresh window", preview: "Most asset teams open vendor RFPs in the first two weeks of August. If that's true on your side, I'd love 20 minutes before the calendar fills." },
  ]);
  const [aiDrafting, setAiDrafting] = React.useState(false);

  const fill = (s) => s
    .replace(/\{\{property\}\}/g, property.name)
    .replace(/\{\{firstName\}\}/g, firstName)
    .replace(/\{\{rep\}\}/g, rep)
    .replace(/\{\{metro\}\}/g, "Phoenix")
    .replace(/\{\{trade\}\}/g, trade)
    .replace(/\{\{count\}\}/g, String(count))
    .replace(/\{\{trend\}\}/g, "18")
    .replace(/\{\{drag\}\}/g, "$84k / yr est.");

  const [subject, setSubject] = React.useState(fill(tpl.subject));
  const [body, setBody] = React.useState(fill(tpl.body));
  React.useEffect(() => { setSubject(fill(tpl.subject)); setBody(fill(tpl.body)); }, [tplId, firstName, rep, trade, count]);

  const regenAI = () => {
    setAiDrafting(true);
    setTimeout(() => {
      setFollowups(fs => fs.map((f, i) => ({
        ...f,
        subject: ["Resurfacing — one paragraph", "A different angle on " + property.name, "Closing the loop"][i] || f.subject,
        preview: [
          "Reframing this around your renewal calendar instead of the trade complaints — your residents stay if their gate works the morning they sign.",
          "Skipping the deck. One number: residents who file a maintenance complaint before renewal renew at 38%, vs 71% baseline. That's the whole pitch.",
          "If now is wrong, no follow-up from me. If Q3 is when you re-bid trades, I'll re-introduce on Aug 4 with a fresh scorecard.",
        ][i] || f.preview,
      })));
      setAiDrafting(false);
      window.toast?.({ kind: "success", title: "AI redraft", msg: "3 follow-ups regenerated using Claude Sonnet" });
    }, 900);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", backdropFilter: "blur(3px)", zIndex: 200, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", inset: "3% 3% 3% 3%", background: "var(--bg)",
        border: "1px solid var(--line-strong)", borderRadius: 14, boxShadow: "var(--shadow-lg)",
        display: "flex", overflow: "hidden", minWidth: 0,
      }}>
        {/* Left: template picker + variables */}
        <div style={{ width: 280, flexShrink: 0, borderRight: "1px solid var(--line)", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 18, borderBottom: "1px solid var(--line)" }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pitch property</div>
            <div className="h-serif" style={{ fontSize: 18, marginTop: 4 }}>{property.name}</div>
            <div className="muted" style={{ fontSize: 12 }}>{property.pmc}</div>
          </div>
          <div style={{ padding: 18, flex: 1, overflowY: "auto" }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Template</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {PITCH_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTplId(t.id)} className="card" style={{
                  padding: 12, textAlign: "left", cursor: "pointer", border: tplId === t.id ? "1px solid var(--bronze)" : "1px solid var(--line)",
                  background: tplId === t.id ? "rgba(176,134,84,0.06)" : "var(--surface)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{t.tone}</div>
                </button>
              ))}
            </div>

            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Merge fields</div>
            <Field label="Recipient first name" value={firstName} onChange={setFirstName}/>
            <Field label="Recipient email" value={contactEmail} onChange={setContactEmail}/>
            <Field label="From (rep)" value={rep} onChange={setRep}/>
            <Field label="Trade focus" value={trade} onChange={setTrade}/>
            <Field label="Signal count" value={count} onChange={(v) => setCount(Number(v) || 0)}/>
          </div>
          <div style={{ padding: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { onClose(); window.toast?.({ kind: "success", title: "Sequence queued", msg: `Initial + 3 follow-ups → ${contactEmail}` }); }}>
              <Icon name="mail" size={12}/> Queue sequence
            </button>
          </div>
        </div>

        {/* Center: branded email preview */}
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--surface-2)", padding: 30 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Initial email · branded preview</div>

          <div style={{ background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)", boxShadow: "var(--shadow-md)", overflow: "hidden", maxWidth: 660, margin: "0 auto" }}>
            {/* Email header band */}
            <div style={{ background: "linear-gradient(180deg, #1a1410 0%, #2A1E12 100%)", padding: "20px 28px", color: "#F1E6D6", borderBottom: "3px solid var(--bronze)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <DaedalusMark size={28}/>
                <div className="h-serif" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.02em" }}>Daedalus<span style={{ color: "var(--bronze)" }}> Pro</span></div>
              </div>
            </div>
            <div style={{ padding: "10px 28px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 12 }}>
                <div><span className="muted">To:</span> {firstName} &lt;{contactEmail}&gt;</div>
                <div className="muted">{rep}@daedalus.pro</div>
              </div>
              <input value={subject} onChange={e => setSubject(e.target.value)} style={{
                width: "100%", border: 0, outline: 0, padding: "8px 0", fontSize: 16, fontWeight: 600, background: "transparent", color: "var(--text)",
                fontFamily: "var(--serif)",
              }}/>
            </div>
            <textarea value={body} onChange={e => setBody(e.target.value)} style={{
              width: "100%", minHeight: 320, border: 0, outline: 0, padding: "20px 28px",
              fontSize: 14, lineHeight: 1.7, fontFamily: "Georgia, serif", color: "var(--text)",
              background: "transparent", resize: "vertical", whiteSpace: "pre-wrap",
            }}/>
            {/* Footer band */}
            <div style={{ padding: "16px 28px", background: "var(--surface-2)", borderTop: "1px solid var(--line)", fontSize: 11, color: "var(--text-3)", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: "var(--text-2)" }}>{rep} · Daedalus Trades & Technology</div>
              <div>1820 W Roosevelt St · Phoenix, AZ · daedalus.pro</div>
              <div style={{ marginTop: 6, fontStyle: "italic" }}>Signal data from public review sources. We never contact your residents — only the asset team.</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="refresh" size={11}/> Reset to template</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setBody(b => b + "\n\nP.S. Happy to keep this completely off-record if a formal RFP feels premature."); }}>
              <Icon name="sparkles" size={11}/> Add AI postscript
            </button>
          </div>
        </div>

        {/* Right: AI follow-up sequence */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: "1px solid var(--line)", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="sparkles" size={14} color="var(--bronze)"/>
                <div style={{ fontSize: 14, fontWeight: 600 }}>AI follow-ups</div>
              </div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>Claude Sonnet · {aiCfg.cadence}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={regenAI} disabled={aiDrafting} style={{ flexShrink: 0 }}>
              <Icon name="refresh" size={11}/> {aiDrafting ? "…" : "Regen"}
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            <div style={{ position: "relative", paddingLeft: 22 }}>
              <div style={{ position: "absolute", top: 6, bottom: 6, left: 7, width: 1, background: "var(--line)" }}/>
              {/* Initial pin */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <div style={{ position: "absolute", left: -19, top: 4, width: 12, height: 12, borderRadius: 999, background: "var(--olive)", border: "2px solid var(--surface)" }}/>
                <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Day 0 · sent on queue</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>Initial branded email</div>
              </div>

              {followups.map((f, i) => (
                <div key={f.id} style={{ position: "relative", marginBottom: 14, opacity: aiDrafting ? 0.5 : 1, transition: "opacity 200ms" }}>
                  <div style={{ position: "absolute", left: -19, top: 4, width: 12, height: 12, borderRadius: 999, background: "var(--bronze)", border: "2px solid var(--surface)" }}/>
                  <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", justifyContent: "space-between" }}>
                    <span>Day {f.day} · auto-pause if reply</span>
                    <button onClick={() => setFollowups(fs => fs.map(x => x.id === f.id ? { ...x, open: !x.open } : x))} style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--text-3)" }}>
                      <Icon name={f.open ? "chevUp" : "chevDown"} size={12}/>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: "var(--text)" }}>{f.subject}</div>
                  {f.open && (
                    <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 6, padding: 10, background: "var(--surface-2)", borderRadius: 6, borderLeft: "2px solid var(--bronze)", lineHeight: 1.5, fontStyle: "italic" }}>
                      {f.preview}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 8, padding: 12, background: "rgba(176,134,84,0.06)", borderRadius: 8, border: "1px solid rgba(176,134,84,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--bronze)", marginBottom: 4 }}>Guardrails</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 }}>
                <li>Auto-pause on any reply, OOO, or unsubscribe</li>
                <li>Stop if PMC opens a deal in pipeline</li>
                <li>Never reference resident names from review sources</li>
                <li>{aiCfg.pretendCoincidence ? "Coincidence framing on (signals not cited explicitly)" : "Cite signal sources in body"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="muted" style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "7px 10px", border: "1px solid var(--line)", borderRadius: 6,
        background: "var(--bg)", color: "var(--text)", fontSize: 12,
      }}/>
    </div>
  );
}

// ── AI Outreach Tab — drip campaigns from resident reviews ──
const DRIP_CAMPAIGNS = [
  {
    id: "c1", name: "Phoenix Gate Belt — Q2",
    status: "Running", trigger: "Gate signals ≥ 6 in 90d",
    properties: 14, contacts: 18, sent: 51, opens: 38, replies: 9, demos: 4,
    started: "Apr 2", coincidence: true, ai: true,
    sample: "We work three properties in your corridor and noticed gate-access patterns across the metro this quarter. Worth a 15 min look?",
  },
  {
    id: "c2", name: "WiFi Mesh Cutover Pain",
    status: "Running", trigger: "WiFi signals + recent platform change",
    properties: 9, contacts: 11, sent: 33, opens: 24, replies: 6, demos: 2,
    started: "Apr 18", coincidence: true, ai: true,
    sample: "We've been seeing a pattern in mesh-WiFi rollouts where the clubhouse area underperforms post-cutover.",
  },
  {
    id: "c3", name: "A/C Renewal Window — Summer",
    status: "Scheduled", trigger: "A/C signals ≥ 4 + lease renewal in 60d",
    properties: 22, contacts: 26, sent: 0, opens: 0, replies: 0, demos: 0,
    started: "Starts Jun 1", coincidence: true, ai: true,
    sample: "Most asset teams refresh HVAC vendors before the heat hits. We can drop a 1-page property scorecard.",
  },
  {
    id: "c4", name: "Direct Mail · Tier-1 Owners",
    status: "Paused", trigger: "Manual list (no signals)",
    properties: 0, contacts: 32, sent: 64, opens: 18, replies: 2, demos: 1,
    started: "Mar 11", coincidence: false, ai: false,
    sample: "Hand-written outreach to the 32 largest PMCs in metro Phoenix. Signal-blind on purpose.",
  },
];

function AIOutreach({ aiCfg, onPitch }) {
  const [selected, setSelected] = React.useState(DRIP_CAMPAIGNS[0]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="h-serif" style={{ fontSize: 16 }}>Drip campaigns</div>
            <div className="muted" style={{ fontSize: 11 }}>AI-drafted, signal-triggered, framed as coincidence</div>
          </div>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> New campaign</button>
        </div>
        <table style={{ width: "100%", fontSize: 12 }}>
          <thead style={{ background: "var(--surface-2)" }}>
            <tr style={{ color: "var(--text-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Campaign</th>
              <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 700 }}>Status</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700 }}>Sent</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700 }}>Open</th>
              <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700 }}>Reply</th>
              <th style={{ textAlign: "right", padding: "10px 14px", fontWeight: 700 }}>Demo</th>
            </tr>
          </thead>
          <tbody>
            {DRIP_CAMPAIGNS.map(c => {
              const sel = selected?.id === c.id;
              const openPct = c.sent ? Math.round((c.opens / c.sent) * 100) : 0;
              return (
                <tr key={c.id} onClick={() => setSelected(c)} style={{ borderTop: "1px solid var(--line)", cursor: "pointer", background: sel ? "rgba(176,134,84,0.06)" : "transparent" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {c.ai && <Icon name="sparkles" size={12} color="var(--bronze)"/>}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                        <div className="muted" style={{ fontSize: 11 }}>{c.trigger}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span className={`pill ${c.status === "Running" ? "pill-success" : c.status === "Paused" ? "pill-neutral" : "pill-info"}`} style={{ fontSize: 10 }}>{c.status}</span>
                  </td>
                  <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>{c.sent}</td>
                  <td className="mono" style={{ padding: "12px 8px", textAlign: "right", color: openPct > 60 ? "var(--olive)" : "var(--text-2)" }}>{openPct}%</td>
                  <td className="mono" style={{ padding: "12px 8px", textAlign: "right", fontWeight: 600 }}>{c.replies}</td>
                  <td className="mono" style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700, color: "var(--olive)" }}>{c.demos || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail */}
      {selected && (
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Campaign</div>
              <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>{selected.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{selected.trigger} · {selected.started}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {selected.status === "Running" ? (
                <button className="btn btn-ghost btn-sm"><Icon name="pause" size={12}/> Pause</button>
              ) : selected.status === "Paused" ? (
                <button className="btn btn-primary btn-sm"><Icon name="play" size={12}/> Resume</button>
              ) : (
                <button className="btn btn-secondary btn-sm"><Icon name="settings" size={12}/> Edit</button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
            <Stat label="Properties" value={selected.properties}/>
            <Stat label="Contacts" value={selected.contacts}/>
            <Stat label="Reply rate" value={selected.sent ? Math.round(selected.replies / selected.sent * 100) + "%" : "—"}/>
            <Stat label="Demos booked" value={selected.demos || "—"}/>
          </div>

          <SectionTitle action={selected.coincidence && <span className="pill" style={{ fontSize: 10, background: "rgba(176,134,84,0.15)", color: "var(--bronze)" }}>Coincidence framing</span>}>Signal source for this drip</SectionTitle>
          <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8, marginBottom: 18, border: "1px solid var(--line)" }}>
            <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
              {selected.coincidence ? (
                <>This drip <b>does not cite resident reviews directly</b>. The pattern in public sentiment is real and triggers the campaign — but the email reads as a regional observation, not a quote of any individual review. The recipient experiences it as professional intuition, not surveillance.</>
              ) : (
                <>This is a <b>signal-blind</b> campaign. No review data informs the recipient list — outreach is driven by manual targeting only.</>
              )}
            </div>
          </div>

          <SectionTitle>Sample lead-in</SectionTitle>
          <div style={{ padding: 14, borderRadius: 8, border: "1px solid var(--line)", background: "var(--bg)", fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.6, fontStyle: "italic", color: "var(--text-2)" }}>
            "{selected.sample}"
          </div>

          <SectionTitle>Sequence</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { d: 0,  k: "Initial branded email" },
              { d: 4,  k: "Soft follow-up · regional reframe" },
              { d: 11, k: "Final touch · scorecard offer" },
              { d: 23, k: "Quarterly re-introduction" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 6, background: "var(--surface-2)" }}>
                <div className="mono" style={{ width: 36, fontSize: 11, fontWeight: 700, color: "var(--bronze)" }}>D+{step.d}</div>
                <div style={{ fontSize: 12, flex: 1 }}>{step.k}</div>
                <Icon name="mail" size={12} color="var(--text-3)"/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Outreach Monitor — track all AI activity + sources ──
function OutreachMonitor({ aiCfg }) {
  const sources = [
    { name: "Google Reviews",   coverage: 412, signals: 1840, latency: "2.1h", status: "ok",      icon: "search" },
    { name: "Yelp",              coverage: 287, signals: 612,  latency: "4.3h", status: "ok",      icon: "star" },
    { name: "Reddit",            coverage: 412, signals: 244,  latency: "1.4h", status: "ok",      icon: "message" },
    { name: "ApartmentRatings",  coverage: 309, signals: 891,  latency: "8.2h", status: "warn",    icon: "home" },
    { name: "Nextdoor",          coverage: 0,   signals: 0,    latency: "—",    status: "off",     icon: "users" },
    { name: "BBB Complaints",    coverage: 412, signals: 67,   latency: "12.0h",status: "ok",      icon: "shield" },
  ];

  const recent = [
    { time: "12 min ago",  prop: "Aria on Camelback",  src: "Google", trade: "Gate", action: "Added to 'Phoenix Gate Belt' drip · contact resolved", state: "ok" },
    { time: "47 min ago",  prop: "Northcrest Towers",  src: "Reddit", trade: "WiFi", action: "Pattern detected · pending review",                    state: "pending" },
    { time: "1h 22m ago",  prop: "Greystone Pavilion", src: "ApartmentRatings", trade: "A/C", action: "Sent follow-up D+4 to Trent McAllister",     state: "ok" },
    { time: "2h 04m ago",  prop: "Solano Lofts",       src: "Yelp",   trade: "WiFi", action: "Skipped — campaign paused (low signal threshold)",   state: "skip" },
    { time: "3h 18m ago",  prop: "The Marquee",        src: "Google", trade: "Gate", action: "Reply received · sequence auto-paused",              state: "win" },
    { time: "5h 42m ago",  prop: "Aria on Camelback",  src: "BBB",    trade: "Plumbing", action: "Signal logged · below 8-mention threshold",       state: "skip" },
    { time: "Yesterday",   prop: "Northcrest Towers",  src: "Reddit", trade: "Access", action: "Coincidence framing applied · sent to Damon",       state: "ok" },
    { time: "Yesterday",   prop: "Greystone Pavilion", src: "Google", trade: "A/C",  action: "Demo booked · removed from drip",                   state: "win" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
      {/* Banner */}
      <div className="card" style={{ padding: 18, background: "linear-gradient(180deg, rgba(176,134,84,0.08), transparent)", borderLeft: "3px solid var(--bronze)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="eye" size={16} color="var(--bronze)"/>
              <div className="h-serif" style={{ fontSize: 18 }}>Outreach Monitor</div>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Every signal we ingest, every email we send. Auditable. {aiCfg.enabled ? "AI outreach is live." : "AI outreach paused — running on manual list only."}</div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Stat label="Signals / 24h" value="284"/>
            <Stat label="Drafted / 24h" value="42"/>
            <Stat label="Sent / 24h" value="29"/>
            <Stat label="Replies / 24h" value="6"/>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="card" style={{ padding: 18 }}>
        <SectionTitle action={<button className="btn btn-ghost btn-sm"><Icon name="refresh" size={11}/> Refresh now</button>}>Signal sources</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {sources.map(s => (
            <div key={s.name} className="card" style={{ padding: 14, opacity: s.status === "off" ? 0.5 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name={s.icon} size={14}/>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                </div>
                <span className={`pill ${s.status === "ok" ? "pill-success" : s.status === "warn" ? "pill-warn" : "pill-neutral"}`} style={{ fontSize: 10 }}>
                  {s.status === "ok" ? "Live" : s.status === "warn" ? "Degraded" : "Off"}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: "uppercase" }}>Properties</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{s.coverage || "—"}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: "uppercase" }}>Signals 90d</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{s.signals || "—"}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: "uppercase" }}>Latency</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{s.latency}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live activity */}
      <div className="card" style={{ padding: 18 }}>
        <SectionTitle action={<div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--olive)", animation: "pulse 1.6s infinite" }}/><span className="muted" style={{ fontSize: 11 }}>Live</span></div>}>Recent AI actions</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {recent.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 80px 1.4fr 24px", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 6, background: i % 2 ? "var(--surface-2)" : "transparent", fontSize: 12 }}>
              <div className="muted" style={{ fontSize: 11 }}>{r.time}</div>
              <div style={{ fontWeight: 600 }}>{r.prop}</div>
              <div className="muted" style={{ fontSize: 11 }}>{r.src}</div>
              <span className="pill pill-warn" style={{ fontSize: 10 }}>{r.trade}</span>
              <div style={{ color: "var(--text-2)" }}>{r.action}</div>
              <div>
                {r.state === "win"     && <span style={{ color: "var(--olive)" }}><Icon name="check" size={12}/></span>}
                {r.state === "ok"      && <span style={{ color: "var(--bronze)" }}><Icon name="mail" size={12}/></span>}
                {r.state === "pending" && <span style={{ color: "var(--amber)" }}><Icon name="clock" size={12}/></span>}
                {r.state === "skip"    && <span style={{ color: "var(--text-3)" }}><Icon name="x" size={12}/></span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <button className="btn btn-ghost btn-sm">Load older activity</button>
        </div>
      </div>
    </div>
  );
}

// ── AI Settings tab ──
function AISettings({ cfg, setCfg }) {
  const update = (patch) => setCfg(c => ({ ...c, ...patch }));
  const updateSrc = (k, v) => setCfg(c => ({ ...c, sources: { ...c.sources, [k]: v } }));
  const toggleTrade = (t) => setCfg(c => ({ ...c, tradeFocus: c.tradeFocus.includes(t) ? c.tradeFocus.filter(x => x !== t) : [...c.tradeFocus, t] }));

  const TRADES = ["Gate", "WiFi", "A/C", "Plumbing", "Lighting", "Gym", "Smart Locks", "Pool", "Pest"];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Master toggle */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="h-serif" style={{ fontSize: 16 }}>AI outreach engine</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Master switch for signal ingestion, drip drafting, and auto-send.</div>
            </div>
            <Toggle on={cfg.enabled} onChange={v => update({ enabled: v })}/>
          </div>
        </div>

        {/* Sources */}
        <div className="card" style={{ padding: 18 }}>
          <SectionTitle>Where we listen</SectionTitle>
          <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>Public review and complaint sources. Signals are aggregated to the property level — never tied to individual reviewers.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
            {[
              ["google",          "Google Reviews",     "Highest volume · primary trade signals"],
              ["yelp",            "Yelp",                "Service-quality complaints"],
              ["reddit",          "Reddit",              "Community threads + city subs"],
              ["apartmentRatings","ApartmentRatings",   "Multifamily-specific rating site"],
              ["nextdoor",        "Nextdoor",            "Neighborhood signals (off by default)"],
              ["bbb",             "BBB Complaints",      "Formal complaints · lower volume, higher signal"],
            ].map(([k, name, desc]) => (
              <label key={k} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 8, border: `1px solid ${cfg.sources[k] ? "var(--bronze)" : "var(--line)"}`, background: cfg.sources[k] ? "rgba(176,134,84,0.05)" : "var(--bg)", cursor: "pointer" }}>
                <input type="checkbox" checked={cfg.sources[k]} onChange={e => updateSrc(k, e.target.checked)} style={{ marginTop: 2 }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Cadence + thresholds */}
        <div className="card" style={{ padding: 18 }}>
          <SectionTitle>Cadence & thresholds</SectionTitle>
          <div style={{ marginBottom: 16 }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Outreach cadence</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["gentle", "balanced", "aggressive"].map(opt => (
                <button key={opt} onClick={() => update({ cadence: opt })} style={{
                  flex: 1, padding: "10px 12px", border: `1px solid ${cfg.cadence === opt ? "var(--bronze)" : "var(--line)"}`,
                  borderRadius: 8, background: cfg.cadence === opt ? "rgba(176,134,84,0.08)" : "var(--bg)",
                  color: "var(--text)", cursor: "pointer", fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                }}>
                  <div>{opt}</div>
                  <div className="muted" style={{ fontSize: 10, fontWeight: 400, marginTop: 4, textTransform: "none" }}>
                    {opt === "gentle" ? "1 initial + 1 follow-up · 21d gap" : opt === "balanced" ? "1 initial + 3 follow-ups · 4/11/23d" : "1 initial + 5 follow-ups · 2/5/9/16/30d"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <SliderRow label="Min signals to trigger" value={cfg.minSignals} min={2} max={25} unit=" mentions / 90d" onChange={v => update({ minSignals: v })}/>
            <SliderRow label="Geographic radius" value={cfg.radiusMi} min={5} max={150} unit=" mi from HQ" onChange={v => update({ radiusMi: v })}/>
          </div>
        </div>

        {/* Framing & guardrails */}
        <div className="card" style={{ padding: 18 }}>
          <SectionTitle>Framing & guardrails</SectionTitle>
          <ToggleRow label="Pretend coincidence framing" desc="Don't cite resident review sources in the email body. Frame the outreach as a regional pattern observation." on={cfg.pretendCoincidence} onChange={v => update({ pretendCoincidence: v })}/>
          <ToggleRow label="Auto-send drip after first send" desc="Initial email is reviewed by a human; follow-ups send automatically based on cadence." on={cfg.autoSendDrip} onChange={v => update({ autoSendDrip: v })}/>
          <ToggleRow label="Suppress for closed-won accounts" desc="Never re-target a PMC that's already a customer or in active proposal." on={cfg.suppressIfWon} onChange={v => update({ suppressIfWon: v })}/>

          <div style={{ marginTop: 14 }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Sender persona</div>
            <select value={cfg.senderPersona} onChange={e => update({ senderPersona: e.target.value })} style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "var(--bg)", color: "var(--text)", fontSize: 13 }}>
              <option value="concierge">Concierge — warm, second-source framing</option>
              <option value="analyst">Analyst — data-forward, scorecard attached</option>
              <option value="founder">Founder — direct, "I'd love 15 min"</option>
            </select>
          </div>
        </div>

        {/* Trade focus */}
        <div className="card" style={{ padding: 18 }}>
          <SectionTitle>Trade focus</SectionTitle>
          <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Only trigger drips when signals are in trades we actually serve.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TRADES.map(t => {
              const on = cfg.tradeFocus.includes(t);
              return (
                <button key={t} onClick={() => toggleTrade(t)} style={{
                  padding: "6px 12px", border: `1px solid ${on ? "var(--bronze)" : "var(--line)"}`,
                  borderRadius: 999, background: on ? "var(--bronze)" : "var(--bg)",
                  color: on ? "white" : "var(--text)", cursor: "pointer", fontSize: 12, fontWeight: 600,
                }}>{t}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right rail: live preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 20, alignSelf: "start" }}>
        <div className="card" style={{ padding: 18 }}>
          <SectionTitle>Estimated reach</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Stat label="Properties / mo" value={Math.round(412 * (cfg.minSignals < 8 ? 0.42 : cfg.minSignals < 14 ? 0.22 : 0.11))}/>
            <Stat label="Drafts / mo"    value={Math.round(412 * (cfg.minSignals < 8 ? 0.42 : cfg.minSignals < 14 ? 0.22 : 0.11) * (cfg.cadence === "gentle" ? 1.4 : cfg.cadence === "balanced" ? 2.2 : 3.4))}/>
          </div>
          <div className="muted" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
            Based on current signal threshold ({cfg.minSignals}+ mentions), {Object.values(cfg.sources).filter(Boolean).length} active sources, and a {cfg.radiusMi}-mile radius.
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <SectionTitle>Compliance reminder</SectionTitle>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "var(--text-2)", lineHeight: 1.6 }}>
            <li>We never email residents — only PMC asset/ops contacts.</li>
            <li>Every campaign is logged in Outreach Monitor.</li>
            <li>CAN-SPAM unsubscribes flow to all properties for that PMC.</li>
            <li>Suppress lists are honored across reps and campaigns.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 24, borderRadius: 999, border: 0, cursor: "pointer",
      background: on ? "var(--bronze)" : "var(--surface-3)", position: "relative", transition: "background 200ms",
    }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: 999, background: "white",
        transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
      }}/>
    </button>
  );
}

function ToggleRow({ label, desc, on, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid var(--line)", gap: 14 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{desc}</div>
      </div>
      <Toggle on={on} onChange={onChange}/>
    </div>
  );
}

function SliderRow({ label, value, min, max, unit, onChange }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
        <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--bronze)" }}>{value}{unit}</div>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--bronze)" }}/>
    </div>
  );
}

window.SalesHub = SalesHub;
