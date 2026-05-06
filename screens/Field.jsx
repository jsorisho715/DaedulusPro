// Field Tech mobile app — phone frame with multi-step job card flow

function Field({ onNav }) {
  const M = window.MOCK;
  const wo = M.WOS.find(w => w.id === "WO-3026"); // en-route
  const [stage, setStage] = React.useState("dispatch"); // dispatch, enroute, onsite, work, signoff, done
  const [photos, setPhotos] = React.useState({ before: 0, during: 0, after: 0 });
  const [tasks, setTasks] = React.useState([
    { t: "Confirm reader make/model on site", done: false },
    { t: "Test failed reader at controller (multimeter)", done: false },
    { t: "Pull replacement HID Signo from truck", done: false },
    { t: "Swap reader, terminate Wiegand + power", done: false },
    { t: "Test mobile credential read (3 cards)", done: false },
    { t: "Reactivate door in C•Cure 9000", done: false },
  ]);
  const [signature, setSignature] = React.useState(false);

  return (
    <div className="page" style={{ padding: 28, display: "flex", gap: 30, justifyContent: "center", alignItems: "flex-start", overflow: "auto" }}>
      <div style={{ width: 320, flexShrink: 0, position: "sticky", top: 28 }}>
        <h1 className="h-serif" style={{ fontSize: 28, margin: 0, fontWeight: 600 }}>Field App</h1>
        <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>Mobile-first, offline-capable. Built around the photo as the primary unit of work.</div>

        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Job stage</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { k: "dispatch", l: "Dispatched", d: "Job assigned" },
            { k: "enroute", l: "En route", d: "Driving to site" },
            { k: "onsite", l: "On site", d: "Arrival check-in" },
            { k: "work", l: "Working", d: "Active scope" },
            { k: "signoff", l: "Sign-off", d: "Customer + photos" },
            { k: "done", l: "Complete", d: "Synced to back office" },
          ].map(s => (
            <button key={s.k} onClick={() => setStage(s.k)} className="card" style={{
              padding: "10px 12px", textAlign: "left", border: stage === s.k ? "1px solid var(--bronze)" : "1px solid var(--line)",
              background: stage === s.k ? "rgba(176,134,84,0.06)" : "var(--surface)",
              color: "var(--text)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 999, border: stage === s.k ? "2px solid var(--bronze)" : "1.5px solid var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stage === s.k && <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--bronze)" }}/>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.l}</div>
                <div className="muted" style={{ fontSize: 11 }}>{s.d}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 14, marginTop: 18, background: "var(--surface-2)" }}>
          <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Tech</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <Avatar user={M.TEAM.find(t => t.id === "u_mp")} size={32}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Miguel Padilla</div>
              <div className="muted" style={{ fontSize: 11 }}>Field Lead · iPhone 15</div>
            </div>
          </div>
        </div>
      </div>

      <PhoneFrame>
        <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column", color: "var(--text)" }}>
          <FieldHeader stage={stage} wo={wo}/>
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
            {stage === "dispatch" && <FieldDispatch wo={wo} onAccept={() => { setStage("enroute"); window.toast({ kind: "success", title: "Job accepted", msg: "ETA shared with PM." }); }}/>}
            {stage === "enroute" && <FieldEnroute wo={wo} onArrive={() => { setStage("onsite"); window.toast({ kind: "success", title: "Arrived on site", msg: "Geo-stamp recorded." }); }}/>}
            {stage === "onsite" && <FieldOnsite photos={photos} setPhotos={setPhotos} onStart={() => setStage("work")}/>}
            {stage === "work" && <FieldWork tasks={tasks} setTasks={setTasks} photos={photos} setPhotos={setPhotos} onComplete={() => setStage("signoff")}/>}
            {stage === "signoff" && <FieldSignoff signature={signature} setSignature={setSignature} photos={photos} setPhotos={setPhotos} onSubmit={() => { setStage("done"); window.toast({ kind: "success", title: "Job complete", msg: "Synced. PM notified." }); }}/>}
            {stage === "done" && <FieldDone onNav={onNav}/>}
          </div>
          <FieldNav stage={stage}/>
        </div>
      </PhoneFrame>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 390, height: 800, borderRadius: 48, background: "#0B0D10",
      padding: 14, boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
      flexShrink: 0,
    }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", position: "relative", background: "var(--bg)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 30, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", fontSize: 13, fontWeight: 600, zIndex: 10, color: "var(--text)" }}>
          <span>9:41</span>
          <div style={{ width: 100, height: 26, background: "#0B0D10", borderRadius: 999 }}/>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>● ● ● 100%</span>
        </div>
        <div style={{ height: "100%", paddingTop: 30 }}>{children}</div>
      </div>
    </div>
  );
}

