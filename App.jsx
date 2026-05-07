// App entry — orchestrates routes, role state, tweaks, toasts

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "bronze",
  "density": "comfortable",
  "mythic": "balanced",
  "tier": "Preferred"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [authed, setAuthed] = useState(false);
  const [route, setRoute] = useState("home");
  const [role, setRole] = useState({ id: "owner", label: "Owner / Principal", sub: "Full vendor access", initials: "JM", color: "#B08654" });
  const [collapsed, setCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);
  // 'admin' (default — full sidebar) or 'daedalus-pro' (production view).
  // Persisted across reloads in localStorage.
  const [view, setView] = useState(() => {
    try { return localStorage.getItem("daedalus.view") || "admin"; }
    catch { return "admin"; }
  });
  useEffect(() => {
    try { localStorage.setItem("daedalus.view", view); } catch {}
  }, [view]);
  // If switching to Daedalus Pro view while on a route that view hides
  // (e.g. Tech Marketplace, demo modal previews), bounce back to home so
  // the active sidebar item always matches what's visible.
  useEffect(() => {
    const allowed = window.DAEDALUS_PRO_NAV_IDS;
    if (view === "daedalus-pro" && allowed && !allowed.includes(route)) {
      setRoute("home");
    }
  }, [view]);

  // Apply theme / accent / density to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", tweaks.theme);
    root.setAttribute("data-accent", tweaks.accent);
    root.setAttribute("data-density", tweaks.density);
    root.setAttribute("data-mythic", tweaks.mythic);
  }, [tweaks]);

  // Toast hook
  useEffect(() => {
    window.toast = ({ kind = "info", title, msg }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(t => [...t, { id, kind, title, msg }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
    };
  }, []);

  const onNav = (id) => { setRoute(id); };

  // Field route uses tech persona
  const effectiveRole = route === "field" ? { id: "tech", label: "Field Tech", sub: "Mobile only", initials: "MP", color: "#B0463A" } : role;

  if (!authed) return <Login onAuth={() => setAuthed(true)} mythic={tweaks.mythic}/>;

  let screen;
  switch (route) {
    case "home":        screen = <Home role={effectiveRole} onNav={onNav}/>; break;
    case "workorders":  screen = <WorkOrders onNav={onNav}/>; break;
    case "bids":        screen = <BidsAndEstimates onNav={onNav}/>; break;
    case "dispatcher":  screen = <Dispatcher onNav={onNav}/>; break;
    case "field":       screen = <Field onNav={onNav}/>; break;
    case "compliance":  screen = <Compliance onNav={onNav}/>; break;
    case "scorecard":   screen = <Scorecard tier={tweaks.tier}/>; break;
    case "invoices":    screen = <Invoices onNav={onNav}/>; break;
    case "factoring":   screen = <Invoices onNav={onNav}/>; break;
    case "onboarding":  screen = <Onboarding onNav={onNav}/>; break;
    case "saleshub":    screen = <SalesHub onNav={onNav}/>; break;
    case "techmarket":  screen = <TechMarket onNav={onNav}/>; break;
    case "pmc":         screen = <PMC onNav={onNav}/>; break;
    case "apply":       screen = <ApplyContractor onClose={() => setRoute("home")} onSubmit={() => { setRoute("home"); window.toast?.({kind:"success", title:"Application submitted", msg:"We'll review and get back within 48 hours."}); }}/>; break;
    case "consumer":    screen = <ConsumerSubmit onClose={() => setRoute("home")} onSubmit={() => { setRoute("home"); window.toast?.({kind:"success", title:"Tech is on the way", msg:"We'll text you live ETA when they're en route."}); }}/>; break;
    case "claim":       screen = <ClaimJob onClose={() => setRoute("field")} onPass={() => { setRoute("field"); window.toast?.({kind:"info", title:"Job passed", msg:"It's still available for other techs nearby."}); }} onClaim={() => { setRoute("field"); window.toast?.({kind:"success", title:"Job claimed", msg:"WO-3247 is now in your queue."}); }}/>; break;
    case "bid":         screen = <BidJob onClose={() => setRoute("field")} onSubmit={() => { setRoute("field"); window.toast?.({kind:"success", title:"Bid submitted", msg:"We'll let you know if Sarah picks you."}); }}/>; break;
    case "homeowner-bids": screen = <HomeownerBids onClose={() => setRoute("home")} onPick={() => { setRoute("home"); window.toast?.({kind:"success", title:"Tech hired", msg:"Auto-accepted — they're on the way."}); }}/>; break;
    case "consumer-market": screen = <ConsumerMarket onNav={onNav}/>; break;
    case "tech-consent":    screen = <CMTechConsentRoute onNav={onNav}/>; break;
    case "tech-incoming":   screen = <CMTechIncomingRoute onNav={onNav}/>; break;
    case "schedule":    screen = <Schedule/>; break;
    case "team":        screen = <Team/>; break;
    case "inbox":       screen = <Inbox/>; break;
    case "reports":     screen = <Reports/>; break;
    case "integrations":screen = <Integrations/>; break;
    default:            screen = <Home role={effectiveRole} onNav={onNav}/>;
  }

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      <Sidebar active={route} onNav={onNav} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} mythicLevel={tweaks.mythic} view={view}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar currentRole={role} density={tweaks.density} view={view} onSetView={setView}/>
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "var(--bg)" }}>
          <div key={route} style={{ animation: "fadeUp 220ms var(--ease)", height: "100%" }}>
            {screen}
          </div>
        </main>
      </div>
      <ToastHost toasts={toasts}/>
      <DaedalusTweaksPanel tweaks={tweaks} setTweak={setTweak}/>
    </div>
  );
}

