// Vendor Tier Scorecard

function Scorecard({ tier }) {
  const M = window.MOCK;
  const v = M.VENDOR;
  const breakdown = v.scoreBreakdown;
  const overall = Math.round((breakdown.compliance + breakdown.jobPerformance + breakdown.financial + breakdown.longevity) / 4);

  const tierThresholds = [
  { name: "Applicant", min: 0, color: "var(--text-3)", desc: "Pending verification" },
  { name: "Verified", min: 60, color: "var(--slateblue)", desc: "Standard access · pay net-30" },
  { name: "Preferred", min: 80, color: "var(--bronze)", desc: "Priority routing · pay net-15 · factoring eligible" },
  { name: "Elite", min: 92, color: "var(--bronze-deep)", desc: "First-look bids · pay net-7 · 1% factoring · co-marketing" }];

  const currentTier = tierThresholds.findIndex((t) => t.name === tier);
  const nextTier = tierThresholds[currentTier + 1];

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Tier & Scorecard</h1>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Updated nightly. Calculation is open — every input is visible below, and you can dispute any line.</div>
      </div>

      {/* Mythic hero */}
      <div className="card" style={{ padding: 0, marginBottom: 22, overflow: "hidden", background: "linear-gradient(135deg, var(--obsidian) 0%, #1a1410 100%)", color: "white", border: 0, position: "relative" }}>
        <BronzeWingBg />
        <div style={{ padding: 36, position: "relative", display: "flex", alignItems: "center", gap: 30 }}>
          <TierBadgeLarge tier={tier} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(212,168,87,0.8)" }}>Current tier</div>
            <div className="h-serif" style={{ fontSize: 48, fontWeight: 600, marginTop: 4, letterSpacing: "-0.01em", color: "rgb(31, 35, 41)" }}>{tier}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8, maxWidth: 480, color: "rgb(31, 35, 41)" }}>{tierThresholds.find((t) => t.name === tier)?.desc}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(212,168,87,0.8)" }}>Overall score</div>
            <div className="h-serif" style={{ fontSize: 80, fontWeight: 600, fontFamily: "var(--serif)", lineHeight: 1, marginTop: 6, color: "var(--bronze-bright)" }}>{overall}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>of 100</div>
          </div>
        </div>

        {nextTier &&
        <div style={{ padding: "14px 36px", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(212,168,87,0.2)", display: "flex", alignItems: "center", gap: 14 }}>
            <Icon name="arrow" size={16} color="var(--bronze-bright)" />
            <div style={{ fontSize: 12, flex: 1 }}>
              <strong style={{ color: "var(--bronze-bright)" }}>{nextTier.min - overall} points to {nextTier.name}.</strong> Largest gap: longevity (+11 needed) — earned through 12 months on platform with no SLA breaches.
            </div>
            <div style={{ flex: 2, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${overall / nextTier.min * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--bronze), var(--bronze-bright))" }} />
            </div>
          </div>
        }
      </div>

      {/* Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <Pillar label="Compliance" score={breakdown.compliance} weight="30%" desc="Docs current · 100% on time" />
        <Pillar label="Job Performance" score={breakdown.jobPerformance} weight="35%" desc="98% on-time · 0 callbacks 90d" />
        <Pillar label="Financial Health" score={breakdown.financial} weight="20%" desc="Plaid: low risk · 0 disputes" />
        <Pillar label="Longevity" score={breakdown.longevity} weight="15%" desc="13 months · 84 jobs" />
      </div>

      {/* Detail */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Score history (90 days)</h3>
          <Sparkline values={[78, 79, 81, 80, 82, 83, 81, 84, 85, 86, 86, 87, 87, 86, 87]} />
          <div className="muted" style={{ fontSize: 11, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span>Feb 5</span><span>Mar 5</span><span>Apr 5</span><span>May 5</span>
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Tier ladder</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tierThresholds.map((t, i) =>
            <div key={t.name} style={{
              display: "flex", alignItems: "center", gap: 12, padding: 12,
              background: i === currentTier ? "rgba(176,134,84,0.10)" : "transparent",
              borderRadius: 8, border: i === currentTier ? "1px solid var(--bronze)" : "1px solid transparent"
            }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: t.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="shield" size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name} {i === currentTier && <span className="pill pill-bronze" style={{ marginLeft: 6, fontSize: 10 }}>You</span>}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{t.desc}</div>
                </div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: i <= currentTier ? "var(--bronze)" : "var(--text-3)" }}>{t.min}+</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wins + recovery */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Recent wins</h3>
          {[
          { t: "12 jobs completed on-time in April", icon: "check", c: "var(--olive)" },
          { t: "5★ review from Marcus Greene (Meridian)", icon: "sparkles", c: "var(--bronze)" },
          { t: "Pool gate emergency response under 90 min", icon: "shield", c: "var(--olive)" },
          { t: "All COIs renewed before expiration", icon: "compliance", c: "var(--olive)" }].
          map((w, i) =>
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--line)" : 0, alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: `${w.c}1A`, color: w.c, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={w.icon} size={12} /></div>
              <div style={{ fontSize: 13 }}>{w.t}</div>
            </div>
          )}
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Improve to Elite</h3>
          {[
          { t: "Maintain 0 callbacks for 90 more days", impact: "+5", time: "90d" },
          { t: "AZ ROC KB-2 license renewal (expires May 21)", impact: "+2", time: "2wk" },
          { t: "Complete 8 more jobs to hit 12-month tenure mark", impact: "+11", time: "Auto" },
          { t: "Add a second background-cleared field lead", impact: "+3", time: "Now" }].
          map((w, i) =>
          <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--line)" : 0, alignItems: "center" }}>
              <div className="pill pill-bronze" style={{ fontSize: 10, height: 22 }}>{w.impact}</div>
              <div style={{ fontSize: 13, flex: 1 }}>{w.t}</div>
              <div className="muted" style={{ fontSize: 11 }}>{w.time}</div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

function Pillar({ label, score, weight, desc }) {
  const c = score >= 90 ? "var(--olive)" : score >= 75 ? "var(--bronze)" : score >= 60 ? "var(--amber)" : "var(--terracotta)";
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label} <span style={{ float: "right" }}>weight {weight}</span></div>
      <div className="mono" style={{ fontSize: 36, fontWeight: 600, marginTop: 6, fontFamily: "var(--serif)", color: c }}>{score}</div>
      <div style={{ width: "100%", height: 5, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden", marginTop: 6 }}>
        <div style={{ width: `${score}%`, height: "100%", background: c }} />
      </div>
      <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>{desc}</div>
    </div>);

}

function Sparkline({ values }) {
  const w = 600,h = 120,pad = 10;
  const min = Math.min(...values) - 2,max = Math.max(...values) + 2;
  const pts = values.map((v, i) => {
    const x = pad + i / (values.length - 1) * (w - 2 * pad);
    const y = h - pad - (v - min) / (max - min) * (h - 2 * pad);
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1][0]} ${h - pad} L ${pad} ${h - pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bronze)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--bronze)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={path} fill="none" stroke="var(--bronze)" strokeWidth="2" />
      {pts.map((p, i) => i === pts.length - 1 ? <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--bronze)" /> : null)}
    </svg>);

}

function TierBadgeLarge({ tier }) {
  const colors = {
    Applicant: ["#3a3a3a", "#222"],
    Verified: ["#5a7a90", "#3a4a58"],
    Preferred: ["#D4A857", "#8E5A2A"],
    Elite: ["#F4D078", "#8E5A2A"]
  };
  const [c1, c2] = colors[tier] || colors.Verified;
  return (
    <div style={{ width: 120, height: 120, position: "relative" }}>
      <svg viewBox="0 0 120 120" width="120" height="120" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}>
        <defs>
          <linearGradient id={`tg-${tier}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <path d="M60 8 L108 28 L108 64 Q108 96 60 112 Q12 96 12 64 L12 28 Z" fill={`url(#tg-${tier})`} stroke={c1} strokeWidth="2" style={{ fill: "rgba(21, 22, 22, 0.23)" }} />
        <path d="M60 16 L100 32 L100 64 Q100 92 60 104 Q20 92 20 64 L20 32 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* Wing motif */}
        <g transform="translate(60 60)">
          <path d="M -28 6 Q -10 -14 28 -10 Q 10 0 -28 8 Z" fill="rgba(255,255,255,0.25)" />
          <path d="M 28 6 Q 10 -14 -28 -10 Q -10 0 28 8 Z" fill="rgba(255,255,255,0.25)" />
        </g>
      </svg>
    </div>);

}

function BronzeWingBg() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }} viewBox="0 0 1280 280" preserveAspectRatio="xMidYMid slice">
      <path d="M -100 280 Q 200 100 600 140 Q 1000 180 1380 80" stroke="var(--bronze-bright)" strokeWidth="80" fill="none" strokeLinecap="round" />
      <path d="M -100 280 Q 200 140 600 180 Q 1000 220 1380 120" stroke="var(--bronze-bright)" strokeWidth="40" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>);

}

window.Scorecard = Scorecard;