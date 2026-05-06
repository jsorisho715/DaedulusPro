// Consumer (Homeowner / SFR) work-order submission.
// This is the *consumer-facing* product, where a single-family homeowner
// books a tech the way they'd book an Uber: pick a category → describe the
// problem (with photos / "smart triage") → pick time → confirm price → pay.
// Mobile-feel inside a phone frame would be ideal but we render at app width
// for context. All copy is friendly, not enterprise.

const HO_CATEGORIES = [
  { k: "lock",     icon: "shield",     t: "Lockout / Locks",         s: "Rekey, smart locks, lost keys",      from: 89  },
  { k: "garage",   icon: "compliance", t: "Garage door",             s: "Spring, opener, sensors",           from: 119 },
  { k: "elec",     icon: "sparkles",   t: "Electrical",              s: "Outlets, fixtures, panels",         from: 99  },
  { k: "plumb",    icon: "settings",   t: "Plumbing",                s: "Leaks, drains, fixtures",           from: 109 },
  { k: "appl",     icon: "workorder",  t: "Appliance repair",        s: "Fridge, dryer, dishwasher",          from: 129 },
  { k: "smart",    icon: "settings",   t: "Smart home / WiFi",       s: "Mesh, cameras, doorbells",          from: 79  },
  { k: "hvac",     icon: "settings",   t: "AC / Heating",            s: "Tune-ups, no-cool diagnostics",     from: 139 },
  { k: "handy",    icon: "field",      t: "Handyman",                s: "Drywall, mounts, assembly",         from: 75  },
];

const HO_URGENCIES = [
  { k: "now",   t: "Right now",          s: "Within 60 minutes",        bump: 1.5, color: "var(--terracotta)" },
  { k: "today", t: "Today",              s: "Next available 4-hr block", bump: 1.0, color: "var(--bronze)"     },
  { k: "tom",   t: "Tomorrow",           s: "Pick a 2-hr window",       bump: 1.0, color: "var(--olive)"      },
  { k: "week",  t: "This week",          s: "Cheapest, you pick the day", bump: 0.85, color: "var(--slateblue)" },
];

