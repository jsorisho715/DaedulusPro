// Tech-side Consumer Market modals — two flavors:
//  1) First-time consent: GC requested to open this tech to consumer jobs.
//     Tech reviews terms, accepts/declines once, then it's auto-on.
//  2) Per-job notification: incoming consumer job hit the queue. Tech sees
//     a soft toast/sheet style preview and can accept or pass.
// Lives in the field tech persona. Uses the phone-style frame language.

function CMTechConsent({ open, onClose, onAccept, onDecline }) {
  if (!open) return null;
  return (
    <ModalShell onClose={onClose}>
      <div style={{ background: "linear-gradient(135deg, var(--bronze), #8C6438)", color: "white", padding: "26px 22px 22px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2), transparent 70%)" }}/>
        <div style={{ position: "relative" }}>
          <div style={{ width: 52, height: 52, borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Icon name="zap" size={22}/>
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, opacity: 0.85 }}>Phoenix Pro Services invites you</div>
          <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>Pick up consumer jobs</div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 8, lineHeight: 1.5, maxWidth: 320, marginInline: "auto" }}>
            When your shop has gaps in the day, take a homeowner job through Daedalus and earn extra on top of your hourly.
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 22px", maxHeight: "55vh", overflowY: "auto" }}>
        <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>How it works</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <Bullet icon="schedule" t="During slow windows" s="Phoenix Pro flips you 'open to consumer'. Jobs only come when you're not on a shop work order."/>
          <Bullet icon="zap" t="One-tap claim" s="You'll see the job, the pay, the customer's notes, and the address. Accept or pass — your call every time."/>
          <Bullet icon="money" t="You get paid like normal" s="Same rate, same direct deposit, same paystub. Daedalus + Phoenix Pro split a cut on top — doesn't come out of you."/>
          <Bullet icon="shield" t="Fully covered" s="Phoenix Pro's GL + Daedalus's $1M consumer add-on apply to every job. You're never personally liable."/>
        </div>

        <div className="card" style={{ padding: 14, background: "var(--surface-2)", marginBottom: 14 }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Sample job (last week, your area)</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Garage door reverse · 47 min</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>Drove 5 mi · 5★ · tipped $15</div>
            </div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--olive)" }}>+$182</div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.5 }}>
          You can pause or opt out anytime in Settings. Accepting just lets Phoenix Pro flip you "open" when there's gap time — you still see and approve every job.
        </div>
      </div>

      <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
        <button onClick={onDecline} className="btn btn-secondary" style={{ flex: 0.7 }}>Not now</button>
        <button onClick={onAccept} className="btn btn-primary btn-lg" style={{ flex: 1.3 }}>
          <Icon name="check" size={14} strokeWidth={3}/> I'm in
        </button>
      </div>
    </ModalShell>
  );
}

function Bullet({ icon, t, s }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(176,134,84,0.10)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={14}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{s}</div>
      </div>
    </div>
  );
}

// Per-job notification — incoming consumer job pings the tech. Soft sheet
// at the bottom of the phone frame, dismissable, claim-able. Designed to feel
// non-coercive: tech can pass, and it surfaces a small "consumer" badge so
// they know it's not a Phoenix Pro shop work-order.
function CMTechIncomingJob({ open, onClose, onClaim, onPass }) {
  const [seconds, setSeconds] = React.useState(58);
  React.useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [open]);
  if (!open) return null;

  return (
    <ModalShell onClose={onClose}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--terracotta)", animation: "pulse 1.4s infinite" }}/>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--terracotta)" }}>Consumer job · {seconds}s</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6 }}>Garage door won't close</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Sarah R. · 4218 N 38th Pl · 4.3 mi (11 min)</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(176,134,84,0.12)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="compliance" size={20}/>
        </div>
      </div>

      <div style={{ padding: "14px 20px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(176,134,84,0.10), rgba(122,139,76,0.06))", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your payout</div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--bronze)", marginTop: 2 }}>$142</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Window</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>Today 2-6 PM</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 10, padding: 12, background: "var(--surface-2)", border: 0 }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Customer note</div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>"Door starts closing then bounces back up. Both sensor lights green. Side gate's unlocked, golden retriever Theo is friendly."</div>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <span className="pill" style={{ background: "rgba(176,134,84,0.10)", color: "var(--bronze)", fontSize: 10, height: 20 }}>Via Consumer Market</span>
          <span className="pill" style={{ background: "rgba(122,139,76,0.10)", color: "var(--olive)", fontSize: 10, height: 20 }}>$1M coverage</span>
          <span className="pill" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text-2)", fontSize: 10, height: 20 }}>Sensor align (likely)</span>
        </div>
      </div>

      <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
        <button onClick={onPass} className="btn btn-secondary" style={{ flex: 0.7 }}>Pass</button>
        <button onClick={onClaim} className="btn btn-primary btn-lg" style={{ flex: 1.3 }}>
          <Icon name="check" size={14} strokeWidth={3}/> Claim · $142
        </button>
      </div>
    </ModalShell>
  );
}

function ModalShell({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(31,35,41,0.65)", backdropFilter: "blur(8px)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 420, padding: 0, background: "var(--surface)", boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "slideUp 280ms var(--ease)" }}>
        {children}
      </div>
    </div>
  );
}

window.CMTechConsent = CMTechConsent;
window.CMTechIncomingJob = CMTechIncomingJob;
