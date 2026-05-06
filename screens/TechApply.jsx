// Individual Technician Onboarding — personal application flow.
// Mobile-feel, single-column. Distinct from the GC Apply wizard:
// this is one human signing up to do field work — under a Daedalus GC umbrella
// or as an independent 1099 in The Forge.

const TECH_TRADES = [
  { k: "access",   label: "Access Control",      icon: "compliance", common: true },
  { k: "lv",       label: "Low-Voltage",         icon: "settings",   common: true },
  { k: "iot",      label: "IoT / Smart Home",    icon: "sparkles",   common: true },
  { k: "lock",     label: "Locksmithing",        icon: "shield" },
  { k: "gate",     label: "Gates",               icon: "shield" },
  { k: "wifi",     label: "WiFi / Networking",   icon: "settings",   common: true },
  { k: "elec",     label: "Electrical",          icon: "sparkles",   common: true },
  { k: "plumb",    label: "Plumbing",            icon: "settings" },
  { k: "hvac",     label: "HVAC",                icon: "settings" },
  { k: "appl",     label: "Appliance Repair",    icon: "workorder" },
  { k: "cam",      label: "Camera / CCTV",       icon: "shield" },
  { k: "light",    label: "Lighting",            icon: "sparkles" },
  { k: "drywall",  label: "Drywall & Paint",     icon: "edit" },
  { k: "handy",    label: "General Handyman",    icon: "field" },
];

function TechApply({ onClose, onSubmit }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    // identity
    first: "Marcus", last: "Cole",
    phone: "(602) 555-0114", email: "marcus.cole@gmail.com",
    dob: "1992-08-14", city: "Phoenix", zip: "85007",
    // status
    employmentType: "1099",   // 1099 | W2-daedalus
    yearsXP: 7,
    // trades
    trades: ["access","lv","iot","wifi"],
    primaryTrade: "access",
    // creds
    licenses: ["AZ ROC CR-67"],
    certs: ["EPA 608", "OSHA 10"],
    hasLLC: false,
    // verification
    idUploaded: true, selfieDone: true, bgcAuthed: true, drugAuthed: true,
    // gear
    truck: true, ladderTall: true, multimeter: true, networkTester: true, drillKit: true, programmingDevice: false,
    // availability
    days: ["Mon","Tue","Wed","Thu","Fri"],
    timeBlock: "anytime",   // morning | afternoon | evening | anytime
    radius: 25,
    weekendsOK: true,
    onCall: false,
    // payout
    payoutMethod: "ach", // ach | debit | factoring
    bankLast4: "2418",
    // agreements
    indyContractor: true,
    bgcConsent: true,
    arbitration: true,
  });

  const upd = (patch) => setData(d => ({ ...d, ...patch }));

  const steps = [
    { k: "welcome",   label: "Welcome",        sub: "What you'll need" },
    { k: "identity",  label: "Identity",       sub: "Who you are" },
    { k: "status",    label: "How you work",   sub: "1099 or W-2" },
    { k: "trades",    label: "Trades",         sub: "What you can do" },
    { k: "creds",     label: "Credentials",    sub: "Licenses + certs" },
    { k: "verify",    label: "Verification",   sub: "ID + background" },
    { k: "gear",      label: "Gear & truck",   sub: "What you carry" },
    { k: "avail",     label: "Availability",   sub: "When you work" },
    { k: "payout",    label: "Get paid",       sub: "Bank / debit / factoring" },
    { k: "agree",     label: "Agreements",     sub: "Contracts" },
    { k: "submit",    label: "All set",        sub: "Final review" },
  ];

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const pct = ((step) / (steps.length - 1)) * 100;

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 500, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header style={{ height: 60, padding: "0 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)" }}>
        <DaedalusMark size={26}/>
        <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600 }}>Daedalus<span style={{ color: "var(--bronze)" }}> Pro</span></div>
        <div style={{ width: 1, height: 20, background: "var(--line)" }}/>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Join as a Technician</div>
        <div className="spacer"/>
        <div className="muted" style={{ fontSize: 12 }}>Step {step + 1} of {steps.length}</div>
        <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon name="x" size={14}/> Save & exit</button>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--surface-2)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: "var(--bronze)", transition: "width 240ms var(--ease)" }}/>
      </div>

      {/* Single-column layout */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 20px 100px", background: "linear-gradient(180deg, var(--bg), var(--surface-2))" }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          {/* Step header */}
          <div className="muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{steps[step].label}</div>
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: "6px 0 4px", letterSpacing: "-0.01em" }}>
            {{
              welcome: "Welcome to Daedalus",
              identity: "Tell us who you are",
              status: "How do you want to work?",
              trades: "What can you fix?",
              creds: "Got papers?",
              verify: "Quick verification",
              gear: "What's in the truck?",
              avail: "When are you available?",
              payout: "Where do we send the money?",
              agree: "Last bit of paperwork",
              submit: "You're in.",
            }[steps[step].k]}
          </h1>
          <div className="muted" style={{ fontSize: 13, marginBottom: 24 }}>{steps[step].sub}</div>

          <div key={step} style={{ animation: "fadeUp 240ms var(--ease)" }}>
            {steps[step].k === "welcome"  && <TechWelcome/>}
            {steps[step].k === "identity" && <TechIdentity data={data} upd={upd}/>}
            {steps[step].k === "status"   && <TechStatus data={data} upd={upd}/>}
            {steps[step].k === "trades"   && <TechTradeStep data={data} upd={upd}/>}
            {steps[step].k === "creds"    && <TechCreds data={data} upd={upd}/>}
            {steps[step].k === "verify"   && <TechVerify data={data} upd={upd}/>}
            {steps[step].k === "gear"     && <TechGear data={data} upd={upd}/>}
            {steps[step].k === "avail"    && <TechAvail data={data} upd={upd}/>}
            {steps[step].k === "payout"   && <TechPayout data={data} upd={upd}/>}
            {steps[step].k === "agree"    && <TechAgree data={data} upd={upd}/>}
            {steps[step].k === "submit"   && <TechSubmit data={data}/>}
          </div>
        </div>
      </main>

      {/* Sticky footer */}
      <footer style={{
        position: "sticky", bottom: 0, padding: "14px 24px",
        background: "var(--surface)", borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10
      }}>
        <button onClick={prev} className="btn btn-ghost" disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
          <Icon name="chevLeft" size={12}/> Back
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === step ? "var(--bronze)" : i < step ? "var(--olive)" : "var(--line-strong)" }}/>
          ))}
        </div>
        {step < steps.length - 1 ? (
          <button onClick={next} className="btn btn-primary">Next <Icon name="chevRight" size={12}/></button>
        ) : (
          <button onClick={() => onSubmit?.(data)} className="btn btn-primary"><Icon name="check" size={13}/> Submit</button>
        )}
      </footer>
    </div>
  );
}

