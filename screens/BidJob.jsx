// BidJob — tech-side bid submission for consumer jobs the homeowner has
// requested in "compare bids" mode. Replaces the one-tap claim flow for
// indie (1099, no GC parent) techs. Fields: pricing model, ETA, pitch,
// photo of similar past work, trip/diagnostic fee.
//
// Pricing guards: warn outside fair-price band, hard-block bids >50% over
// the comparable average. Cap is first-3-bids, then closed.

const BID_JOB = {
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
  window: "Today · 2:00 – 6:00 PM",
  postedAgo: "2 min ago",
  bidsIn: 1,
  bidCap: 3,
  // Fair-price band for THIS work in THIS area (USD).
  fairLow: 165,
  fairMid: 245,
  fairHigh: 360,
  hardCap: 540, // 50% over fairHigh-ish; bids above this are blocked
  tags: ["Sensor align", "Spring inspect", "Common fix"],
};

function BidJob({ onClose, onSubmit }) {
  const j = BID_JOB;
  const [phase, setPhase] = React.useState("form"); // form → submitting → submitted
  const [model, setModel] = React.useState("fixed"); // fixed | hourly
  const [price, setPrice] = React.useState(265);
  const [hourlyRate, setHourlyRate] = React.useState(95);
  const [hours, setHours] = React.useState(2);
  const [eta, setEta] = React.useState("Today · 3:00 – 4:00 PM");
  const [tripFee, setTripFee] = React.useState(35);
  const [tripFeeWaived, setTripFeeWaived] = React.useState(true); // waived if hired
  const [pitch, setPitch] = React.useState("Did 3 of these last week — almost always sensor alignment from a kid kicking a ball. I'll bring shims, a fresh sensor pair, and a spring gauge in case it's the torsion. 30-day warranty on labor.");
  const [photoIdx, setPhotoIdx] = React.useState(0);

  const effectivePrice = model === "fixed" ? price : Math.round(hourlyRate * hours);
  const inBand = effectivePrice >= j.fairLow && effectivePrice <= j.fairHigh;
  const overBand = effectivePrice > j.fairHigh;
  const blocked = effectivePrice > j.hardCap;
  const underBand = effectivePrice < j.fairLow;

  const submitBid = () => {
    if (blocked) return;
    setPhase("submitting");
    setTimeout(() => setPhase("submitted"), 1200);
  };

  if (phase === "submitted") {
    return <BidSubmittedScreen job={j} bid={{ price: effectivePrice, eta, model }} onDone={() => onSubmit?.({ price: effectivePrice, eta })} onClose={onClose}/>;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,35,41,0.65)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 200ms var(--ease)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 540, maxHeight: "calc(100vh - 48px)", overflow: "hidden", display: "flex", flexDirection: "column", padding: 0, background: "var(--surface)", boxShadow: "var(--shadow-xl)", animation: "slideUp 280ms var(--ease)" }}>

        {/* Header — slate (different vibe from the urgent claim header) */}
        <div style={{ background: "linear-gradient(135deg, #4A6378, #2D4356)", color: "white", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15), transparent 60%)" }}/>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
            <Icon name="bid" size={17}/>
          </div>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, opacity: 0.85 }}>Submit bid · Independent</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{j.bidsIn}/{j.bidCap} bids in · {j.bidCap - j.bidsIn} slot{j.bidCap - j.bidsIn === 1 ? "" : "s"} left</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(255,255,255,0.15)", border: 0, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}><Icon name="x" size={14}/></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 12px" }}>
          {/* Why-bid notice — explains to the indie tech why this isn't one-tap */}
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(74,99,120,0.08)", borderLeft: "3px solid var(--slateblue)", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="info" size={13} color="var(--slateblue)"/>
            <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.55 }}>
              The homeowner asked to compare {j.bidCap} bids before picking. Submit yours and we'll let you know if you win. <strong style={{ color: "var(--text)" }}>Auto-accept on win</strong> — your bid IS the commitment.
            </div>
          </div>

          {/* Job summary — compact */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14, padding: 12, background: "var(--surface-2)", borderRadius: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(176,134,84,0.18)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={j.icon} size={16}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{j.title}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{j.id} · {j.distance} mi · {j.window}</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ alignSelf: "center" }}>Details <Icon name="chevDown" size={11}/></button>
          </div>

          {/* PRICING MODEL */}
          <div style={{ marginBottom: 16 }}>
            <SectionLabel>Pricing model</SectionLabel>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setModel("fixed")} style={{
                flex: 1, padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "var(--text)",
                background: model === "fixed" ? "rgba(176,134,84,0.10)" : "var(--surface)",
                border: `1px solid ${model === "fixed" ? "var(--bronze)" : "var(--line)"}`,
                fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Icon name="money" size={13}/> Fixed quote
              </button>
              <button onClick={() => setModel("hourly")} style={{
                flex: 1, padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "var(--text)",
                background: model === "hourly" ? "rgba(176,134,84,0.10)" : "var(--surface)",
                border: `1px solid ${model === "hourly" ? "var(--bronze)" : "var(--line)"}`,
                fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Icon name="schedule" size={13}/> Hourly + est.
              </button>
            </div>
          </div>

          {/* PRICE INPUT */}
          {model === "fixed" ? (
            <div style={{ marginBottom: 14 }}>
              <SectionLabel>Your price</SectionLabel>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 18, fontWeight: 600 }}>$</span>
                <input type="number" value={price} onChange={e => setPrice(Math.max(0, parseInt(e.target.value || 0)))}
                  style={{
                    width: "100%", height: 52, padding: "0 14px 0 32px", border: `2px solid ${blocked ? "var(--terracotta)" : overBand ? "var(--amber)" : underBand ? "var(--amber)" : "var(--line)"}`,
                    borderRadius: 10, background: "var(--surface)", color: "var(--text)", fontSize: 22, fontWeight: 700, outline: "none", fontFamily: "var(--mono)",
                  }}/>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <SectionLabel>Rate / hr</SectionLabel>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 14, fontWeight: 600 }}>$</span>
                  <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Math.max(0, parseInt(e.target.value || 0)))}
                    style={{ width: "100%", height: 44, padding: "0 12px 0 26px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface)", color: "var(--text)", fontSize: 16, fontWeight: 600, outline: "none", fontFamily: "var(--mono)" }}/>
                </div>
              </div>
              <div>
                <SectionLabel>Est. hours</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 6, height: 44, padding: "0 4px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface)" }}>
                  <button onClick={() => setHours(h => Math.max(0.5, h - 0.5))} style={{ width: 32, height: 32, borderRadius: 6, border: 0, background: "var(--surface-2)", color: "var(--text)", cursor: "pointer", fontSize: 16, fontWeight: 600 }}>−</button>
                  <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--mono)", fontSize: 16, fontWeight: 600 }}>{hours.toFixed(1)}h</div>
                  <button onClick={() => setHours(h => Math.min(12, h + 0.5))} style={{ width: 32, height: 32, borderRadius: 6, border: 0, background: "var(--surface-2)", color: "var(--text)", cursor: "pointer", fontSize: 16, fontWeight: 600 }}>+</button>
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1", padding: "8px 12px", background: "var(--surface-2)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="muted" style={{ fontSize: 11 }}>Estimated total ({hourlyRate}/hr × {hours}h)</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--bronze)" }}>${effectivePrice}</div>
              </div>
            </div>
          )}

          {/* FAIR-PRICE BAND VISUAL */}
          <FairPriceBand price={effectivePrice} low={j.fairLow} mid={j.fairMid} high={j.fairHigh} hardCap={j.hardCap}/>

          {/* GUARDRAIL ALERTS */}
          {blocked && (
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(176,70,58,0.10)", border: "1px solid rgba(176,70,58,0.4)", marginTop: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="alert" size={14} color="var(--terracotta)"/>
              <div style={{ fontSize: 12, color: "var(--terracotta)", lineHeight: 1.5 }}>
                <strong>Bid blocked.</strong> ${effectivePrice} is more than 50% over the comparable average ($
                {j.hardCap}). Lower your price or skip this job.
              </div>
            </div>
          )}
          {!blocked && overBand && (
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(214,160,40,0.10)", border: "1px solid rgba(214,160,40,0.4)", marginTop: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="alert" size={14} color="var(--amber)"/>
              <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>
                Above the fair band — homeowners are <strong>3× less likely</strong> to pick. Make sure your pitch justifies it.
              </div>
            </div>
          )}
          {!blocked && underBand && (
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(214,160,40,0.10)", border: "1px solid rgba(214,160,40,0.4)", marginTop: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="info" size={14} color="var(--amber)"/>
              <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>
                Below the fair band. You'll likely win, but you're leaving money on the table.
              </div>
            </div>
          )}

          {/* ETA */}
          <div style={{ marginTop: 16, marginBottom: 14 }}>
            <SectionLabel>Earliest you can be there</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Today · 3:00 – 4:00 PM",
                "Today · 4:00 – 5:00 PM",
                "Today · 5:00 – 6:00 PM",
                "Tomorrow · morning",
              ].map(slot => (
                <button key={slot} onClick={() => setEta(slot)} style={{
                  padding: "10px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer", color: "var(--text)",
                  background: eta === slot ? "rgba(176,134,84,0.08)" : "var(--surface)",
                  border: `1px solid ${eta === slot ? "var(--bronze)" : "var(--line)"}`,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <Icon name="schedule" size={13} color={eta === slot ? "var(--bronze)" : "var(--text-3)"}/>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: eta === slot ? 600 : 500 }}>{slot}</span>
                  {eta === slot && <Icon name="check" size={13} color="var(--bronze)"/>}
                </button>
              ))}
            </div>
          </div>

          {/* TRIP / DIAGNOSTIC FEE */}
          <div style={{ marginBottom: 14 }}>
            <SectionLabel>Trip / diagnostic fee disclosure</SectionLabel>
            <div className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 12, fontWeight: 600 }}>$</span>
                  <input type="number" value={tripFee} onChange={e => setTripFee(Math.max(0, parseInt(e.target.value || 0)))}
                    style={{ width: 90, height: 36, padding: "0 10px 0 22px", border: "1px solid var(--line)", borderRadius: 6, background: "var(--surface)", color: "var(--text)", fontSize: 13, fontWeight: 600, outline: "none", fontFamily: "var(--mono)" }}/>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                  Charged if homeowner declines after diagnosis
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={tripFeeWaived} onChange={e => setTripFeeWaived(e.target.checked)} style={{ accentColor: "var(--bronze)" }}/>
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>Waive trip fee if I'm hired (recommended)</span>
              </label>
            </div>
          </div>

          {/* PITCH */}
          <div style={{ marginBottom: 14 }}>
            <SectionLabel>
              Why you · pitch <span className="muted" style={{ fontWeight: 400 }}>({pitch.length}/240)</span>
            </SectionLabel>
            <textarea value={pitch} maxLength={240} onChange={e => setPitch(e.target.value)}
              placeholder="Why you'll knock this out fast. Past similar jobs, what you'll bring, warranty terms."
              style={{ width: "100%", minHeight: 80, padding: 12, border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface)", color: "var(--text)", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.5 }}/>
          </div>

          {/* PHOTO OF SIMILAR PAST WORK */}
          <div style={{ marginBottom: 8 }}>
            <SectionLabel>Photo of similar past work <span className="muted" style={{ fontWeight: 400 }}>(optional, big credibility boost)</span></SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {["#7A8B4C", "#B08654", "#4A6378", null].map((c, i) => (
                <button key={i} onClick={() => c && setPhotoIdx(i)} disabled={!c} style={{
                  aspectRatio: "1", borderRadius: 8, padding: 0, cursor: c ? "pointer" : "default",
                  background: c ? `linear-gradient(135deg, ${c}, var(--surface-3))` : "var(--surface)",
                  border: `2px solid ${photoIdx === i && c ? "var(--bronze)" : c ? "var(--line)" : "var(--line)"}`,
                  borderStyle: c ? "solid" : "dashed",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)",
                  position: "relative",
                }}>
                  {!c && <><Icon name="camera" size={16}/></>}
                  {c && photoIdx === i && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "rgba(176,134,84,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check" size={20} color="white" strokeWidth={3}/>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", background: "var(--surface)", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your bid</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: blocked ? "var(--terracotta)" : "var(--bronze)", lineHeight: 1.2 }}>
              ${effectivePrice} <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>· {eta.split(" · ")[1]}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={submitBid} disabled={blocked || phase === "submitting"} className="btn btn-primary btn-lg" style={{ minWidth: 160 }}>
            {phase === "submitting" ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: 999, animation: "spin 0.7s linear infinite" }}/>
                Submitting…
              </>
            ) : (
              <>Submit bid <Icon name="chevRight" size={13}/></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{children}</div>;
}

// Visual: horizontal track from $0 to hardCap. Highlights the fair band,
// drops a marker at the user's bid, color-codes by zone.
function FairPriceBand({ price, low, mid, high, hardCap }) {
  // Stretch the track to ~120% of hardCap so blocked bids still render visually.
  const max = hardCap * 1.05;
  const pct = (v) => Math.min(100, (v / max) * 100);
  const inBand = price >= low && price <= high;
  const blocked = price > hardCap;
  const markerColor = blocked ? "var(--terracotta)" : inBand ? "var(--olive)" : "var(--amber)";

  return (
    <div className="card" style={{ padding: 14, marginTop: 4, background: "var(--surface-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Fair-price band · 85018 · garage door
        </div>
        <span className="pill" style={{ fontSize: 10, height: 18, background: blocked ? "rgba(176,70,58,0.18)" : inBand ? "rgba(122,139,76,0.18)" : "rgba(214,160,40,0.18)", color: blocked ? "var(--terracotta)" : inBand ? "var(--olive)" : "var(--amber)" }}>
          {blocked ? "BLOCKED" : inBand ? "IN BAND" : price > high ? "ABOVE BAND" : "BELOW BAND"}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 36, marginBottom: 4 }}>
        {/* Base */}
        <div style={{ position: "absolute", top: 14, left: 0, right: 0, height: 8, background: "var(--surface-3)", borderRadius: 999 }}/>
        {/* Fair band */}
        <div style={{ position: "absolute", top: 14, left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%`, height: 8, background: "linear-gradient(90deg, rgba(122,139,76,0.7), rgba(176,134,84,0.7), rgba(122,139,76,0.7))", borderRadius: 999 }}/>
        {/* Hard cap zone */}
        <div style={{ position: "absolute", top: 14, left: `${pct(hardCap)}%`, width: `${100 - pct(hardCap)}%`, height: 8, background: "repeating-linear-gradient(135deg, rgba(176,70,58,0.4) 0 4px, rgba(176,70,58,0.15) 4px 8px)", borderRadius: 999 }}/>

        {/* Median marker */}
        <div style={{ position: "absolute", top: 8, left: `${pct(mid)}%`, transform: "translateX(-50%)" }}>
          <div style={{ width: 2, height: 20, background: "var(--text-3)" }}/>
        </div>

        {/* User's bid marker */}
        <div style={{ position: "absolute", top: 4, left: `${pct(Math.min(price, max))}%`, transform: "translateX(-50%)", transition: "left 200ms var(--ease)" }}>
          <div style={{ width: 4, height: 28, background: markerColor, borderRadius: 2, boxShadow: "0 0 0 3px rgba(255,255,255,0.9)" }}/>
        </div>
        <div style={{ position: "absolute", top: -2, left: `${pct(Math.min(price, max))}%`, transform: "translateX(-50%)", transition: "left 200ms var(--ease)" }}>
          <div className="mono" style={{ padding: "1px 6px", background: markerColor, color: "white", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>${price}</div>
        </div>
      </div>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
        <span>$0</span>
        <span style={{ position: "absolute", left: `calc(${pct(low)}% - 12px)`, marginTop: 0 }}>${low}</span>
        <span style={{ position: "absolute", left: `calc(${pct(mid)}% - 14px)`, color: "var(--text-2)", fontWeight: 600 }}>${mid} med</span>
        <span style={{ position: "absolute", left: `calc(${pct(high)}% - 14px)` }}>${high}</span>
        <span style={{ color: "var(--terracotta)", fontWeight: 600 }}>${hardCap} cap</span>
      </div>
    </div>
  );
}

// ── Submitted screen ──
function BidSubmittedScreen({ job, bid, onDone, onClose }) {
  const slotsLeft = job.bidCap - job.bidsIn - 1;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,35,41,0.65)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, padding: 0, background: "var(--surface)", boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "slideUp 320ms var(--ease)" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #4A6378, #2D4356)", color: "white", padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 70%)" }}/>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", animation: "popIn 380ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <Icon name="check" size={36} strokeWidth={2.5}/>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--serif)", position: "relative" }}>Bid in.</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6, position: "relative" }}>${bid.price} · {bid.eta}</div>
        </div>

        <div style={{ padding: 20 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>What happens now</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Step n={1} label={`${slotsLeft} more bid${slotsLeft === 1 ? "" : "s"} can come in`} sub="Then bidding closes automatically" active/>
            <Step n={2} label="Sarah picks one of the bids" sub="Usually within 10–20 min of close" />
            <Step n={3} label="If you win, the job's yours" sub="Auto-accepted — your bid is the commitment" />
          </div>

          <div style={{ marginTop: 14, padding: 12, background: "rgba(176,134,84,0.06)", borderLeft: "3px solid var(--bronze)", borderRadius: 6, fontSize: 12, color: "var(--text-2)", lineHeight: 1.55 }}>
            <Icon name="info" size={12} color="var(--bronze)"/>{" "}
            <strong style={{ color: "var(--text)" }}>Heads up:</strong> Daedalus is just the marketplace here — if Sarah picks you, it's a direct contract between you two. We take a 12% platform fee from the homeowner side, no markup on you.
          </div>
        </div>

        <div style={{ padding: "0 20px 20px", display: "flex", gap: 8 }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Browse more jobs</button>
          <button onClick={onDone} className="btn btn-primary" style={{ flex: 1 }}>Open in Field <Icon name="chevRight" size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function Step({ n, label, sub, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, background: active ? "rgba(74,99,120,0.04)" : "var(--surface)" }}>
      <div style={{ width: 28, height: 28, borderRadius: 999, background: active ? "var(--slateblue)" : "var(--surface-2)", color: active ? "white" : "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
        {n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{sub}</div>
      </div>
      {active && <span className="pill pill-info" style={{ fontSize: 10, height: 18 }}><span className="dot"/>NOW</span>}
    </div>
  );
}

window.BidJob = BidJob;
