// Claim Job — the tech-side workflow when a job hits the marketplace.
// This is the *opposite* end of the consumer flow: a tech sees an unclaimed
// job, sizes it up, and decides whether to grab it. Frame it as a focused
// "decision" surface, not a list. One job at a time, full context, claim or
// pass. Inspired by Uber's "trip request" overlay + Instawork's claim sheet.

const CLAIM_JOB = {
  id: "WO-3247",
  category: "Garage door",
  icon: "compliance",
  title: "Garage door reverses halfway down",
  customer: "Sarah R.",
  customerNote: "The door starts closing then bounces back up. Both sensor lights are green. I've owned the house 3 yrs, never had this issue. Theo (golden retriever) is friendly, side gate's unlocked.",
  photos: ["#B08654", "#7A8B4C", "#4A6378"],
  address: "4218 N 38th Pl",
  city: "Phoenix, AZ 85018",
  distance: 4.3,
  driveTime: 11,
  pay: 285,
  payBreakdown: { service: 119, drive: 18, urgency: 28, materials: 120 },
  window: "Today · 2:00 – 6:00 PM",
  postedAgo: "32 sec ago",
  expires: 87, // seconds
  difficulty: 2, // 1-3
  tags: ["Sensor align", "Spring inspect", "Common fix"],
  customerHistory: { jobs: 2, rating: 5.0, tips: "Tipped 18% avg" },
  conflicts: { other: "1 other tech viewing", competing: false },
};

function ClaimJob({ onClose, onClaim, onPass, onBid, techType = "gc-w2", jobMode = "instant" }) {
  // techType: "gc-w2"  → W-2 of a Daedalus GC, can one-tap claim
  //           "indie"  → 1099, no GC parent — must submit a bid for consumer jobs
  // jobMode:  "instant" or "compare" (homeowner's pick)
  // If indie + compare → render BidJob instead. Indie + instant → claim still works.
  const mustBid = techType === "indie" && jobMode === "compare";

  React.useEffect(() => {
    if (mustBid && onBid) onBid();
  }, [mustBid, onBid]);
  if (mustBid) return null;

  const [secondsLeft, setSecondsLeft] = React.useState(CLAIM_JOB.expires);
  const [phase, setPhase] = React.useState("review"); // review → claiming → claimed
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  React.useEffect(() => {
    if (phase !== "review") return;
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleClaim = () => {
    setPhase("claiming");
    setTimeout(() => setPhase("claimed"), 1500);
  };

  const j = CLAIM_JOB;

  if (phase === "claimed") {
    return <ClaimedScreen job={j} onDone={() => onClaim?.(j)}/>;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,35,41,0.65)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 200ms var(--ease)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, maxHeight: "calc(100vh - 48px)", overflow: "hidden", display: "flex", flexDirection: "column", padding: 0, background: "var(--surface)", boxShadow: "var(--shadow-xl)", animation: "slideUp 280ms var(--ease)" }}>

        {/* Header — terracotta urgent strip */}
        <div style={{ background: "linear-gradient(135deg, #B0463A, #8B3A30)", color: "white", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15), transparent 60%)" }}/>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
            <Icon name="zap" size={18}/>
          </div>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, opacity: 0.85 }}>New job nearby</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Posted {j.postedAgo}</div>
          </div>
          <ExpiryRing seconds={secondsLeft} total={CLAIM_JOB.expires}/>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(255,255,255,0.15)", border: 0, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}><Icon name="x" size={14}/></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 12px" }}>
          {/* Title row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(176,134,84,0.12)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={j.icon} size={20}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{j.category} · {j.id}</div>
              <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, marginTop: 2 }}>{j.title}</div>
            </div>
          </div>

          {/* Pay — hero */}
          <div style={{ background: "linear-gradient(135deg, rgba(176,134,84,0.10), rgba(122,139,76,0.06))", borderRadius: 12, padding: 16, marginBottom: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Estimated payout</div>
                <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: "var(--bronze)", letterSpacing: "-0.02em", lineHeight: 1, marginTop: 6 }}>${j.pay}</div>
              </div>
              <button onClick={() => setShowBreakdown(s => !s)} className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }}>
                {showBreakdown ? "Hide" : "Breakdown"} <Icon name={showBreakdown ? "chevUp" : "chevDown"} size={11}/>
              </button>
            </div>
            {showBreakdown && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(176,134,84,0.25)", display: "flex", flexDirection: "column", gap: 5 }}>
                <BreakdownRow label="Service call (1 hr)" value={j.payBreakdown.service}/>
                <BreakdownRow label="Drive bonus (4.3 mi)" value={j.payBreakdown.drive}/>
                <BreakdownRow label="Same-day premium" value={j.payBreakdown.urgency}/>
                <BreakdownRow label="Parts margin (est)" value={j.payBreakdown.materials} muted/>
              </div>
            )}
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="pill" style={{ background: "rgba(122,139,76,0.15)", color: "var(--olive)", fontSize: 10, height: 20 }}>Instant pay eligible</span>
              <span className="pill" style={{ background: "rgba(176,134,84,0.15)", color: "var(--bronze)", fontSize: 10, height: 20 }}>+$50 if 5★</span>
            </div>
          </div>

          {/* Where & When grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 10 }}>
              <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Where</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{j.distance} mi away</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{j.driveTime} min · {j.city.split(",")[0]}</div>
            </div>
            <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: 10 }}>
              <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>When</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Today</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>2:00 – 6:00 PM</div>
            </div>
          </div>

          {/* Customer note */}
          <div style={{ marginBottom: 14 }}>
            <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>From the customer</div>
            <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 10, fontSize: 12, lineHeight: 1.55, color: "var(--text)", fontStyle: "italic", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: 8, fontSize: 22, color: "var(--text-3)", fontFamily: "var(--serif)", lineHeight: 1 }}>"</div>
              <div style={{ paddingLeft: 14 }}>{j.customerNote}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 8 }}>
              {j.photos.map((p, i) => (
                <div key={i} style={{ aspectRatio: "1.4", borderRadius: 8, background: `linear-gradient(135deg, ${p}, var(--surface-3))`, border: "1px solid var(--line)" }}/>
              ))}
            </div>
          </div>

          {/* Diagnostic suggestion */}
          <div className="card" style={{ padding: 12, marginBottom: 14, background: "rgba(74,99,120,0.06)", borderColor: "rgba(74,99,120,0.3)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="sparkles" size={14} color="var(--slateblue)"/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slateblue)" }}>AI triage</div>
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 3, lineHeight: 1.5 }}>Likely culprits: misaligned safety sensors (70%), worn torsion spring (20%), opener force setting (10%). Bring shims + spring gauge.</div>
                <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                  {j.tags.map(t => (
                    <span key={t} className="pill" style={{ background: "var(--surface)", color: "var(--text-2)", fontSize: 10, height: 20 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer history */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "var(--surface-2)", borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--bronze)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>SR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{j.customer}</div>
              <div className="muted" style={{ fontSize: 11 }}>{j.customerHistory.jobs} prior jobs · ★ {j.customerHistory.rating} · {j.customerHistory.tips}</div>
            </div>
            <span className="pill pill-success" style={{ fontSize: 10, height: 20 }}><span className="dot"/>Repeat</span>
          </div>

          {/* Competing notice */}
          {j.conflicts.other && (
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(176,70,58,0.08)", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--terracotta)", fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--terracotta)", animation: "pulse 1.4s infinite" }}/>
              {j.conflicts.other}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", background: "var(--surface)", display: "flex", gap: 8 }}>
          <button onClick={() => onPass?.(j)} className="btn btn-secondary" disabled={phase === "claiming"} style={{ flex: 0.6 }}>
            <Icon name="x" size={13}/> Pass
          </button>
          <button onClick={handleClaim} disabled={phase === "claiming" || secondsLeft === 0} className="btn btn-primary btn-lg" style={{ flex: 1.4, position: "relative", overflow: "hidden", opacity: secondsLeft === 0 ? 0.5 : 1 }}>
            {phase === "claiming" ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: 999, animation: "spin 0.7s linear infinite" }}/>
                Claiming…
              </>
            ) : secondsLeft === 0 ? (
              <>Job expired</>
            ) : (
              <><Icon name="check" size={15} strokeWidth={3}/> Claim · ${j.pay}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
      <span style={{ color: muted ? "var(--text-3)" : "var(--text-2)" }}>{label}</span>
      <span className="mono" style={{ fontWeight: 600, color: muted ? "var(--text-3)" : "var(--text)" }}>${value}</span>
    </div>
  );
}

function ExpiryRing({ seconds, total }) {
  const pct = seconds / total;
  const r = 16;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct);
  const danger = seconds < 30;
  return (
    <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0, zIndex: 1 }}>
      <svg width="40" height="40" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="20" cy="20" r={r} stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none"/>
        <circle cx="20" cy="20" r={r} stroke={danger ? "#FFD7D2" : "white"} strokeWidth="3" fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
        {seconds}
      </div>
    </div>
  );
}

