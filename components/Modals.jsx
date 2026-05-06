// Modals: Permission-to-Enter, Change Order, AI Matching reasoning, Lien Waiver, Job Templates

function PTEModal({ wo, onClose }) {
  const [step, setStep] = React.useState(1);
  const [lang, setLang] = React.useState("en");
  const next = () => step < 3 ? setStep(s => s + 1) : (window.toast({ kind: "success", title: "PTE notice sent", msg: "24-hour notice delivered to resident." }), onClose());
  const msg = {
    en: `Hi from Solano Lofts management. A Daedalus technician will enter your unit on Tue 5/6 between 8–10 AM to install your smart lock. Reply YES to confirm, RESCHED to change, or NO to deny entry.`,
    es: `Hola, desde la administración de Solano Lofts. Un técnico de Daedalus ingresará a su unidad el martes 5/6 entre 8–10 AM para instalar la cerradura inteligente. Responda SÍ para confirmar, RESCHED para cambiar, o NO para negar la entrada.`,
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.65)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 30 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 580, padding: 0, animation: "fadeUp 200ms var(--ease)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="key" size={16} color="var(--bronze)"/>
            <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Permission to enter · Step {step} of 3</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding: 26 }}>
          {step === 1 && (
            <>
              <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Notify resident — 24-hour entry notice.</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 18 }}>Bldg 3 · Unit 308 · Maria Rodriguez · prefers Spanish · last response 2 days ago.</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[{k:"en",l:"English"},{k:"es",l:"Español"}].map(l => (
                  <button key={l.k} onClick={() => setLang(l.k)} className={`btn ${lang===l.k?"btn-primary":"btn-ghost"} btn-sm`}>{l.l}</button>
                ))}
              </div>
              <div className="card" style={{ padding: 14, background: "var(--surface-2)", fontSize: 13, lineHeight: 1.6 }}>{msg[lang]}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>Sent via Twilio masked SMS · Daedalus number (602) 555-0399</div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Resident response timeline</div>
              {[
                { t: "Notice sent", on: "Mon 5/4 · 9:14 AM", icon: "check", c: "var(--olive)" },
                { t: "Read receipt", on: "Mon 5/4 · 9:18 AM", icon: "check", c: "var(--olive)" },
                { t: "Resident replied 'SÍ'", on: "Mon 5/4 · 11:02 AM", icon: "check", c: "var(--olive)" },
                { t: "Auto-confirm geofence rule active", on: "Tue 5/6 · 8:00 AM window", icon: "shield", c: "var(--bronze)" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--line)" : 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: `${s.c}1A`, color: s.c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={s.icon} size={13}/></div>
                  <div><div style={{ fontSize: 13, fontWeight: 600 }}>{s.t}</div><div className="muted" style={{ fontSize: 11 }}>{s.on}</div></div>
                </div>
              ))}
            </>
          )}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--olive)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Icon name="check" size={32} strokeWidth={2.5}/></div>
              <div className="h-serif" style={{ fontSize: 22, marginBottom: 6 }}>PTE confirmed</div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 380, margin: "0 auto" }}>Tech can enter Tue 5/6 between 8:00–10:00 AM. Geofence + photo timestamp will log entry.</div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
            {step > 1 && step < 3 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button>}
            <button className="btn btn-primary" onClick={next}>{step === 1 ? "Send notice" : step === 2 ? "Looks good" : "Done"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangeOrderModal({ wo, onClose }) {
  const [scope, setScope] = React.useState("Discovered corroded conduit at junction box. Need to replace 6ft of 1/2\" EMT plus weatherproof box before re-mounting reader.");
  const [delta, setDelta] = React.useState(245);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.65)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 30 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 620, padding: 0, animation: "fadeUp 200ms var(--ease)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Change order · WO-3026</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding: 24 }}>
          <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Add to scope mid-job</div>
          <div className="muted" style={{ fontSize: 13, marginBottom: 18 }}>PM Diego Martín gets a push notification. Work pauses until approved.</div>
          <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Scope addition</div>
          <textarea className="textarea" value={scope} onChange={e => setScope(e.target.value)} style={{ minHeight: 80 }}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
            <div>
              <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Photos (3)</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 56, height: 56, borderRadius: 6, background: `linear-gradient(135deg, hsl(${20+i*15},25%,30%), hsl(${10+i*10},35%,18%))` }}/>)}
              </div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Price delta</div>
              <input className="input" value={`$${delta}`} onChange={e => setDelta(Number(e.target.value.replace(/\D/g,"")) || 0)} style={{ fontFamily: "var(--mono)", fontWeight: 600 }}/>
            </div>
          </div>
          <div className="card" style={{ padding: 14, marginTop: 16, background: "linear-gradient(135deg, rgba(176,134,84,0.08), transparent)", borderLeft: "3px solid var(--bronze)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><Icon name="sparkles" size={14} color="var(--bronze)"/><div style={{ fontSize: 12, fontWeight: 700 }}>AI re-estimate</div></div>
            <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>$245 is within market band ($210–$280) for 6ft EMT replacement + weatherproof box in Phoenix metro. Confidence: 91%.</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { window.toast({ kind: "success", title: "Sent for approval", msg: "Diego notified · ETA 5 min" }); onClose(); }}>Submit for approval</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIMatchModal({ onClose }) {
  const factors = [
    { l: "Trade match", v: "Gate ops + low-voltage", score: 100, weight: 25 },
    { l: "Proximity to property", v: "11.4 mi · 18 min", score: 92, weight: 15 },
    { l: "Compliance current", v: "All docs · ROC dual lic.", score: 100, weight: 20 },
    { l: "Performance score", v: "87 · Preferred tier", score: 87, weight: 20 },
    { l: "PMC preference", v: "Preferred for Red Rock", score: 100, weight: 10 },
    { l: "Capacity today", v: "2 of 5 crews available", score: 80, weight: 10 },
  ];
  const overall = Math.round(factors.reduce((s, f) => s + f.score * f.weight, 0) / 100);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.65)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 30 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 640, padding: 0, animation: "fadeUp 200ms var(--ease)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="sparkles" size={16} color="var(--bronze)"/><div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>AI matching · why Daedalus?</div></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding: 26 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 18 }}>
            <div>
              <div className="h-serif" style={{ fontSize: 56, fontWeight: 600, color: "var(--bronze)", lineHeight: 1 }}>{overall}</div>
              <div className="muted" style={{ fontSize: 11 }}>Match score / 100</div>
            </div>
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>Out of 14 vendors eligible for this WO, Daedalus ranked #1. Routing rule: top vendor first refusal · 15-min response window for Urgent.</div>
            </div>
          </div>
          {factors.map(f => (
            <div key={f.l} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13 }}><strong>{f.l}</strong> <span className="muted" style={{ marginLeft: 8 }}>{f.v}</span></div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{f.score} <span className="muted" style={{ fontSize: 10, fontWeight: 400 }}>· wt {f.weight}%</span></div>
              </div>
              <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 999 }}><div style={{ width: `${f.score}%`, height: "100%", background: "var(--bronze)", borderRadius: 999 }}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.PTEModal = PTEModal;
window.ChangeOrderModal = ChangeOrderModal;
window.AIMatchModal = AIMatchModal;
