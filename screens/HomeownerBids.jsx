// HomeownerBids — homeowner-facing screen for the "compare bids" path.
// Shows up to 3 bids side-by-side from independent (1099) techs. Each card
// has price, ETA, pitch, photo of past work, ratings. Homeowner picks one.
// Loser bids auto-receive nearby-job suggestions. Median + fair-price band
// are surfaced so the homeowner sees what's reasonable.

const HOB_JOB = {
  id: "WO-3247",
  category: "Garage door",
  icon: "compliance",
  title: "Garage door reverses halfway down",
  posted: "Today, 1:18 PM",
  closed: "Today, 1:32 PM",
  fairLow: 165,
  fairMid: 245,
  fairHigh: 360,
};

const HOB_BIDS = [
  {
    id: "b1", techId: "t-mp",
    name: "Miguel Padilla", initials: "MP", color: "#B0463A",
    rating: 4.93, jobs: 412, years: 7, distance: 4.3, etaMin: 45,
    badges: ["Verified", "Background ✓", "Insured", "Top 5%"],
    model: "fixed",
    price: 265,
    eta: "Today · 3:00 – 4:00 PM",
    tripFee: 35, tripWaived: true,
    pitch: "Did 3 of these last week — almost always sensor alignment from a kid kicking a ball. I'll bring shims, a fresh sensor pair, and a spring gauge in case it's the torsion. 30-day warranty on labor.",
    pastPhotos: ["#7A8B4C", "#B08654"],
    warranty: "30-day labor",
    submittedAgo: "2 min ago",
    aiScore: 94,
    aiNote: "Strongest match: garage door specialist with 38 similar jobs in the last 90 days. Bid is in the heart of the fair band.",
  },
  {
    id: "b2", techId: "t-rc",
    name: "Renata Cole", initials: "RC", color: "#B08654",
    rating: 4.95, jobs: 503, years: 9, distance: 6.1, etaMin: 60,
    badges: ["Verified", "Background ✓", "Insured", "Elite"],
    model: "hourly",
    price: 285, // 95/hr × 3h
    hourlyRate: 95, hours: 3,
    eta: "Today · 4:00 – 5:00 PM",
    tripFee: 0, tripWaived: true,
    pitch: "Master tech, 9 yrs in valley. I'll diagnose first then write a fixed quote before any work — no surprises. Includes 90-day warranty on parts and labor, plus a free safety check on the spring & cable.",
    pastPhotos: ["#4A6378", "#B0463A", "#7A8B4C"],
    warranty: "90-day parts + labor",
    submittedAgo: "5 min ago",
    aiScore: 91,
    aiNote: "Highest-rated bidder. Hourly model adds uncertainty but warranty is best in class.",
  },
  {
    id: "b3", techId: "t-dh",
    name: "Devin Hayes", initials: "DH", color: "#7A8B4C",
    rating: 4.78, jobs: 187, years: 4, distance: 3.1, etaMin: 30,
    badges: ["Verified", "Background ✓", "Insured"],
    model: "fixed",
    price: 195,
    eta: "Today · 2:30 – 3:30 PM",
    tripFee: 49, tripWaived: false,
    pitch: "Closest to you. Can be there in 30 min. Standard 14-day warranty. If you decline after I diagnose, $49 trip fee.",
    pastPhotos: ["#B08654"],
    warranty: "14-day labor",
    submittedAgo: "11 min ago",
    aiScore: 78,
    aiNote: "Cheapest and fastest. Fewer reviews and shorter warranty — solid choice if speed matters most.",
  },
];

