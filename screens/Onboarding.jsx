// Stub screens for nav items not in scope but visible in the sidebar

function Onboarding({ onNav }) {
  const M = window.MOCK;
  const ob = M.ONBOARDING;
  const completedCount = ob.stages.filter(s => s.done).length;
  const pct = Math.round((completedCount / ob.stages.length) * 100);

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <div className="muted" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Application status</div>
        <h1 className="h-serif" style={{ fontSize: 32, margin: "6px 0 4px", fontWeight: 600 }}>Daedalus is in final review.</h1>
        <div className="muted" style={{ fontSize: 14 }}>{ob.eta}</div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: 28, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          {ob.stages.map((s, i) => (
            <React.Fragment key={s.key}>
              <div style={{ flex: "0 0 auto", textAlign: "center", minWidth: 100 }}>
                <div style={{
                  width: 36, height: 36, margin: "0 auto", borderRadius: 999,
                  background: s.done ? "var(--olive)" : s.active ? "var(--bronze)" : "var(--surface-2)",
                  color: s.done || s.active ? "white" : "var(--text-3)",
                  border: s.active ? "0" : s.done ? "0" : "1px solid var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: s.active ? "0 0 0 4px rgba(176,134,84,0.2)" : "none",
                }}>
                  {s.done ? <Icon name="check" size={16}/> : <span style={{ fontSize: 13, fontWeight: 700 }}>{i+1}</span>}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, color: s.active ? "var(--bronze)" : "inherit" }}>{s.label}</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{s.on || (s.active ? "In progress" : "—")}</div>
              </div>
              {i < ob.stages.length - 1 && <div style={{ flex: 1, height: 2, background: ob.stages[i+1].done || ob.stages[i+1].active ? "var(--olive)" : "var(--line)", margin: "0 -10px", marginTop: -28 }}/>}
            </React.Fragment>
          ))}
        </div>
        <div className="muted" style={{ fontSize: 12, textAlign: "center" }}>{pct}% complete · Submitted {ob.submittedAt.slice(0,10)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>What we've verified</h3>
          {ob.checklist.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < ob.checklist.length - 1 ? "1px solid var(--line)" : 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: 999, background: c.done ? "var(--olive)" : "var(--amber)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {c.done ? <Icon name="check" size={11} strokeWidth={2.5}/> : <Icon name="clock" size={11}/>}
              </div>
              <div style={{ flex: 1, fontSize: 13 }}>{c.label}</div>
              <span className={`pill ${c.done ? "pill-success" : "pill-warn"}`} style={{ fontSize: 10 }}>{c.done ? "Verified" : "Pending"}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="card" style={{ padding: 22, marginBottom: 14 }}>
            <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 12px" }}>Your specialist</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 999, background: "var(--slateblue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600 }}>{ob.specialist.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{ob.specialist.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{ob.specialist.title}</div>
              </div>
            </div>
            <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>"You're in great shape. One reference still pending — once Marcus Greene's reply lands, decision should follow within 24h."</div>
            <button className="btn btn-secondary btn-sm" style={{ width: "100%", marginBottom: 6 }}><Icon name="mail" size={12}/> Message Anya</button>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%" }}><Icon name="phone" size={12}/> Schedule call</button>
          </div>

          <div className="card" style={{ padding: 22, background: "linear-gradient(135deg, rgba(176,134,84,0.08), rgba(212,168,87,0.02))", borderLeft: "3px solid var(--bronze)" }}>
            <div className="h-serif" style={{ fontSize: 16, marginBottom: 8 }}>What happens at decision</div>
            <div className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>You'll be tiered <strong style={{ color: "var(--bronze)" }}>Verified</strong> at minimum, with a 90-day path to Preferred. First job invitations typically arrive within 48h.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stub({ title, desc, icon }) {
  return (
    <div className="page" style={{ padding: 28, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>{title}</h1>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{desc}</div>
      </div>
      <div className="card" style={{ padding: 60, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 16, background: "var(--surface-2)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={28}/>
        </div>
        <div className="h-serif" style={{ fontSize: 18, fontWeight: 600 }}>Coming in the next pilot wave</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 8, maxWidth: 420, margin: "8px auto 0" }}>This surface is part of the broader Daedalus Pro vendor portal. The v1 prototype focuses on the end-to-end work order lifecycle.</div>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
window.Stub = Stub;