function FieldHeader({ stage, wo }) {
  const M = window.MOCK;
  const prop = M.PROPERTIES.find(p => p.id === wo.property);
  return (
    <div style={{ padding: "10px 18px 14px", borderBottom: "1px solid var(--line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 700 }}>{wo.id}</div>
        <UrgencyPill u={wo.urgency} small/>
      </div>
      <div className="h-serif" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.25, marginTop: 4 }}>{wo.title}</div>
      <div className="muted" style={{ fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="location" size={11}/> {prop.name}
      </div>
    </div>
  );
}

function FieldDispatch({ wo, onAccept }) {
  const M = window.MOCK;
  const prop = M.PROPERTIES.find(p => p.id === wo.property);
  return (
    <div style={{ padding: "16px 18px" }}>
      <div className="card" style={{ padding: 12, background: "var(--surface-2)", marginBottom: 14 }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Address</div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{prop.addr}</div>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 10, width: "100%" }}><Icon name="map" size={12}/> Open in Maps · 14 min</button>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{wo.desc}</div>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Materials needed</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        {["HID Signo 20 — Mullion", "Wiegand cable 22/6 (10ft)", "Tap connectors", "Multimeter"].map(m => (
          <div key={m} className="card" style={{ padding: "8px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={12} color="var(--olive)"/> {m}
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={onAccept}>Accept job · Start drive</button>
    </div>
  );
}

function FieldEnroute({ wo, onArrive }) {
  const M = window.MOCK;
  const prop = M.PROPERTIES.find(p => p.id === wo.property);
  return (
    <div>
      <div style={{ height: 280, background: "linear-gradient(135deg, #1a2332, #0f1a26)", position: "relative", overflow: "hidden" }}>
        {/* Faux map */}
        <svg width="100%" height="100%" viewBox="0 0 360 280" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(176,134,84,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="360" height="280" fill="url(#grid)"/>
          <path d="M 40 240 Q 120 200 180 160 T 320 60" stroke="var(--bronze)" strokeWidth="3" fill="none" strokeDasharray="6 4"/>
          <circle cx="40" cy="240" r="8" fill="var(--olive)"/>
          <circle cx="40" cy="240" r="14" fill="var(--olive)" opacity="0.3"/>
          <circle cx="320" cy="60" r="10" fill="var(--terracotta)"/>
        </svg>
        <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, padding: 12, background: "rgba(11,13,16,0.85)", borderRadius: 10, color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>ETA</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>9 min</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Distance</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>3.4 mi</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div className="card" style={{ padding: 12, marginBottom: 12 }}>
          <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Driving to</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{prop.name}</div>
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{prop.addr}</div>
        </div>
        <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={onArrive}><Icon name="location" size={14}/> I've arrived</button>
        <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }}><Icon name="phone" size={14}/> Call PM (Diego)</button>
      </div>
    </div>
  );
}

function FieldOnsite({ photos, setPhotos, onStart }) {
  return (
    <div style={{ padding: 18 }}>
      <div className="card" style={{ padding: 14, marginBottom: 12, background: "var(--olive)", color: "white", border: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="check" size={20}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Checked in on site</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>9:41 AM · ±8m geofence</div>
          </div>
        </div>
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Required: Before photos (min 3)</div>
      <PhotoGrid count={photos.before} max={6} onAdd={() => setPhotos({...photos, before: Math.min(6, photos.before + 1)})}/>

      <div className="muted" style={{ fontSize: 11, marginTop: 14, padding: 12, background: "var(--surface-2)", borderRadius: 8, lineHeight: 1.5 }}>
        <Icon name="info" size={12} color="var(--slateblue)"/> Photos must include EXIF + geo-stamp. Daedalus auto-tags time, location, and tech ID at capture.
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }} disabled={photos.before < 3} onClick={onStart}>
        Begin scope of work {photos.before < 3 && `(${3 - photos.before} more photos needed)`}
      </button>
    </div>
  );
}

function FieldWork({ tasks, setTasks, photos, setPhotos, onComplete }) {
  const allDone = tasks.every(t => t.done);
  const toggle = i => setTasks(t => t.map((x, j) => j === i ? { ...x, done: !x.done } : x));
  return (
    <div style={{ padding: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Scope tasks ({tasks.filter(t=>t.done).length}/{tasks.length})</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        {tasks.map((task, i) => (
          <button key={i} onClick={() => toggle(i)} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, textAlign: "left", cursor: "pointer", background: task.done ? "rgba(122,139,76,0.06)" : "var(--surface)" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: task.done ? 0 : "1.5px solid var(--text-3)", background: task.done ? "var(--olive)" : "transparent", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {task.done && <Icon name="check" size={14}/>}
            </div>
            <div style={{ fontSize: 13, color: task.done ? "var(--text-3)" : "var(--text)", textDecoration: task.done ? "line-through" : "none", lineHeight: 1.3 }}>{task.t}</div>
          </button>
        ))}
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>During photos</div>
      <PhotoGrid count={photos.during} max={8} onAdd={() => setPhotos({...photos, during: photos.during + 1})}/>

      <div className="card" style={{ padding: 12, marginTop: 14, background: "var(--surface-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Truck stock · Van #2</div>
          <button className="btn btn-ghost btn-sm" style={{ padding: "2px 6px", fontSize: 10 }}>Reorder</button>
        </div>
        {[
          { p: "HID Signo 20 readers", on: 1, par: 3, unit: "$248", low: true },
          { p: "Wiegand 22/6 cable",   on: 24, par: 50, unit: "/ft", low: false },
          { p: "Tap connectors",       on: 18, par: 24, unit: "/pk", low: false },
          { p: "Mullion mount kits",   on: 0, par: 4, unit: "$32", low: true },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: i ? "1px solid var(--line)" : 0, fontSize: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{s.p}</div>
              <div className="muted" style={{ fontSize: 10 }}>On hand · <span style={{ color: s.low ? "var(--terracotta)" : "var(--olive)" }}>{s.on}</span> / par {s.par} {s.unit}</div>
            </div>
            {s.low && <button className="btn btn-secondary btn-sm" style={{ padding: "3px 8px", fontSize: 10 }}>Order</button>}
          </div>
        ))}
        <div style={{ marginTop: 8, padding: 8, background: "var(--bg)", borderRadius: 6, fontSize: 10, color: "var(--text-2)", lineHeight: 1.4 }}>
          <strong style={{ color: "var(--bronze)" }}>Daedalus Supply</strong> · 2 items below par. Next-day delivery to Phoenix yard · est. {fmt$(312)}
        </div>
      </div>

      <div className="card" style={{ padding: 12, marginTop: 14, background: "var(--surface-2)" }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Materials used</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>HID Signo 20 reader · 1 ea</span><span className="mono">$248</span></div>
          <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Wiegand 22/6 cable · 8 ft</span><span className="mono">$22</span></div>
          <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Tap connectors · 4 ea</span><span className="mono">$6</span></div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: "100%" }}><Icon name="plus" size={12}/> Add material</button>
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }} disabled={!allDone} onClick={onComplete}>
        {allDone ? "Mark complete · Sign-off" : `${tasks.filter(t=>!t.done).length} tasks remaining`}
      </button>
    </div>
  );
}

function FieldSignoff({ signature, setSignature, photos, setPhotos, onSubmit }) {
  return (
    <div style={{ padding: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>After photos</div>
      <PhotoGrid count={photos.after} max={6} onAdd={() => setPhotos({...photos, after: Math.min(6, photos.after + 1)})}/>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 18, marginBottom: 8 }}>Customer sign-off</div>
      <div className="card" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>Signed by:</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Diego Martín · Maintenance Supervisor</div>
        <div className="muted" style={{ fontSize: 11 }}>Solano Lofts · 9:41 AM</div>
      </div>
      <div onClick={() => setSignature(true)} style={{
        height: 120, border: "1px dashed var(--line-strong)", borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: signature ? "var(--surface-2)" : "var(--surface)",
        cursor: "pointer", position: "relative",
      }}>
        {signature ? (
          <svg width="140" height="60" viewBox="0 0 140 60">
            <path d="M 10 40 Q 30 10 50 35 T 90 30 Q 110 50 130 25" fill="none" stroke="var(--bronze)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <div className="muted" style={{ fontSize: 12 }}>Tap to sign</div>
        )}
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 18, marginBottom: 6 }}>Tech notes</div>
      <textarea className="textarea" placeholder="Anything PM should know…" defaultValue="HID Signo 20 installed and tested. Verified mobile credential read on 3 separate cards. C•Cure 9000 reactivated. Old reader showed water ingress at the back terminal — recommended sealing all clubhouse-side readers next PM."/>

      <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }} disabled={!signature || photos.after < 3} onClick={onSubmit}>
        Submit job
      </button>
    </div>
  );
}

function FieldDone({ onNav }) {
  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 999, background: "var(--olive)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto" }}>
        <Icon name="check" size={40} strokeWidth={2.5}/>
      </div>
      <div className="h-serif" style={{ fontSize: 22, marginBottom: 6 }}>Job complete</div>
      <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Synced to Daedalus Pro. PM Diego Martín notified. Invoice draft auto-generated for review.</div>
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => onNav("invoices")}>View invoice draft</button>
      <button className="btn btn-ghost" style={{ marginTop: 8, width: "100%" }}>Next job in queue</button>
    </div>
  );
}

