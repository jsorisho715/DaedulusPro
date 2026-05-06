// Technician Marketplace — "FUTURE" surface
// A consumerized, almost game-like UI for field techs to grab on-demand jobs.
// Surfaces: live heatmap of available jobs, quests/streaks, ranks, earnings,
// and crew formation. Tone is more like a high-end ops video game than a
// traditional FSM app — but rooted in real, enterprise-credible mechanics.

function TechMarket({ onNav }) {
  const [view, setView] = React.useState("map");          // map | routing | quests | rank | crew
  const [picked, setPicked] = React.useState(null);
  const [channel, setChannel] = React.useState("all");    // all | consumer | multifamily

  return (
    <div style={{ position: "relative", minHeight: "100%", background: "var(--bg)" }}>
      {/* FUTURE banner */}
      <FutureBanner/>

      <div className="page" style={{ padding: "8px 28px 28px", maxWidth: 1480, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
          <div>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Daedalus Pro · Marketplace</div>
            <h1 className="h-serif" style={{ fontSize: 32, margin: "4px 0", fontWeight: 600 }}>The Forge</h1>
            <div className="muted" style={{ fontSize: 13 }}>Live, on-demand jobs across the Phoenix metro. Open to credentialed techs only.</div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <RankPill rank="Master" level={4} xp={3220} next={4000}/>
            <EarningsBadge/>
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--surface-2)", borderRadius: 10, width: "fit-content", marginBottom: 18 }}>
          {[
            { k: "map",     l: "Live map",      i: "location" },
            { k: "routing", l: "Routing model", i: "compliance" },
            { k: "quests",  l: "Quests",        i: "sparkles" },
            { k: "rank",    l: "Ranks",         i: "shield" },
            { k: "crew",    l: "My crew",       i: "users" },
          ].map(t => (
            <button key={t.k} onClick={() => setView(t.k)} style={{
              padding: "8px 16px", border: 0, borderRadius: 7, cursor: "pointer",
              background: view === t.k ? "var(--surface)" : "transparent",
              boxShadow: view === t.k ? "var(--shadow-sm)" : "none",
              color: view === t.k ? "var(--text)" : "var(--text-3)",
              fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
            }}><Icon name={t.i} size={13}/> {t.l}</button>
          ))}
        </div>

        {view === "map"     && <LiveMap onPick={setPicked} channel={channel} setChannel={setChannel}/>}
        {view === "routing" && <RoutingModel/>}
        {view === "quests"  && <Quests/>}
        {view === "rank"    && <Ranks/>}
        {view === "crew"    && <Crew/>}
      </div>

      {picked && <JobPickerSheet job={picked} onClose={() => setPicked(null)}/>}
    </div>
  );
}

function FutureBanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, rgba(176,134,84,0.12), rgba(212,168,87,0.04))",
      borderBottom: "1px solid rgba(176,134,84,0.25)",
      padding: "8px 28px", display: "flex", alignItems: "center", gap: 10, fontSize: 12,
    }}>
      <span className="pill" style={{ background: "var(--bronze)", color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>FUTURE · ROADMAP</span>
      <div style={{ color: "var(--text-2)" }}>The Forge launches Q1 2027 — a live, on-demand marketplace where credentialed Daedalus techs claim PMC-routed work. This is a directional preview, not a shipping product.</div>
    </div>
  );
}

function RankPill({ rank, level, xp, next }) {
  const pct = (xp / next) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999 }}>
      <div style={{ position: "relative", width: 32, height: 32 }}>
        <svg viewBox="0 0 32 32" style={{ position: "absolute", inset: 0 }}>
          <circle cx="16" cy="16" r="13" fill="none" stroke="var(--surface-3)" strokeWidth="3"/>
          <circle cx="16" cy="16" r="13" fill="none" stroke="var(--bronze)" strokeWidth="3"
            strokeDasharray={`${(pct/100) * 81.68} 81.68`} strokeLinecap="round" transform="rotate(-90 16 16)"/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--bronze)" }}>{level}</div>
      </div>
      <div style={{ lineHeight: 1.2 }}>
        <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{rank}</div>
        <div className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{xp.toLocaleString()} / {next.toLocaleString()} XP</div>
      </div>
    </div>
  );
}

function EarningsBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "linear-gradient(135deg, var(--olive), #5F7039)", color: "white", borderRadius: 999 }}>
      <Icon name="money" size={14}/>
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.06em" }}>This week</div>
        <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>$2,148.40</div>
      </div>
    </div>
  );
}

// ── Live Map ──
// channel: "consumer" routes resident→tech directly (Uber model);
// "multifamily" routes PMC→GC→tech (enterprise model).
const HEAT_JOBS = [
  { id: "j1", x: 28, y: 32, trade: "Gate",       payout: 380, urgency: "now",   prop: "Aria on Camelback",   eta: "12 min", surge: 1.4, bond: 25, channel: "multifamily", origin: "Meridian Living · Yardi" },
  { id: "j2", x: 42, y: 48, trade: "WiFi",       payout: 220, urgency: "today", prop: "Solano Lofts",         eta: "32 min", surge: 1.0, bond: 12, channel: "multifamily", origin: "Solana Residential · AppFolio" },
  { id: "j3", x: 56, y: 38, trade: "Lock",       payout: 145, urgency: "now",   prop: "1428 N Mariposa Pl",   eta: "18 min", surge: 1.2, bond: 8,  channel: "consumer",    origin: "Homeowner · J. Reyes" },
  { id: "j4", x: 64, y: 60, trade: "A/C",        payout: 540, urgency: "today", prop: "Northcrest Towers",    eta: "44 min", surge: 1.6, bond: 30, channel: "multifamily", origin: "Northcrest Capital · RealPage" },
  { id: "j5", x: 36, y: 70, trade: "Plumbing",   payout: 320, urgency: "now",   prop: "812 W Encanto Blvd",   eta: "27 min", surge: 1.3, bond: 18, channel: "consumer",    origin: "Homeowner · M. Bahar" },
  { id: "j6", x: 72, y: 28, trade: "Lighting",   payout: 110, urgency: "today", prop: "Vista Ridge",          eta: "38 min", surge: 1.0, bond: 6,  channel: "multifamily", origin: "Vista Pacific · Yardi" },
  { id: "j7", x: 50, y: 22, trade: "Camera",     payout: 280, urgency: "now",   prop: "Aria on Camelback",    eta: "12 min", surge: 1.4, bond: 14, channel: "multifamily", origin: "Meridian Living · Yardi" },
  { id: "j8", x: 22, y: 54, trade: "Lock",       payout: 165, urgency: "now",   prop: "2204 E Glenrosa Ave",  eta: "20 min", surge: 1.0, bond: 8,  channel: "consumer",    origin: "Homeowner · K. Patel" },
];

const TRADE_COLOR = {
  Gate:      "var(--terracotta)",
  WiFi:      "var(--bronze)",
  Lock:      "var(--bronze-deep)",
  "A/C":     "var(--amber)",
  Plumbing:  "var(--slateblue)",
  Lighting:  "var(--olive)",
  Camera:    "#7B5BA8",
};

