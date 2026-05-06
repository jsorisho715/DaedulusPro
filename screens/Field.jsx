// Field Tech mobile app — full multi-view phone mockup.
//
// Tabs (bottom nav): Job · Queue · Time · More
// Inside More: Profile · Settings · Notifications · Truck · Help · Sign out
// Plus: floating push-notification stack, badge-unlock modal,
// task close-out sheets (photo / comment / measurement / scan).
//
// Drives off window.MOCK.FIELD_* data. Every prototype interaction is
// instrumented as if it were the real ship app.

function Field({ onNav }) {
  const M = window.MOCK;
  const wos = M.WOS;
  const queue = M.FIELD_QUEUE;
  const profile = M.FIELD_PROFILE;
  const tech = M.TEAM.find(t => t.id === profile.techId);

  // ── Top-level UI state ──────────────────────────────────────────────
  // view = which screen the phone shows. The bottom tab bar drives this.
  const [view, setView] = React.useState("job");
  // Which WO is currently active in the Job tab.
  const [activeWoId, setActiveWoId] = React.useState(queue[0].id);
  const [stage, setStage] = React.useState("dispatch"); // dispatch, enroute, onsite, work, signoff, done
  const [photos, setPhotos] = React.useState({ before: 0, during: 0, after: 0 });

  // Per-WO checklist completion. Resets when activeWoId changes.
  const activeQueue = queue.find(q => q.id === activeWoId) || queue[0];
  const template = M.FIELD_TEMPLATES[activeQueue.template];
  const [taskState, setTaskState] = React.useState(() => initTaskState(template));
  React.useEffect(() => { setTaskState(initTaskState(template)); setStage("dispatch"); setPhotos({ before: 0, during: 0, after: 0 }); }, [activeWoId]);

  const [signature, setSignature] = React.useState(false);
  const [settings, setSettings] = React.useState(M.FIELD_SETTINGS_DEFAULT);

  // Push-notification stack. Replays from FIELD_NOTIFS schedule.
  const [pushes, setPushes] = React.useState([]);
  React.useEffect(() => {
    const timers = [];
    M.FIELD_NOTIFS.forEach(n => {
      timers.push(setTimeout(() => {
        setPushes(prev => [...prev.slice(-2), { ...n, ts: Date.now() }]);
        // Auto-dismiss after 6s
        timers.push(setTimeout(() => setPushes(prev => prev.filter(p => p.id !== n.id)), 6000));
      }, n.at * 1000));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Selected badge for the unlock modal.
  const [openBadge, setOpenBadge] = React.useState(null);
  // Open task sheet — { taskId, kind } or null.
  const [openTask, setOpenTask] = React.useState(null);

  // Active job timer (live ticking elapsed for the active WO).
  const [elapsedSec, setElapsedSec] = React.useState(M.FIELD_TIME.activeTimer.elapsedSec);
  React.useEffect(() => {
    const id = setInterval(() => setElapsedSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="page" style={{ padding: 28, display: "flex", gap: 30, justifyContent: "center", alignItems: "flex-start", overflow: "auto" }}>
      <FieldDesktopRail
        stage={stage} setStage={setStage}
        view={view} setView={setView}
        activeWoId={activeWoId} setActiveWoId={setActiveWoId}
        queue={queue} tech={tech}
      />

      <PhoneFrame settings={settings}>
        <PushStack pushes={pushes} onTap={(p) => { if (p.route) setView(p.route); setPushes(prev => prev.filter(x => x.id !== p.id)); }} onDismiss={(id) => setPushes(prev => prev.filter(x => x.id !== id))}/>

        <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column", color: "var(--text)" }}>
          <ViewHeader view={view} stage={stage} wo={activeQueue} setView={setView} elapsedSec={elapsedSec}/>

          <div key={view + stage} style={{ flex: 1, overflowY: "auto", paddingBottom: 80, animation: "fadeUp 220ms var(--ease)" }}>
            {view === "job" && (
              <>
                {stage === "dispatch" && <FieldDispatch queue={activeQueue} template={template} onAccept={() => { setStage("enroute"); window.toast({ kind: "success", title: "Job accepted", msg: "ETA shared with PM." }); }}/>}
                {stage === "enroute" && <FieldEnroute queue={activeQueue} onArrive={() => { setStage("onsite"); window.toast({ kind: "success", title: "Arrived on site", msg: "Geo-stamp recorded." }); }}/>}
                {stage === "onsite" && <FieldOnsite photos={photos} setPhotos={setPhotos} onStart={() => setStage("work")}/>}
                {stage === "work" && <FieldWork template={template} taskState={taskState} setTaskState={setTaskState} photos={photos} setPhotos={setPhotos} onComplete={() => setStage("signoff")} onTaskTap={setOpenTask}/>}
                {stage === "signoff" && <FieldSignoff signature={signature} setSignature={setSignature} photos={photos} setPhotos={setPhotos} onSubmit={() => { setStage("done"); window.toast({ kind: "success", title: "Job complete", msg: "Synced. PM notified." }); }}/>}
                {stage === "done" && <FieldDone onNext={() => { setActiveWoId(queue.find(q => q.status === "scheduled")?.id || queue[0].id); window.toast({ kind: "info", title: "Next job loaded", msg: "Driving instructions ready." }); }} onNav={onNav}/>}
              </>
            )}
            {view === "queue" && <QueueView queue={queue} active={activeWoId} onPick={(id) => { setActiveWoId(id); setView("job"); }}/>}
            {view === "time" && <TimeView elapsedSec={elapsedSec}/>}
            {view === "more" && <MoreView onGo={setView} tech={tech}/>}
            {view === "profile" && <ProfileView tech={tech} onBadge={setOpenBadge}/>}
            {view === "settings" && <SettingsView settings={settings} onChange={setSettings}/>}
            {view === "notifications" && <NotificationsView/>}
            {view === "truck" && <TruckView/>}
          </div>

          <FieldNav view={view} setView={setView}/>
        </div>

        {openBadge && <BadgeUnlockSheet badge={openBadge} onClose={() => setOpenBadge(null)}/>}
        {openTask && <TaskCloseoutSheet task={openTask} template={template} onSubmit={(payload) => { setTaskState(s => ({ ...s, [openTask.id]: { done: true, ...payload } })); setOpenTask(null); window.toast({ kind: "success", title: "Step completed", msg: openTask.label }); }} onClose={() => setOpenTask(null)}/>}
      </PhoneFrame>
    </div>
  );
}

// Each task starts as { done: false }. Photos / comments / measurements
// merge their payload into this state when closed out.
function initTaskState(template) {
  const out = {};
  template.tasks.forEach(t => { out[t.id] = { done: false }; });
  return out;
}

// ──────────────────────────────────────────────────────────────────────
// Desktop rail (sticky panel left of the phone frame). Acts as the
// designer's documentation: stage timeline + queue switcher.
// ──────────────────────────────────────────────────────────────────────
function FieldDesktopRail({ stage, setStage, view, setView, activeWoId, setActiveWoId, queue, tech }) {
  return (
    <div style={{ width: 320, flexShrink: 0, position: "sticky", top: 28 }}>
      <h1 className="h-serif" style={{ fontSize: 28, margin: 0, fontWeight: 600 }}>Field App</h1>
      <div className="muted" style={{ fontSize: 13, marginTop: 6, marginBottom: 18 }}>Mobile-first, offline-capable. Photo as the unit of work, gamified rewards on the back end.</div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Job stage</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { k: "dispatch", l: "Dispatched",   d: "Job assigned" },
          { k: "enroute",  l: "En route",     d: "Driving to site" },
          { k: "onsite",   l: "On site",      d: "Arrival check-in" },
          { k: "work",     l: "Working",      d: "Multi-method checklist" },
          { k: "signoff",  l: "Sign-off",     d: "Customer + photos" },
          { k: "done",     l: "Complete",     d: "Synced to back office" },
        ].map(s => (
          <button key={s.k} onClick={() => { setView("job"); setStage(s.k); }} className="card" style={{
            padding: "10px 12px", textAlign: "left",
            border: stage === s.k && view === "job" ? "1px solid var(--bronze)" : "1px solid var(--line)",
            background: stage === s.k && view === "job" ? "rgba(176,134,84,0.06)" : "var(--surface)",
            color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10
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

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, margin: "18px 0 8px" }}>Switch active job</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {queue.filter(q => q.status !== "completed").map(q => {
          const tpl = window.MOCK.FIELD_TEMPLATES[q.template];
          const prop = window.MOCK.PROPERTIES.find(p => p.id === q.property);
          const isActive = activeWoId === q.id;
          return (
            <button key={q.id} onClick={() => { setActiveWoId(q.id); setView("job"); setStage("dispatch"); }} className="card" style={{
              padding: "10px 12px", textAlign: "left",
              border: isActive ? "1px solid var(--bronze)" : "1px solid var(--line)",
              background: isActive ? "rgba(176,134,84,0.06)" : "var(--surface)",
              color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: tpl.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={tpl.icon} size={14}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--bronze)" }}>{q.id}</div>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tpl.label}</div>
                <div className="muted" style={{ fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prop.name}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="card" style={{ padding: 14, marginTop: 18, background: "var(--surface-2)" }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Tech</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
          <Avatar user={tech} size={32}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{tech.name}</div>
            <div className="muted" style={{ fontSize: 11 }}>{tech.role} · iPhone 15</div>
          </div>
          <TierBadge tier="Preferred" size="sm"/>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Phone frame — shell, status bar, dynamic island, time clock.
// ──────────────────────────────────────────────────────────────────────
function PhoneFrame({ children, settings }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 48, background: "#0B0D10",
      padding: 14, boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
      flexShrink: 0, position: "sticky", top: 28,
    }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", position: "relative", background: "var(--bg)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 38, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", fontSize: 14, fontWeight: 600, zIndex: 30, color: "var(--text)" }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
          <div style={{ width: 110, height: 30, background: "#0B0D10", borderRadius: 999 }}/>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
            <span style={{ display: "inline-block", width: 14 }}>●●●</span>
            <Icon name="wifi" size={12}/>
            <span style={{ minWidth: 22, textAlign: "right" }}>87%</span>
          </span>
        </div>
        <div style={{ height: "100%", paddingTop: 38 }}>{children}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Push-notification stack. Slides in from top, dismiss on tap or after 6s.
// ──────────────────────────────────────────────────────────────────────
function PushStack({ pushes, onTap, onDismiss }) {
  return (
    <div style={{ position: "absolute", top: 44, left: 8, right: 8, zIndex: 28, pointerEvents: "none", display: "flex", flexDirection: "column", gap: 6 }}>
      {pushes.map((p, i) => (
        <button key={p.id} onClick={() => onTap(p)}
          style={{
            pointerEvents: "auto", textAlign: "left",
            background: "rgba(28,30,34,0.92)", color: "#FFF", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            animation: "fa-pushSlideIn 380ms cubic-bezier(0.32,0.72,0,1)",
            transform: `scale(${1 - i * 0.02})`, opacity: 1 - i * 0.05,
            cursor: "pointer",
          }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: p.color, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={p.icon} size={14}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
              <div style={{ fontSize: 10, opacity: 0.6, flexShrink: 0 }}>now</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 1, lineHeight: 1.35 }}>{p.body}</div>
          </div>
          <span onClick={(e) => { e.stopPropagation(); onDismiss(p.id); }} style={{ fontSize: 10, opacity: 0.5, padding: "2px 6px", borderRadius: 999, background: "rgba(255,255,255,0.08)", cursor: "pointer", flexShrink: 0 }}>×</span>
        </button>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Per-view header. Adapts to the current view + stage.
// ──────────────────────────────────────────────────────────────────────
function ViewHeader({ view, stage, wo, setView, elapsedSec }) {
  const M = window.MOCK;
  if (view === "job") {
    const tpl = M.FIELD_TEMPLATES[wo.template];
    const prop = M.PROPERTIES.find(p => p.id === wo.property);
    return (
      <div style={{ padding: "10px 18px 14px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 700 }}>{wo.id}</div>
          <UrgencyPill u={wo.urgency} small/>
        </div>
        <div className="h-serif" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25, marginTop: 4 }}>{tpl.label}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
          <div className="muted" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="location" size={11}/> {prop.name}
          </div>
          {(stage === "work" || stage === "signoff") && (
            <div className="mono" style={{ fontSize: 11, color: "var(--olive)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--olive)", animation: "fa-checkBounce 1500ms ease-in-out infinite" }}/>
              {fmtElapsed(elapsedSec)}
            </div>
          )}
        </div>
      </div>
    );
  }
  const titles = {
    queue: "Today's Queue",
    time: "Time",
    more: "More",
    profile: "Profile",
    settings: "Settings",
    notifications: "Notifications",
    truck: "Truck Stock",
  };
  const back = view === "profile" || view === "settings" || view === "notifications" || view === "truck";
  return (
    <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
      {back && <button onClick={() => setView("more")} style={{ background: "transparent", border: 0, color: "var(--bronze)", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500 }}>
        <Icon name="chevLeft" size={14}/>Back
      </button>}
      <div className="h-serif" style={{ fontSize: 19, fontWeight: 600, flex: 1 }}>{titles[view]}</div>
    </div>
  );
}

function fmtElapsed(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

// ──────────────────────────────────────────────────────────────────────
// JOB · Stage 1: Dispatch (job offer + scope + materials + accept)
// ──────────────────────────────────────────────────────────────────────
function FieldDispatch({ queue, template, onAccept }) {
  const M = window.MOCK;
  const prop = M.PROPERTIES.find(p => p.id === queue.property);
  const wo = M.WOS.find(w => w.id === queue.id) || {};
  return (
    <div style={{ padding: "16px 18px" }}>
      {/* Hero card with category icon + meta */}
      <div className="card" style={{ padding: 14, marginBottom: 14, background: `linear-gradient(135deg, ${template.color}, ${template.color}dd)`, color: "#FFF", border: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={template.icon} size={22}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{template.category}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>{template.label}</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, display: "flex", gap: 10 }}>
              <span><Icon name="clock" size={10}/> {template.duration}</span>
              <span><Icon name="list" size={10}/> {template.tasks.length} steps</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 12, background: "var(--surface-2)", marginBottom: 14 }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Address</div>
        <div style={{ fontSize: 13, marginTop: 2, fontWeight: 600 }}>{prop.name}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{prop.addr}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Icon name="map" size={12}/> Maps · {queue.etaMin} min</button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Icon name="phone" size={12}/> {queue.contact.split(" · ")[0].split(" ")[0]}</button>
        </div>
      </div>

      <div style={{ fontSize: 12, lineHeight: 1.55, marginBottom: 14 }}>{wo.desc || queue.note}</div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Materials needed</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        {template.materials.map(m => (
          <div key={m.p} className="card" style={{ padding: "8px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={12} color="var(--olive)"/>
            <span style={{ flex: 1 }}>{m.p}</span>
            <span className="muted mono" style={{ fontSize: 11 }}>{m.qty} {m.unit}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={onAccept}>Accept job · Start drive</button>
      <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8, color: "var(--terracotta)" }}>Decline (sends back to dispatch)</button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// JOB · Stage 2: En route — richer Google-Maps style mockup
// ──────────────────────────────────────────────────────────────────────
function FieldEnroute({ queue, onArrive }) {
  const M = window.MOCK;
  const prop = M.PROPERTIES.find(p => p.id === queue.property);

  // Animated vehicle progress 0→1 along the route polyline.
  const [t, setT] = React.useState(0.18);
  React.useEffect(() => {
    const id = setInterval(() => setT(v => Math.min(1, v + 0.0015)), 80);
    return () => clearInterval(id);
  }, []);

  // Sample the path at progress t.
  const path = [
    [40, 360], [80, 348], [120, 322], [160, 300], [200, 260],
    [230, 218], [248, 188], [254, 156], [262, 124], [276, 92], [304, 64],
  ];
  const pos = bezierAt(path, t);

  return (
    <div>
      <div style={{ height: 380, background: "linear-gradient(180deg, #DCE5DC, #E6E2D2)", position: "relative", overflow: "hidden" }}>
        {/* Faux-Google-Maps base */}
        <svg width="100%" height="100%" viewBox="0 0 360 380" style={{ position: "absolute", inset: 0 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gmap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(180,176,160,0.35)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="park" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#CFE0C0"/>
              <stop offset="1" stopColor="#B7CFA1"/>
            </linearGradient>
          </defs>
          <rect width="360" height="380" fill="#EAE5D5"/>
          <rect width="360" height="380" fill="url(#gmap-grid)"/>
          {/* Park */}
          <path d="M 240 240 L 330 215 L 350 280 L 280 320 Z" fill="url(#park)" opacity="0.85"/>
          <text x="290" y="275" fontSize="9" fill="#6B7860" fontFamily="var(--sans)" textAnchor="middle">Encanto Park</text>
          {/* Water */}
          <path d="M 0 100 Q 60 90 100 110 T 180 105 L 180 80 L 0 80 Z" fill="#B6D6E0" opacity="0.7"/>
          <text x="80" y="98" fontSize="8" fill="#4D6B7A" fontFamily="var(--sans)" textAnchor="middle">Lake Pleasant</text>
          {/* Roads — major (yellow) */}
          <path d="M 0 200 L 360 180" stroke="#FFD66B" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 0 200 L 360 180" stroke="#E8B450" strokeWidth="0.7" fill="none"/>
          <text x="160" y="195" fontSize="8" fill="#7A6230" fontFamily="var(--sans)" fontWeight="600">N CENTRAL AVE</text>
          {/* Roads — interstate (orange) */}
          <path d="M 220 0 L 260 380" stroke="#FF9F43" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.85"/>
          <text x="252" y="360" fontSize="9" fill="#7A4F1A" fontFamily="var(--sans)" fontWeight="700">I-10</text>
          {/* Roads — minor (white) */}
          <path d="M 0 280 L 360 270" stroke="#FFF" strokeWidth="5" fill="none"/>
          <path d="M 80 0 L 90 380" stroke="#FFF" strokeWidth="4" fill="none"/>
          <path d="M 320 0 L 305 380" stroke="#FFF" strokeWidth="4" fill="none"/>
          <path d="M 140 0 L 152 380" stroke="#FFF" strokeWidth="3.5" fill="none"/>
          <path d="M 0 60 L 360 50"   stroke="#FFF" strokeWidth="3.5" fill="none"/>
          <path d="M 0 320 L 360 310" stroke="#FFF" strokeWidth="3.5" fill="none"/>
          {/* Buildings (rough silhouettes) */}
          {[
            [25, 130, 22, 30], [54, 132, 16, 25], [108, 220, 22, 25], [125, 250, 18, 18],
            [185, 130, 18, 22], [165, 305, 24, 28], [285, 105, 18, 22], [330, 220, 14, 18],
            [55, 230, 12, 14], [70, 210, 10, 22], [200, 60, 16, 16], [340, 40, 12, 14],
          ].map(([x,y,w,h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#D6CDB6" stroke="#B6AC95" strokeWidth="0.5" rx="1"/>
          ))}

          {/* Route polyline (blue, thick, thin border) */}
          <path d={catmullSpline(path)} fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
          <path d={catmullSpline(path)} fill="none" stroke="#3A7BD5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Animated dashes along the route */}
          <path d={catmullSpline(path)} fill="none" stroke="#FFF" strokeWidth="2" strokeDasharray="8 14" strokeLinecap="round" style={{ animation: "fa-dashFlow 1200ms linear infinite" }}/>

          {/* Origin marker */}
          <circle cx="40" cy="360" r="6" fill="#FFF"/>
          <circle cx="40" cy="360" r="4" fill="#3A7BD5"/>

          {/* Destination pin */}
          <g transform="translate(304, 64)">
            <circle r="14" fill="#B0463A" opacity="0.18" style={{ animation: "fa-pulseRing 2000ms ease-out infinite" }}/>
            <path d="M 0 -10 a 10 10 0 1 1 0 20 a 10 10 0 1 1 0 -20" fill="#B0463A" stroke="#FFF" strokeWidth="2"/>
            <circle r="3.5" fill="#FFF"/>
          </g>

          {/* Vehicle marker — animated */}
          <g transform={`translate(${pos.x}, ${pos.y})`} style={{ animation: "fa-vehiclePulse 2400ms ease-in-out infinite" }}>
            <circle r="11" fill="rgba(176,134,84,0.25)"/>
            <circle r="8" fill="#B08654" stroke="#FFF" strokeWidth="2"/>
            <path d="M 0 -3.5 L 3 3.5 L 0 1.5 L -3 3.5 Z" fill="#FFF"/>
          </g>
        </svg>

        {/* Top — turn-by-turn instruction banner */}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, padding: "10px 12px", background: "rgba(11,13,16,0.92)", borderRadius: 12, color: "#FFF", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#3A7BD5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 5l7 7-7 7M3 12h18"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>In 0.4 mi</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Turn right onto E Roosevelt St</div>
          </div>
          <div className="mono" style={{ fontSize: 11, opacity: 0.7 }}>2</div>
        </div>

        {/* Bottom — ETA card with traffic + route stats */}
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, padding: 12, background: "rgba(11,13,16,0.92)", borderRadius: 14, color: "#FFF", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: "0.06em", textTransform: "uppercase" }}>ETA</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>9 min</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>Arrives 1:42 PM</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: "0.06em", textTransform: "uppercase" }}>Distance</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>3.4</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>miles</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: "0.06em", textTransform: "uppercase" }}>Traffic</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFC97A", marginTop: 7, display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <span style={{ width: 4, height: 14, background: "#7BD389", borderRadius: 1 }}/>
                <span style={{ width: 4, height: 14, background: "#FFC97A", borderRadius: 1 }}/>
                <span style={{ width: 4, height: 14, background: "rgba(255,255,255,0.18)", borderRadius: 1 }}/>
              </div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>Light</div>
            </div>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", gap: 8 }}>
            <button className="btn btn-sm" style={{ flex: 1, background: "rgba(255,255,255,0.12)", color: "#FFF", border: 0 }}><Icon name="phone" size={12}/> Resident</button>
            <button className="btn btn-sm" style={{ flex: 1, background: "rgba(255,255,255,0.12)", color: "#FFF", border: 0 }}><Icon name="message" size={12}/> Dispatch</button>
            <button className="btn btn-sm" style={{ flex: 1, background: "rgba(255,255,255,0.12)", color: "#FFF", border: 0 }}><Icon name="alert" size={12}/> Delay</button>
          </div>
        </div>
      </div>

      <div style={{ padding: 18 }}>
        <div className="card" style={{ padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar user={M.TEAM.find(t => t.id === "u_mp")} size={36}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Driving to</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{prop.name}</div>
            <div className="muted" style={{ fontSize: 11 }}>{queue.contact}</div>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={onArrive}><Icon name="location" size={14}/> I've arrived</button>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Icon name="phone" size={12}/> Call PM</button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Icon name="message" size={12}/> Message</button>
        </div>
      </div>
    </div>
  );
}

// Catmull-Rom -> cubic Bézier spline through points (smooth route).
function catmullSpline(pts) {
  if (pts.length < 2) return "";
  const p = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M ${p(0)[0]} ${p(0)[1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function bezierAt(pts, t) {
  // Approximate by walking segments equally weighted.
  const n = pts.length - 1;
  const idx = Math.floor(t * n);
  const lt = (t * n) - idx;
  const a = pts[Math.min(idx, n)];
  const b = pts[Math.min(idx + 1, n)];
  return { x: a[0] + (b[0] - a[0]) * lt, y: a[1] + (b[1] - a[1]) * lt };
}

// ──────────────────────────────────────────────────────────────────────
// JOB · Stage 3: On site — check-in confirmation + before photos
// ──────────────────────────────────────────────────────────────────────
function FieldOnsite({ photos, setPhotos, onStart }) {
  return (
    <div style={{ padding: 18 }}>
      <div className="card" style={{ padding: 14, marginBottom: 12, background: "var(--olive)", color: "white", border: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={20}/>
            <div className="fa-pulse-ring" style={{ color: "rgba(255,255,255,0.7)" }}/>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Checked in on site</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>1:51 PM · ±8m geofence · GPS verified</div>
          </div>
        </div>
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Required: Before photos (min 3)</div>
      <PhotoGrid count={photos.before} max={6} onAdd={() => setPhotos({ ...photos, before: Math.min(6, photos.before + 1) })}/>

      <div className="muted" style={{ fontSize: 11, marginTop: 14, padding: 12, background: "var(--surface-2)", borderRadius: 8, lineHeight: 1.5 }}>
        <Icon name="info" size={12} color="var(--slateblue)"/> Photos auto-tagged with EXIF, GPS, time, and tech ID at capture. Required before scope tasks unlock.
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }} disabled={photos.before < 3} onClick={onStart}>
        Begin scope of work {photos.before < 3 && `(${3 - photos.before} more photos needed)`}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// JOB · Stage 4: Work — checklist with multi-method close-out
// ──────────────────────────────────────────────────────────────────────
function FieldWork({ template, taskState, setTaskState, photos, setPhotos, onComplete, onTaskTap }) {
  const doneCount = template.tasks.filter(t => taskState[t.id]?.done).length;
  const allRequiredDone = template.tasks.every(t => !t.required || taskState[t.id]?.done);

  return (
    <div style={{ padding: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
        <span>Scope ({doneCount}/{template.tasks.length})</span>
        <span style={{ color: "var(--bronze)" }}>{Math.round((doneCount / template.tasks.length) * 100)}%</span>
      </div>
      <div style={{ height: 4, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden", marginBottom: 14, position: "relative" }}>
        <div style={{ height: "100%", width: `${(doneCount / template.tasks.length) * 100}%`, background: "linear-gradient(90deg, var(--bronze), var(--brass))", transition: "width 320ms ease-out" }}/>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        {template.tasks.map((task) => {
          const state = taskState[task.id] || {};
          return (
            <TaskItem key={task.id} task={task} state={state}
              onComplete={() => task.kind === "check"
                ? setTaskState(s => ({ ...s, [task.id]: { done: true } }))
                : onTaskTap(task)
              }/>
          );
        })}
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>During photos (optional · {photos.during})</div>
      <PhotoGrid count={photos.during} max={8} onAdd={() => setPhotos({ ...photos, during: photos.during + 1 })}/>

      <div className="card" style={{ padding: 12, marginTop: 14, background: "var(--surface-2)" }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Materials used</div>
        {template.materials.map((m, i) => (
          <div key={m.p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderTop: i ? "1px solid var(--line)" : 0, fontSize: 12 }}>
            <span>{m.p} · {m.qty} {m.unit}</span>
            <span className="mono">${m.cost}</span>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6, width: "100%" }}><Icon name="plus" size={12}/> Add material</button>
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }} disabled={!allRequiredDone} onClick={onComplete}>
        {allRequiredDone ? "Mark complete · Sign-off" : `${template.tasks.filter(t => t.required && !taskState[t.id]?.done).length} required tasks left`}
      </button>
    </div>
  );
}

// Each row knows how to render itself based on close-out kind.
function TaskItem({ task, state, onComplete }) {
  const kindStyle = {
    check:       { icon: "check",  color: "var(--olive)",     label: "Tap when done" },
    photo:       { icon: "camera", color: "var(--bronze)",    label: `Photo · ${task.count || 1}` },
    comment:     { icon: "edit",   color: "var(--slateblue)", label: "Note required" },
    measurement: { icon: "target", color: "var(--amber)",     label: `Reading · ${task.unit || ""}` },
    scan:        { icon: "chip",   color: "var(--bronze)",    label: `Scan · ${task.count || 1}` },
  }[task.kind];

  return (
    <button onClick={onComplete} className="card" style={{
      padding: 12, display: "flex", alignItems: "flex-start", gap: 10,
      textAlign: "left", cursor: "pointer",
      background: state.done ? "rgba(122,139,76,0.06)" : "var(--surface)",
      border: state.done ? "1px solid rgba(122,139,76,0.32)" : "1px solid var(--line)",
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
        border: state.done ? 0 : `1.5px solid ${kindStyle.color}`,
        background: state.done ? "var(--olive)" : `${kindStyle.color}1A`,
        color: state.done ? "white" : kindStyle.color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {state.done
          ? <Icon name="check" size={14} style={{ animation: "fa-checkBounce 360ms ease-out" }}/>
          : <Icon name={kindStyle.icon} size={14}/>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, color: state.done ? "var(--text-3)" : "var(--text)", textDecoration: state.done ? "line-through" : "none" }}>
          {task.label}{!task.required && <span className="muted" style={{ fontWeight: 400 }}> · optional</span>}
        </div>
        {state.done && state.value && <div className="mono" style={{ fontSize: 11, color: "var(--olive)", marginTop: 2 }}>{state.value}</div>}
        {state.done && state.note && <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>“{state.note}”</div>}
        {!state.done && <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{kindStyle.label}{task.hint && ` · ${task.hint}`}</div>}
      </div>
      {!state.done && <Icon name="chevRight" size={14} color="var(--text-3)"/>}
    </button>
  );
}

// Bottom sheet: handles photo / comment / measurement / scan close-outs.
function TaskCloseoutSheet({ task, template, onSubmit, onClose }) {
  const [value, setValue] = React.useState("");
  const [shooting, setShooting] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);

  React.useEffect(() => {
    if (task.kind === "scan") {
      setScanning(true);
      const id = setTimeout(() => { setScanning(false); onSubmit({ value: "Scanned · " + (task.count || 1) + " items" }); }, 1800);
      return () => clearTimeout(id);
    }
  }, [task.id]);

  const renderBody = () => {
    if (task.kind === "photo") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ aspectRatio: "4/5", background: "linear-gradient(160deg, #3a3a3a, #1a1a1a)", borderRadius: 14, position: "relative", overflow: "hidden" }}>
            {/* Faux camera viewfinder */}
            <div style={{ position: "absolute", inset: 16, border: "2px solid rgba(255,255,255,0.4)", borderRadius: 8 }}/>
            <div style={{ position: "absolute", top: 16, left: 16, padding: "4px 8px", background: "rgba(0,0,0,0.5)", color: "#FFF", borderRadius: 4, fontSize: 9, letterSpacing: "0.06em" }}>EXIF · 33.45° N · 12:14 PM</div>
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.18)", border: 0, color: "#FFF", cursor: "pointer" }}>
                <Icon name="layers" size={14}/>
              </button>
              <button onClick={() => { setShooting(true); setTimeout(() => onSubmit({ value: `${task.count || 1} photo${(task.count || 1) > 1 ? "s" : ""} captured` }), 500); }} style={{ width: 64, height: 64, borderRadius: 999, background: "#FFF", border: "4px solid rgba(255,255,255,0.4)", cursor: "pointer", animation: shooting ? "fa-shutterPulse 240ms ease-out" : "none" }}/>
              <button style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.18)", border: 0, color: "#FFF", cursor: "pointer" }}>
                <Icon name="refresh" size={14}/>
              </button>
            </div>
            {shooting && <div style={{ position: "absolute", inset: 0, background: "#FFF", animation: "fa-flash 320ms ease-out" }}/>}
          </div>
          <div className="muted" style={{ fontSize: 11, lineHeight: 1.5, textAlign: "center" }}>
            <Icon name="info" size={11}/> Photo includes auto-tagged location, time, tech ID, and device serial.
          </div>
        </div>
      );
    }
    if (task.kind === "comment") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea autoFocus className="textarea" placeholder={task.hint || "Note for the record…"} value={value} onChange={(e) => setValue(e.target.value)} style={{ minHeight: 130 }}/>
          <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", color: "var(--bronze)" }}>
            <Icon name="mic" size={12}/> Voice-to-text
          </button>
          <button className="btn btn-primary btn-lg" disabled={!value.trim()} onClick={() => onSubmit({ note: value.trim() })}>Save note</button>
        </div>
      );
    }
    if (task.kind === "measurement") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="card" style={{ padding: 12, background: "var(--surface-2)" }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Expected range</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{task.expect} <span className="muted" style={{ fontSize: 11, fontWeight: 400 }}>{task.unit}</span></div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input autoFocus type="text" inputMode="decimal" className="input" placeholder="0.0" value={value} onChange={(e) => setValue(e.target.value)} style={{ flex: 1, fontSize: 18, fontWeight: 600 }}/>
            <div className="mono" style={{ fontSize: 13, color: "var(--text-3)", padding: "0 6px" }}>{task.unit}</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", color: "var(--bronze)" }}>
            <Icon name="zap" size={12}/> Auto-fill from Bluetooth meter
          </button>
          <button className="btn btn-primary btn-lg" disabled={!value.trim()} onClick={() => onSubmit({ value: `${value} ${task.unit || ""}` })}>Save reading</button>
        </div>
      );
    }
    // scan
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
        <div style={{ width: 200, height: 200, borderRadius: 18, background: "linear-gradient(160deg, #1a2640, #0d1320)", position: "relative", overflow: "hidden", border: "2px solid var(--bronze)" }}>
          <div style={{ position: "absolute", inset: 24, border: "2px dashed rgba(176,134,84,0.6)", borderRadius: 12 }}/>
          {scanning && <div style={{ position: "absolute", left: 12, right: 12, top: "50%", height: 2, background: "var(--bronze)", boxShadow: "0 0 12px var(--bronze)", animation: "fa-checkBounce 1200ms ease-in-out infinite" }}/>}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: "rgba(176,134,84,0.8)" }}>
            <Icon name="chip" size={32}/>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>{scanning ? "SCANNING…" : "READY"}</div>
          </div>
        </div>
        <div className="muted" style={{ fontSize: 12, textAlign: "center", lineHeight: 1.5 }}>
          {task.hint || "Hold steady. Auto-detects QR / barcode / Bluetooth pair."}
        </div>
      </div>
    );
  };

  return (
    <BottomSheet onClose={onClose} title={task.label}>
      {renderBody()}
    </BottomSheet>
  );
}

function BottomSheet({ children, onClose, title, fullHeight = false }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", animation: "fa-flash 200ms ease-out forwards", zIndex: 50 }}/>
      <div className="fa-sheet-anim" style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        maxHeight: fullHeight ? "100%" : "82%",
        background: "var(--surface)", borderRadius: "20px 20px 0 0",
        boxShadow: "0 -16px 40px rgba(0,0,0,0.18)",
        zIndex: 60, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "10px 0 6px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "var(--line-strong)" }}/>
        </div>
        <div style={{ padding: "8px 18px 12px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, paddingRight: 12 }}>{title}</div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 28, padding: 0 }}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding: 18, overflowY: "auto" }}>{children}</div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// JOB · Stage 5: Sign-off — after photos + signature pad + tech notes
// ──────────────────────────────────────────────────────────────────────
function FieldSignoff({ signature, setSignature, photos, setPhotos, onSubmit }) {
  return (
    <div style={{ padding: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>After photos</div>
      <PhotoGrid count={photos.after} max={6} onAdd={() => setPhotos({ ...photos, after: Math.min(6, photos.after + 1) })}/>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 18, marginBottom: 8 }}>Customer sign-off</div>
      <div className="card" style={{ padding: 14, marginBottom: 8 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>Signed by:</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Diego Martín · Maintenance Supervisor</div>
        <div className="muted" style={{ fontSize: 11 }}>Solano Lofts · 2:38 PM</div>
      </div>
      <div onClick={() => setSignature(true)} style={{
        height: 130, border: "1px dashed var(--line-strong)", borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: signature ? "var(--surface-2)" : "var(--surface)",
        cursor: "pointer",
      }}>
        {signature ? (
          <svg width="200" height="80" viewBox="0 0 200 80">
            <path d="M 12 56 Q 30 12 56 48 T 100 38 Q 132 70 168 32" fill="none" stroke="var(--bronze)" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 156 38 q 6 -2 10 4" fill="none" stroke="var(--bronze)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <div className="muted" style={{ fontSize: 12 }}>Tap to sign</div>
        )}
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 18, marginBottom: 6 }}>Tech notes</div>
      <textarea className="textarea" placeholder="Anything PM should know…" defaultValue="HID Signo 20 installed and tested. Verified mobile credential read on 3 separate cards. C•Cure 9000 reactivated. Old reader showed water ingress at the back terminal — recommend sealing all clubhouse-side readers next PM."/>

      <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 18 }} disabled={!signature || photos.after < 3} onClick={onSubmit}>
        Submit job
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// JOB · Stage 6: Done — celebration + next-job CTA
// ──────────────────────────────────────────────────────────────────────
function FieldDone({ onNext, onNav }) {
  return (
    <div style={{ padding: 30, textAlign: "center", position: "relative" }}>
      {/* confetti */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", top: 50, left: "50%",
          width: 8, height: 14, borderRadius: 2,
          background: ["var(--bronze)", "var(--olive)", "var(--amber)", "var(--terracotta)", "var(--slateblue)"][i % 5],
          animation: `fa-confetti ${1200 + i * 80}ms ease-out forwards`,
          "--cx": `${(i - 7) * 14}px`,
          "--cy": `${120 + (i % 4) * 20}px`,
          "--cr": `${i * 30}deg`,
        }}/>
      ))}
      <div style={{ width: 80, height: 80, borderRadius: 999, background: "var(--olive)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto", animation: "fa-badgePop 520ms cubic-bezier(0.32, 0.72, 0, 1)" }}>
        <Icon name="check" size={40} strokeWidth={2.5}/>
      </div>
      <div className="h-serif" style={{ fontSize: 22, marginBottom: 6 }}>Job complete</div>
      <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Synced to Daedalus Pro. PM Diego Martín notified. Invoice draft auto-generated.</div>

      <div className="card" style={{ padding: 14, marginTop: 22, background: "linear-gradient(135deg, rgba(176,134,84,0.10), rgba(208,138,46,0.10))", border: "1px solid rgba(176,134,84,0.32)", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="trophy" size={16} color="var(--amber)"/>
          <div style={{ fontSize: 13, fontWeight: 700 }}>+1 progress · Emergency Ace</div>
        </div>
        <div className="muted" style={{ fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>You're 8/10 on under-90-min emergencies. Two more jobs unlocks $150.</div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: 18, width: "100%" }} onClick={onNext}>Next job in queue</button>
      <button className="btn btn-ghost" style={{ marginTop: 8, width: "100%" }} onClick={() => onNav("invoices")}>View invoice draft</button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Photo grid (shared)
// ──────────────────────────────────────────────────────────────────────
function PhotoGrid({ count, max, onAdd }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: `linear-gradient(135deg, hsl(${30 + i * 22}, 22%, 28%), hsl(${22 + i * 8}, 30%, 18%))`, position: "relative", border: "1px solid var(--line)" }}>
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

// ──────────────────────────────────────────────────────────────────────
// QUEUE TAB — today's jobs ordered by time, route-optimization toggle
// ──────────────────────────────────────────────────────────────────────
function QueueView({ queue, active, onPick }) {
  const [opt, setOpt] = React.useState(true);
  const M = window.MOCK;
  return (
    <div style={{ padding: 18 }}>
      <div className="card" style={{ padding: 12, marginBottom: 12, background: "var(--surface-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Route optimization</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{opt ? "Saves 32 min vs. raw order" : "Tap to optimize"}</div>
          </div>
          <Switch on={opt} onChange={setOpt}/>
        </div>
      </div>

      {queue.map((q, i) => {
        const tpl = M.FIELD_TEMPLATES[q.template];
        const prop = M.PROPERTIES.find(p => p.id === q.property);
        const isActive = active === q.id;
        const t = new Date(q.scheduled);
        const time = t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        return (
          <button key={q.id} onClick={() => onPick(q.id)} className="card" style={{
            width: "100%", display: "flex", alignItems: "stretch", gap: 0, marginBottom: 8,
            border: isActive ? "1px solid var(--bronze)" : "1px solid var(--line)",
            background: isActive ? "rgba(176,134,84,0.06)" : "var(--surface)",
            color: "var(--text)", cursor: "pointer", textAlign: "left", padding: 0, overflow: "hidden",
          }}>
            <div style={{ width: 4, background: q.status === "completed" ? "var(--olive)" : q.status === "active" ? "var(--bronze)" : tpl.color }}/>
            <div style={{ padding: 12, flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 700 }}>{q.id}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{time}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{tpl.label}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="location" size={11}/> {prop.name}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span className="pill" style={{ background: `${tpl.color}1F`, color: tpl.color }}>
                  <Icon name={tpl.icon} size={10}/> {tpl.category}
                </span>
                <UrgencyPill u={q.urgency} small/>
                {q.status === "completed" && <span className="pill pill-success"><Icon name="check" size={10}/> Complete</span>}
                {q.status === "active" && <span className="pill pill-bronze"><span className="dot" style={{ animation: "fa-checkBounce 1500ms infinite" }}/> In progress</span>}
                {q.status === "scheduled" && <span className="pill pill-neutral">{q.distanceMi} mi · {q.etaMin} min</span>}
              </div>
            </div>
          </button>
        );
      })}

      <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8, color: "var(--bronze)" }}><Icon name="plus" size={12}/> Add break or personal time</button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// TIME TAB — today / week summary, live timer, ledger
// ──────────────────────────────────────────────────────────────────────
function TimeView({ elapsedSec }) {
  const M = window.MOCK;
  const t = M.FIELD_TIME;
  const active = t.entries.find(e => e.active);
  const wo = active ? M.WOS.find(w => w.id === active.woId) : null;

  return (
    <div style={{ padding: 18 }}>
      {/* Live timer */}
      <div className="card" style={{ padding: 16, marginBottom: 12, background: "linear-gradient(135deg, var(--bronze), var(--bronze-deep))", color: "#FFF", border: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: "#FFF", animation: "fa-checkBounce 1200ms infinite" }}/>
          <span style={{ fontSize: 11, opacity: 0.85, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>Active timer</span>
        </div>
        <div className="mono" style={{ fontSize: 36, fontWeight: 700, marginTop: 6, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          {fmtElapsed(elapsedSec)}
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{wo?.id || active?.woId} · {wo?.title || active?.label}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button className="btn btn-sm" style={{ flex: 1, background: "rgba(255,255,255,0.18)", color: "#FFF", border: 0 }}><Icon name="pause" size={12}/> Pause</button>
          <button className="btn btn-sm" style={{ flex: 1, background: "rgba(255,255,255,0.18)", color: "#FFF", border: 0 }}><Icon name="x" size={12}/> Stop</button>
        </div>
      </div>

      {/* Today / Week */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        <StatTile label="Today worked" value={`${t.today.worked}h`} hint={`${t.today.billable}h billable`}/>
        <StatTile label="Week" value={`${t.week.worked}h`} hint={`of ${t.week.target}h target`}/>
      </div>

      {/* Week progress bar */}
      <div className="card" style={{ padding: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>This week</div>
          <div className="mono" style={{ fontSize: 11 }}>{Math.round((t.week.worked / t.week.target) * 100)}%</div>
        </div>
        <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(t.week.worked / t.week.target) * 100}%`, background: "linear-gradient(90deg, var(--olive), var(--olive-soft))" }}/>
        </div>
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Today's ledger</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {t.entries.map((e, i) => (
          <div key={e.id} style={{ padding: "10px 12px", borderTop: i ? "1px solid var(--line)" : 0, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: e.kind === "job" ? "rgba(176,134,84,0.12)" : e.kind === "travel" ? "rgba(74,99,120,0.12)" : "rgba(122,139,76,0.12)", color: e.kind === "job" ? "var(--bronze)" : e.kind === "travel" ? "var(--slateblue)" : "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={e.kind === "job" ? "workorder" : e.kind === "travel" ? "car" : "leaf"} size={13}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{e.label}</div>
              <div className="muted" style={{ fontSize: 11 }}>{e.clockIn} → {e.clockOut || "now"}</div>
            </div>
            <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: e.active ? "var(--bronze)" : "var(--text)" }}>
              {Math.floor(e.durMin / 60)}h {e.durMin % 60}m
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatTile({ label, value, hint, color }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 2, color: color || "var(--text)" }}>{value}</div>
      {hint && <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{hint}</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// MORE TAB — entry points to Profile, Settings, Notifications, etc.
// ──────────────────────────────────────────────────────────────────────
function MoreView({ onGo, tech }) {
  const items = [
    { k: "profile",       l: "Profile & rewards",  d: "Tier, badges, $1,450 earned",    icon: "trophy", color: "var(--amber)" },
    { k: "notifications", l: "Notifications",      d: "8 unread",                        icon: "bell",   color: "var(--bronze)" },
    { k: "settings",      l: "Settings",           d: "Push, language, biometrics",     icon: "settings", color: "var(--slateblue)" },
    { k: "truck",         l: "Truck stock",        d: "2 items below par",              icon: "truck",  color: "var(--terracotta)" },
  ];
  const support = [
    { k: "help",     l: "Help & support",  d: "Live chat with dispatch",  icon: "info" },
    { k: "feedback", l: "Send feedback",   d: "Help shape the field app", icon: "message" },
    { k: "privacy",  l: "Privacy & legal", d: "Terms, EULA, data export", icon: "lock" },
    { k: "signout",  l: "Sign out",        d: "",                          icon: "x", danger: true },
  ];
  return (
    <div style={{ padding: 18 }}>
      <button onClick={() => onGo("profile")} className="card" style={{ padding: 14, marginBottom: 14, width: "100%", border: 0, background: "linear-gradient(135deg, var(--bronze), var(--bronze-deep))", color: "#FFF", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
        <Avatar user={tech} size={48}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{tech.name}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>{tech.role} · Phoenix metro</div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", fontSize: 11 }}>
            <TierBadge tier="Preferred" size="sm"/>
            <span style={{ opacity: 0.85 }}>Rank #1 · CSAT 4.92★</span>
          </div>
        </div>
        <Icon name="chevRight" size={16}/>
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
        {items.map(it => (
          <button key={it.k} onClick={() => onGo(it.k)} className="card" style={{ width: "100%", padding: 12, border: "1px solid var(--line)", background: "var(--surface)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${it.color}1A`, color: it.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={it.icon} size={16}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{it.l}</div>
              <div className="muted" style={{ fontSize: 11 }}>{it.d}</div>
            </div>
            <Icon name="chevRight" size={14} color="var(--text-3)"/>
          </button>
        ))}
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Support</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {support.map((s, i) => (
          <button key={s.k} className="btn btn-ghost" style={{
            width: "100%", justifyContent: "flex-start", borderRadius: 0,
            borderTop: i ? "1px solid var(--line)" : 0,
            padding: "12px 14px", height: "auto",
            color: s.danger ? "var(--terracotta)" : "var(--text)",
          }}>
            <Icon name={s.icon} size={14}/>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.l}</div>
              {s.d && <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{s.d}</div>}
            </div>
          </button>
        ))}
      </div>
      <div className="muted" style={{ fontSize: 10, textAlign: "center", marginTop: 14 }}>Daedalus Pro · v2026.5.6 (build 3127)</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// PROFILE TAB — gamified tech profile, badges, leaderboard, quest
// ──────────────────────────────────────────────────────────────────────
function ProfileView({ tech, onBadge }) {
  const M = window.MOCK;
  const profile = M.FIELD_PROFILE;
  const badges = M.FIELD_BADGES;
  const lead = M.FIELD_LEADERBOARD;
  const quest = M.FIELD_QUEST;
  return (
    <div style={{ padding: 18 }}>
      {/* Hero — avatar, tier, rank */}
      <div className="card" style={{ padding: 16, marginBottom: 14, background: "linear-gradient(135deg, var(--bronze), var(--bronze-deep))", color: "#FFF", border: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar user={tech} size={56}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{tech.name}</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>{tech.role} · Phoenix metro</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <TierBadge tier="Preferred" size="sm"/>
              <span className="pill" style={{ background: "rgba(255,255,255,0.18)", color: "#FFF", height: 18, padding: "0 8px", fontSize: 10 }}>
                <Icon name="medal" size={10}/> #{profile.rank} of {profile.rankOf}
              </span>
            </div>
          </div>
        </div>
        {/* Tier progress */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ opacity: 0.85 }}>To {profile.nextTier}</span>
            <span style={{ fontWeight: 700 }}>{Math.round(profile.tierProgressToNext * 100)}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.18)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
            <div style={{ height: "100%", width: `${profile.tierProgressToNext * 100}%`, background: "linear-gradient(90deg, #FFD27A, #FFE6A8)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, width: 60, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)", animation: "fa-progressShine 2200ms ease-in-out infinite" }}/>
            </div>
          </div>
          <div style={{ fontSize: 10, opacity: 0.85, marginTop: 4 }}>34 closed jobs to Elite · unlocks $250 base bonus + factoring eligibility</div>
        </div>
      </div>

      {/* Cash earned */}
      <div className="card" style={{ padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(122,139,76,0.32)", background: "rgba(122,139,76,0.06)" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--olive)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="money" size={20}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--olive)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Cash rewards earned</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>${profile.cash.lifetimeEarned.toLocaleString()}</div>
          <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>${profile.cash.pendingThisMonth} pending this month · last payout ${profile.cash.lastPayout.amount}</div>
        </div>
      </div>

      {/* Quest of the week */}
      <div className="card" style={{ padding: 14, marginBottom: 14, background: "linear-gradient(135deg, rgba(208,138,46,0.10), rgba(176,134,84,0.06))", border: "1px solid rgba(208,138,46,0.28)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: "var(--amber)" }}><Icon name="flame" size={10}/> Quest · ends Sunday</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{quest.label}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>{quest.desc}</div>
          </div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--amber)" }}>+${quest.reward}</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span className="muted">{quest.progress.c} of {quest.progress.r} done</span>
            <span style={{ fontWeight: 700, color: "var(--amber)" }}>{Math.round((quest.progress.c / quest.progress.r) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(quest.progress.c / quest.progress.r) * 100}%`, background: "linear-gradient(90deg, var(--amber), var(--amber-soft))" }}/>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>30-day stats</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 18 }}>
        <StatTile label="Jobs done" value={profile.stats.jobs30}/>
        <StatTile label="On-time" value={`${Math.round(profile.stats.onTimeRate * 100)}%`} color="var(--olive)"/>
        <StatTile label="CSAT" value={`${profile.stats.csat}★`} color="var(--amber)"/>
        <StatTile label="Photo quality" value={`${Math.round(profile.stats.photoQuality * 100)}%`} color="var(--bronze)"/>
        <StatTile label="Streak" value={`${profile.stats.streakDays}d`} color="var(--terracotta)"/>
        <StatTile label="Avg / job" value={`${profile.stats.avgMinutesPerJob}m`}/>
      </div>

      {/* Badges */}
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Badges · {badges.filter(b => b.unlocked).length} of {badges.length}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
        {badges.map(b => (
          <button key={b.id} onClick={() => onBadge(b)} className="card" style={{
            padding: 10, textAlign: "center", border: b.unlocked ? `1px solid ${b.color}55` : "1px solid var(--line)",
            background: b.unlocked ? `${b.color}10` : "var(--surface)", cursor: "pointer", color: "var(--text)",
          }}>
            <div style={{
              margin: "0 auto", width: 48, height: 48, borderRadius: 999,
              background: b.unlocked ? `linear-gradient(135deg, ${b.color}, ${b.color}aa)` : "var(--surface-3)",
              color: b.unlocked ? "#FFF" : "var(--text-3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              filter: b.unlocked ? "none" : "grayscale(0.6)", opacity: b.unlocked ? 1 : 0.55,
              boxShadow: b.unlocked ? `0 4px 12px ${b.color}55` : "none",
              animation: b.unlocked && b.special ? "fa-badgePop 600ms ease-out" : "none",
            }}>
              <Icon name={b.icon} size={20}/>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6, lineHeight: 1.2 }}>{b.name}</div>
            <div className="mono" style={{ fontSize: 10, color: b.unlocked ? "var(--olive)" : "var(--text-3)", marginTop: 2 }}>
              {b.unlocked ? `+$${b.reward}` : `${b.progress.c}/${b.progress.r}`}
            </div>
            {!b.unlocked && (
              <div style={{ height: 3, background: "var(--surface-3)", borderRadius: 999, marginTop: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(b.progress.c / b.progress.r) * 100}%`, background: b.color }}/>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Phoenix metro leaderboard</div>
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
        {lead.map((row, i) => (
          <div key={row.id} style={{
            padding: "10px 12px", borderTop: i ? "1px solid var(--line)" : 0,
            display: "flex", alignItems: "center", gap: 10,
            background: row.you ? "rgba(176,134,84,0.06)" : "transparent",
          }}>
            <div className="mono" style={{ width: 22, fontSize: 13, fontWeight: 700, color: i === 0 ? "var(--amber)" : "var(--text-3)" }}>#{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: row.you ? 700 : 500 }}>{row.name}{row.you && <span className="pill pill-bronze" style={{ marginLeft: 6, height: 16, padding: "0 6px", fontSize: 9 }}>You</span>}</div>
              <div className="muted" style={{ fontSize: 11 }}>{row.jobs30} jobs · {Math.round(row.onTime * 100)}% on-time · {row.csat}★</div>
            </div>
            {i === 0 && <Icon name="trophy" size={14} color="var(--amber)"/>}
          </div>
        ))}
      </div>

      {/* Cash redemption history */}
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Reward payouts</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {profile.redemptions.map((r, i) => (
          <div key={r.id} style={{ padding: "10px 12px", borderTop: i ? "1px solid var(--line)" : 0, display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="check" size={14} color="var(--olive)"/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</div>
              <div className="muted" style={{ fontSize: 11 }}>{r.date}</div>
            </div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--olive)" }}>+${r.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgeUnlockSheet({ badge, onClose }) {
  return (
    <BottomSheet onClose={onClose} title={badge.unlocked ? "Badge earned" : "Badge progress"}>
      <div style={{ textAlign: "center", paddingTop: 6 }}>
        <div style={{
          margin: "0 auto", width: 88, height: 88, borderRadius: 999,
          background: badge.unlocked ? `linear-gradient(135deg, ${badge.color}, ${badge.color}aa)` : "var(--surface-3)",
          color: badge.unlocked ? "#FFF" : "var(--text-3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: badge.unlocked ? `0 8px 28px ${badge.color}66` : "none",
          animation: "fa-badgePop 600ms ease-out",
        }}>
          <Icon name={badge.icon} size={40}/>
        </div>
        <div className="h-serif" style={{ fontSize: 22, marginTop: 14 }}>{badge.name}</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{badge.desc}</div>
        <div style={{ marginTop: 16, padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="money" size={14} color="var(--olive)"/>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{badge.unlocked ? "Cash reward" : "Reward on unlock"} · </span>
          <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--olive)" }}>${badge.reward}</span>
        </div>
        {!badge.unlocked && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span className="muted">Progress</span>
              <span style={{ fontWeight: 700 }}>{badge.progress.c} / {badge.progress.r}</span>
            </div>
            <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(badge.progress.c / badge.progress.r) * 100}%`, background: badge.color }}/>
            </div>
          </div>
        )}
        {badge.unlocked && badge.earnedAt && <div className="muted" style={{ fontSize: 11, marginTop: 12 }}>Earned {badge.earnedAt}</div>}
      </div>
    </BottomSheet>
  );
}

// ──────────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ──────────────────────────────────────────────────────────────────────
function SettingsView({ settings, onChange }) {
  const set = (path, value) => onChange(s => deepSet(s, path, value));
  return (
    <div style={{ padding: 18 }}>
      <SettingsGroup label="Notifications">
        <SettingRow label="Push notifications" desc="Master switch for all push" right={<Switch on={settings.push.master} onChange={(v) => set(["push", "master"], v)}/>}/>
        <SettingRow label="New jobs" sub right={<Switch on={settings.push.newJobs} onChange={(v) => set(["push", "newJobs"], v)} disabled={!settings.push.master}/>}/>
        <SettingRow label="Customer messages" sub right={<Switch on={settings.push.customerMessages} onChange={(v) => set(["push", "customerMessages"], v)} disabled={!settings.push.master}/>}/>
        <SettingRow label="Dispatcher alerts" sub right={<Switch on={settings.push.dispatcherAlerts} onChange={(v) => set(["push", "dispatcherAlerts"], v)} disabled={!settings.push.master}/>}/>
        <SettingRow label="Badge updates" sub right={<Switch on={settings.push.badgeUpdates} onChange={(v) => set(["push", "badgeUpdates"], v)} disabled={!settings.push.master}/>}/>
        <SettingRow label="Truck stock low" sub right={<Switch on={settings.push.stockLow} onChange={(v) => set(["push", "stockLow"], v)} disabled={!settings.push.master}/>}/>
      </SettingsGroup>

      <SettingsGroup label="Quiet hours">
        <SettingRow label="Quiet hours" desc={settings.quietHours.enabled ? `${settings.quietHours.from} → ${settings.quietHours.to}` : "Off"} right={<Switch on={settings.quietHours.enabled} onChange={(v) => set(["quietHours", "enabled"], v)}/>}/>
      </SettingsGroup>

      <SettingsGroup label="Sound & feel">
        <SettingRow label="Sound" right={<Switch on={settings.sound} onChange={(v) => onChange(s => ({ ...s, sound: v }))}/>}/>
        <SettingRow label="Haptics" right={<Switch on={settings.haptics} onChange={(v) => onChange(s => ({ ...s, haptics: v }))}/>}/>
        <SettingRow label="Biometric login" desc="Face ID required" right={<Switch on={settings.biometric} onChange={(v) => onChange(s => ({ ...s, biometric: v }))}/>}/>
      </SettingsGroup>

      <SettingsGroup label="Locale & display">
        <SettingPicker label="Language" value={settings.language} options={[{ v: "en", l: "English" }, { v: "es", l: "Español" }]} onChange={(v) => onChange(s => ({ ...s, language: v }))}/>
        <SettingPicker label="Distance" value={settings.units} options={[{ v: "imperial", l: "Miles" }, { v: "metric", l: "Kilometers" }]} onChange={(v) => onChange(s => ({ ...s, units: v }))}/>
        <SettingPicker label="Map provider" value={settings.mapProvider} options={[{ v: "google", l: "Google" }, { v: "apple", l: "Apple" }, { v: "waze", l: "Waze" }]} onChange={(v) => onChange(s => ({ ...s, mapProvider: v }))}/>
        <SettingPicker label="Appearance" value={settings.appearance} options={[{ v: "system", l: "System" }, { v: "light", l: "Light" }, { v: "dark", l: "Dark" }]} onChange={(v) => onChange(s => ({ ...s, appearance: v }))}/>
      </SettingsGroup>

      <SettingsGroup label="Field execution">
        <SettingPicker label="Photo quality" value={settings.photoQuality} options={[{ v: "standard", l: "Standard" }, { v: "hd", l: "HD" }, { v: "original", l: "Original" }]} onChange={(v) => onChange(s => ({ ...s, photoQuality: v }))}/>
        <SettingPicker label="Offline pack" value={settings.offlinePack} options={[{ v: "auto", l: "Automatic" }, { v: "manual", l: "Manual download" }]} onChange={(v) => onChange(s => ({ ...s, offlinePack: v }))}/>
        <SettingRow label="Truck stock auto-deduct" desc="Subtract used materials from inventory" right={<Switch on={settings.truckAutoDeduct} onChange={(v) => onChange(s => ({ ...s, truckAutoDeduct: v }))}/>}/>
      </SettingsGroup>

      <SettingsGroup label="Accessibility">
        <SettingRow label="High-contrast mode" desc="Easier reading outdoors / basements" right={<Switch on={settings.highContrast} onChange={(v) => onChange(s => ({ ...s, highContrast: v }))}/>}/>
        <SettingRow label="Large text" desc="Easier with gloves on" right={<Switch on={settings.largeText} onChange={(v) => onChange(s => ({ ...s, largeText: v }))}/>}/>
      </SettingsGroup>

      <div style={{ textAlign: "center", padding: "18px 0", color: "var(--text-3)", fontSize: 11 }}>
        Daedalus Pro · v2026.5.6 (build 3127)<br/>
        Tech ID: u_mp · Device: iPhone 15 Pro
      </div>
    </div>
  );
}

function SettingsGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6, padding: "0 4px" }}>{label}</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, sub, right }) {
  return (
    <div className="fa-setting-row" style={{ padding: sub ? "10px 14px 10px 32px" : "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: sub ? "var(--text-2)" : "var(--text)" }}>{label}</div>
        {desc && <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function SettingPicker({ label, value, options, onChange }) {
  return (
    <div className="fa-setting-row" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="select" style={{ width: "auto", minWidth: 110, height: 30, fontSize: 12, paddingRight: 26 }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Switch({ on, onChange, disabled }) {
  return (
    <button onClick={() => !disabled && onChange(!on)} disabled={disabled} style={{
      width: 42, height: 24, borderRadius: 999, padding: 2,
      background: on ? "var(--olive)" : "var(--surface-3)",
      border: "1px solid " + (on ? "var(--olive)" : "var(--line-strong)"),
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "background 180ms",
      position: "relative",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 999, background: "#FFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        transform: on ? "translateX(18px)" : "translateX(0)",
        transition: "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)",
      }}/>
    </button>
  );
}

// Tiny helper: deep-set a nested property on an object via path array.
function deepSet(obj, path, value) {
  if (typeof obj !== "function") {
    // Used as a state updater function caller: onChange(s => deepSet(s, path, v))
    const out = { ...obj };
    let cur = out;
    for (let i = 0; i < path.length - 1; i++) {
      cur[path[i]] = { ...(cur[path[i]] || {}) };
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    return out;
  }
  return obj;
}

// ──────────────────────────────────────────────────────────────────────
// NOTIFICATIONS TAB — full inbox
// ──────────────────────────────────────────────────────────────────────
function NotificationsView() {
  const items = [
    { id: "n1", icon: "workorder", color: "var(--bronze)",     title: "New job assigned", body: "WO-3038 · Aria on Camelback · Smart lock pairing — 2 hours away", when: "2 min", unread: true },
    { id: "n2", icon: "message",   color: "var(--slateblue)",  title: "Diego Martín · Solano Lofts", body: "We left you the side door propped — see you in 10", when: "8 min", unread: true },
    { id: "n3", icon: "trophy",    color: "var(--amber)",      title: "Badge progress · 7/10", body: "Emergency Ace — 3 more sub-90-min jobs to unlock $150", when: "16 min", unread: true },
    { id: "n4", icon: "truck",     color: "var(--terracotta)", title: "Truck stock low", body: "HID Signo 20 — 1 left. Reorder before next emergency.", when: "26 min", unread: true },
    { id: "n5", icon: "schedule",  color: "var(--olive)",      title: "Tomorrow's schedule", body: "4 jobs queued. Optimized route saves 32 min vs. raw order.", when: "38 min", unread: false },
    { id: "n6", icon: "money",     color: "var(--olive)",      title: "Reward paid · $100", body: "Perfect Week × 4 (April) — wired to Wells Fargo •••2418", when: "Yesterday", unread: false },
    { id: "n7", icon: "shield",    color: "var(--slateblue)",  title: "Background check renewed", body: "Checkr report valid through 2027-05-06. No action needed.", when: "Yesterday", unread: false },
    { id: "n8", icon: "users",     color: "var(--bronze)",     title: "Tasha tagged you in WO-3036", body: "“Hey Miguel — left the IDF key behind the second hot tub. — T”", when: "2d", unread: false },
  ];
  const unread = items.filter(i => i.unread).length;
  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="muted" style={{ fontSize: 12 }}>{unread} unread</div>
        <button className="btn btn-ghost btn-sm">Mark all read</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {items.map((n, i) => (
          <div key={n.id} style={{ padding: "12px 14px", borderTop: i ? "1px solid var(--line)" : 0, display: "flex", gap: 10, background: n.unread ? "rgba(176,134,84,0.04)" : "transparent" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${n.color}1F`, color: n.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
              <Icon name={n.icon} size={14}/>
              {n.unread && <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: "var(--terracotta)", border: "2px solid var(--surface)" }}/>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</div>
                <div className="muted" style={{ fontSize: 10, flexShrink: 0 }}>{n.when}</div>
              </div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// TRUCK TAB — inventory
// ──────────────────────────────────────────────────────────────────────
function TruckView() {
  const items = [
    { p: "HID Signo 20 readers",      on: 1,  par: 3,  unit: "$248",  low: true,  category: "Access Control" },
    { p: "Wiegand 22/6 cable",        on: 24, par: 50, unit: "/ft",   low: false, category: "Access Control" },
    { p: "Tap connectors",            on: 18, par: 24, unit: "/pk",   low: false, category: "Misc" },
    { p: "Mullion mount kits",        on: 0,  par: 4,  unit: "$32",   low: true,  category: "Access Control" },
    { p: "ecobee SmartThermostat",    on: 2,  par: 4,  unit: "$218",  low: false, category: "IoT" },
    { p: "Ubiquiti U7 Pro WiFi 7",    on: 3,  par: 4,  unit: "$279",  low: false, category: "WiFi" },
    { p: "PoE+ injector (60 W)",      on: 6,  par: 8,  unit: "$32",   low: false, category: "WiFi" },
    { p: "Cat6 patch (50 ft)",        on: 4,  par: 6,  unit: "$24",   low: false, category: "WiFi" },
  ];
  return (
    <div style={{ padding: 18 }}>
      <div className="card" style={{ padding: 12, marginBottom: 12, background: "var(--surface-2)" }}>
        <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Van #2 · Phoenix yard</div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{items.filter(i => i.low).length} items below par</div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {items.map((s, i) => (
          <div key={s.p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderTop: i ? "1px solid var(--line)" : 0, fontSize: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500 }}>{s.p}</div>
              <div className="muted" style={{ fontSize: 10 }}>{s.category} · On hand <span style={{ color: s.low ? "var(--terracotta)" : "var(--olive)" }}>{s.on}</span> / par {s.par}</div>
            </div>
            {s.low && <button className="btn btn-secondary btn-sm" style={{ padding: "3px 8px", fontSize: 10 }}>Order</button>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: "var(--surface-2)", borderRadius: 8, fontSize: 11, color: "var(--text-2)", lineHeight: 1.4 }}>
        <strong style={{ color: "var(--bronze)" }}>Daedalus Supply</strong> · 2 items below par. Next-day delivery to Phoenix yard · est. {fmt$(312)}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Bottom nav
// ──────────────────────────────────────────────────────────────────────
function FieldNav({ view, setView }) {
  const items = [
    { k: "job",   l: "Job",   icon: "workorder" },
    { k: "queue", l: "Queue", icon: "list" },
    { k: "time",  l: "Time",  icon: "clock" },
    { k: "more",  l: "More",  icon: "settings" },
  ];
  // The sub-views that should keep "more" lit.
  const moreSet = new Set(["more", "profile", "settings", "notifications", "truck"]);
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 74, paddingBottom: 10, display: "flex", borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
      {items.map(it => {
        const active = it.k === view || (it.k === "more" && moreSet.has(view));
        return (
          <button key={it.k} onClick={() => setView(it.k)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: active ? "var(--bronze)" : "var(--text-3)", gap: 2,
            background: "transparent", border: 0, cursor: "pointer",
            transition: "color 180ms",
          }}>
            <Icon name={it.icon} size={20}/>
            <div style={{ fontSize: 10, fontWeight: 600 }}>{it.l}</div>
          </button>
        );
      })}
    </div>
  );
}

window.Field = Field;