// — steps —
function TechWelcome() {
  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>This will take ~12 minutes.</div>
        <div className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>You'll need: a government ID, your insurance carrier (if you have one), and your bank info for direct deposit.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { i: "shield",   t: "Background check", s: "Daedalus pays the first run via Checkr." },
          { i: "money",    t: "Get paid in 24 hours", s: "Choose ACH, instant debit, or factoring." },
          { i: "sparkles", t: "Pick your jobs",        s: "Heatmaps show where work is right now." },
          { i: "users",    t: "GC umbrella included",  s: "Daedalus carries the COI on multifamily work." },
        ].map(b => (
          <div key={b.t} style={{ display: "flex", gap: 12, padding: "10px 4px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(176,134,84,0.10)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={b.i} size={15}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{b.t}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{b.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inp = { width: "100%", height: 42, padding: "0 14px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit" };
function lab(t) { return <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 6, marginTop: 12 }}>{t}</div>; }

function TechIdentity({ data, upd }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>{lab("First name")}<input style={inp} value={data.first} onChange={e => upd({ first: e.target.value })}/></div>
        <div>{lab("Last name")}<input style={inp} value={data.last} onChange={e => upd({ last: e.target.value })}/></div>
      </div>
      {lab("Mobile number")}<input style={inp} value={data.phone} onChange={e => upd({ phone: e.target.value })}/>
      {lab("Personal email")}<input style={inp} value={data.email} onChange={e => upd({ email: e.target.value })}/>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
        <div>{lab("City")}<input style={inp} value={data.city} onChange={e => upd({ city: e.target.value })}/></div>
        <div>{lab("ZIP")}<input style={{ ...inp, fontFamily: "var(--mono)" }} value={data.zip} onChange={e => upd({ zip: e.target.value })}/></div>
      </div>
      {lab("Date of birth")}<input style={{ ...inp, fontFamily: "var(--mono)" }} type="date" value={data.dob} onChange={e => upd({ dob: e.target.value })}/>
    </div>
  );
}

function TechStatus({ data, upd }) {
  const opts = [
    { k: "1099",         t: "Independent (1099)",    s: "I run my own jobs. Daedalus is my marketplace.", icons: ["💼","Self-set hours","Expense-write-offs"] },
    { k: "W2-daedalus",  t: "W-2 with Daedalus",     s: "Full benefits, fixed schedule, salary or hourly.", icons: ["🏥","Health insurance","Paid time off"] },
  ];
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {opts.map(o => {
          const on = data.employmentType === o.k;
          return (
            <button key={o.k} onClick={() => upd({ employmentType: o.k })} style={{
              padding: 16, borderRadius: 12, textAlign: "left", cursor: "pointer",
              background: on ? "rgba(176,134,84,0.06)" : "var(--surface)",
              border: `2px solid ${on ? "var(--bronze)" : "var(--line)"}`,
              color: "var(--text)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${on ? "var(--bronze)" : "var(--line-strong)"}`, background: on ? "var(--bronze)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {on && <div style={{ width: 8, height: 8, borderRadius: 999, background: "white" }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{o.t}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{o.s}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {lab("Years of professional experience")}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input type="range" min="0" max="30" value={data.yearsXP} onChange={e => upd({ yearsXP: +e.target.value })} style={{ flex: 1, accentColor: "var(--bronze)" }}/>
        <div className="mono" style={{ minWidth: 56, fontSize: 16, fontWeight: 700, color: "var(--bronze)" }}>{data.yearsXP} {data.yearsXP === 1 ? "yr" : "yrs"}</div>
      </div>
    </div>
  );
}

function TechTradeStep({ data, upd }) {
  const toggle = k => upd({
    trades: data.trades.includes(k) ? data.trades.filter(x => x !== k) : [...data.trades, k],
    primaryTrade: data.primaryTrade === k && data.trades.includes(k) ? null : data.primaryTrade
  });
  return (
    <div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>Pick everything you'd take a job in. Star your strongest trade — that's how we route urgent dispatches.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {TECH_TRADES.map(t => {
          const on = data.trades.includes(t.k);
          const primary = data.primaryTrade === t.k;
          return (
            <div key={t.k} style={{
              padding: "10px 12px", borderRadius: 10,
              background: on ? "rgba(176,134,84,0.08)" : "var(--surface)",
              border: `1px solid ${on ? "var(--bronze)" : "var(--line)"}`,
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            }} onClick={() => toggle(t.k)}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: on ? "var(--bronze)" : "var(--surface-2)", color: on ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={t.icon} size={13}/>
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: on ? 600 : 500 }}>{t.label}</div>
              {on && (
                <button onClick={e => { e.stopPropagation(); upd({ primaryTrade: t.k }); }}
                  style={{ width: 24, height: 24, borderRadius: 999, border: 0, cursor: "pointer",
                  background: primary ? "var(--amber)" : "transparent", color: primary ? "white" : "var(--text-3)" }} title="Set as primary">
                  ★
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="muted" style={{ fontSize: 11, marginTop: 12, textAlign: "center" }}>{data.trades.length} selected · primary: <strong>{TECH_TRADES.find(t => t.k === data.primaryTrade)?.label || "—"}</strong></div>
    </div>
  );
}

function TechCreds({ data, upd }) {
  const licenses = ["AZ ROC CR-67","AZ ROC CR-11","AZ ROC C-67","Locksmith ALOA","None — handyman only"];
  const certs = ["EPA 608","OSHA 10","OSHA 30","BICSI Installer 1","NICET Fire Alarm"];
  const tg = (k, v) => upd({ [k]: data[k].includes(v) ? data[k].filter(x => x !== v) : [...data[k], v] });
  return (
    <div>
      {lab("Licenses")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {licenses.map(l => {
          const on = data.licenses.includes(l);
          return <button key={l} onClick={() => tg("licenses", l)} className={`btn btn-sm ${on ? "btn-primary" : "btn-secondary"}`}>{on && <Icon name="check" size={11}/>} {l}</button>;
        })}
      </div>
      {lab("Certifications")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {certs.map(c => {
          const on = data.certs.includes(c);
          return <button key={c} onClick={() => tg("certs", c)} className={`btn btn-sm ${on ? "btn-primary" : "btn-secondary"}`}>{on && <Icon name="check" size={11}/>} {c}</button>;
        })}
      </div>
      <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Do you have an LLC or S-Corp?</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>Affects tax treatment. We can help you set one up if not.</div>
          </div>
          <Toggle on={data.hasLLC} onChange={v => upd({ hasLLC: v })}/>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 999, border: 0, cursor: "pointer",
      background: on ? "var(--bronze)" : "var(--surface-3)", position: "relative", transition: "background 200ms var(--ease)",
    }}>
      <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 999, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 200ms var(--ease)" }}/>
    </button>
  );
}

function TechVerify({ data, upd }) {
  const items = [
    { k: "idUploaded", t: "Photo ID",            s: "Driver's license, state ID, or passport.", btn: "Take photo" },
    { k: "selfieDone", t: "Liveness selfie",     s: "Confirms you match the ID. 5 seconds.",    btn: "Open camera" },
    { k: "bgcAuthed",  t: "Background check",    s: "Checkr 7-year — Daedalus pays.",          btn: "Authorize" },
    { k: "drugAuthed", t: "Drug screen",         s: "Quest 5-panel at a lab near you.",        btn: "Authorize" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map(it => {
        const done = data[it.k];
        return (
          <div key={it.k} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, flexShrink: 0,
              background: done ? "rgba(122,139,76,0.18)" : "var(--surface-2)",
              color: done ? "var(--olive)" : "var(--text-3)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={done ? "check" : "camera"} size={15}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{it.t}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{it.s}</div>
            </div>
            {done ? <span className="pill pill-success"><span className="dot"/>Done</span>
              : <button onClick={() => upd({ [it.k]: true })} className="btn btn-secondary btn-sm">{it.btn}</button>}
          </div>
        );
      })}
    </div>
  );
}

function TechGear({ data, upd }) {
  const items = [
    { k: "truck",            t: "Truck or van",          s: "Required for most jobs." },
    { k: "ladderTall",       t: "Ladder ≥ 12 ft",        s: "For ceiling-mount cameras + lighting." },
    { k: "multimeter",       t: "Multimeter",            s: "Klein, Fluke — DC + AC." },
    { k: "networkTester",    t: "Network tester",        s: "Cable + PoE detection." },
    { k: "drillKit",         t: "Drill + impact kit",    s: "Cordless, full bit set." },
    { k: "programmingDevice",t: "Access control programmer", s: "Z-Wave / RFID / BLE." },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map(it => (
        <label key={it.k} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, border: `1px solid ${data[it.k] ? "var(--olive)" : "var(--line)"}`, background: data[it.k] ? "rgba(122,139,76,0.06)" : "var(--surface)", cursor: "pointer" }}>
          <input type="checkbox" checked={data[it.k]} onChange={e => upd({ [it.k]: e.target.checked })} style={{ accentColor: "var(--olive)", width: 18, height: 18 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{it.t}</div>
            <div className="muted" style={{ fontSize: 11 }}>{it.s}</div>
          </div>
        </label>
      ))}
    </div>
  );
}

function TechAvail({ data, upd }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const blocks = [
    { k: "morning", l: "Mornings", h: "6 AM – 12 PM" },
    { k: "afternoon", l: "Afternoons", h: "12 – 6 PM" },
    { k: "evening", l: "Evenings", h: "6 – 10 PM" },
    { k: "anytime", l: "Anytime", h: "Whatever's there" },
  ];
  const tg = d => upd({ days: data.days.includes(d) ? data.days.filter(x => x !== d) : [...data.days, d] });
  return (
    <div>
      {lab("Days you'll work")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {days.map(d => {
          const on = data.days.includes(d);
          return (
            <button key={d} onClick={() => tg(d)} style={{
              height: 44, borderRadius: 8, border: `1px solid ${on ? "var(--bronze)" : "var(--line)"}`,
              background: on ? "var(--bronze)" : "var(--surface)", color: on ? "white" : "var(--text-2)",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>{d}</button>
          );
        })}
      </div>
      {lab("Time of day")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {blocks.map(b => {
          const on = data.timeBlock === b.k;
          return (
            <button key={b.k} onClick={() => upd({ timeBlock: b.k })} style={{
              padding: "12px 14px", borderRadius: 10, textAlign: "left", cursor: "pointer",
              background: on ? "rgba(176,134,84,0.08)" : "var(--surface)",
              border: `1px solid ${on ? "var(--bronze)" : "var(--line)"}`, color: "var(--text)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{b.l}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{b.h}</div>
            </button>
          );
        })}
      </div>
      {lab(`Travel radius — ${data.radius} mi`)}
      <input type="range" min="5" max="60" value={data.radius} onChange={e => upd({ radius: +e.target.value })} style={{ width: "100%", accentColor: "var(--bronze)" }}/>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <Row label="Open to weekend dispatches" on={data.weekendsOK} onChange={v => upd({ weekendsOK: v })}/>
        <Row label="On-call rotation (after-hours bonus +30%)" on={data.onCall} onChange={v => upd({ onCall: v })}/>
      </div>
    </div>
  );
}
function Row({ label, on, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)" }}>
      <div style={{ flex: 1, fontSize: 13 }}>{label}</div>
      <Toggle on={on} onChange={onChange}/>
    </div>
  );
}

function TechPayout({ data, upd }) {
  const opts = [
    { k: "ach",       t: "Direct deposit (ACH)",    s: "Net 1 day · free.",                       icon: "money" },
    { k: "debit",     t: "Instant debit card",      s: "Within minutes · 1.5% fee.",              icon: "card" },
    { k: "factoring", t: "24-hour factoring",       s: "PMC jobs only · 2% fee · skip Net-30.",   icon: "factoring" },
  ];
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map(o => {
          const on = data.payoutMethod === o.k;
          return (
            <button key={o.k} onClick={() => upd({ payoutMethod: o.k })} style={{
              padding: 14, borderRadius: 10, textAlign: "left", cursor: "pointer", display: "flex", gap: 12, alignItems: "center",
              background: on ? "rgba(176,134,84,0.08)" : "var(--surface)",
              border: `2px solid ${on ? "var(--bronze)" : "var(--line)"}`, color: "var(--text)",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: on ? "var(--bronze)" : "var(--surface-2)", color: on ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={o.icon} size={15}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{o.t}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{o.s}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${on ? "var(--bronze)" : "var(--line-strong)"}`, background: on ? "var(--bronze)" : "transparent", flexShrink: 0 }}/>
            </button>
          );
        })}
      </div>
      <div className="card" style={{ padding: 14, marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>Bank account on file</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <div style={{ width: 36, height: 24, borderRadius: 4, background: "linear-gradient(135deg,#1F2937,#4A6378)", color: "white", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>WF</div>
          <div className="mono" style={{ flex: 1, fontSize: 13 }}>Wells Fargo Checking · ••••{data.bankLast4}</div>
          <button className="btn btn-ghost btn-sm">Change</button>
        </div>
      </div>
    </div>
  );
}

function TechAgree({ data, upd }) {
  const docs = [
    { k: "indyContractor", t: "Independent Contractor Agreement", s: "Defines you as 1099, sets fee schedule." },
    { k: "bgcConsent",     t: "FCRA Background Check Consent",     s: "Required by federal law for screening." },
    { k: "arbitration",    t: "Mutual arbitration",                s: "Disputes go to AAA, not court." },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {docs.map(d => (
        <div key={d.k} className="card" style={{ padding: 14, display: "flex", gap: 12 }}>
          <input type="checkbox" checked={data[d.k]} onChange={e => upd({ [d.k]: e.target.checked })} style={{ accentColor: "var(--bronze)", width: 18, height: 18, marginTop: 2 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{d.t}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{d.s}</div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6, fontSize: 11 }}><Icon name="file" size={11}/> Read full agreement</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TechSubmit({ data }) {
  const trades = data.trades.map(k => TECH_TRADES.find(t => t.k === k)?.label).filter(Boolean);
  return (
    <div>
      <div className="card" style={{ padding: 22, textAlign: "center", marginBottom: 14, background: "linear-gradient(135deg, rgba(176,134,84,0.10), rgba(212,168,87,0.04))" }}>
        <div style={{ width: 60, height: 60, borderRadius: 999, background: "var(--bronze)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Icon name="check" size={26} strokeWidth={2.5}/>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{data.first}, you're ready.</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 6, maxWidth: 360, marginInline: "auto" }}>Background results take 24–72 hours. Once cleared, you'll see jobs in your area immediately.</div>
      </div>
      <div className="card" style={{ padding: 16 }}>
        {[
          ["Status", data.employmentType === "1099" ? "1099 Independent" : "W-2 Daedalus"],
          ["Trades", `${trades.length} · primary ${TECH_TRADES.find(t => t.k === data.primaryTrade)?.label || "—"}`],
          ["Service area", `${data.city} · ${data.radius} mi`],
          ["Days", data.days.join(" · ")],
          ["Payout", { ach: "ACH · Net 1d", debit: "Instant debit", factoring: "24h factoring" }[data.payoutMethod]],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : 0 }}>
            <div className="muted" style={{ fontSize: 12 }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.TechApply = TechApply;