function ClaimedScreen({ job, onDone }) {
  const [eta] = React.useState(11);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,35,41,0.65)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, padding: 0, background: "var(--surface)", boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "slideUp 320ms var(--ease)" }}>
        {/* Big check */}
        <div style={{ background: "linear-gradient(135deg, var(--olive), #5C6F3A)", color: "white", padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 70%)" }}/>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", animation: "popIn 380ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <Icon name="check" size={36} strokeWidth={2.5}/>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--serif)", position: "relative" }}>It's yours, Miguel.</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6, position: "relative" }}>{job.id} · ${job.pay} · {job.window}</div>
        </div>

        {/* Quick actions */}
        <div style={{ padding: 20 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Next steps</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <NextStep n={1} icon="phone" label="Call Sarah" sub="Confirm the 2 PM window" cta="Call"/>
            <NextStep n={2} icon="location" label="Get directions" sub={`${job.distance} mi · ETA ${eta} min`} cta="Open"/>
            <NextStep n={3} icon="workorder" label="Mark en route" sub="Customer gets live ETA" cta="Start"/>
          </div>
        </div>

        <div style={{ padding: "0 20px 20px" }}>
          <button onClick={onDone} className="btn btn-primary btn-lg" style={{ width: "100%" }}>
            Open in Field <Icon name="chevRight" size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function NextStep({ n, icon, label, sub, cta }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 999, background: "var(--surface-2)", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={13}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{sub}</div>
      </div>
      <button className="btn btn-ghost btn-sm">{cta}</button>
    </div>
  );
}

window.ClaimJob = ClaimJob;