function LiveMap({ onPick, channel, setChannel }) {
  const [filter, setFilter] = React.useState("all");
  const visible = HEAT_JOBS.filter(j =>
    (filter === "all" || j.urgency === filter) &&
    (channel === "all" || j.channel === channel)
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>
      {/* map */}
      <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative", aspectRatio: "16/10" }}>
        {/* terrain */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #1A1A1F 0%, #0E0E12 100%)",
        }}/>
        <svg width="100%" height="100%" viewBox="0 0 100 60" style={{ position: "absolute", inset: 0 }} preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M0 0L6 0M0 0L0 6" stroke="rgba(176,134,84,0.06)" strokeWidth="0.2"/>
            </pattern>
            <radialGradient id="heat-hot" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(212,80,60,0.6)"/>
              <stop offset="100%" stopColor="rgba(212,80,60,0)"/>
            </radialGradient>
            <radialGradient id="heat-warm" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(212,168,87,0.5)"/>
              <stop offset="100%" stopColor="rgba(212,168,87,0)"/>
            </radialGradient>
          </defs>
          <rect width="100" height="60" fill="url(#grid)"/>
          {/* Roads */}
          <path d="M0 30L100 32" stroke="rgba(176,134,84,0.18)" strokeWidth="0.6" fill="none"/>
          <path d="M0 14L100 18" stroke="rgba(176,134,84,0.14)" strokeWidth="0.4" fill="none"/>
          <path d="M0 46L100 44" stroke="rgba(176,134,84,0.14)" strokeWidth="0.4" fill="none"/>
          <path d="M30 0L34 60" stroke="rgba(176,134,84,0.14)" strokeWidth="0.4" fill="none"/>
          <path d="M64 0L60 60" stroke="rgba(176,134,84,0.14)" strokeWidth="0.4" fill="none"/>
          {/* Heat blobs */}
          <ellipse cx="32" cy="24" rx="20" ry="14" fill="url(#heat-hot)"/>
          <ellipse cx="68" cy="38" rx="18" ry="12" fill="url(#heat-warm)"/>
          <ellipse cx="42" cy="48" rx="14" ry="10" fill="url(#heat-warm)"/>
        </svg>
        {/* You */}
        <div style={{ position: "absolute", left: "44%", top: "42%", transform: "translate(-50%, -50%)" }}>
          <div style={{
            width: 18, height: 18, borderRadius: 999, background: "var(--bronze)", border: "3px solid white",
            boxShadow: "0 0 0 8px rgba(176,134,84,0.25), 0 0 0 18px rgba(176,134,84,0.10)",
            animation: "pulse 2.4s ease-out infinite",
          }}/>
          <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 8px rgba(176,134,84,0.4), 0 0 0 14px rgba(176,134,84,0.15); } 100% { box-shadow: 0 0 0 30px rgba(176,134,84,0), 0 0 0 50px rgba(176,134,84,0); } }`}</style>
          <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 700, color: "white", background: "var(--bronze)", padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>YOU · MP</div>
        </div>
        {/* Job pins */}
        {visible.map(j => {
          const channelColor = j.channel === "consumer" ? "var(--olive)" : "var(--slateblue)";
          return (
          <button key={j.id} onClick={() => onPick(j)} style={{
            position: "absolute", left: `${j.x}%`, top: `${j.y}%`, transform: "translate(-50%, -100%)",
            border: 0, background: "transparent", cursor: "pointer", padding: 0,
          }}>
            <div style={{
              padding: "4px 8px 4px 4px", background: "var(--surface)",
              border: `2px solid ${TRADE_COLOR[j.trade]}`, borderRadius: 999,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: `0 0 0 2px ${channelColor}, 0 4px 12px rgba(0,0,0,0.4)`,
              fontSize: 11, fontWeight: 600,
            }}>
              <div style={{ width: 16, height: 16, borderRadius: 999, background: TRADE_COLOR[j.trade], color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700 }}>{j.trade[0]}</div>
              <span className="mono">${j.payout}</span>
              {j.surge > 1.1 && <span style={{ fontSize: 9, color: "var(--terracotta)", fontWeight: 700 }}>×{j.surge}</span>}
            </div>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${TRADE_COLOR[j.trade]}`, margin: "0 auto" }}/>
          </button>
        );})}

        {/* Filter chips */}
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { k: "all",          l: "All channels",  c: HEAT_JOBS.length },
              { k: "consumer",     l: "Consumer",      c: HEAT_JOBS.filter(j => j.channel === "consumer").length },
              { k: "multifamily",  l: "Multifamily",   c: HEAT_JOBS.filter(j => j.channel === "multifamily").length },
            ].map(f => (
              <button key={f.k} onClick={() => setChannel(f.k)} style={{
                padding: "6px 12px", border: 0, borderRadius: 999, cursor: "pointer",
                background: channel === f.k
                  ? (f.k === "consumer" ? "var(--olive)" : f.k === "multifamily" ? "var(--slateblue)" : "var(--bronze)")
                  : "rgba(15,17,21,0.7)",
                color: "white", fontSize: 11, fontWeight: 600,
                backdropFilter: "blur(6px)",
              }}>{f.l} · {f.c}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { k: "all",   l: "All",   c: HEAT_JOBS.filter(j => channel === "all" || j.channel === channel).length },
              { k: "now",   l: "Now",   c: HEAT_JOBS.filter(j => j.urgency === "now"   && (channel === "all" || j.channel === channel)).length },
              { k: "today", l: "Today", c: HEAT_JOBS.filter(j => j.urgency === "today" && (channel === "all" || j.channel === channel)).length },
            ].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{
                padding: "5px 10px", border: 0, borderRadius: 999, cursor: "pointer",
                background: filter === f.k ? "var(--bronze)" : "rgba(15,17,21,0.55)",
                color: "white", fontSize: 10, fontWeight: 600,
                backdropFilter: "blur(6px)",
              }}>{f.l} · {f.c}</button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ position: "absolute", bottom: 14, right: 14, padding: 10, background: "rgba(15,17,21,0.85)", borderRadius: 8, backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Channel ring</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(255,255,255,0.85)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--olive)" }}/> Consumer (direct)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(255,255,255,0.85)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--slateblue)" }}/> Multifamily (PMC→GC)
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "4px 0" }}/>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Trade</div>
          {Object.entries(TRADE_COLOR).map(([k, c]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(255,255,255,0.85)" }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: c }}/> {k}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar — queue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 16, background: "linear-gradient(135deg, rgba(212,80,60,0.10), rgba(176,134,84,0.04))", borderLeft: "3px solid var(--terracotta)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Icon name="alert" size={14} color="var(--terracotta)"/>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--terracotta)" }}>Surge active</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>1.4× pay on Aria on Camelback</div>
          <div className="muted" style={{ fontSize: 12 }}>4 gate-related WOs piling up after PMC's Yardi cutover. Ends in 2h 14m.</div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Hot queue · {visible.length}</div>
            <div className="muted mono" style={{ fontSize: 11 }}>Sorted by $/min</div>
          </div>
          <div>
            {visible.map(j => {
              const channelColor = j.channel === "consumer" ? "var(--olive)" : "var(--slateblue)";
              return (
              <button key={j.id} onClick={() => onPick(j)} style={{
                width: "100%", padding: 12, textAlign: "left", border: 0, borderBottom: "1px solid var(--line)",
                background: "transparent", cursor: "pointer", color: "var(--text)",
                display: "flex", alignItems: "center", gap: 10,
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: TRADE_COLOR[j.trade], color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, boxShadow: `0 0 0 2px ${channelColor}` }}>{j.trade[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.prop}</div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    <span style={{ color: channelColor, fontWeight: 600 }}>{j.channel === "consumer" ? "Direct" : "PMC"}</span> · {j.trade} · {j.eta}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 700 }}>${j.payout}</div>
              </button>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobPickerSheet({ job, onClose }) {
  const channelColor = job.channel === "consumer" ? "var(--olive)" : "var(--slateblue)";
  const chain = job.channel === "consumer"
    ? [{ icon: "user",  label: "Resident",  detail: job.origin }, { icon: "wing", label: "Daedalus Forge", detail: "Direct dispatch" }, { icon: "users", label: "You",      detail: "Mason Pereira" }]
    : [{ icon: "shield",label: "PMC",        detail: job.origin.split(" · ")[0] }, { icon: "compliance", label: "PMS push", detail: job.origin.split(" · ")[1] || "Yardi" }, { icon: "wing", label: "Daedalus GC", detail: "Daedalus Trades" }, { icon: "users", label: "You", detail: "Mason Pereira" }];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 520, padding: 0, overflow: "hidden", animation: "fadeUp 240ms var(--ease)" }}>
        <div style={{ background: TRADE_COLOR[job.trade], color: "white", padding: 18, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: channelColor, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
              {job.channel === "consumer" ? "CONSUMER · DIRECT" : "MULTIFAMILY · PMC→GC"}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.9 }}>{job.trade} · {job.urgency}</span>
          </div>
          <div className="h-serif" style={{ fontSize: 22, marginTop: 8 }}>{job.prop}</div>
          <div style={{ position: "absolute", top: 18, right: 18, padding: "8px 12px", background: "rgba(0,0,0,0.25)", borderRadius: 999, fontSize: 18, fontWeight: 700, fontFamily: "var(--mono)" }}>${job.payout}</div>
        </div>
        <div style={{ padding: 20 }}>
          {/* Routing chain */}
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Routing path</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
            {chain.map((c, i) => (
              <React.Fragment key={i}>
                <div style={{ flex: 1, padding: "8px 10px", background: i === chain.length - 1 ? "rgba(176,134,84,0.10)" : "var(--surface-2)", border: i === chain.length - 1 ? "1px solid var(--bronze)" : "1px solid var(--line)", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: i === chain.length - 1 ? "var(--bronze)" : channelColor, color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                    <Icon name={c.icon} size={11}/>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{c.label}</div>
                  <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{c.detail}</div>
                </div>
                {i < chain.length - 1 && <Icon name="chevRight" size={10} color="var(--text-3)"/>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
            <Stat label="ETA" value={job.eta}/>
            <Stat label="Surge" value={`×${job.surge.toFixed(1)}`}/>
            <Stat label="XP bond" value={`+${job.bond}`}/>
          </div>
          <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 18 }}>
            {job.channel === "consumer"
              ? "Direct consumer job — Daedalus is the GC of record but you transact 1:1 with the homeowner. Payment captured pre-job; no factoring needed."
              : "Multifamily job — routed through the PMC and Daedalus GC. Daedalus pays out 24h after PMC sign-off via Stripe Connect or factoring."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Skip</button>
            <button onClick={onClose} className="btn btn-primary" style={{ flex: 2 }}><Icon name="check" size={14}/> Claim job</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 10 }}>
      <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ── Quests ──
function Quests() {
  const quests = [
    { id: "q1", name: "Gatekeeper",      desc: "Close 5 gate WOs in 7 days",         prog: 3, total: 5, reward: "$80 + 200 XP", type: "weekly" },
    { id: "q2", name: "First Responder", desc: "Accept 10 same-day jobs",            prog: 7, total: 10,reward: "150 XP",       type: "weekly" },
    { id: "q3", name: "Five-Star Spree", desc: "10 consecutive 5★ ratings",          prog: 10,total: 10,reward: "Preferred tier", type: "achievement", done: true },
    { id: "q4", name: "Hubcrafter",      desc: "Cover 3 distinct hubs in one week",  prog: 2, total: 3, reward: "$50 + 100 XP", type: "weekly" },
    { id: "q5", name: "Iron Streak",     desc: "30-day on-time streak",              prog: 22,total: 30,reward: "Master rank",   type: "achievement" },
    { id: "q6", name: "Mentor",          desc: "Complete 3 jobs paired with apprentice", prog: 1, total: 3, reward: "+0.5% lifetime cut", type: "monthly" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
      {quests.map(q => {
        const pct = (q.prog / q.total) * 100;
        return (
          <div key={q.id} className="card" style={{ padding: 18, borderLeft: `3px solid ${q.done ? "var(--olive)" : "var(--bronze)"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span className={`pill ${q.done ? "pill-success" : q.type === "weekly" ? "pill-warn" : q.type === "monthly" ? "pill-info" : "pill-neutral"}`} style={{ fontSize: 10 }}>
                {q.done ? "COMPLETE" : q.type.toUpperCase()}
              </span>
              <div className="muted mono" style={{ fontSize: 11 }}>{q.prog}/{q.total}</div>
            </div>
            <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{q.name}</div>
            <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>{q.desc}</div>
            <div style={{ height: 6, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: q.done ? "var(--olive)" : "var(--bronze)", borderRadius: 999 }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 600 }}>↗ {q.reward}</div>
              {q.done ? <span className="pill pill-success" style={{ fontSize: 10 }}><Icon name="check" size={10}/> Claimed</span>
                      : <span className="muted" style={{ fontSize: 11 }}>{q.total - q.prog} to go</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Ranks ──
function Ranks() {
  const RANKS = [
    { tier: "Apprentice", color: "var(--text-3)",   floor: 0,    cut: "65%", perks: ["Daily payouts (Net 1)","Standard insurance"] },
    { tier: "Journeyman", color: "var(--slateblue)",floor: 500,  cut: "70%", perks: ["Priority dispatch within 5mi","Surge access"] },
    { tier: "Master",     color: "var(--bronze)",   floor: 2000, cut: "75%", perks: ["Quest XP ×1.25","Lead crew of 3","Discounted parts"], current: true },
    { tier: "Architect",  color: "var(--bronze-deep)", floor: 5000, cut: "80%", perks: ["Custom branding","Direct PMC referrals","Equity vesting"] },
    { tier: "Daedalus",   color: "linear-gradient(135deg, #B08654, #D4A857)", floor: 12000, cut: "85%", perks: ["Quarterly profit share","Network co-design seat"], legendary: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {RANKS.map((r, i) => (
        <div key={r.tier} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", borderLeft: `4px solid ${r.legendary ? "var(--bronze)" : r.color}`, opacity: r.legendary ? 1 : 1, position: "relative" }}>
          {r.current && <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", background: "var(--bronze)", color: "white", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>YOU</div>}
          <div style={{ padding: 22, width: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: r.legendary ? "linear-gradient(135deg, #1A1208, #2A1810)" : "var(--surface-2)", color: r.legendary ? "white" : "var(--text)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: r.legendary ? "linear-gradient(135deg, #B08654, #D4A857)" : r.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Icon name={i < 2 ? "shield" : i < 3 ? "compliance" : i < 4 ? "sparkles" : "wing"} size={26} color="white"/>
            </div>
            <div className="h-serif" style={{ fontSize: 18, fontWeight: 600 }}>{r.tier}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{r.floor.toLocaleString()}+ XP</div>
          </div>
          <div style={{ padding: 22, flex: 1 }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Tech keeps</div>
            <div className="h-serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>{r.cut} of payout</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {r.perks.map(p => <span key={p} className="pill pill-neutral" style={{ fontSize: 11 }}><Icon name="check" size={11} color="var(--olive)"/> {p}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Crew ──
function Crew() {
  const crew = [
    { name: "Mason Pereira", role: "Lead · You",        rank: "Master",    xp: 3220, status: "On a job"  },
    { name: "Devin Hollister",role: "Apprentice",       rank: "Apprentice",xp: 340,  status: "Available" },
    { name: "Rosa Cárdenas",  role: "Specialist · A/C", rank: "Journeyman",xp: 1120, status: "On a job"  },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <div className="card" style={{ padding: 22 }}>
        <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Your crew</div>
        <div className="muted" style={{ fontSize: 12, marginBottom: 16 }}>Masters can lead up to 3. Earn 8% of crew XP.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {crew.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, background: "var(--surface-2)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: "var(--bronze)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{c.name.split(" ").map(p => p[0]).join("")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <div className="muted" style={{ fontSize: 11 }}>{c.role} · {c.rank} · {c.xp.toLocaleString()} XP</div>
              </div>
              <span className={`pill ${c.status === "Available" ? "pill-success" : "pill-warn"}`} style={{ fontSize: 10 }}><span className="dot"/>{c.status}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}><Icon name="plus" size={11}/> Invite tech</button>
      </div>

      <div className="card" style={{ padding: 22, background: "linear-gradient(135deg, #1A1208 0%, #2A1810 100%)", color: "white" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bronze)", marginBottom: 6 }}>Weekly leaderboard · Phoenix</div>
        <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Top crews</div>
        {[
          { rank: 1, name: "The Forge — Pereira",        you: true,  xp: 8420, color: "var(--bronze)" },
          { rank: 2, name: "Copperwire Collective",      you: false, xp: 7980, color: "rgba(255,255,255,0.4)" },
          { rank: 3, name: "Roosevelt Trades",           you: false, xp: 7110, color: "rgba(255,255,255,0.3)" },
          { rank: 4, name: "Sonoran Field Co.",           you: false, xp: 6240, color: "rgba(255,255,255,0.2)" },
          { rank: 5, name: "Alameda IronWorks",           you: false, xp: 5580, color: "rgba(255,255,255,0.2)" },
        ].map(c => (
          <div key={c.rank} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 24, fontSize: 18, fontFamily: "var(--serif)", fontWeight: 600, color: c.color, textAlign: "center" }}>{c.rank}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: c.you ? 700 : 500, color: c.you ? "var(--bronze)" : "white" }}>{c.name} {c.you && <span style={{ fontSize: 10, padding: "2px 6px", background: "var(--bronze)", color: "#1A1208", borderRadius: 4, marginLeft: 6 }}>YOU</span>}</div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{c.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.TechMarket = TechMarket;

// ── Routing Model — explains the two-channel routing ──
function RoutingModel() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Consumer lane */}
      <div className="card" style={{ padding: 22, borderTop: "3px solid var(--olive)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--olive)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="user" size={15}/></div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--olive)" }}>Channel A · Consumer</div>
            <div className="h-serif" style={{ fontSize: 20, fontWeight: 600 }}>Direct dispatch (Uber-style)</div>
          </div>
        </div>
        <div className="muted" style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>Homeowner books a job in the Daedalus consumer app. The platform matches them with the nearest credentialed tech in The Forge — no GC middleman, payment captured up-front.</div>
        <RouteChain steps={[
          { i: "user", l: "Homeowner",     d: "Books in app" },
          { i: "wing", l: "Daedalus",      d: "Match & price" },
          { i: "users",l: "Tech",          d: "Dispatched" },
        ]} color="var(--olive)"/>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["Avg cycle","27 min"],["Tech cut","75–85%"],["Pay","Net 1d"],["Dispute","Daedalus mediates"]].map(([k,v]) => (
            <div key={k} style={{ padding: 10, background: "var(--surface-2)", borderRadius: 8 }}>
              <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Multifamily lane */}
      <div className="card" style={{ padding: 22, borderTop: "3px solid var(--slateblue)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--slateblue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="shield" size={15}/></div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--slateblue)" }}>Channel B · Multifamily</div>
            <div className="h-serif" style={{ fontSize: 20, fontWeight: 600 }}>Enterprise GC routing</div>
          </div>
        </div>
        <div className="muted" style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>PMC pushes a WO from Yardi / AppFolio / RealPage. Daedalus, as GC of record, accepts the job, runs compliance checks, and dispatches a tech under its own license + insurance umbrella.</div>
        <RouteChain steps={[
          { i: "shield",     l: "PMC",        d: "Yardi / AppFolio" },
          { i: "compliance", l: "Daedalus GC",d: "Compliance + bid" },
          { i: "wing",       l: "Forge",      d: "Auto-route" },
          { i: "users",      l: "Tech",       d: "On-site" },
        ]} color="var(--slateblue)"/>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["Avg cycle","2.4 days"],["Tech cut","65–80%"],["Pay","Net 30 / 24h via factoring"],["Dispute","PMC + Daedalus"]].map(([k,v]) => (
            <div key={k} style={{ padding: 10, background: "var(--surface-2)", borderRadius: 8 }}>
              <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why two lanes */}
      <div className="card" style={{ padding: 22, gridColumn: "1 / -1", background: "linear-gradient(135deg, rgba(176,134,84,0.06), transparent)" }}>
        <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Why two lanes?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, fontSize: 13, lineHeight: 1.55 }}>
          <div><strong style={{ color: "var(--olive)" }}>Consumer</strong> wins on speed and trust. Homeowners want a single tap → on-site in &lt;30 min. They don't care about the GC.</div>
          <div><strong style={{ color: "var(--slateblue)" }}>Multifamily</strong> wins on compliance and accounting. PMCs need a GC of record on every WO — COIs, lien waivers, retainage — that no individual tech can carry alone.</div>
          <div><strong style={{ color: "var(--bronze)" }}>Same tech pool</strong> serves both. A Master tech in Phoenix can run a homeowner gate-fix in the morning and a Meridian property gate-fix in the afternoon — both flow through Daedalus, both count toward rank.</div>
        </div>
      </div>
    </div>
  );
}

function RouteChain({ steps, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ flex: 1, padding: "10px 8px", background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 8, textAlign: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: color, color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}><Icon name={s.i} size={13}/></div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{s.l}</div>
            <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{s.d}</div>
          </div>
          {i < steps.length - 1 && <Icon name="chevRight" size={11} color={color}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

window.RoutingModel = RoutingModel;