function HomeownerBids({ onClose, onPick }) {
  const job = HOB_JOB;
  const bids = HOB_BIDS;
  const [picked, setPicked] = React.useState(null);
  const [confirming, setConfirming] = React.useState(null);
  const [phase, setPhase] = React.useState("review"); // review → confirming → picked

  const median = Math.round([...bids.map(b => b.price)].sort((a, b) => a - b)[Math.floor(bids.length / 2)]);

  const confirmPick = (bid) => {
    setPhase("picking");
    setTimeout(() => {
      setPhase("picked");
      setPicked(bid);
    }, 1200);
  };

  if (phase === "picked" && picked) {
    return <BidPickedScreen bid={picked} job={job} onDone={() => onPick?.(picked)}/>;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 500, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ height: 64, padding: "0 28px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#D4A857,#B08654)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, fontFamily: "var(--serif)" }}>D</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>Daedalus<span style={{ color: "var(--bronze)" }}> · Home</span></div>
        </div>
        <div style={{ width: 1, height: 22, background: "var(--line)" }}/>
        <div>
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{job.id} · Bids closed</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>{job.title}</div>
        </div>
        <div className="spacer"/>
        <span className="pill" style={{ background: "rgba(122,139,76,0.18)", color: "var(--olive)", height: 24 }}>
          <Icon name="check" size={11} strokeWidth={3}/> All 3 bids in
        </span>
        <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon name="x" size={14}/></button>
      </header>

      {/* Body */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Intro + summary band */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
            <div>
              <h1 className="h-serif" style={{ fontSize: 30, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Pick your tech</h1>
              <div className="muted" style={{ fontSize: 14, marginTop: 6, maxWidth: 580 }}>
                3 bids came in for your job. Compare price, ETA, warranty, and what each pro brings — then choose the one you like.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost"><Icon name="info" size={13}/> What to look for</button>
              <button className="btn btn-secondary"><Icon name="phone" size={13}/> Call human</button>
            </div>
          </div>

          {/* Median + fair band summary */}
          <FairBandSummary job={job} bids={bids} median={median}/>

          {/* Bid cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18, alignItems: "stretch" }}>
            {bids.map(bid => (
              <BidCard key={bid.id} bid={bid} job={job} median={median}
                isConfirming={confirming === bid.id}
                onPick={() => setConfirming(bid.id)}
                onConfirm={() => confirmPick(bid)}
                onCancel={() => setConfirming(null)}
                phase={phase}
              />
            ))}
          </div>

          {/* Trust bar */}
          <div style={{ marginTop: 20, padding: "14px 18px", background: "var(--surface-2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 18, fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-2)" }}>
              <Icon name="shield" size={14} color="var(--olive)"/> All Daedalus-verified · $1M coverage
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-2)" }}>
              <Icon name="check" size={14} color="var(--olive)"/> Background-checked · Licensed
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-2)" }}>
              <Icon name="info" size={14} color="var(--bronze)"/> Direct contract — Daedalus is the marketplace, not the contractor
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Fair-band summary strip ──
function FairBandSummary({ job, bids, median }) {
  const max = job.fairHigh * 1.35;
  const pct = (v) => Math.min(100, (v / max) * 100);

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            What's fair for {job.category} · 85018
          </div>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>
            All 3 bids fall <strong style={{ color: "var(--olive)" }}>inside the fair-price band</strong> — pick on what matters most to you.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Median bid</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--bronze)", marginTop: 2 }}>${median}</div>
        </div>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 56, marginBottom: 4 }}>
        {/* Base */}
        <div style={{ position: "absolute", top: 24, left: 0, right: 0, height: 8, background: "var(--surface-3)", borderRadius: 999 }}/>
        {/* Fair band */}
        <div style={{ position: "absolute", top: 24, left: `${pct(job.fairLow)}%`, width: `${pct(job.fairHigh) - pct(job.fairLow)}%`, height: 8, background: "linear-gradient(90deg, rgba(122,139,76,0.7), rgba(176,134,84,0.7), rgba(122,139,76,0.7))", borderRadius: 999 }}/>

        {/* Band edge labels */}
        <div className="mono" style={{ position: "absolute", top: 38, left: `${pct(job.fairLow)}%`, transform: "translateX(-50%)", fontSize: 10, color: "var(--text-3)" }}>${job.fairLow}</div>
        <div className="mono" style={{ position: "absolute", top: 38, left: `${pct(job.fairHigh)}%`, transform: "translateX(-50%)", fontSize: 10, color: "var(--text-3)" }}>${job.fairHigh}</div>

        {/* Bid markers */}
        {bids.map(bid => (
          <div key={bid.id} style={{ position: "absolute", top: 0, left: `${pct(bid.price)}%`, transform: "translateX(-50%)" }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: bid.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, border: "2px solid var(--surface)", boxShadow: "var(--shadow-sm)" }}>
              {bid.initials}
            </div>
            <div className="mono" style={{ marginTop: 4, fontSize: 10, fontWeight: 700, textAlign: "center" }}>${bid.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Single bid card ──
function BidCard({ bid, job, median, isConfirming, onPick, onConfirm, onCancel, phase }) {
  const inBand = bid.price >= job.fairLow && bid.price <= job.fairHigh;
  const vsMedian = bid.price - median;
  const isFastest = bid.id === "b3"; // Devin
  const isHighestRated = bid.id === "b2"; // Renata
  const isBestMatch = bid.id === "b1"; // Miguel — highest AI score

  return (
    <div className="card" style={{
      padding: 0, overflow: "hidden", display: "flex", flexDirection: "column",
      border: isConfirming ? "2px solid var(--bronze)" : "1px solid var(--line)",
      transition: "all 200ms var(--ease)",
      transform: isConfirming ? "translateY(-4px)" : "none",
      boxShadow: isConfirming ? "var(--shadow-lg)" : "var(--shadow-sm)",
    }}>
      {/* Highlight badge */}
      {(isBestMatch || isFastest || isHighestRated) && (
        <div style={{
          padding: "6px 14px",
          background: isBestMatch ? "linear-gradient(90deg, var(--bronze), #D4A857)" : isFastest ? "var(--olive)" : "var(--slateblue)",
          color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          textAlign: "center",
        }}>
          {isBestMatch && "★ Best Daedalus match"}
          {isFastest && "⚡ Fastest"}
          {isHighestRated && "🏆 Highest-rated"}
        </div>
      )}

      {/* Tech header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: bid.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
            {bid.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{bid.name}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>★ {bid.rating} · {bid.jobs} jobs · {bid.years} yrs</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
          {bid.badges.map(b => (
            <span key={b} className="pill" style={{ background: "var(--surface-2)", color: "var(--text-2)", fontSize: 9, height: 18, padding: "0 8px" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Price hero */}
      <div style={{ padding: "16px 18px", background: inBand ? "linear-gradient(135deg, rgba(122,139,76,0.06), rgba(176,134,84,0.04))" : "var(--surface-2)" }}>
        <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {bid.model === "fixed" ? "Fixed quote" : `Hourly · $${bid.hourlyRate}/hr × ${bid.hours}h est.`}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: "var(--bronze)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            ${bid.price}
          </div>
          {vsMedian !== 0 && (
            <div style={{ fontSize: 11, color: vsMedian > 0 ? "var(--terracotta)" : "var(--olive)", fontWeight: 600 }}>
              {vsMedian > 0 ? "+" : ""}${vsMedian} vs median
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {/* ETA */}
        <Row icon="schedule" label="ETA" value={bid.eta} accent="var(--bronze)"/>

        {/* Trip fee */}
        <Row icon="money" label="Trip fee"
          value={bid.tripWaived ? `$${bid.tripFee} (waived if hired)` : `$${bid.tripFee} (charged on decline)`}
          accent={bid.tripWaived ? "var(--olive)" : "var(--amber)"}
        />

        {/* Warranty */}
        <Row icon="shield" label="Warranty" value={bid.warranty} accent="var(--slateblue)"/>

        {/* Pitch */}
        <div>
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Why me</div>
          <div style={{ fontSize: 12, lineHeight: 1.55, color: "var(--text-2)", fontStyle: "italic", padding: 10, background: "var(--surface-2)", borderRadius: 8, position: "relative" }}>
            <div style={{ position: "absolute", top: 4, left: 6, fontSize: 18, color: "var(--text-3)", fontFamily: "var(--serif)", lineHeight: 1 }}>"</div>
            <div style={{ paddingLeft: 12 }}>{bid.pitch}</div>
          </div>
        </div>

        {/* Past work photos */}
        {bid.pastPhotos?.length > 0 && (
          <div>
            <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Past work</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(bid.pastPhotos.length, 3)}, 1fr)`, gap: 4 }}>
              {bid.pastPhotos.map((c, i) => (
                <div key={i} style={{ aspectRatio: "1.4", borderRadius: 6, background: `linear-gradient(135deg, ${c}, var(--surface-3))`, border: "1px solid var(--line)" }}/>
              ))}
            </div>
          </div>
        )}

        {/* AI assist */}
        <div style={{ marginTop: "auto", padding: "10px 12px", background: "rgba(74,99,120,0.06)", borderLeft: "3px solid var(--slateblue)", borderRadius: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <Icon name="sparkles" size={11} color="var(--slateblue)"/>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--slateblue)", letterSpacing: "0.04em", textTransform: "uppercase" }}>AI take · {bid.aiScore}/100 match</span>
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.45, color: "var(--text-2)" }}>{bid.aiNote}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 18px 16px", borderTop: "1px solid var(--line)" }}>
        {!isConfirming ? (
          <button onClick={onPick} className="btn btn-primary" style={{ width: "100%" }}>
            <Icon name="check" size={13}/> Pick {bid.name.split(" ")[0]}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", textAlign: "center" }}>
              Hire {bid.name} for ${bid.price}? Their bid auto-accepts.
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={onCancel} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Cancel</button>
              <button onClick={onConfirm} className="btn btn-primary btn-sm" style={{ flex: 2 }}
                disabled={phase === "picking"}>
                {phase === "picking" ? (
                  <>
                    <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: 999, animation: "spin 0.7s linear infinite" }}/>
                    Hiring…
                  </>
                ) : <>Confirm · ${bid.price}</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon, label, value, accent }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--surface-2)", color: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={12}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

// ── Picked confirmation ──
function BidPickedScreen({ bid, job, onDone }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 540, padding: 0, background: "var(--surface)", boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "slideUp 320ms var(--ease)" }}>
        <div style={{ background: "linear-gradient(135deg, var(--olive), #5C6F3A)", color: "white", padding: "32px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 70%)" }}/>
          <div style={{ width: 76, height: 76, borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", animation: "popIn 380ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <Icon name="check" size={38} strokeWidth={2.5}/>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "var(--serif)", position: "relative" }}>{bid.name} is hired.</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8, position: "relative" }}>${bid.price} · {bid.eta}</div>
        </div>

        <div style={{ padding: 24 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>What happens now</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PickedStep n={1} label={`${bid.name} got the win notification`} sub="Auto-accepted — they're already prepping" active/>
            <PickedStep n={2} label="Direct contract is in place" sub={`Daedalus is the marketplace; you and ${bid.name.split(" ")[0]} are direct`}/>
            <PickedStep n={3} label="Live ETA + truck location" sub="As soon as they're en route"/>
          </div>

          <div style={{ marginTop: 14, padding: 12, background: "rgba(74,99,120,0.06)", borderLeft: "3px solid var(--slateblue)", borderRadius: 6, fontSize: 12, color: "var(--text-2)", lineHeight: 1.55 }}>
            <Icon name="info" size={12} color="var(--slateblue)"/>{" "}
            The other 2 bidders were notified they didn't win, with auto-suggestions for nearby jobs that match their skills.
          </div>
        </div>

        <div style={{ padding: "0 24px 22px", display: "flex", gap: 8 }}>
          <button onClick={onDone} className="btn btn-secondary" style={{ flex: 1 }}><Icon name="phone" size={13}/> Call {bid.name.split(" ")[0]}</button>
          <button onClick={onDone} className="btn btn-primary" style={{ flex: 1 }}>Track ETA <Icon name="chevRight" size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function PickedStep({ n, label, sub, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, background: active ? "rgba(122,139,76,0.06)" : "var(--surface)" }}>
      <div style={{ width: 28, height: 28, borderRadius: 999, background: active ? "var(--olive)" : "var(--surface-2)", color: active ? "white" : "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
        {active ? <Icon name="check" size={13} strokeWidth={3}/> : n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{sub}</div>
      </div>
      {active && <span className="pill" style={{ background: "rgba(122,139,76,0.18)", color: "var(--olive)", fontSize: 10, height: 18 }}>DONE</span>}
    </div>
  );
}

window.HomeownerBids = HomeownerBids;
