// Apply as Contractor — full GC application wizard, meshed with the existing
// Onboarding (post-submission tracker). The wizard collects: company info,
// service area, trades, licensing, insurance, docs, team, background auth,
// references, pricing acknowledgment, and submission.
//
// Two surfaces in this file:
//   <ApplyContractor onClose onSubmit />   — full-screen wizard (pre-account)
//   Onboarding (revised)                    — post-submission tracker; checklist
//   The original Onboarding stays exported as `Onboarding`. Apply wizard is
//   `ApplyContractor`. App.jsx routes both.

const TRADES = [
  "Access Control","Low-Voltage","IoT Installer","Locksmith","Gate Tech",
  "WiFi / Networking","Electrical","Plumbing","HVAC","Fire / Life-Safety",
  "Camera / CCTV","Lighting","Pool Equipment","Gym Equipment","General Contractor",
];

const LICENSES = [
  { code: "AZ ROC KB-2",  name: "Dual Licensed (Residential + Commercial)" },
  { code: "AZ ROC CR-67", name: "Low Voltage Communications" },
  { code: "EPA 608",      name: "Refrigerant Universal" },
  { code: "OSHA 30",      name: "Construction" },
  { code: "BICSI",        name: "Installer 1 / 2" },
];

function ApplyContractor({ onClose, onSubmit }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    legal: "Daedalus Trades & Technology, LLC",
    dba: "Daedalus",
    ein: "87-2349911",
    structure: "LLC",
    founded: "2019",
    headcount: 24,
    hubs: ["Phoenix","Scottsdale","Tempe","Mesa"],
    radius: 35,
    trades: ["Access Control","Low-Voltage","IoT Installer","WiFi / Networking","Locksmith","Gate Tech"],
    licenses: ["AZ ROC KB-2","AZ ROC CR-67"],
    glLimit: 2_000_000,
    umbrella: 5_000_000,
    docs: { coi: true, w9: true, license: true, bond: true, articles: false },
    team: 10,
    bgAuth: true,
    refs: [
      { name: "Marcus Greene",  pmc: "Meridian Living",     email: "m.greene@meridian.com",   sent: true,  replied: true  },
      { name: "Lila Tran",      pmc: "Red Rock Capital",    email: "l.tran@redrock.com",      sent: true,  replied: true  },
      { name: "Diego Martín",   pmc: "Solana Residential",  email: "d.martin@solana.com",     sent: true,  replied: true  },
      { name: "Heather Quinn",  pmc: "Palmcrest Properties",email: "h.quinn@palmcrest.com",   sent: true,  replied: false },
      { name: "Sasha Whitfield",pmc: "Meridian Living",     email: "s.whitfield@meridian.com",sent: false, replied: false },
    ],
    pricingAck: false,
  });

  const steps = [
    { key: "company",   label: "Company",     icon: "file" },
    { key: "service",   label: "Service Area",icon: "location" },
    { key: "trades",    label: "Trades",      icon: "settings" },
    { key: "licensing", label: "Licensing",   icon: "shield" },
    { key: "insurance", label: "Insurance",   icon: "compliance" },
    { key: "docs",      label: "Documents",   icon: "upload" },
    { key: "team",      label: "Team",        icon: "users" },
    { key: "checks",    label: "Background",  icon: "user" },
    { key: "refs",      label: "References",  icon: "mail" },
    { key: "pricing",   label: "Pricing",     icon: "money" },
    { key: "review",    label: "Review",      icon: "check" },
  ];

  const upd = (patch) => setData(d => ({ ...d, ...patch }));

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 500, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ height: 60, padding: "0 28px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)" }}>
        <DaedalusMark size={26}/>
        <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>Daedalus<span style={{ color: "var(--bronze)" }}> Pro</span></div>
        <div style={{ width: 1, height: 22, background: "var(--line)" }}/>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Contractor application</div>
        <div className="spacer"/>
        <div className="muted" style={{ fontSize: 12 }}>Saved · auto-resumes if you close</div>
        <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon name="x" size={14}/> Save & exit</button>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Stepper */}
        <aside style={{ width: 260, borderRight: "1px solid var(--line)", padding: "22px 18px", overflowY: "auto", background: "var(--surface-2)" }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Application</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {steps.map((s, i) => {
              const done = i < step, active = i === step;
              return (
                <button key={s.key} onClick={() => setStep(i)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                  background: active ? "var(--surface)" : "transparent", border: 0,
                  borderRadius: 8, cursor: "pointer", textAlign: "left", color: "var(--text)",
                  boxShadow: active ? "var(--shadow-sm)" : "none",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                    background: done ? "var(--olive)" : active ? "var(--bronze)" : "var(--surface-3)",
                    color: done || active ? "white" : "var(--text-3)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                  }}>{done ? <Icon name="check" size={11} strokeWidth={2.5}/> : i + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 500, color: active ? "var(--text)" : done ? "var(--text-2)" : "var(--text-3)" }}>{s.label}</div>
                  {active && <Icon name="chevRight" size={12} color="var(--bronze)"/>}
                </button>
              );
            })}
          </div>
          <div className="muted" style={{ fontSize: 11, marginTop: 18, padding: 10, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--line)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-2)" }}>Average review time:</strong><br/>5–7 business days after submission.
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 56px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Step {step + 1} of {steps.length}
            </div>
            <h1 className="h-serif" style={{ fontSize: 30, margin: "4px 0 28px", fontWeight: 600 }}>
              {{
                company: "Tell us about your company",
                service: "Where do you work?",
                trades: "What trades are you expert in?",
                licensing: "Licenses & certifications",
                insurance: "Insurance coverage",
                docs: "Upload documents",
                team: "Team roster",
                checks: "Background & drug screen",
                refs: "Client references",
                pricing: "Pricing acknowledgment",
                review: "Review & submit",
              }[steps[step].key]}
            </h1>

            {steps[step].key === "company"   && <StepCompany data={data} upd={upd}/>}
            {steps[step].key === "service"   && <StepService data={data} upd={upd}/>}
            {steps[step].key === "trades"    && <StepTrades data={data} upd={upd}/>}
            {steps[step].key === "licensing" && <StepLicensing data={data} upd={upd}/>}
            {steps[step].key === "insurance" && <StepInsurance data={data} upd={upd}/>}
            {steps[step].key === "docs"      && <StepDocs data={data} upd={upd}/>}
            {steps[step].key === "team"      && <StepTeam data={data} upd={upd}/>}
            {steps[step].key === "checks"    && <StepChecks data={data} upd={upd}/>}
            {steps[step].key === "refs"      && <StepRefs data={data} upd={upd}/>}
            {steps[step].key === "pricing"   && <StepPricing data={data} upd={upd}/>}
            {steps[step].key === "review"    && <StepReview data={data}/>}

            {/* footer nav */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
              <button onClick={prev} className="btn btn-secondary" disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
                <Icon name="chevLeft" size={12}/> Back
              </button>
              {step < steps.length - 1 ? (
                <button onClick={next} className="btn btn-primary">Continue <Icon name="chevRight" size={12}/></button>
              ) : (
                <button onClick={() => onSubmit?.(data)} className="btn btn-primary btn-lg">
                  <Icon name="sparkles" size={14}/> Submit application
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// — steps —
function L({ children }) { return <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", display: "block", marginBottom: 6 }}>{children}</label>; }
function FieldGrid({ children, cols = 2 }) { return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 14, marginBottom: 14 }}>{children}</div>; }

function StepCompany({ data, upd }) {
  return (
    <div>
      <FieldGrid cols={2}>
        <div><L>Legal name</L><input className="input" value={data.legal} onChange={e => upd({ legal: e.target.value })}/></div>
        <div><L>DBA</L><input className="input" value={data.dba} onChange={e => upd({ dba: e.target.value })}/></div>
      </FieldGrid>
      <FieldGrid cols={3}>
        <div><L>EIN</L><input className="input mono" value={data.ein} onChange={e => upd({ ein: e.target.value })}/></div>
        <div><L>Structure</L>
          <select className="select" value={data.structure} onChange={e => upd({ structure: e.target.value })}>
            <option>LLC</option><option>S-Corp</option><option>C-Corp</option><option>Sole Prop</option>
          </select>
        </div>
        <div><L>Year founded</L><input className="input" value={data.founded} onChange={e => upd({ founded: e.target.value })}/></div>
      </FieldGrid>
      <div><L>Headcount</L><input type="number" className="input" value={data.headcount} onChange={e => upd({ headcount: +e.target.value })}/></div>
    </div>
  );
}

function StepService({ data, upd }) {
  const ALL = ["Phoenix","Scottsdale","Tempe","Mesa","Chandler","Glendale","Gilbert","Surprise","Peoria","Goodyear"];
  const toggle = h => upd({ hubs: data.hubs.includes(h) ? data.hubs.filter(x => x !== h) : [...data.hubs, h] });
  return (
    <div>
      <L>Service hubs (Phoenix metro)</L>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {ALL.map(h => (
          <button key={h} onClick={() => toggle(h)} className={`btn btn-sm ${data.hubs.includes(h) ? "btn-primary" : "btn-secondary"}`}>{h}</button>
        ))}
      </div>
      <L>Radius from HQ — {data.radius} mi</L>
      <input type="range" min="5" max="100" value={data.radius} onChange={e => upd({ radius: +e.target.value })} style={{ width: "100%", accentColor: "var(--bronze)" }}/>
      <div className="card" style={{ marginTop: 16, padding: 0, height: 220, overflow: "hidden", position: "relative", background: "linear-gradient(180deg, #EDE5D2 0%, #E0D4B8 100%)" }}>
        {/* Stylized service area map */}
        <svg width="100%" height="100%" viewBox="0 0 600 220" style={{ display: "block" }}>
          <defs>
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M-1 7L7 -1M5 9L9 5" stroke="rgba(176,134,84,0.18)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="600" height="220" fill="url(#hatch)"/>
          <circle cx="300" cy="110" r={data.radius * 1.6} fill="rgba(176,134,84,0.16)" stroke="var(--bronze)" strokeWidth="1.5" strokeDasharray="4 3"/>
          {[
            ["Phoenix",300,110],["Scottsdale",380,90],["Tempe",340,150],["Mesa",420,150],
            ["Chandler",380,180],["Glendale",230,90],["Gilbert",420,180],["Peoria",200,60],
          ].map(([n,x,y]) => (
            <g key={n}>
              <circle cx={x} cy={y} r="3" fill={data.hubs.includes(n) ? "var(--bronze)" : "rgba(31,35,41,0.3)"}/>
              <text x={x+6} y={y+3} fontSize="10" fill={data.hubs.includes(n) ? "var(--text)" : "var(--text-3)"} fontWeight="600">{n}</text>
            </g>
          ))}
          <g transform="translate(300 110)">
            <circle r="6" fill="var(--bronze)"/>
            <circle r="10" fill="none" stroke="var(--bronze)" strokeWidth="1.5"/>
          </g>
        </svg>
      </div>
    </div>
  );
}

function StepTrades({ data, upd }) {
  const toggle = t => upd({ trades: data.trades.includes(t) ? data.trades.filter(x => x !== t) : [...data.trades, t] });
  return (
    <div>
      <L>Select all trades you perform — depth shown after selection</L>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {TRADES.map(t => {
          const on = data.trades.includes(t);
          return (
            <button key={t} onClick={() => toggle(t)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
              background: on ? "rgba(176,134,84,0.10)" : "var(--surface)",
              border: `1px solid ${on ? "var(--bronze)" : "var(--line)"}`,
              color: "var(--text)", cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: on ? "var(--bronze)" : "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {on && <Icon name="check" size={11} color="white" strokeWidth={3}/>}
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: on ? 600 : 500 }}>{t}</div>
              {on && <select className="select" style={{ height: 28, fontSize: 11, width: 110, padding: "0 8px" }}>
                <option>Expert</option><option>Proficient</option><option>Familiar</option>
              </select>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepLicensing({ data, upd }) {
  const toggle = c => upd({ licenses: data.licenses.includes(c) ? data.licenses.filter(x => x !== c) : [...data.licenses, c] });
  return (
    <div>
      <L>Licenses & certifications you hold</L>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LICENSES.map(l => {
          const on = data.licenses.includes(l.code);
          return (
            <div key={l.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, border: `1px solid ${on ? "var(--bronze)" : "var(--line)"}`, background: on ? "rgba(176,134,84,0.06)" : "var(--surface)" }}>
              <input type="checkbox" checked={on} onChange={() => toggle(l.code)} style={{ accentColor: "var(--bronze)" }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.code}</div>
                <div className="muted" style={{ fontSize: 11 }}>{l.name}</div>
              </div>
              {on && <button className="btn btn-secondary btn-sm"><Icon name="upload" size={11}/> Upload</button>}
              {on && <span className="pill pill-success"><span className="dot"/>Auto-verified</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepInsurance({ data, upd }) {
  return (
    <div>
      <FieldGrid cols={2}>
        <div><L>General Liability — Aggregate</L>
          <select className="select" value={data.glLimit} onChange={e => upd({ glLimit: +e.target.value })}>
            <option value={1_000_000}>$1,000,000</option>
            <option value={2_000_000}>$2,000,000</option>
            <option value={5_000_000}>$5,000,000</option>
          </select>
        </div>
        <div><L>Umbrella</L>
          <select className="select" value={data.umbrella} onChange={e => upd({ umbrella: +e.target.value })}>
            <option value={0}>None</option>
            <option value={1_000_000}>$1,000,000</option>
            <option value={5_000_000}>$5,000,000</option>
            <option value={10_000_000}>$10,000,000</option>
          </select>
        </div>
      </FieldGrid>
      <div style={{ background: "rgba(122,139,76,0.08)", border: "1px solid rgba(122,139,76,0.3)", borderRadius: 10, padding: 14, marginTop: 8 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="check" color="var(--olive)" size={16}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--olive)" }}>Meets Daedalus minimums</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>$2M GL aggregate + $5M umbrella covers 100% of pilot PMC requirements (Meridian, Solana, Red Rock, Palmcrest).</div>
          </div>
        </div>
      </div>
      <L style={{ marginTop: 18 }}>Upload ACORD 25 Certificate of Insurance</L>
      <UploadDrop label="Drop ACORD 25 PDF here · or browse" filename="ACORD_25_2026.pdf"/>
    </div>
  );
}

function StepDocs({ data, upd }) {
  const items = [
    { k: "coi",      label: "Certificate of Insurance",   sub: "ACORD 25 with Additional Insured" },
    { k: "w9",       label: "W-9",                          sub: "Auto TIN match with IRS" },
    { k: "license",  label: "Contractor license",           sub: "AZ ROC verification" },
    { k: "bond",     label: "Surety bond",                  sub: "$25K minimum for AZ" },
    { k: "articles", label: "Articles of incorporation",    sub: "From Secretary of State" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(it => (
        <div key={it.k} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(176,134,84,0.12)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="file" size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{it.label}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{it.sub}</div>
          </div>
          {data.docs[it.k] ? (
            <span className="pill pill-success"><span className="dot"/>Uploaded</span>
          ) : (
            <button onClick={() => upd({ docs: { ...data.docs, [it.k]: true } })} className="btn btn-secondary btn-sm"><Icon name="upload" size={11}/> Upload</button>
          )}
        </div>
      ))}
    </div>
  );
}

function StepTeam({ data, upd }) {
  return (
    <div>
      <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="users" size={18} color="var(--bronze)"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{data.team} team members invited</div>
          <div className="muted" style={{ fontSize: 11 }}>Each tech needs background-check authorization before in-unit work.</div>
        </div>
        <button className="btn btn-secondary btn-sm"><Icon name="plus" size={11}/> Invite</button>
      </div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {(window.MOCK?.TEAM || []).slice(0, 6).map(t => (
          <div key={t.id} className="card" style={{ padding: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar user={t} size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>{t.role}</div>
            </div>
            <span className="pill pill-success">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepChecks({ data, upd }) {
  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Authorize background checks via Checkr</div>
        <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>
          Each technician receives an email to complete their own consent. Daedalus pays for the first run; renewals are billed back at cost. Background checks are required before any in-unit work at PMC properties.
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <input type="checkbox" checked={data.bgAuth} onChange={e => upd({ bgAuth: e.target.checked })} style={{ accentColor: "var(--bronze)" }}/>
          I authorize Daedalus Pro to initiate background and drug screen checks on behalf of my technicians, who will provide individual consent.
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Background</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Checkr · 7-year</div>
          <div className="muted" style={{ fontSize: 12 }}>SSN trace · sex offender · county criminal · MVR</div>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Drug Screen</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Quest · 5-panel</div>
          <div className="muted" style={{ fontSize: 12 }}>Pre-employment + random quarterly</div>
        </div>
      </div>
    </div>
  );
}

function StepRefs({ data, upd }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>Provide up to 5 prior client references. Daedalus contacts each via secure form. <strong>{data.refs.filter(r => r.replied).length} of {data.refs.length}</strong> have replied so far.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.refs.map((r, i) => (
          <div key={i} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--slateblue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
              {r.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>{r.pmc} · {r.email}</div>
            </div>
            {r.replied ? <span className="pill pill-success"><span className="dot"/>Replied</span>
              : r.sent ? <span className="pill pill-warn"><span className="dot"/>Awaiting reply</span>
              : <button className="btn btn-secondary btn-sm">Send request</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPricing({ data, upd }) {
  const tiers = [
    { tier: "Verified",  fee: "10%", net: "Net 30" },
    { tier: "Preferred", fee: "8%",  net: "Net 24h via factoring" },
    { tier: "Elite",     fee: "6%",  net: "Net 24h via factoring" },
  ];
  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
        <table style={{ width: "100%", fontSize: 12 }}>
          <thead style={{ background: "var(--surface-2)" }}>
            <tr><th style={{ padding: 12, textAlign: "left" }}>Tier</th><th style={{ padding: 12, textAlign: "right" }}>Platform fee</th><th style={{ padding: 12, textAlign: "right" }}>Pay timing</th></tr>
          </thead>
          <tbody>
            {tiers.map(t => (
              <tr key={t.tier} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: 12 }}><TierBadge tier={t.tier}/></td>
                <td style={{ padding: 12, textAlign: "right", fontFamily: "var(--mono)", fontWeight: 600 }}>{t.fee}</td>
                <td style={{ padding: 12, textAlign: "right" }}>{t.net}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, lineHeight: 1.5 }}>
        <input type="checkbox" checked={data.pricingAck} onChange={e => upd({ pricingAck: e.target.checked })} style={{ accentColor: "var(--bronze)", marginTop: 3 }}/>
        I acknowledge the platform fee schedule, retainage policy (5–10% per PMC), and standard markup ranges (5–30%). My company is an independent contractor; we set our own schedules and methods.
      </label>
    </div>
  );
}

function StepReview({ data }) {
  const rows = [
    ["Company", `${data.legal} · ${data.structure} · est. ${data.founded}`],
    ["EIN", data.ein],
    ["Service area", `${data.hubs.length} hubs · ${data.radius} mi radius`],
    ["Trades", `${data.trades.length} selected`],
    ["Licenses", `${data.licenses.length} on file`],
    ["Insurance", `$${(data.glLimit/1e6).toFixed(0)}M GL · $${(data.umbrella/1e6).toFixed(0)}M umbrella`],
    ["Documents", `${Object.values(data.docs).filter(Boolean).length}/5 uploaded`],
    ["Team", `${data.team} members invited`],
    ["References", `${data.refs.filter(r => r.replied).length}/${data.refs.length} replied`],
    ["Pricing acknowledged", data.pricingAck ? "Yes" : "Not yet"],
  ];
  return (
    <div>
      <div className="card" style={{ padding: 22 }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : 0 }}>
            <div className="muted" style={{ fontSize: 12 }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 14, padding: 16, background: "linear-gradient(135deg, rgba(176,134,84,0.10), rgba(212,168,87,0.04))", borderLeft: "3px solid var(--bronze)" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Icon name="sparkles" size={20} color="var(--bronze)"/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Estimated decision: 5–7 business days</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>You'll be matched with a Compliance Specialist within 24 hours of submission. Track progress in real time on the application status page.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadDrop({ label, filename }) {
  const [uploaded, setUploaded] = React.useState(filename || null);
  return (
    <div style={{
      border: "2px dashed var(--line-strong)", borderRadius: 10, padding: 22,
      background: uploaded ? "rgba(122,139,76,0.06)" : "var(--surface)",
      borderColor: uploaded ? "rgba(122,139,76,0.5)" : "var(--line-strong)",
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: uploaded ? "rgba(122,139,76,0.18)" : "var(--surface-2)", color: uploaded ? "var(--olive)" : "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={uploaded ? "check" : "upload"} size={18}/>
      </div>
      <div style={{ flex: 1 }}>
        {uploaded ? <>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{uploaded}</div>
          <div className="muted" style={{ fontSize: 11 }}>Parsed · 5 coverage lines extracted · additional insured present</div>
        </> : <>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
          <div className="muted" style={{ fontSize: 11 }}>PDF, max 20 MB · we extract carrier, limits, and expiration automatically</div>
        </>}
      </div>
      {!uploaded && <button onClick={() => setUploaded("ACORD_25_2026.pdf")} className="btn btn-primary btn-sm">Browse</button>}
    </div>
  );
}

window.ApplyContractor = ApplyContractor;
