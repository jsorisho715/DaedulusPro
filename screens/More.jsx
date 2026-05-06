// Schedule, Team, Inbox, Reports, Integrations — broader product surfaces from PRD

function Schedule() {
  const M = window.MOCK;
  const days = ["Mon 5/4","Tue 5/5","Wed 5/6","Thu 5/7","Fri 5/8","Sat 5/9","Sun 5/10"];
  const techs = M.TEAM.filter(t => ["Field Lead","Field Tech"].includes(t.role));
  const heatmap = (i,j) => { const seed = (i*7+j*3)%10; return seed>=8?"high":seed>=5?"med":seed>=2?"low":"none"; };
  const heatColor = h => ({high:"var(--terracotta)", med:"var(--amber)", low:"var(--olive)", none:"var(--surface-2)"})[h];
  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Schedule</h1>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Capacity heatmap by tech · drag a job from the queue onto a cell to assign.</div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "200px repeat(7, 1fr)", borderBottom: "1px solid var(--line)" }}>
          <div style={{ padding: "12px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-2)" }}>Tech / Day</div>
          {days.map(d => <div key={d} style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, borderLeft: "1px solid var(--line)", textAlign: "center" }}>{d}</div>)}
        </div>
        {techs.map(t => (
          <div key={t.id} style={{ display: "grid", gridTemplateColumns: "200px repeat(7, 1fr)", borderBottom: "1px solid var(--line)" }}>
            <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar user={t} size={26}/>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div><div className="muted" style={{ fontSize: 11 }}>{(t.trades||[]).join(", ")}</div></div>
            </div>
            {days.map((d, j) => {
              const h = heatmap(techs.indexOf(t), j); const jobs = h==="high"?5:h==="med"?3:h==="low"?1:0;
              return (
                <div key={d} style={{ padding: 8, borderLeft: "1px solid var(--line)", minHeight: 64, background: h==="none"?"transparent":`${heatColor(h)}15`, display: "flex", flexDirection: "column", gap: 4 }}>
                  {jobs > 0 && <div className="pill" style={{ background: heatColor(h), color: "white", fontSize: 10, alignSelf: "flex-start", height: 18 }}>{jobs} jobs · {jobs*2}h</div>}
                  {jobs >= 3 && <div style={{ fontSize: 10, color: "var(--text-3)" }}>{jobs===5?"Capacity":jobs===4?"Heavy":"Booked"}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// TEAM with Invite workflow
// ──────────────────────────────────────────────────────────────────────────
function Team() {
  const M = window.MOCK;
  const [invite, setInvite] = React.useState(false);
  return (
    <div className="page" style={{ padding: 28, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Team</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{M.TEAM.length} members · 6 in field · per-tech compliance tracked.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setInvite(true)}><Icon name="plus" size={14}/> Invite member</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600 }}>Member</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Role</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Trades</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Background</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Drug screen</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Certs</th>
              <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {M.TEAM.map((t, i) => {
              const bg = i === 7 ? { l: "Expired", c: "danger" } : { l: "Cleared", c: "success" };
              const certs = i < 5 ? ["OSHA 30","EPA 608"] : i < 8 ? ["OSHA 10"] : [];
              return (
                <tr key={t.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar user={t} size={32}/>
                      <div><div style={{ fontWeight: 600 }}>{t.name}</div><div className="muted" style={{ fontSize: 11 }}>{t.email || t.phone}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{t.role}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(t.trades || []).slice(0,2).map(tr => <span key={tr} className="pill" style={{ background: "var(--surface-2)", color: "var(--text-2)", fontSize: 10 }}>{tr}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px" }}><span className={`pill pill-${bg.c}`} style={{ fontSize: 10 }}>{bg.l}</span></td>
                  <td style={{ padding: "12px 12px" }}><span className="pill pill-success" style={{ fontSize: 10 }}>Current</span></td>
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {certs.map(c => <span key={c} className="pill pill-bronze" style={{ fontSize: 10 }}>{c}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}><button className="btn btn-ghost btn-sm">Manage</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {invite && <InviteMemberModal onClose={() => setInvite(false)}/>}
    </div>
  );
}

function InviteMemberModal({ onClose }) {
  const M = window.MOCK;
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    firstName: "", lastName: "", email: "", phone: "",
    role: "lead", trades: ["access-control"], properties: "all",
    bgCheck: true, drugScreen: true, mfaRequired: true, sendBranded: true,
    propertyIds: [], message: "Welcome to Daedalus Trades. Click the link below to set your password and start MFA enrollment.",
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const roleOptions = [
    { id: "owner",      label: "Owner / Principal",   sub: "Everything. Can invite and remove team." },
    { id: "admin",      label: "Operations Admin",    sub: "Ops + scheduling. No finance access." },
    { id: "dispatcher", label: "Dispatcher",          sub: "Assign techs, manage routes, comms." },
    { id: "estimator",  label: "Estimator",           sub: "Bidding only. Read-only on jobs." },
    { id: "lead",       label: "Field Lead",          sub: "Mobile app + sign-off authority." },
    { id: "tech",       label: "Field Tech",          sub: "Mobile app, no sign-off." },
    { id: "books",      label: "Bookkeeper",          sub: "AR, factoring, payouts. No ops." },
  ];
  const tradeOptions = [
    { id: "access-control", l: "Access Control" }, { id: "low-voltage", l: "Low-voltage" },
    { id: "iot", l: "IoT / Smart Home" }, { id: "gate", l: "Gates" }, { id: "wifi", l: "WiFi / Networking" },
    { id: "plumbing", l: "Plumbing" }, { id: "hvac", l: "HVAC" }, { id: "electrical", l: "Electrical" },
  ];
  const role = roleOptions.find(r => r.id === data.role);
  const next = () => step < 4 ? setStep(s => s + 1) : (window.toast?.({ kind: "success", title: "Invitation sent", msg: `${data.firstName} ${data.lastName} · ${role.label}` }), onClose());
  const valid1 = data.firstName && data.lastName && data.email;
  const isFieldRole = ["lead", "tech"].includes(data.role);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 30, overflowY: "auto", animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 720, padding: 0, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Invite team member · Step {step} of 4</div>
            <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>
              {step === 1 ? "Who are you adding?" : step === 2 ? "What can they do?" : step === 3 ? "Compliance requirements" : "Review & send"}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        {/* progress dots */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--line)", display: "flex", gap: 6, flexShrink: 0 }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: s <= step ? "var(--bronze)" : "var(--surface-2)" }}/>
          ))}
        </div>

        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="First name"><input className="input" value={data.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Elena"/></Field>
              <Field label="Last name"><input className="input" value={data.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Sandoval"/></Field>
              <Field label="Email" full><input className="input" value={data.email} onChange={e => set("email", e.target.value)} placeholder="elena@daedalustrades.com" type="email"/></Field>
              <Field label="Mobile (for SMS + MFA)" full><input className="input" value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="(602) 555-0142" type="tel"/></Field>
              <div style={{ gridColumn: "1 / -1", padding: 14, background: "var(--surface-2)", borderRadius: 8, fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>
                <Icon name="info" size={12} color="var(--slateblue)"/> Daedalus emails an invitation with a magic link valid for 72 hours. They'll set a password, enroll in MFA, and accept the platform terms before getting access.
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Role</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                {roleOptions.map(r => (
                  <button key={r.id} onClick={() => set("role", r.id)} className="card" style={{ padding: 12, textAlign: "left", cursor: "pointer", border: data.role === r.id ? "1px solid var(--bronze)" : "1px solid var(--line)", background: data.role === r.id ? "rgba(176,134,84,0.06)" : "var(--surface)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 999, border: data.role === r.id ? "4px solid var(--bronze)" : "1.5px solid var(--text-3)" }}/>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{r.sub}</div>
                  </button>
                ))}
              </div>

              {isFieldRole && (
                <>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Trades they cover</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                    {tradeOptions.map(t => {
                      const on = data.trades.includes(t.id);
                      return (
                        <button key={t.id} onClick={() => set("trades", on ? data.trades.filter(x => x !== t.id) : [...data.trades, t.id])} className="pill" style={{ background: on ? "var(--bronze)" : "var(--surface-2)", color: on ? "white" : "var(--text-2)", border: 0, cursor: "pointer", fontSize: 12, height: 28, padding: "0 12px" }}>
                          {on && <Icon name="check" size={11}/>} {t.l}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Property scope</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { v: "all", l: "All assigned properties", s: "Default for Owner, Admin, Dispatcher" },
                  { v: "pmc", l: "Specific PMCs", s: "Limit to chosen client tenants" },
                  { v: "props", l: "Specific properties", s: "Tightest scope · per-property allow list" },
                ].map(o => (
                  <label key={o.v} style={{ padding: 12, border: data.properties === o.v ? "1px solid var(--bronze)" : "1px solid var(--line)", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: data.properties === o.v ? "rgba(176,134,84,0.06)" : "var(--surface)" }}>
                    <input type="radio" checked={data.properties === o.v} onChange={() => set("properties", o.v)}/>
                    <div><div style={{ fontSize: 13, fontWeight: 600 }}>{o.l}</div><div className="muted" style={{ fontSize: 11 }}>{o.s}</div></div>
                  </label>
                ))}
                {data.properties === "props" && (
                  <div className="card" style={{ padding: 10, background: "var(--surface-2)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 160, overflowY: "auto" }}>
                      {(M.PROPERTIES || []).slice(0, 6).map(p => (
                        <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 6, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" defaultChecked={["solano","aria"].includes(p.id)}/>
                          <div style={{ flex: 1 }}>{p.name}</div>
                          <span className="muted" style={{ fontSize: 11 }}>{p.pmc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Toggle label="Require MFA at first login" sub="Mandatory for Owner/Admin/Dispatcher · enforced by platform policy" value={data.mfaRequired} onChange={v => set("mfaRequired", v)} required/>
                {isFieldRole && <Toggle label="Order Checkr background check" sub="Industry-standard 7yr criminal · runs on consent · ~36h to clear" value={data.bgCheck} onChange={v => set("bgCheck", v)}/>}
                {isFieldRole && <Toggle label="Order 5-panel drug screen" sub="Required by Meridian Living, Red Rock, Solana Residential" value={data.drugScreen} onChange={v => set("drugScreen", v)}/>}
              </div>

              {isFieldRole && (
                <div className="card" style={{ marginTop: 18, padding: 14, background: "var(--surface-2)" }}>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Trade certifications to track</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["OSHA 10","OSHA 30","EPA 608","NATE","ESA Level 1","BICSI"].map(c => (
                      <span key={c} className="pill" style={{ background: "var(--surface)", color: "var(--text-2)", fontSize: 11 }}>{c}</span>
                    ))}
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>You'll be reminded to upload these after they accept.</div>
                </div>
              )}

              <div className="card" style={{ marginTop: 12, padding: 14, borderLeft: "3px solid var(--slateblue)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Estimated cost</div>
                  <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--bronze)" }}>${(data.bgCheck?32:0)+(data.drugScreen?48:0)}</div>
                </div>
                <div className="muted" style={{ fontSize: 11 }}>Charged to your platform account · billed against your monthly invoice.</div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="card" style={{ padding: 18, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 999, background: "var(--bronze)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{data.firstName[0]}{data.lastName[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{data.firstName} {data.lastName}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{data.email} · {data.phone || "no phone"}</div>
                  </div>
                  <span className="pill pill-bronze">{role.label}</span>
                </div>
                <ReviewRow l="Property scope" v={data.properties === "all" ? "All assigned" : data.properties === "pmc" ? "Specific PMCs" : "Per-property allow list"}/>
                {isFieldRole && <ReviewRow l="Trades" v={data.trades.map(t => tradeOptions.find(o => o.id === t)?.l).join(", ")}/>}
                <ReviewRow l="MFA required" v={data.mfaRequired ? "Yes" : "Optional"}/>
                {isFieldRole && <ReviewRow l="Background check" v={data.bgCheck ? "Checkr · ordered on consent" : "Skipped"}/>}
                {isFieldRole && <ReviewRow l="Drug screen" v={data.drugScreen ? "5-panel · ordered on consent" : "Skipped"}/>}
              </div>

              <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Invitation message</div>
              <textarea className="textarea" value={data.message} onChange={e => set("message", e.target.value)} style={{ minHeight: 80 }}/>
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={data.sendBranded} onChange={e => set("sendBranded", e.target.checked)}/>
                Send with Daedalus Trades branding (logo + signature)
              </label>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "var(--surface-2)" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
            <button className="btn btn-primary" onClick={next} disabled={step === 1 && !valid1}>{step < 4 ? "Continue" : "Send invitation"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : "auto" }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      {children}
    </label>
  );
}

function Toggle({ label, sub, value, onChange, required }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, border: "1px solid var(--line)", borderRadius: 8, cursor: required ? "default" : "pointer", background: "var(--surface)" }}>
      <button type="button" onClick={() => !required && onChange(!value)} style={{ width: 38, height: 22, borderRadius: 999, background: value ? "var(--bronze)" : "var(--surface-2)", border: "1px solid var(--line)", padding: 0, position: "relative", cursor: required ? "default" : "pointer", flexShrink: 0, marginTop: 1 }}>
        <span style={{ position: "absolute", top: 2, left: value ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: value ? "white" : "var(--text-3)", transition: "left 150ms var(--ease)" }}/>
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>{label}{required && <span className="pill" style={{ background: "var(--surface-2)", fontSize: 9, height: 16 }}>required</span>}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
      </div>
    </label>
  );
}

function ReviewRow({ l, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderBottom: "1px solid var(--line)" }}>
      <span className="muted">{l}</span>
      <span style={{ fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// INBOX (unchanged)
// ──────────────────────────────────────────────────────────────────────────
function Inbox() {
  const [active, setActive] = React.useState(0);
  const threads = [
    { wo: "WO-3041", who: "Sasha Whitfield (PM)", role: "Red Rock", last: "Are you submitting the bid today?", time: "12 min ago", unread: 2, channel: "in-app", avatar: "SW", color: "#A4577C" },
    { wo: "WO-3026", who: "Diego Martín (Maint)", role: "Solano Lofts", last: "Tech is on site now, watching the stream.", time: "1h ago", unread: 0, channel: "in-app", avatar: "DM", color: "#4A6378" },
    { wo: "WO-3038", who: "Maria Rodriguez (Resident)", role: "Aria · Unit 308", last: "Sí, confirmo — entrada el martes.", time: "3h ago", unread: 0, channel: "sms-es", avatar: "MR", color: "#B0463A" },
    { wo: "WO-3029", who: "Lila Tran (PM)", role: "Palomar Heights", last: "Approved the invoice. Net-30 starts today.", time: "Yesterday", unread: 0, channel: "email", avatar: "LT", color: "#7A8B4C" },
  ];
  const messages = [
    { who: "Sasha Whitfield", time: "Mon 9:14 AM", body: "Hey — got two competitive bids in for the gate operator. Need yours to compare. Can you submit by EOD?", side: "in" },
    { who: "Johnathan Marquez", time: "Mon 9:48 AM", body: "On it. Elena is finishing the AI estimate review. Will be in by 4pm.", side: "out" },
    { who: "Sasha Whitfield", time: "Mon 12:02 PM", body: "Are you submitting the bid today?", side: "in" },
  ];
  const t = threads[active];
  return (
    <div className="page" style={{ display: "grid", gridTemplateColumns: "360px 1fr", height: "100%" }}>
      <aside style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        <div style={{ padding: "20px 22px 14px", borderBottom: "1px solid var(--line)" }}>
          <h1 className="h-serif" style={{ fontSize: 24, margin: 0, fontWeight: 600 }}>Inbox</h1>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Threaded by work order · masked SMS · auto-translated</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {threads.map((th, i) => (
            <button key={th.wo + th.who} onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "14px 18px", border: 0, background: active === i ? "rgba(176,134,84,0.06)" : "transparent", borderLeft: active === i ? "3px solid var(--bronze)" : "3px solid transparent", borderBottom: "1px solid var(--line)", cursor: "pointer", display: "flex", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: th.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{th.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="mono" style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 600 }}>{th.wo}</span><span className="muted" style={{ fontSize: 10 }}>{th.time}</span></div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{th.who}</div>
                <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>{th.role}</div>
                <div className="muted" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{th.last}</div>
                {th.unread > 0 && <span className="pill" style={{ background: "var(--bronze)", color: "white", fontSize: 10, height: 16, marginTop: 4 }}>{th.unread} new</span>}
              </div>
            </button>
          ))}
        </div>
      </aside>
      <section style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--bronze)", fontWeight: 600 }}>{t.wo}</span>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{t.who}</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12, background: "var(--bg)" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.side === "out" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "65%" }}>
                <div className="muted" style={{ fontSize: 11, marginBottom: 4, textAlign: m.side === "out" ? "right" : "left" }}>{m.who} · {m.time}</div>
                <div style={{ padding: "10px 14px", borderRadius: 12, background: m.side === "out" ? "var(--bronze)" : "var(--surface)", color: m.side === "out" ? "white" : "var(--text)", border: m.side === "out" ? 0 : "1px solid var(--line)", fontSize: 13 }}>{m.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// REPORTS — expanded with executive KPIs, SLA, AR aging, drilldowns
// ──────────────────────────────────────────────────────────────────────────
function Reports() {
  const [range, setRange] = React.useState("90d");
  const [drill, setDrill] = React.useState(null);

  const kpis = [
    { l: "Revenue", v: "$65,510", sub: "+12% vs prior 90d", c: "var(--bronze)", trend: [12,18,15,22,19,28,32], drill: "revenue" },
    { l: "Gross margin", v: "31.2%", sub: "+1.4 pts vs prior", c: "var(--olive)", trend: [27,28,29,28,30,31,31], drill: "margin" },
    { l: "Jobs completed", v: "84", sub: "98% on-time", c: "var(--slateblue)", trend: [10,12,11,15,13,12,11], drill: "jobs" },
    { l: "Avg. response", v: "1h 47m", sub: "Urgent SLA: 2h", c: "var(--olive)", trend: [120,115,108,107,107,105,107], drill: "sla" },
    { l: "First-time fix", v: "94%", sub: "0 callbacks 90d", c: "var(--olive)", trend: [88,89,91,92,93,94,94], drill: "ftf" },
    { l: "DSO", v: "22 days", sub: "vs. 30 day terms", c: "var(--bronze)", trend: [28,27,26,25,24,23,22], drill: "dso" },
  ];

  const trades = [
    { k: "Access Control", v: 18420, jobs: 24, margin: 34, c: "var(--bronze)" },
    { k: "Low-Voltage", v: 14210, jobs: 19, margin: 32, c: "var(--bronze-bright)" },
    { k: "IoT", v: 9840, jobs: 12, margin: 36, c: "var(--olive)" },
    { k: "Gate", v: 7610, jobs: 8, margin: 28, c: "var(--slateblue)" },
    { k: "WiFi", v: 6240, jobs: 9, margin: 30, c: "var(--amber)" },
    { k: "Plumbing", v: 4910, jobs: 6, margin: 22, c: "var(--terracotta)" },
    { k: "Other", v: 4280, jobs: 6, margin: 24, c: "var(--text-3)" },
  ];
  const totalRev = trades.reduce((s, t) => s + t.v, 0);

  const aging = [
    { b: "Current", v: 8420, c: "var(--olive)", count: 6 },
    { b: "1–30", v: 4280, c: "var(--bronze)", count: 3 },
    { b: "31–60", v: 2240, c: "var(--amber)", count: 1 },
    { b: "61–90", v: 0, c: "var(--terracotta)", count: 0 },
    { b: "90+", v: 0, c: "var(--terracotta)", count: 0 },
  ];

  const slaData = [
    { l: "Emergency (4h)", on: 12, total: 12, c: "var(--olive)" },
    { l: "Urgent (24h)", on: 28, total: 29, c: "var(--olive)" },
    { l: "Routine (5d)", on: 41, total: 43, c: "var(--bronze)" },
  ];

  const pmcs = [
    { k: "Meridian Living", v: 22480, jobs: 28, score: 98, properties: 4 },
    { k: "Red Rock Capital", v: 18920, jobs: 22, score: 95, properties: 3 },
    { k: "Solana Residential", v: 14010, jobs: 18, score: 96, properties: 2 },
    { k: "Palmcrest", v: 10100, jobs: 16, score: 92, properties: 2 },
  ];

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Reports</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Executive view · {range === "90d" ? "Last 90 days" : range === "30d" ? "Last 30 days" : "Last 12 months"} · auto-refreshed nightly</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 8, padding: 2, background: "var(--surface)" }}>
            {[{k:"30d",l:"30d"},{k:"90d",l:"90d"},{k:"ytd",l:"YTD"},{k:"12m",l:"12mo"}].map(r => (
              <button key={r.k} onClick={() => setRange(r.k)} style={{ padding: "6px 12px", border: 0, borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, background: range === r.k ? "var(--bronze)" : "transparent", color: range === r.k ? "white" : "var(--text-2)" }}>{r.l}</button>
            ))}
          </div>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-secondary"><Icon name="schedule" size={14}/> Schedule email</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Custom report</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 22 }}>
        {kpis.map(k => (
          <button key={k.l} onClick={() => setDrill(k.drill)} className="card" style={{ padding: 14, borderTop: `2px solid ${k.c}`, textAlign: "left", cursor: "pointer", border: "1px solid var(--line)" }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{k.l}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, fontFamily: "var(--serif)", color: k.c }}>{k.v}</div>
            <div className="muted" style={{ fontSize: 10, marginTop: 2 }}>{k.sub}</div>
            <MiniSpark values={k.trend} color={k.c}/>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 className="h-serif" style={{ fontSize: 18, margin: 0 }}>Revenue & jobs over time</h3>
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 2, background: "var(--bronze)" }}/>Revenue</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 2, background: "var(--olive)" }}/>Jobs</div>
            </div>
          </div>
          <DualChart/>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 18px" }}>SLA compliance</h3>
          {slaData.map(s => {
            const pct = Math.round((s.on / s.total) * 100);
            return (
              <div key={s.l} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{s.l}</span>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: s.c }}>{pct}% · {s.on}/{s.total}</span>
                </div>
                <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: s.c, transition: "width 600ms var(--ease)" }}/>
                </div>
              </div>
            );
          })}
          <div className="muted" style={{ fontSize: 11, marginTop: 12, padding: 10, background: "var(--surface-2)", borderRadius: 6, lineHeight: 1.5 }}>
            <Icon name="info" size={11} color="var(--slateblue)"/> One urgent SLA miss in May (WO-3019) — <button className="link" style={{ background: 0, border: 0, color: "var(--bronze)", cursor: "pointer", fontWeight: 600, padding: 0, fontSize: 11 }}>view root cause</button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 18px" }}>Revenue by trade</h3>
          {trades.map(c => (
            <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ width: 130, fontSize: 13, fontWeight: 500 }}>{c.k}</div>
              <div style={{ flex: 1, height: 22, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${(c.v / totalRev) * 100 * 2}%`, height: "100%", background: c.c, display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 10, fontWeight: 600, color: "white", maxWidth: "100%" }}>{Math.round((c.v / totalRev) * 100)}%</div>
              </div>
              <div className="mono" style={{ width: 80, textAlign: "right", fontSize: 13, fontWeight: 600 }}>${c.v.toLocaleString()}</div>
              <div className="muted" style={{ width: 60, textAlign: "right", fontSize: 11 }}>{c.jobs} jobs</div>
              <div className="mono" style={{ width: 50, textAlign: "right", fontSize: 12, color: "var(--olive)" }}>{c.margin}%</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Top PMCs</h3>
          {pmcs.map(p => (
            <div key={p.k} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.k}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{p.properties} properties · {p.jobs} jobs</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>${p.v.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "var(--olive)" }}>{p.score} score</div>
                </div>
              </div>
              <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 999 }}><div style={{ width: `${(p.v / pmcs[0].v) * 100}%`, height: "100%", background: "var(--bronze)", borderRadius: 999 }}/></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 18px" }}>A/R aging</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, marginBottom: 12 }}>
            {aging.map(a => {
              const max = Math.max(...aging.map(x => x.v));
              const h = max ? (a.v / max) * 100 : 0;
              return (
                <div key={a.b} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                  <div className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{a.v ? `$${(a.v/1000).toFixed(1)}k` : "—"}</div>
                  <div style={{ width: "100%", height: `${h}%`, minHeight: a.v ? 4 : 0, background: a.c, borderRadius: "4px 4px 0 0" }}/>
                  <div style={{ fontSize: 11, fontWeight: 500 }}>{a.b}</div>
                  <div className="muted" style={{ fontSize: 10 }}>{a.count}</div>
                </div>
              );
            })}
          </div>
          <div className="muted" style={{ fontSize: 11, padding: 10, background: "var(--surface-2)", borderRadius: 6 }}>Total outstanding: <strong style={{ color: "var(--text)" }}>$14,940</strong> · 1 invoice eligible for factoring</div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 className="h-serif" style={{ fontSize: 18, margin: "0 0 14px" }}>Win rate by mode</h3>
          {[
            { l: "Direct award", won: 28, total: 28, c: "var(--olive)" },
            { l: "Competitive bid", won: 14, total: 22, c: "var(--bronze)" },
          ].map(m => {
            const pct = Math.round((m.won / m.total) * 100);
            return (
              <div key={m.l} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{m.l}</span>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{pct}% · {m.won}/{m.total}</span>
                </div>
                <div style={{ height: 10, background: "var(--surface-2)", borderRadius: 999 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: m.c, borderRadius: 999 }}/>
                </div>
              </div>
            );
          })}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
              <div className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Avg. bid size</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>$1,240</div>
            </div>
            <div style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
              <div className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Loss reasons</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Price (67%) · Schedule (33%)</div>
            </div>
          </div>
        </div>
      </div>

      {drill && <DrilldownModal kind={drill} onClose={() => setDrill(null)}/>}
    </div>
  );
}

function MiniSpark({ values, color }) {
  const w = 120, h = 28;
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginTop: 8 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" opacity="0.8"/>
    </svg>
  );
}

function DualChart() {
  const data = [
    { m: "Feb", r: 18, j: 22 }, { m: "Mar", r: 22, j: 26 }, { m: "Apr", r: 25, j: 24 },
    { m: "May", r: 31, j: 28 }, { m: "Jun", r: 28, j: 25 }, { m: "Jul", r: 35, j: 31 }, { m: "Aug", r: 38, j: 28 },
  ];
  const w = 600, h = 200, pad = 30;
  const maxR = Math.max(...data.map(d => d.r));
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const yR = h - pad - (d.r / maxR) * (h - 2 * pad);
    const yJ = h - pad - (d.j / maxR) * (h - 2 * pad);
    return { x, yR, yJ, ...d };
  });
  const pathR = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.yR}`).join(" ");
  const pathJ = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.yJ}`).join(" ");
  const areaR = `${pathR} L ${points[points.length-1].x} ${h-pad} L ${pad} ${h-pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="rgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bronze)" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="var(--bronze)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={pad} x2={w-pad} y1={pad + t * (h - 2*pad)} y2={pad + t * (h - 2*pad)} stroke="var(--line)" strokeDasharray="2 4"/>
      ))}
      <path d={areaR} fill="url(#rgrad)"/>
      <path d={pathR} fill="none" stroke="var(--bronze)" strokeWidth="2.5"/>
      <path d={pathJ} fill="none" stroke="var(--olive)" strokeWidth="2" strokeDasharray="4 3"/>
      {points.map(p => (
        <g key={p.m}>
          <circle cx={p.x} cy={p.yR} r="3" fill="var(--bronze)"/>
          <text x={p.x} y={h - 8} fontSize="10" textAnchor="middle" fill="var(--text-3)">{p.m}</text>
        </g>
      ))}
    </svg>
  );
}

function DrilldownModal({ kind, onClose }) {
  const titles = { revenue: "Revenue drilldown", margin: "Gross margin breakdown", jobs: "Jobs completed", sla: "SLA compliance", ftf: "First-time fix rate", dso: "Days sales outstanding" };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", padding: 30, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 720, padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="h-serif" style={{ fontSize: 20, fontWeight: 600 }}>{titles[kind]}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding: 22 }}>
          <div className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>Cross-tab view of {titles[kind].toLowerCase()} segmented by PMC, property, trade, and tech. In production this opens the custom report builder pre-filtered to the selected metric.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {["By PMC","By Property","By Trade","By Tech","By Job mode","By Source"].map(d => (
              <div key={d} className="card" style={{ padding: 14, background: "var(--surface-2)" }}>
                <div className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{d}</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Open in builder →</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// INTEGRATIONS — full hub with per-vendor config forms
// ──────────────────────────────────────────────────────────────────────────
const INTEGRATIONS = [
  // Property Management Systems
  { id: "yardi", name: "Yardi Voyager", logo: "Y", c: "#0066B2", category: "Property Management Systems", connected: true, syncedAgo: "4 min ago",
    docs: "https://www.yardi.com/products/voyager/",
    desc: "Sync property roster, work orders, tenant contacts, and vendor payables with Yardi Voyager.",
    fields: [
      { k: "endpoint", l: "Yardi WebServices URL", placeholder: "https://your-tenant.yardi.com/voyager7s/Webservices/", help: "Provided by your Yardi admin." },
      { k: "username", l: "Database username", placeholder: "DAEDALUS_API" },
      { k: "password", l: "Database password", type: "password" },
      { k: "database", l: "Database (SQL Server name)", placeholder: "live_yourpmc" },
      { k: "platform", l: "Platform", type: "select", options: ["SQL Server","Oracle"] },
      { k: "interfaceLicense", l: "Yardi Interface license #", help: "Required for outbound work-order push." },
    ],
    scopes: ["properties:read","tenants:read","work-orders:write","vendors:read","ap:write"],
  },
  { id: "realpage", name: "RealPage OneSite", logo: "RP", c: "#E36F1E", category: "Property Management Systems", connected: false, docs: "https://www.realpage.com/onesite-property-management/",
    desc: "Property roster + work order push to RealPage OneSite portfolios.",
    fields: [
      { k: "siteId", l: "Site ID" }, { k: "apiKey", l: "API key", type: "password" },
      { k: "region", l: "Region", type: "select", options: ["US-East","US-West","US-Central"] },
    ], scopes: ["properties:read","work-orders:write"] },
  { id: "entrata", name: "Entrata", logo: "E", c: "#1E8DCB", category: "Property Management Systems", connected: false, docs: "https://docs.entrata.com/",
    desc: "Two-way sync via Entrata's REST API.",
    fields: [
      { k: "tenantId", l: "Tenant ID" }, { k: "username", l: "API username" }, { k: "password", l: "API password", type: "password" },
    ], scopes: ["properties:read","leases:read","work-orders:write"] },
  { id: "appfolio", name: "AppFolio", logo: "AF", c: "#234B92", category: "Property Management Systems", connected: false, docs: "https://help.appfolio.com/s/article/AppFolio-API",
    desc: "Connect via AppFolio's reporting API + work-order webhooks.",
    fields: [
      { k: "clientId", l: "Client ID" }, { k: "clientSecret", l: "Client secret", type: "password" },
      { k: "subdomain", l: "AppFolio subdomain", placeholder: "yourpmc.appfolio.com" },
    ], scopes: ["properties:read","work-orders:write","tenants:read"] },
  { id: "resman", name: "ResMan", logo: "RM", c: "#0E7C7B", category: "Property Management Systems", connected: false, docs: "https://api.myresman.com/",
    desc: "Sync via ResMan's GraphQL API.",
    fields: [
      { k: "accountId", l: "Account ID" }, { k: "apiKey", l: "API key", type: "password" },
    ], scopes: ["properties:read","work-orders:write"] },
  { id: "buildium", name: "Buildium", logo: "B", c: "#3C8CBC", category: "Property Management Systems", connected: false, docs: "https://developer.buildium.com/",
    desc: "Connect via Buildium's Open API.",
    fields: [
      { k: "clientId", l: "Client ID" }, { k: "clientSecret", l: "Client secret", type: "password" },
    ], scopes: ["properties:read","work-orders:write"] },

  // Vendor Compliance
  { id: "netvendor", name: "NetVendor", logo: "NV", c: "#5C2D91", category: "Vendor Compliance", connected: true, syncedAgo: "1h ago · 12 docs", docs: "https://netvendor.net/",
    desc: "Push compliance documents (COIs, W-9, licenses) directly to PMC NetVendor accounts.",
    fields: [
      { k: "vendorAccountId", l: "Vendor account ID" }, { k: "apiToken", l: "API token", type: "password" },
      { k: "autoPush", l: "Auto-push new docs", type: "toggle", default: true },
    ], scopes: ["compliance-docs:write"] },
  { id: "compliancedepot", name: "Compliance Depot", logo: "CD", c: "#E36F1E", category: "Vendor Compliance", connected: true, syncedAgo: "1h ago · 8 docs", docs: "https://www.realpage.com/vendor-compliance/",
    desc: "RealPage Vendor Compliance — automatic COI sync.",
    fields: [
      { k: "vendorId", l: "Vendor ID" }, { k: "apiKey", l: "API key", type: "password" },
    ], scopes: ["compliance-docs:write"] },

  // Accounting
  { id: "quickbooks", name: "QuickBooks Online", logo: "Q", c: "#2CA01C", category: "Accounting", connected: true, syncedAgo: "23 min ago",
    docs: "https://developer.intuit.com/app/developer/qbo/docs/get-started",
    desc: "Two-way sync of customers, invoices, payments, and chart of accounts. Supports OAuth 2.0 and per-PMC cost-code mapping.",
    fields: [
      { k: "realmId", l: "Company / Realm ID", help: "Found in QuickBooks Settings → Account and Settings → Billing & Subscription" },
      { k: "oauthState", l: "OAuth status", type: "readonly", value: "Authorized · expires Aug 12, 2026" },
      { k: "incomeAccount", l: "Default income account", type: "select", options: ["Service Revenue","Maintenance Income","Job Income"] },
      { k: "apAccount", l: "A/P account for Daedalus fees", type: "select", options: ["Accounts Payable","Platform Fees","Trade Payables"] },
      { k: "syncDirection", l: "Sync direction", type: "select", options: ["Two-way (recommended)","Push only","Pull only"] },
      { k: "autoCreateCustomers", l: "Auto-create QBO customers from new PMCs", type: "toggle", default: true },
    ], scopes: ["accounting:read","accounting:write","payments:read"] },
  { id: "xero", name: "Xero", logo: "X", c: "#13B5EA", category: "Accounting", connected: false, docs: "https://developer.xero.com/",
    desc: "Two-way invoice + payment sync via Xero OAuth.",
    fields: [
      { k: "tenantId", l: "Xero tenant ID" }, { k: "oauthBtn", l: "Authorize Xero", type: "oauth", provider: "Xero" },
    ], scopes: ["accounting:read","accounting:write"] },
  { id: "netsuite", name: "NetSuite", logo: "NS", c: "#125CA0", category: "Accounting", connected: false, docs: "https://docs.oracle.com/en/cloud/saas/netsuite/",
    desc: "Enterprise-grade ERP integration via NetSuite SuiteTalk REST.",
    fields: [
      { k: "accountId", l: "Account ID" }, { k: "consumerKey", l: "Consumer key" }, { k: "consumerSecret", l: "Consumer secret", type: "password" },
      { k: "tokenId", l: "Token ID" }, { k: "tokenSecret", l: "Token secret", type: "password" },
    ], scopes: ["accounting:read","accounting:write","items:read"] },

  // Field & Operations
  { id: "checkr", name: "Checkr", logo: "Ch", c: "#3B6FF5", category: "Field & Operations", connected: true, syncedAgo: "10 active", docs: "https://docs.checkr.com/",
    desc: "Background checks for technicians. Per-PMC requirement matrix supported.",
    fields: [
      { k: "apiKey", l: "Checkr API key", type: "password" },
      { k: "package", l: "Default package", type: "select", options: ["driver_pro","essential","essential_criminal","tasker_standard"] },
      { k: "autoOrder", l: "Auto-order on new tech invite", type: "toggle", default: true },
      { k: "renewMonths", l: "Renew every N months", type: "number", default: 12 },
    ], scopes: ["candidates:write","reports:read"] },
  { id: "twilio", name: "Twilio", logo: "Tw", c: "#F22F46", category: "Field & Operations", connected: true, syncedAgo: "SMS · 142/mo",
    docs: "https://www.twilio.com/docs/messaging",
    desc: "Masked SMS for resident notifications, PTE confirmations, and tech ETAs. Number masking keeps tech and resident phones private.",
    fields: [
      { k: "accountSid", l: "Account SID", placeholder: "AC..." },
      { k: "authToken", l: "Auth token", type: "password" },
      { k: "messagingService", l: "Messaging Service SID", placeholder: "MG...", help: "Use a Messaging Service for number pooling and proxy." },
      { k: "fromNumber", l: "Default sender number", placeholder: "+16025551234" },
      { k: "statusWebhook", l: "Status webhook URL", type: "readonly", value: "https://api.daedalus.pro/webhooks/twilio/status" },
      { k: "enableProxy", l: "Use Twilio Proxy for resident ↔ tech masking", type: "toggle", default: true },
      { k: "smsLanguages", l: "Supported languages", type: "multiselect", options: ["English","Spanish","Vietnamese","Chinese"] },
    ], scopes: ["messages:send","proxy:create","numbers:manage"] },
  { id: "stripe", name: "Stripe", logo: "S", c: "#635BFF", category: "Field & Operations", connected: true, syncedAgo: "Payouts active",
    docs: "https://stripe.com/docs/connect",
    desc: "Stripe Connect for vendor payouts, ACH debits from PMCs, and factoring advances.",
    fields: [
      { k: "publishableKey", l: "Publishable key", placeholder: "pk_live_..." },
      { k: "secretKey", l: "Secret key", type: "password", placeholder: "sk_live_..." },
      { k: "webhookSecret", l: "Webhook signing secret", type: "password", placeholder: "whsec_..." },
      { k: "connectedAccount", l: "Connected account ID", type: "readonly", value: "acct_1Q9z2Jdaedalus · Daedalus Trades & Tech" },
      { k: "payoutSchedule", l: "Payout schedule", type: "select", options: ["Daily (T+2)","Weekly","Monthly"] },
      { k: "currency", l: "Settlement currency", type: "select", options: ["USD","CAD","MXN"] },
    ], scopes: ["charges:write","transfers:write","payouts:read","accounts:read"] },
  { id: "plaid", name: "Plaid", logo: "P", c: "#000", category: "Field & Operations", connected: true, syncedAgo: "Bank verified",
    docs: "https://plaid.com/docs/",
    desc: "Bank account verification and financial-health signal for vendor scoring.",
    fields: [
      { k: "clientId", l: "Plaid client ID" },
      { k: "secret", l: "Secret (per environment)", type: "password" },
      { k: "env", l: "Environment", type: "select", options: ["Sandbox","Development","Production"] },
      { k: "products", l: "Enabled products", type: "multiselect", options: ["auth","identity","assets","transactions","income"] },
      { k: "linkToken", l: "Link token rotation", type: "select", options: ["Per-session (recommended)","Static"] },
      { k: "redirectUri", l: "OAuth redirect URI", type: "readonly", value: "https://app.daedalus.pro/integrations/plaid/return" },
    ], scopes: ["auth","identity","assets:read","transactions:read"] },
  { id: "docusign", name: "DocuSign", logo: "DS", c: "#FFCC00", category: "Field & Operations", connected: false,
    docs: "https://developers.docusign.com/",
    desc: "Electronic signatures for lien waivers, MSAs, change orders, and customer sign-offs.",
    fields: [
      { k: "accountId", l: "DocuSign account ID" },
      { k: "userId", l: "Impersonated user GUID", help: "Service-account user used for JWT auth." },
      { k: "integrationKey", l: "Integration key (Client ID)" },
      { k: "rsaPrivateKey", l: "RSA private key", type: "password", help: "PEM-formatted; used for JWT grant." },
      { k: "baseUri", l: "Base URI", type: "select", options: ["https://demo.docusign.net/restapi","https://www.docusign.net/restapi","https://eu.docusign.net/restapi"] },
      { k: "templateLien", l: "Lien waiver template ID" },
      { k: "templateChangeOrder", l: "Change order template ID" },
      { k: "webhookUrl", l: "Connect webhook", type: "readonly", value: "https://api.daedalus.pro/webhooks/docusign" },
    ], scopes: ["signature","impersonation"] },
  { id: "sendgrid", name: "SendGrid", logo: "SG", c: "#1A82E2", category: "Field & Operations", connected: false,
    docs: "https://docs.sendgrid.com/",
    desc: "Transactional email for invitations, invoices, statements, and resident notifications.",
    fields: [
      { k: "apiKey", l: "API key", type: "password", placeholder: "SG..." },
      { k: "fromEmail", l: "From address", placeholder: "no-reply@daedalus.pro" },
      { k: "fromName", l: "From name", placeholder: "Daedalus Pro" },
      { k: "domainVerified", l: "Domain authentication", type: "readonly", value: "daedalus.pro · SPF + DKIM verified" },
      { k: "ipPool", l: "IP pool", type: "select", options: ["Shared","Dedicated · transactional","Dedicated · marketing"] },
    ], scopes: ["mail.send","sender_verification"] },
  { id: "avalara", name: "Avalara AvaTax", logo: "Av", c: "#FF6F00", category: "Field & Operations", connected: false,
    docs: "https://developer.avalara.com/",
    desc: "Sales tax calculation per jurisdiction on labor and materials.",
    fields: [
      { k: "accountId", l: "Account ID" }, { k: "licenseKey", l: "License key", type: "password" },
      { k: "companyCode", l: "Company code" },
      { k: "env", l: "Environment", type: "select", options: ["Sandbox","Production"] },
    ], scopes: ["tax:calculate","tax:commit"] },
  { id: "googlemaps", name: "Google Maps Platform", logo: "GM", c: "#4285F4", category: "Field & Operations", connected: true, syncedAgo: "API active",
    docs: "https://developers.google.com/maps/documentation",
    desc: "Geocoding for property addresses, routing for tech ETAs, and distance matrix for AI matching.",
    fields: [
      { k: "apiKey", l: "API key (server-side)", type: "password", placeholder: "AIza..." },
      { k: "mapsId", l: "Map ID (vector styles)", placeholder: "Optional · for branded maps" },
      { k: "enabledApis", l: "Enabled APIs", type: "multiselect", options: ["Geocoding","Directions","Distance Matrix","Maps JavaScript","Places","Roads"] },
      { k: "billingProject", l: "GCP billing project ID", help: "Daedalus consolidates billing under one project per tenant." },
      { k: "monthlyBudget", l: "Monthly budget cap (USD)", type: "number", default: 800 },
    ], scopes: ["maps.read","geocoding","routes"] },

  // Supplier Catalogs
  { id: "hdsupply", name: "HD Supply", logo: "HD", c: "#F96302", category: "Supplier Catalogs", connected: false, docs: "https://hdsupplysolutions.com/",
    desc: "Live catalog and parts ordering through your HD Supply Solutions account.",
    fields: [
      { k: "accountNumber", l: "HD Supply account number" }, { k: "punchoutUrl", l: "PunchOut URL" },
      { k: "username", l: "Username" }, { k: "password", l: "Password", type: "password" },
    ], scopes: ["catalog:read","orders:write"] },
  { id: "ferguson", name: "Ferguson", logo: "Fe", c: "#F58220", category: "Supplier Catalogs", connected: false, docs: "https://www.ferguson.com/",
    desc: "Plumbing and HVAC parts catalog.",
    fields: [{ k: "customerNumber", l: "Customer number" }, { k: "apiKey", l: "API key", type: "password" }], scopes: ["catalog:read","orders:write"] },
  { id: "wilmar", name: "Wilmar", logo: "W", c: "#005BAC", category: "Supplier Catalogs", connected: false, docs: "https://wilmar.com/",
    desc: "Multifamily MRO supplies.",
    fields: [{ k: "accountId", l: "Wilmar account ID" }, { k: "apiKey", l: "API key", type: "password" }], scopes: ["catalog:read","orders:write"] },
  { id: "homedepotpro", name: "Home Depot Pro", logo: "HDP", c: "#F96302", category: "Supplier Catalogs", connected: false, docs: "https://www.homedepot.com/c/Pro_Xtra",
    desc: "Pro Xtra catalog and bulk ordering.",
    fields: [{ k: "proXtraId", l: "Pro Xtra account ID" }, { k: "apiKey", l: "API key", type: "password" }], scopes: ["catalog:read","orders:write"] },
];

function Integrations() {
  const [openId, setOpenId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  const filtered = INTEGRATIONS.filter(i => {
    if (filter === "connected" && !i.connected) return false;
    if (filter === "available" && i.connected) return false;
    if (search && !`${i.name} ${i.category} ${i.desc}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const grouped = filtered.reduce((acc, i) => { (acc[i.category] = acc[i.category] || []).push(i); return acc; }, {});

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Integrations Hub</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Connect once, sync forever. Daedalus absorbs the cost of vendor compliance services.</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input className="input" placeholder="Search integrations…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }}/>
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 8, padding: 2, background: "var(--surface)" }}>
            {[{k:"all",l:"All"},{k:"connected",l:"Connected"},{k:"available",l:"Available"}].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: "6px 12px", border: 0, borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, background: filter === f.k ? "var(--bronze)" : "transparent", color: filter === f.k ? "white" : "var(--text-2)" }}>{f.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { l: "Connected", v: INTEGRATIONS.filter(i => i.connected).length, c: "var(--olive)" },
          { l: "Available", v: INTEGRATIONS.filter(i => !i.connected).length, c: "var(--bronze)" },
          { l: "Active syncs", v: "1.2k/day", c: "var(--slateblue)" },
          { l: "Sync errors (24h)", v: "0", c: "var(--olive)" },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: 14, borderTop: `2px solid ${s.c}` }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{s.l}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, color: s.c, fontFamily: "var(--serif)" }}>{s.v}</div>
          </div>
        ))}
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 26 }}>
          <h3 className="h-serif" style={{ fontSize: 17, margin: "0 0 10px", fontWeight: 600 }}>{cat} <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>· {items.length}</span></h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {items.map(it => (
              <div key={it.id} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, border: it.connected ? "1px solid rgba(122,139,76,0.3)" : "1px solid var(--line)", background: it.connected ? "rgba(122,139,76,0.04)" : "var(--surface)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: it.c, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{it.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {it.connected && <span style={{ color: "var(--olive)", marginRight: 4 }}>●</span>}
                    {it.connected ? it.syncedAgo : "Available"}
                  </div>
                </div>
                <button className={`btn ${it.connected ? "btn-ghost" : "btn-secondary"} btn-sm`} onClick={() => setOpenId(it.id)}>{it.connected ? "Manage" : "Connect"}</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {openId && <IntegrationConfigModal integration={INTEGRATIONS.find(i => i.id === openId)} onClose={() => setOpenId(null)}/>}
    </div>
  );
}

function IntegrationConfigModal({ integration: it, onClose }) {
  const [tab, setTab] = React.useState("config");
  const [values, setValues] = React.useState({});
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }));

  const save = () => {
    window.toast?.({ kind: "success", title: `${it.name} saved`, msg: it.connected ? "Configuration updated" : "Connection initialized" });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 30, overflowY: "auto", animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 740, padding: 0, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: it.c, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{it.logo}</div>
          <div style={{ flex: 1 }}>
            <div className="h-serif" style={{ fontSize: 22, fontWeight: 600 }}>{it.name}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{it.category} · <a href={it.docs} target="_blank" rel="noreferrer" style={{ color: "var(--bronze)", textDecoration: "none" }}>API docs ↗</a></div>
          </div>
          {it.connected ? <span className="pill pill-success">● Connected</span> : <span className="pill" style={{ background: "var(--surface-2)" }}>Available</span>}
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ marginLeft: 8 }}><Icon name="x" size={14}/></button>
        </div>

        <div style={{ padding: "0 24px", borderBottom: "1px solid var(--line)", display: "flex", gap: 4, flexShrink: 0 }}>
          {[{k:"config",l:"Configuration"},{k:"mapping",l:"Field mapping"},{k:"health",l:"Sync health"},{k:"scopes",l:"Scopes & security"}].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ padding: "12px 14px", border: 0, background: "transparent", borderBottom: tab === t.k ? "2px solid var(--bronze)" : "2px solid transparent", color: tab === t.k ? "var(--bronze)" : "var(--text-2)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>{t.l}</button>
          ))}
        </div>

        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {tab === "config" && (
            <>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 18, padding: 14, background: "var(--surface-2)", borderRadius: 8, borderLeft: "3px solid var(--bronze)" }}>{it.desc}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {it.fields.map(f => <ConfigField key={f.k} f={f} value={values[f.k]} onChange={v => set(f.k, v)}/>)}
              </div>

              {it.id === "twilio" && (
                <div className="card" style={{ marginTop: 16, padding: 14, background: "var(--surface-2)" }}>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Test SMS</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="input" placeholder="+1..." style={{ flex: 1 }}/>
                    <button className="btn btn-secondary" onClick={() => window.toast?.({ kind: "success", title: "Test SMS queued", msg: "Should arrive within 30s" })}>Send test</button>
                  </div>
                </div>
              )}
              {it.id === "stripe" && (
                <div className="card" style={{ marginTop: 16, padding: 14, background: "var(--surface-2)" }}>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Connect onboarding</div>
                  <button className="btn btn-secondary" onClick={() => window.toast?.({ kind: "info", title: "Stripe Express link copied", msg: "Send to vendor for KYC" })}>Generate Express onboarding link</button>
                </div>
              )}
              {it.id === "plaid" && (
                <div className="card" style={{ marginTop: 16, padding: 14, background: "var(--surface-2)" }}>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Linked accounts (1)</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, background: "var(--surface)", borderRadius: 6 }}>
                    <div><div style={{ fontSize: 13, fontWeight: 600 }}>Wells Fargo · Business Checking</div><div className="muted" style={{ fontSize: 11 }}>•••2418 · linked Apr 14</div></div>
                    <button className="btn btn-ghost btn-sm">Re-verify</button>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "mapping" && (
            <div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Map Daedalus fields to {it.name} fields.</div>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead style={{ fontSize: 11, textTransform: "uppercase", color: "var(--text-3)", letterSpacing: "0.05em" }}>
                  <tr><th style={{ textAlign: "left", padding: "8px 0" }}>Daedalus</th><th></th><th style={{ textAlign: "left", padding: "8px 0" }}>{it.name}</th></tr>
                </thead>
                <tbody>
                  {[
                    ["Property", "→", "Property ID"],
                    ["Work order #", "→", "Service request ID"],
                    ["Trade", "→", "Category"],
                    ["Tech", "→", "Vendor user"],
                    ["Cost code", "→", "GL account"],
                    ["Invoice total", "→", "AP amount"],
                  ].map(([a,b,c]) => (
                    <tr key={a} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "10px 0" }}>{a}</td>
                      <td style={{ padding: "10px 8px", color: "var(--text-3)" }}>{b}</td>
                      <td style={{ padding: "10px 0" }}><select className="input" style={{ height: 32 }}><option>{c}</option></select></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "health" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                {[{l:"Last sync",v:it.connected?it.syncedAgo:"—",c:"var(--olive)"},{l:"24h success",v:it.connected?"99.7%":"—",c:"var(--olive)"},{l:"Errors today",v:"0",c:"var(--olive)"}].map(s => (
                  <div key={s.l} style={{ padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
                    <div className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.l}</div>
                    <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="muted" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Recent events</div>
              <div style={{ fontSize: 12, fontFamily: "var(--mono)", background: "var(--obsidian)", color: "#e8e3d6", padding: 14, borderRadius: 8, maxHeight: 220, overflowY: "auto" }}>
                <div>2026-05-06 09:14:22  INFO   sync.{it.id}.outbound  rows=18 ms=412</div>
                <div>2026-05-06 09:10:00  INFO   sync.{it.id}.inbound   rows=2  ms=88</div>
                <div>2026-05-06 09:00:00  INFO   sync.{it.id}.heartbeat ok</div>
                <div>2026-05-06 08:54:41  INFO   sync.{it.id}.outbound  rows=4  ms=210</div>
                <div>2026-05-06 08:30:00  INFO   sync.{it.id}.inbound   rows=0  ms=42</div>
              </div>
            </div>
          )}

          {tab === "scopes" && (
            <div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Daedalus requests only the scopes required to deliver the integration. You can revoke access at any time.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(it.scopes || []).map(s => (
                  <div key={s} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, background: "var(--surface-2)" }}>
                    <Icon name="shield" size={14} color="var(--olive)"/>
                    <div className="mono" style={{ fontSize: 12, flex: 1 }}>{s}</div>
                    <span className="pill pill-success" style={{ fontSize: 10 }}>Granted</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ marginTop: 14, padding: 14, borderLeft: "3px solid var(--terracotta)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Disconnect this integration</div>
                <div className="muted" style={{ fontSize: 11, marginBottom: 8 }}>Revokes credentials, stops syncing, and deletes mapping after 30 days.</div>
                <button className="btn btn-secondary btn-sm" style={{ color: "var(--terracotta)", borderColor: "var(--terracotta)" }}>Disconnect</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "var(--surface-2)" }}>
          <div className="muted" style={{ fontSize: 11 }}>Encrypted at rest · scoped per tenant · audit-logged</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-secondary" onClick={() => window.toast?.({ kind: "info", title: "Test connection", msg: "Round-trip succeeded in 412ms" })}>Test connection</button>
            <button className="btn btn-primary" onClick={save}>{it.connected ? "Save changes" : "Connect"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigField({ f, value, onChange }) {
  const v = value ?? f.value ?? f.default ?? "";
  return (
    <label style={{ display: "block" }}>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5 }}>
        {f.l}{f.type === "password" && <span style={{ marginLeft: 6, color: "var(--bronze)" }}>· encrypted</span>}
      </div>
      {f.type === "select" ? (
        <select className="input" value={v} onChange={e => onChange(e.target.value)} style={{ width: "100%" }}>
          {f.options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : f.type === "multiselect" ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: 10, border: "1px solid var(--line)", borderRadius: 6, background: "var(--surface)" }}>
          {f.options.map(o => {
            const arr = Array.isArray(v) ? v : [];
            const on = arr.includes(o);
            return <button key={o} type="button" onClick={() => onChange(on ? arr.filter(x => x !== o) : [...arr, o])} className="pill" style={{ background: on ? "var(--bronze)" : "var(--surface-2)", color: on ? "white" : "var(--text-2)", border: 0, cursor: "pointer", fontSize: 11 }}>{on && "✓ "}{o}</button>;
          })}
        </div>
      ) : f.type === "toggle" ? (
        <button type="button" onClick={() => onChange(!v)} style={{ width: 38, height: 22, borderRadius: 999, background: v ? "var(--bronze)" : "var(--surface-2)", border: "1px solid var(--line)", padding: 0, position: "relative", cursor: "pointer" }}>
          <span style={{ position: "absolute", top: 2, left: v ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: v ? "white" : "var(--text-3)" }}/>
        </button>
      ) : f.type === "readonly" ? (
        <div className="mono" style={{ padding: "9px 12px", background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 6, fontSize: 12, color: "var(--text-2)" }}>{v}</div>
      ) : f.type === "oauth" ? (
        <button type="button" className="btn btn-secondary" style={{ width: "100%" }}>Authorize {f.provider}</button>
      ) : (
        <input className="input" type={f.type || "text"} value={v} onChange={e => onChange(e.target.value)} placeholder={f.placeholder} style={{ width: "100%" }}/>
      )}
      {f.help && <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{f.help}</div>}
    </label>
  );
}

window.Schedule = Schedule;
window.Team = Team;
window.Inbox = Inbox;
window.Reports = Reports;
window.Integrations = Integrations;
window.InviteMemberModal = InviteMemberModal;