function ToastHost({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} className="card" style={{
          padding: "12px 16px", minWidth: 280, maxWidth: 380,
          background: "var(--surface)", border: "1px solid var(--line)",
          borderLeft: `3px solid ${t.kind === "success" ? "var(--olive)" : t.kind === "error" ? "var(--terracotta)" : "var(--bronze)"}`,
          animation: "slideIn 240ms var(--ease)", boxShadow: "var(--shadow-lg)",
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <div style={{ flexShrink: 0, marginTop: 2, color: t.kind === "success" ? "var(--olive)" : t.kind === "error" ? "var(--terracotta)" : "var(--bronze)" }}>
            <Icon name={t.kind === "success" ? "check" : t.kind === "error" ? "alert" : "info"} size={16}/>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
            {t.msg && <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{t.msg}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function DaedalusTweaksPanel({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Theme">
        <TweakRadio label="Mode" value={tweaks.theme} options={[{value:"light",label:"Light"},{value:"dark",label:"Dark"}]} onChange={v => setTweak("theme", v)}/>
        <TweakRadio label="Accent" value={tweaks.accent} options={[{value:"bronze",label:"Bronze"},{value:"slate",label:"Slate"},{value:"olive",label:"Olive"}]} onChange={v => setTweak("accent", v)}/>
        <TweakRadio label="Density" value={tweaks.density} options={[{value:"comfortable",label:"Comfortable"},{value:"compact",label:"Compact"}]} onChange={v => setTweak("density", v)}/>
      </TweakSection>
      <TweakSection title="Brand">
        <TweakRadio label="Mythic intensity" value={tweaks.mythic} options={[{value:"restrained",label:"Restrained"},{value:"balanced",label:"Balanced"},{value:"full",label:"Full"}]} onChange={v => setTweak("mythic", v)}/>
        <TweakSelect label="Vendor tier" value={tweaks.tier} options={[{value:"Applicant",label:"Applicant"},{value:"Verified",label:"Verified"},{value:"Preferred",label:"Preferred"},{value:"Elite",label:"Elite"}]} onChange={v => setTweak("tier", v)}/>
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

// Wrappers for the tech-side modals so they can be opened from a nav route.
// They show the modal centered on a brief "field" backdrop.
function CMTechConsentRoute({ onNav }) {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <div style={{ padding: 60, textAlign: "center", color: "var(--text-3)" }}>
        <div className="muted" style={{ fontSize: 13 }}>Tech consent modal preview</div>
      </div>
      <CMTechConsent open={open}
        onClose={() => onNav("field")}
        onAccept={() => { onNav("field"); window.toast?.({kind:"success", title:"You're in", msg:"Phoenix Pro can now flip you 'open to consumer' during gap time."}); }}
        onDecline={() => { onNav("field"); window.toast?.({kind:"info", title:"Declined", msg:"Phoenix Pro will keep you on shop work orders only."}); }}/>
    </>
  );
}

function CMTechIncomingRoute({ onNav }) {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <div style={{ padding: 60, textAlign: "center", color: "var(--text-3)" }}>
        <div className="muted" style={{ fontSize: 13 }}>Tech incoming-job modal preview</div>
      </div>
      <CMTechIncomingJob open={open}
        onClose={() => onNav("field")}
        onClaim={() => { onNav("field"); window.toast?.({kind:"success", title:"Claimed", msg:"$142 consumer job · heading to Sarah R."}); }}
        onPass={() => { onNav("field"); window.toast?.({kind:"info", title:"Passed", msg:"It'll go to the next available tech."}); }}/>
    </>
  );
}