function ConsumerSubmit({ onClose, onSubmit }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    category: "lock",
    issue: "",
    photos: [],
    address: "4218 N 38th Pl, Phoenix, AZ 85018",
    addressType: "House",
    urgency: "today",
    pickedSlot: "Today · 2:00 – 6:00 PM",
    notes: "Side gate is unlocked; please come around back. Big golden retriever named Theo, super friendly.",
    accessCode: "",
    payment: "card-1817",
    sms: true,
    name: "Sarah Reyes",
    phone: "(602) 555-0193",
    // bidding mode: "instant" = first qualified tech grabs (one-tap claim path)
    //               "compare" = wait for 3 bids, pick the best
    bidMode: "instant",
    minBids: 3,
  });
  const upd = p => setData(d => ({ ...d, ...p }));

  const cat = HO_CATEGORIES.find(c => c.k === data.category);
  const urg = HO_URGENCIES.find(u => u.k === data.urgency);
  const basePrice = cat ? cat.from : 99;
  const finalEst = Math.round(basePrice * (urg?.bump || 1));

  const steps = [
    { k: "category",  l: "What's wrong?" },
    { k: "describe",  l: "Tell us more" },
    { k: "where",     l: "Where?" },
    { k: "when",      l: "When?" },
    { k: "bidmode",   l: "How to pick" },
    { k: "review",    l: "Review" },
    { k: "confirmed", l: "Booked" },
  ];

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 500, display: "flex", flexDirection: "column" }}>
      {/* Top */}
      <header style={{ height: 56, padding: "0 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#D4A857,#B08654)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, fontFamily: "var(--serif)" }}>D</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>Daedalus<span style={{ color: "var(--bronze)" }}> · Home</span></div>
        </div>
        <div style={{ width: 1, height: 22, background: "var(--line)" }}/>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Book a tech</div>
        <div className="spacer"/>
        <div className="muted" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="shield" size={12}/> Backed by Daedalus · $1M coverage
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon name="x" size={14}/></button>
      </header>

      {/* Stepper bar */}
      <div style={{ padding: "16px 24px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          {steps.slice(0, 6).map((s, i) => (
            <React.Fragment key={s.k}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: i <= step ? "var(--bronze)" : "var(--text-3)" }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, background: i < step ? "var(--olive)" : i === step ? "var(--bronze)" : "var(--surface-3)", color: i <= step ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {i < step ? <Icon name="check" size={10} strokeWidth={3}/> : i + 1}
                </div>
                <div style={{ fontSize: 12, fontWeight: i === step ? 600 : 500 }}>{s.l}</div>
              </div>
              {i < 5 && <div style={{ flex: 1, height: 1, background: i < step ? "var(--olive)" : "var(--line)" }}/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Body */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 24px 100px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div key={step} style={{ animation: "fadeUp 220ms var(--ease)" }}>
            {steps[step].k === "category"  && <HOCategory data={data} upd={upd}/>}
            {steps[step].k === "describe"  && <HODescribe data={data} upd={upd}/>}
            {steps[step].k === "where"     && <HOWhere data={data} upd={upd}/>}
            {steps[step].k === "when"      && <HOWhen data={data} upd={upd}/>}
            {steps[step].k === "bidmode"   && <HOBidMode data={data} upd={upd} cat={cat}/>}
            {steps[step].k === "review"    && <HOReview data={data} upd={upd} cat={cat} urg={urg} basePrice={basePrice} finalEst={finalEst}/>}
            {steps[step].k === "confirmed" && <HOConfirmed data={data} cat={cat}/>}
          </div>
        </div>
      </main>

      {/* Footer */}
      {step < 6 && (
        <footer style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <button onClick={prev} className="btn btn-ghost" disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
            <Icon name="chevLeft" size={12}/> Back
          </button>
          {step < 5 && <button onClick={next} className="btn btn-primary">Continue <Icon name="chevRight" size={12}/></button>}
          {step === 5 && (
            <button onClick={() => setStep(6)} className="btn btn-primary btn-lg">
              {data.bidMode === "instant" ? `Confirm & book · $${finalEst} est.` : `Post for bids · ${data.minBids} pros`}
            </button>
          )}
        </footer>
      )}
      {step === 6 && (
        <footer style={{ padding: "14px 24px", borderTop: "1px solid var(--line)", background: "var(--surface)", display: "flex", justifyContent: "center", gap: 10 }}>
          {data.bidMode === "compare" && (
            <button onClick={() => onSubmit?.({ ...data, viewBids: true })} className="btn btn-secondary"><Icon name="users" size={13}/> Watch bids come in</button>
          )}
          <button onClick={() => onSubmit?.(data)} className="btn btn-primary"><Icon name="check" size={13}/> Done</button>
        </footer>
      )}
    </div>
  );
}

function HOCategory({ data, upd }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>What's wrong at home?</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>Pick the closest match. We'll fine-tune in a sec.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {HO_CATEGORIES.map(c => {
          const on = data.category === c.k;
          return (
            <button key={c.k} onClick={() => upd({ category: c.k })} style={{
              padding: 16, textAlign: "left", borderRadius: 12, cursor: "pointer",
              background: on ? "rgba(176,134,84,0.08)" : "var(--surface)",
              border: `2px solid ${on ? "var(--bronze)" : "var(--line)"}`,
              color: "var(--text)", display: "flex", flexDirection: "column", gap: 8,
              transition: "all var(--tx-fast)",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: on ? "var(--bronze)" : "var(--surface-2)", color: on ? "white" : "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={c.icon} size={17}/>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.t}</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{c.s}</div>
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 600, marginTop: "auto" }}>From ${c.from}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HODescribe({ data, upd }) {
  // Smart triage chips per category — picked from common problems
  const presets = {
    lock:    ["Locked out", "Rekey 2 doors", "Install smart lock", "Lost keys", "Broken deadbolt"],
    garage:  ["Door won't open", "Loud grinding", "Spring snapped", "Sensor light blinks", "Remote not working"],
    elec:    ["Outlet sparking", "Breaker keeps tripping", "Install ceiling fan", "Replace fixture", "Add outlet"],
    plumb:   ["Leak under sink", "Toilet running", "Slow drain", "Hot water out", "Replace faucet"],
    appl:    ["Fridge not cold", "Dishwasher not draining", "Dryer no heat", "Washer leaking", "Microwave dead"],
    smart:   ["WiFi dead spots", "Doorbell offline", "Cameras dropping", "Smart lock setup", "Mesh network install"],
    hvac:    ["AC not cooling", "Filter change", "Thermostat install", "Tune-up", "Strange noises"],
    handy:   ["Drywall patch", "TV mount", "Furniture assembly", "Picture hanging", "Door planing"],
  };
  const list = presets[data.category] || [];
  const tg = (chip) => upd({ issue: data.issue.includes(chip) ? data.issue : (data.issue ? data.issue + ", " + chip : chip) });
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Tell us what's going on</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>Tap a quick-pick or describe in your own words. Photos help a lot.</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {list.map(c => (
          <button key={c} onClick={() => tg(c)} style={{
            padding: "6px 12px", borderRadius: 999, border: "1px solid var(--line)",
            background: "var(--surface)", color: "var(--text-2)", fontSize: 12, fontWeight: 500, cursor: "pointer",
          }}>+ {c}</button>
        ))}
      </div>
      <textarea value={data.issue} onChange={e => upd({ issue: e.target.value })}
        placeholder="The garage door reverses halfway down. I think a sensor is misaligned but the light is still green."
        style={{ width: "100%", minHeight: 110, padding: 14, border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", color: "var(--text)", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.5 }}/>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>Photos ({data.photos.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {data.photos.map((p, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: `linear-gradient(135deg, ${p}, var(--surface-3))`, position: "relative", border: "1px solid var(--line)" }}>
              <button onClick={() => upd({ photos: data.photos.filter((_, j) => j !== i) })} style={{
                position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: 999,
                background: "rgba(0,0,0,0.6)", color: "white", border: 0, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}><Icon name="x" size={11}/></button>
            </div>
          ))}
          {data.photos.length < 4 && (
            <button onClick={() => upd({ photos: [...data.photos, ["#B08654","#7A8B4C","#4A6378","#B0463A"][data.photos.length]] })}
              style={{ aspectRatio: "1", borderRadius: 10, border: "2px dashed var(--line-strong)", background: "var(--surface)", color: "var(--text-3)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Icon name="camera" size={20}/>
              <span style={{ fontSize: 11 }}>Add photo</span>
            </button>
          )}
        </div>
      </div>
      <div className="card" style={{ padding: 12, marginTop: 14, background: "rgba(176,134,84,0.06)", borderLeft: "3px solid var(--bronze)" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Icon name="sparkles" size={14} color="var(--bronze)"/>
          <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-2)" }}>AI triage</strong> reads your description + photos and matches you to a tech with the right tools — usually in &lt;15 sec.
          </div>
        </div>
      </div>
    </div>
  );
}

function HOWhere({ data, upd }) {
  const types = ["House", "Townhouse", "Condo", "Apartment"];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Where's the work?</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>We'll text the tech your address only after you confirm.</div>
      <div style={{ position: "relative" }}>
        <Icon name="location" size={14} style={{ position: "absolute", left: 14, top: 14, color: "var(--bronze)" }}/>
        <input value={data.address} onChange={e => upd({ address: e.target.value })}
          style={{ width: "100%", height: 46, padding: "0 14px 0 38px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none" }}/>
      </div>

      {/* mini map mock */}
      <div className="card" style={{ marginTop: 14, padding: 0, height: 180, overflow: "hidden", position: "relative", background: "linear-gradient(180deg, #EDE5D2, #DFD4B8)" }}>
        <svg width="100%" height="100%" viewBox="0 0 600 180">
          <defs>
            <pattern id="ho-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(31,35,41,0.06)" strokeWidth="1"/></pattern>
          </defs>
          <rect width="600" height="180" fill="url(#ho-grid)"/>
          <path d="M0 110 Q 200 60 400 100 T 600 90" stroke="rgba(176,134,84,0.4)" strokeWidth="2" fill="none"/>
          <path d="M150 0 V 180 M450 0 V 180" stroke="rgba(31,35,41,0.08)" strokeWidth="1.5"/>
          <g transform="translate(300 90)">
            <circle r="14" fill="var(--bronze)" opacity="0.18"/>
            <circle r="7" fill="var(--bronze)"/>
            <circle r="3" fill="white"/>
          </g>
        </svg>
        <div style={{ position: "absolute", bottom: 10, right: 10, padding: "6px 10px", background: "var(--surface)", borderRadius: 6, fontSize: 11, fontWeight: 600, boxShadow: "var(--shadow-sm)" }}>📍 Phoenix · 85018</div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Property type</div>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {types.map(t => (
          <button key={t} onClick={() => upd({ addressType: t })}
            className={`btn btn-sm ${data.addressType === t ? "btn-primary" : "btn-secondary"}`}
            style={{ flex: 1 }}>{t}</button>
        ))}
      </div>

      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Access notes <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></div>
      <textarea value={data.notes} onChange={e => upd({ notes: e.target.value })}
        placeholder="Gate code, dog name, parking spot — anything that helps the tech show up smoothly."
        style={{ width: "100%", marginTop: 8, minHeight: 80, padding: 12, border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", color: "var(--text)" }}/>
    </div>
  );
}

function HOWhen({ data, upd }) {
  const slots = {
    now:   ["ASAP · ETA 35–55 min"],
    today: ["Today · 10 AM – 2 PM", "Today · 2 – 6 PM", "Today · 6 – 9 PM"],
    tom:   ["Tomorrow · 8 – 10 AM", "Tomorrow · 10 AM – 12 PM", "Tomorrow · 12 – 2 PM", "Tomorrow · 2 – 4 PM"],
    week:  ["Thu · any time", "Fri · 9 AM – 1 PM", "Sat · 9 AM – 1 PM", "Sat · 1 – 5 PM"],
  };
  const list = slots[data.urgency] || [];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>When works for you?</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>Faster windows cost more. Off-hour slots are cheapest.</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {HO_URGENCIES.map(u => {
          const on = data.urgency === u.k;
          return (
            <button key={u.k} onClick={() => upd({ urgency: u.k, pickedSlot: slots[u.k][0] })} style={{
              padding: 14, borderRadius: 10, textAlign: "left", cursor: "pointer", color: "var(--text)",
              background: on ? `${u.color}14` : "var(--surface)",
              border: `2px solid ${on ? u.color : "var(--line)"}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{u.t}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{u.s}</div>
              <div className="mono" style={{ fontSize: 11, marginTop: 6, color: u.color, fontWeight: 600 }}>
                {u.bump > 1 ? `+${Math.round((u.bump - 1)*100)}% premium` : u.bump < 1 ? `${Math.round((1 - u.bump)*100)}% off` : "Standard pricing"}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18, fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Pick a window</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        {list.map(s => (
          <button key={s} onClick={() => upd({ pickedSlot: s })} style={{
            padding: "12px 14px", borderRadius: 10, textAlign: "left", cursor: "pointer", color: "var(--text)",
            background: data.pickedSlot === s ? "rgba(176,134,84,0.08)" : "var(--surface)",
            border: `1px solid ${data.pickedSlot === s ? "var(--bronze)" : "var(--line)"}`,
            display: "flex", alignItems: "center", gap: 10
          }}>
            <Icon name="schedule" size={14} color={data.pickedSlot === s ? "var(--bronze)" : "var(--text-3)"}/>
            <span style={{ flex: 1, fontSize: 13, fontWeight: data.pickedSlot === s ? 600 : 500 }}>{s}</span>
            {data.pickedSlot === s && <Icon name="check" size={14} color="var(--bronze)"/>}
          </button>
        ))}
      </div>
    </div>
  );
}

function HOReview({ data, upd, cat, urg, basePrice, finalEst }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Review &amp; book</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>You won't be charged until the tech finishes the job.</div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(176,134,84,0.12)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={cat.icon} size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{cat.t}</div>
            <div className="muted" style={{ fontSize: 12 }}>{data.issue || "—"}</div>
          </div>
        </div>
        <Line label="When" value={data.pickedSlot} icon="schedule"/>
        <Line label="Where" value={`${data.address} · ${data.addressType}`} icon="location"/>
        <Line
          label="How we'll pick"
          value={data.bidMode === "instant" ? "First fair-priced pro grabs the job" : `Compare ${data.minBids} bids — you choose`}
          icon={data.bidMode === "instant" ? "zap" : "users"}
        />
        {data.notes && <Line label="Access notes" value={data.notes} icon="info" multiline/>}
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="muted" style={{ fontSize: 12 }}>Service call (first hour)</div>
          <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>${basePrice}</div>
        </div>
        {urg.bump !== 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="muted" style={{ fontSize: 12 }}>{urg.t} {urg.bump > 1 ? "premium" : "discount"}</div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: urg.color }}>{urg.bump > 1 ? "+" : "−"}${Math.abs(Math.round(basePrice * (urg.bump - 1)))}</div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="muted" style={{ fontSize: 12 }}>Diagnostic + materials</div>
          <div className="mono" style={{ fontSize: 13, color: "var(--text-3)" }}>billed at job</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--line)", marginTop: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Estimate today</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--bronze)" }}>${finalEst}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 24, borderRadius: 4, background: "linear-gradient(135deg, #4A6378, #1F2937)", color: "white", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>VISA</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Card ending 1817</div>
          <div className="muted" style={{ fontSize: 11 }}>Auth $1; charged on completion</div>
        </div>
        <button className="btn btn-ghost btn-sm">Change</button>
      </div>

      <div className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, background: "rgba(122,139,76,0.06)", borderColor: "rgba(122,139,76,0.3)" }}>
        <Icon name="shield" size={14} color="var(--olive)"/>
        <div style={{ flex: 1, fontSize: 12, color: "var(--text-2)" }}>Every Daedalus tech is licensed, insured, background-checked, and rated by 50+ jobs.</div>
      </div>
    </div>
  );
}

function Line({ label, value, icon, multiline }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: "1px solid var(--line)" }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--surface-2)", color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Icon name={icon} size={11}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, ...(multiline ? { lineHeight: 1.4 } : { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }) }}>{value}</div>
      </div>
    </div>
  );
}

function HOConfirmed({ data, cat }) {
  // Compare-bids mode shows a "bids coming in" state instead of an assigned tech.
  if (data.bidMode === "compare") {
    return <HOConfirmedBids data={data} cat={cat}/>;
  }
  return (
    <div>
      <div className="card" style={{ padding: 24, textAlign: "center", marginBottom: 14, background: "linear-gradient(135deg, rgba(122,139,76,0.10), rgba(176,134,84,0.04))" }}>
        <div style={{ width: 60, height: 60, borderRadius: 999, background: "var(--olive)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <Icon name="check" size={28} strokeWidth={2.5}/>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Booked. WO-{Math.floor(Math.random()*900+3100)}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{cat.t} · {data.pickedSlot}</div>
      </div>
      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--bronze)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>MP</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Miguel Padilla</div>
              <span className="pill pill-success" style={{ height: 18 }}><span className="dot"/>Verified</span>
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>★ 4.93 · 412 jobs · 7 yrs · Phoenix</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: 36, padding: 0 }}><Icon name="phone" size={14}/></button>
          <button className="btn btn-ghost btn-sm" style={{ width: 36, padding: 0 }}><Icon name="mail" size={14}/></button>
        </div>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>What happens next</div>
        {[
          ["1","We notify Miguel — he confirms within 5 min.", true],
          ["2","Live ETA + truck location once en route.", false],
          ["3","Tap to add a tip when the work's done.", false],
        ].map(([n,t,active]) => (
          <div key={n} style={{ display: "flex", gap: 10, padding: "8px 0" }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: active ? "var(--bronze)" : "var(--surface-2)", color: active ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{n}</div>
            <div style={{ fontSize: 13, color: active ? "var(--text)" : "var(--text-2)" }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HOConfirmedBids({ data, cat }) {
  // Animated "bids coming in" state — shows progress toward the cap.
  const [bidsIn, setBidsIn] = React.useState(0);
  const cap = data.minBids || 3;

  React.useEffect(() => {
    if (bidsIn >= cap) return;
    const t = setTimeout(() => setBidsIn(b => b + 1), 1200 + Math.random() * 1100);
    return () => clearTimeout(t);
  }, [bidsIn, cap]);

  const woId = `WO-${Math.floor(Math.random()*900+3100)}`;

  return (
    <div>
      <div className="card" style={{ padding: 24, textAlign: "center", marginBottom: 14, background: "linear-gradient(135deg, rgba(74,99,120,0.10), rgba(176,134,84,0.04))" }}>
        <div style={{ width: 60, height: 60, borderRadius: 999, background: "var(--slateblue)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative" }}>
          <Icon name="users" size={26}/>
          {bidsIn < cap && (
            <div style={{ position: "absolute", inset: -4, borderRadius: 999, border: "2px solid var(--slateblue)", opacity: 0.4, animation: "pulse 1.6s infinite" }}/>
          )}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{bidsIn >= cap ? "All bids in!" : "Pinging qualified pros…"}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{woId} · {cat.t} · {data.pickedSlot}</div>
      </div>

      {/* Bid progress */}
      <div className="card" style={{ padding: 18, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Bids received</div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--slateblue)" }}>{bidsIn} / {cap}</div>
        </div>
        <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${(bidsIn / cap) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--slateblue), var(--bronze))", transition: "width 600ms var(--ease)" }}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
          {Array.from({ length: cap }).map((_, i) => {
            const arrived = i < bidsIn;
            const initials = ["MP", "DH", "AC", "RC", "JS"][i];
            const colors = ["#B0463A", "#7A8B4C", "#4A6378", "#B08654", "#D08A2E"];
            const names  = ["Miguel P.", "Devin H.", "Aria C.", "Renata C.", "Jordan S."];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: arrived ? "var(--surface-2)" : "transparent", border: `1px dashed ${arrived ? "transparent" : "var(--line)"}`, opacity: arrived ? 1 : 0.5, transition: "all 300ms var(--ease)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: arrived ? colors[i] : "var(--surface-3)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {arrived ? initials : "?"}
                </div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>
                  {arrived ? names[i] : "Waiting on bid…"}
                </div>
                {arrived && <span className="pill pill-info" style={{ fontSize: 10, height: 18 }}>NEW</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 14, background: "rgba(176,134,84,0.06)", borderColor: "rgba(176,134,84,0.3)" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Icon name="info" size={14} color="var(--bronze)"/>
          <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
            We'll text you the moment all <strong style={{ color: "var(--text)" }}>{cap}</strong> bids are in. You'll see them side-by-side with prices, ETAs, photos, and pitches — pick the one you like.
          </div>
        </div>
      </div>
    </div>
  );
}

window.ConsumerSubmit = ConsumerSubmit;

// ── Bid mode picker — instant claim vs. compare 3 bids ──
function HOBidMode({ data, upd, cat }) {
  const fairLow  = Math.round((cat?.from || 99) * 0.85);
  const fairHigh = Math.round((cat?.from || 99) * 1.45);
  const fairMid  = Math.round((fairLow + fairHigh) / 2);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>How should we pick your tech?</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>Either way, every Daedalus tech is licensed, insured, background-checked, and AI-vetted for this trade.</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Instant — first qualified tech grabs */}
        <button onClick={() => upd({ bidMode: "instant" })} style={{
          padding: 18, borderRadius: 12, textAlign: "left", cursor: "pointer", color: "var(--text)",
          background: data.bidMode === "instant" ? "rgba(176,134,84,0.08)" : "var(--surface)",
          border: `2px solid ${data.bidMode === "instant" ? "var(--bronze)" : "var(--line)"}`,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: data.bidMode === "instant" ? "var(--bronze)" : "var(--surface-2)", color: data.bidMode === "instant" ? "white" : "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="zap" size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Just send me a tech — fast</div>
              <span className="pill" style={{ background: "rgba(122,139,76,0.18)", color: "var(--olive)", height: 20, fontSize: 10 }}>FASTEST</span>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
              First Daedalus-vetted pro to grab the job at a fair price gets it. Typically dispatched in 90 sec. Guaranteed to fall inside our fair-price band.
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 11 }}>
              <div className="muted"><Icon name="schedule" size={11}/> ~90 sec to claim</div>
              <div className="muted"><Icon name="shield" size={11}/> Fair price guaranteed</div>
            </div>
          </div>
        </button>

        {/* Compare — wait for N bids */}
        <button onClick={() => upd({ bidMode: "compare" })} style={{
          padding: 18, borderRadius: 12, textAlign: "left", cursor: "pointer", color: "var(--text)",
          background: data.bidMode === "compare" ? "rgba(74,99,120,0.08)" : "var(--surface)",
          border: `2px solid ${data.bidMode === "compare" ? "var(--slateblue)" : "var(--line)"}`,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: data.bidMode === "compare" ? "var(--slateblue)" : "var(--surface-2)", color: data.bidMode === "compare" ? "white" : "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="users" size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Let me compare bids</div>
              <span className="pill" style={{ background: "rgba(74,99,120,0.18)", color: "var(--slateblue)", height: 20, fontSize: 10 }}>BEST VALUE</span>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
              We'll collect the first <strong style={{ color: "var(--text)" }}>3 bids</strong> from qualified pros, then ping you to pick the one you like — by price, ETA, or pitch.
            </div>

            {data.bidMode === "compare" && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <div className="muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Bid count cap</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[2, 3, 5].map(n => (
                    <button key={n} onClick={(e) => { e.stopPropagation(); upd({ minBids: n }); }} style={{
                      flex: 1, padding: "10px 8px", borderRadius: 8, cursor: "pointer", color: "var(--text)",
                      background: data.minBids === n ? "var(--slateblue)" : "var(--surface)",
                      border: `1px solid ${data.minBids === n ? "var(--slateblue)" : "var(--line)"}`,
                      fontSize: 12, fontWeight: 600,
                    }}>
                      {n} bids
                      {data.minBids === n && <span style={{ color: "white", display: "block", fontSize: 10, fontWeight: 400, marginTop: 2 }}>then closes</span>}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: 10, background: "var(--surface-2)", borderRadius: 8, fontSize: 11, lineHeight: 1.5, color: "var(--text-2)" }}>
                  <Icon name="info" size={11} color="var(--slateblue)"/>{" "}
                  Bids close as soon as <strong>{data.minBids}</strong> qualified pros offer. Typically <strong>3–8 min</strong> for your trade in this area.
                </div>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Fair-price strip (always visible) */}
      <div className="card" style={{ padding: 14, marginTop: 16, background: "rgba(122,139,76,0.06)", borderColor: "rgba(122,139,76,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Icon name="shield" size={14} color="var(--olive)"/>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Fair-price band for {cat?.t || "this work"} in 85018</div>
        </div>
        <div style={{ position: "relative", height: 28, marginBottom: 6 }}>
          <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 4, background: "var(--surface-3)", borderRadius: 999 }}/>
          <div style={{ position: "absolute", top: 12, left: "20%", right: "20%", height: 4, background: "linear-gradient(90deg, var(--olive), var(--bronze), var(--olive))", borderRadius: 999 }}/>
          <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: 999, background: "var(--bronze)", border: "2px solid var(--surface)" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span className="mono muted">${fairLow}</span>
          <span className="mono" style={{ color: "var(--bronze)", fontWeight: 700 }}>median ${fairMid}</span>
          <span className="mono muted">${fairHigh}</span>
        </div>
        <div className="muted" style={{ fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
          We block bids more than 50% over the comparable average and warn pros if they're outside the band — so you don't get gouged either way.
        </div>
      </div>
    </div>
  );
}