function PhotoGrid({ count, max, onAdd }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: `linear-gradient(135deg, hsl(${30+i*22},22%,28%), hsl(${22+i*8},30%,18%))`, position: "relative", border: "1px solid var(--line)" }}>
          <span className="pill" style={{ position: "absolute", top: 4, left: 4, fontSize: 9, height: 16, background: "rgba(0,0,0,0.6)", color: "white" }}>EXIF</span>
        </div>
      ))}
      {count < max && (
        <button onClick={onAdd} style={{ aspectRatio: "1", borderRadius: 8, background: "var(--surface-2)", border: "1px dashed var(--line-strong)", color: "var(--bronze)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontSize: 11 }}>
          <Icon name="camera" size={20}/>
          Photo
        </button>
      )}
    </div>
  );
}

function FieldNav({ stage }) {
  const items = [
    { k: "job", l: "Job", icon: "workorder" },
    { k: "queue", l: "Queue", icon: "list" },
    { k: "time", l: "Time", icon: "clock" },
    { k: "more", l: "More", icon: "settings" },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 64, display: "flex", borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
      {items.map(it => (
        <div key={it.k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: it.k === "job" ? "var(--bronze)" : "var(--text-3)", gap: 2 }}>
          <Icon name={it.icon} size={20}/>
          <div style={{ fontSize: 10, fontWeight: 600 }}>{it.l}</div>
        </div>
      ))}
    </div>
  );
}

window.Field = Field;
