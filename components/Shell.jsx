// Shell: top bar + sidebar + role switcher + toast host

const NAV = [
{ id: "home", label: "Home", icon: "home", group: "main" },
{ id: "workorders", label: "Work Orders", icon: "workorder", group: "main", badge: 3 },
{ id: "bids", label: "Bids & Estimates", icon: "bid", group: "main", badge: 1 },
{ id: "dispatcher", label: "Dispatcher", icon: "dispatch", group: "main" },
{ id: "schedule", label: "Schedule", icon: "schedule", group: "main" },
{ id: "field", label: "Field App", icon: "field", group: "main" },
{ id: "inbox", label: "Inbox", icon: "mail", group: "main", badge: 4 },
{ id: "saleshub", label: "Sales Hub", icon: "sparkles", group: "growth" },
{ id: "consumer-market", label: "Consumer Market", icon: "grid", group: "growth" },
{ id: "techmarket", label: "Tech Marketplace", icon: "users", group: "growth", badge: "FUTURE" },
{ id: "pmc", label: "PMC View", icon: "shield", group: "growth" },
{ id: "compliance", label: "Compliance Vault", icon: "compliance", group: "ops" },
{ id: "scorecard", label: "Tier & Scorecard", icon: "shield", group: "ops" },
{ id: "team", label: "Team", icon: "users", group: "ops" },
{ id: "invoices", label: "Invoices", icon: "invoice", group: "fin" },
{ id: "factoring", label: "Factoring", icon: "factoring", group: "fin" },
{ id: "reports", label: "Reports", icon: "report", group: "fin" },
{ id: "integrations", label: "Integrations", icon: "settings", group: "fin" },
{ id: "consumer", label: "Homeowner Booking", icon: "home", group: "flows" },
{ id: "claim", label: "Claim Job (tech, W-2)", icon: "zap", group: "flows" },
{ id: "bid", label: "Bid on Job (tech, 1099)", icon: "money", group: "flows" },
{ id: "homeowner-bids", label: "Compare Bids (homeowner)", icon: "list", group: "flows" },
{ id: "tech-consent", label: "Tech Consent (modal)", icon: "shield", group: "flows" },
{ id: "tech-incoming", label: "Tech Incoming Job (modal)", icon: "zap", group: "flows" },
{ id: "apply", label: "Apply as Contractor", icon: "shield", group: "flows" }];


// Routes visible in the production "Daedalus Pro" view (everything else is
// admin/demo-only). Order is preserved by NAV — this list is just a filter.
const DAEDALUS_PRO_NAV_IDS = [
  "home", "workorders", "bids", "dispatcher", "schedule", "field",
  "inbox", "saleshub", "consumer-market", "pmc", "compliance", "scorecard",
  "team", "invoices", "factoring", "reports", "integrations", "apply"
];


const ROLES = [
{ id: "owner", label: "Owner / Principal", sub: "Full vendor access", initials: "JM", color: "#B08654" },
{ id: "admin", label: "Operations Admin", sub: "Ops, no finance", initials: "KA", color: "#7A8B4C" },
{ id: "dispatcher", label: "Dispatcher", sub: "Schedule + assign", initials: "DR", color: "#4A6378" },
{ id: "estimator", label: "Estimator", sub: "Bidding focus", initials: "ES", color: "#D08A2E" },
{ id: "lead", label: "Field Lead", sub: "Mobile + sign-off", initials: "MP", color: "#B0463A" },
{ id: "tech", label: "Field Tech", sub: "Mobile only", initials: "JC", color: "#A4B27A" },
{ id: "books", label: "Bookkeeper", sub: "AR + factoring", initials: "PN", color: "#4A6378" }];


function Sidebar({ active, onNav, collapsed, onToggle, mythicLevel, view = "admin" }) {
  const isDaedalusPro = view === "daedalus-pro";
  const groups = [
  { key: "main", label: null },
  { key: "growth", label: "Growth & Network" },
  { key: "ops", label: "Compliance & Team" },
  { key: "fin", label: "Finance" },
  // In Daedalus Pro view only "apply" remains in this group; drop the
  // "Demo Flows" label so it reads as a plain bottom action area.
  { key: "flows", label: isDaedalusPro ? null : "Demo Flows" }];

  return (
    <aside style={{
      width: collapsed ? 64 : 240, flexShrink: 0,
      background: "var(--chrome-bg)",
      color: "var(--chrome-text)",
      borderRight: "1px solid var(--chrome-line)",
      display: "flex", flexDirection: "column",
      transition: "width 250ms var(--ease)",
      position: "relative", zIndex: 5
    }}>
      {/* Brand */}
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: collapsed ? "0 18px" : "0 20px", borderBottom: "1px solid var(--chrome-line)", gap: 10 }}>
        <DaedalusMark size={24} />
        {!collapsed &&
        <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 18, letterSpacing: "0.01em" }}>
            Daedalus<span style={{ color: "var(--bronze)" }}> Pro</span>
          </div>
        }
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {groups.map((g, gi) => {
          const items = NAV.filter((n) =>
            n.group === g.key &&
            (!isDaedalusPro || DAEDALUS_PRO_NAV_IDS.includes(n.id))
          );
          if (items.length === 0) return null;
          return (
        <div key={g.key} style={{ marginBottom: 14 }}>
            {!collapsed && g.label &&
          <div style={{ padding: "10px 12px 6px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--chrome-text-2)", fontWeight: 600 }}>
                {g.label}
              </div>
          }
            {items.map((item) => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => onNav(item.id)} title={item.label}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "10px" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? "var(--chrome-selected)" : "transparent",
                color: isActive ? "var(--bronze-soft)" : "var(--chrome-text)",
                border: 0, borderRadius: 8, cursor: "pointer",
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                transition: "background var(--tx-fast)",
                position: "relative",
                marginBottom: 1
              }}
              onMouseEnter={(e) => {if (!isActive) e.currentTarget.style.background = "var(--chrome-hover)";}}
              onMouseLeave={(e) => {if (!isActive) e.currentTarget.style.background = "transparent";}}>
                  {isActive && <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, background: "var(--bronze)", borderRadius: 2 }} />}
                  <Icon name={item.icon} size={18} />
                  {!collapsed && <><span style={{ flex: 1, textAlign: "left", fontFamily: "Inter" }}>{item.label}</span>{item.badge && <span className="pill pill-bronze" style={{ height: 18, padding: "0 6px", fontSize: 10 }}>{item.badge}</span>}</>}
                </button>);

          })}
          </div>
          );
        })}
      </nav>

      {/* Mythic flourish */}
      {!collapsed && mythicLevel >= 0.5 &&
      <div className="meander" style={{ "--mythic-opacity": Math.min(0.7, mythicLevel * 0.7) }} />
      }

      {/* Vendor card at bottom */}
      <div style={{ padding: 10, borderTop: "1px solid var(--chrome-line)" }}>
        {!collapsed ?
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 8, background: "rgba(176, 134, 84, 0.08)" }}>
            <div className="ring" style={{ width: 30, height: 30, fontSize: 12 }}>D</div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Daedalus Trades</div>
              <div style={{ fontSize: 10, color: "var(--chrome-text-2)" }}>Vendor tenant</div>
            </div>
          </div> :

        <div className="ring" style={{ width: 30, height: 30, fontSize: 12, margin: "0 auto" }}>D</div>
        }
      </div>

      <button onClick={onToggle}
      style={{
        position: "absolute", top: 60, right: -10,
        width: 20, height: 20, borderRadius: 999,
        background: "var(--chrome-bg-2)", color: "var(--chrome-text)",
        border: "1px solid var(--chrome-line)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 10
      }}>
        <Icon name={collapsed ? "chevRight" : "chevLeft"} size={12} />
      </button>
    </aside>);

}

function DaedalusMark({ size = 24 }) {
  return (
    <img src="uploads/daedalus-logo.png" width={size} height={size} alt="Daedalus" style={{ display: "block", objectFit: "contain" }} />
  );
}

function TopBar({ onRoleSwitcher, currentRole, onTweaks, density, onNav, view = "admin", onSetView }) {
  const [openDD, setOpenDD] = React.useState(null); // 'filter' | 'notif' | 'profile' | null
  const [search, setSearch] = React.useState("");
  const ddRef = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => {if (ddRef.current && !ddRef.current.contains(e.target)) setOpenDD(null);};
    const onKey = (e) => {
      if (e.key === "Escape") setOpenDD(null);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {e.preventDefault();setOpenDD((d) => d === "filter" ? null : "filter");}
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {document.removeEventListener("mousedown", onClick);document.removeEventListener("keydown", onKey);};
  }, []);

  return (
    <header ref={ddRef} style={{
      height: 56, background: "var(--chrome-bg)", color: "var(--chrome-text)",
      borderBottom: "1px solid var(--chrome-line)",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 16, zIndex: 50,
      flexShrink: 0, position: "relative"
    }}>
      {/* Search → command/filter palette */}
      <div style={{ flex: 1, maxWidth: 520, position: "relative" }}>
        <Icon name="search" size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--chrome-text-2)" }} />
        <input placeholder="Search work orders, properties, vendors…"
        value={search}
        onFocus={() => setOpenDD("filter")}
        onChange={(e) => {setSearch(e.target.value);setOpenDD("filter");}}
        style={{
          width: "100%", height: 34, paddingLeft: 34, paddingRight: 12,
          background: "var(--chrome-bg-2)", border: "1px solid var(--chrome-line)",
          borderRadius: 6, color: "var(--chrome-text)", fontSize: 13, outline: "none"
        }} />
        <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
          <kbd style={{ fontSize: 10, padding: "2px 5px", background: "rgba(244,241,234,0.06)", border: "1px solid var(--chrome-line)", borderRadius: 3, color: "var(--chrome-text-2)" }}>⌘K</kbd>
        </div>
        {openDD === "filter" && <FilterPalette query={search} onPick={(item) => {setOpenDD(null);setSearch("");if (item.route && onNav) onNav(item.route);window.toast?.({ kind: "info", title: item.label, msg: item.hint });}} />}
      </div>

      <div className="spacer" />

      <button onClick={onTweaks} className="btn btn-ghost" style={{ height: 32, padding: "0 10px", color: "var(--chrome-text-2)" }} title="Tweaks">
        <Icon name="sliders" size={16} />
      </button>

      <div style={{ position: "relative" }}>
        <button onClick={() => setOpenDD((d) => d === "notif" ? null : "notif")} className="btn btn-ghost" style={{ height: 32, padding: "0 8px", color: openDD === "notif" ? "var(--bronze)" : "var(--chrome-text-2)", position: "relative", background: openDD === "notif" ? "var(--chrome-selected)" : "transparent" }} title="Notifications">
          <Icon name="bell" size={16} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: 999, background: "var(--terracotta)" }} />
        </button>
        {openDD === "notif" && <NotificationsDropdown onNav={(r) => {setOpenDD(null);onNav?.(r);}} />}
      </div>

      <div style={{ position: "relative" }}>
        <button onClick={() => setOpenDD((d) => d === "profile" ? null : "profile")}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px",
          height: 38, borderRadius: 999,
          background: openDD === "profile" ? "var(--chrome-selected)" : "var(--chrome-bg-2)",
          border: "1px solid var(--chrome-line)",
          color: "var(--chrome-text)", cursor: "pointer"
        }}>
          <Avatar user={{ initials: currentRole.initials, color: currentRole.color }} size={28} />
          <div style={{ textAlign: "left", lineHeight: 1.2 }}>
            <div style={{ fontSize: 11, color: "var(--chrome-text-2)" }}>{currentRole.sub}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{currentRole.label}</div>
          </div>
          <Icon name={openDD === "profile" ? "chevUp" : "chevDown"} size={14} />
        </button>
        {openDD === "profile" &&
          <ProfileDropdown
            view={view}
            currentRole={currentRole}
            onSetView={(v) => { onSetView?.(v); setOpenDD(null); }}
            onSwitchRole={() => { setOpenDD(null); onRoleSwitcher?.(); }}
          />
        }
      </div>
    </header>);

}

function RoleSwitcher({ open, onClose, current, onPick }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(11, 13, 16, 0.55)",
      backdropFilter: "blur(4px)", zIndex: 200,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: 80, animation: "fadeUp 200ms var(--ease)"
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 520, background: "var(--surface)", borderRadius: 14,
        border: "1px solid var(--line-strong)", boxShadow: "var(--shadow-lg)", padding: 22
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="h-serif" style={{ fontSize: 22 }}>Choose your workspace</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>You hold multiple roles inside Daedalus Trades. Switch any time.</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 30, padding: 0 }}><Icon name="x" size={14} /></button>
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {ROLES.map((r) => {
            const isCurrent = r.id === current.id;
            return (
              <button key={r.id} onClick={() => onPick(r)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10,
                background: isCurrent ? "rgba(176,134,84,0.10)" : "transparent",
                border: `1px solid ${isCurrent ? "rgba(176,134,84,0.35)" : "var(--line)"}`,
                cursor: "pointer", textAlign: "left", color: "var(--text)",
                transition: "all var(--tx-fast)"
              }}
              onMouseEnter={(e) => {if (!isCurrent) e.currentTarget.style.background = "var(--hover)";}}
              onMouseLeave={(e) => {if (!isCurrent) e.currentTarget.style.background = "transparent";}}>
                <Avatar user={{ initials: r.initials, color: r.color }} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{r.sub} · Daedalus Trades & Tech</div>
                </div>
                {isCurrent && <span className="pill pill-bronze">Active</span>}
                <Icon name="chevRight" size={14} color="var(--text-3)" />
              </button>);

          })}
        </div>

        <div className="muted" style={{ fontSize: 11, marginTop: 16, textAlign: "center" }}>
          One human, many hats. Daedalus tracks every action by role for audit.
        </div>
      </div>
    </div>);

}

// Toast host: window.toast({ title, msg, kind })
function ToastHost() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    window.toast = (t) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), t.duration || 4000);
    };
  }, []);
  return (
    <div className="toast-wrap">
      {toasts.map((t) =>
      <div key={t.id} className={`toast ${t.kind || "info"}`}>
          <div className="t-title">{t.title}</div>
          {t.msg && <div className="t-msg">{t.msg}</div>}
        </div>
      )}
    </div>);

}

// ──────────────────────────────────────────────────────────────────────────
// Filter / Command palette (⌘K)
// ──────────────────────────────────────────────────────────────────────────
function FilterPalette({ query, onPick }) {
  const M = window.MOCK;
  const items = React.useMemo(() => {
    const list = [];
    (M.WOS || []).forEach((w) => list.push({ kind: "WO", label: `${w.id} · ${w.title}`, hint: w.property, route: "workorders", _q: `${w.id} ${w.title} ${w.property}`.toLowerCase() }));
    (M.PROPERTIES || []).forEach((p) => list.push({ kind: "Property", label: p.name, hint: p.addr, route: "workorders", _q: `${p.name} ${p.addr}`.toLowerCase() }));
    (M.TEAM || []).forEach((t) => list.push({ kind: "Team", label: t.name, hint: t.role, route: "team", _q: `${t.name} ${t.role}`.toLowerCase() }));
    [
    { kind: "Action", label: "Create new work order", hint: "⌘N", route: "workorders" },
    { kind: "Action", label: "Submit a bid", hint: "Bids & Estimates", route: "bids" },
    { kind: "Action", label: "Invite a team member", hint: "Owner only", route: "team" },
    { kind: "Action", label: "Open invoice factoring", hint: "Net 24h funding", route: "factoring" },
    { kind: "Filter", label: "Urgent work orders", hint: "Filter by urgency", route: "workorders" },
    { kind: "Filter", label: "Bids awaiting submission", hint: "3 open", route: "bids" },
    { kind: "Filter", label: "Compliance docs expiring < 30d", hint: "2 items", route: "compliance" },
    { kind: "Filter", label: "Overdue invoices", hint: "1 item", route: "invoices" },
    { kind: "Nav", label: "Go to Dispatcher Board", hint: "", route: "dispatcher" },
    { kind: "Nav", label: "Go to Field App", hint: "", route: "field" },
    { kind: "Nav", label: "Go to Reports", hint: "", route: "reports" },
    { kind: "Nav", label: "Go to Integrations Hub", hint: "", route: "integrations" }].
    forEach((a) => list.push({ ...a, _q: `${a.label} ${a.hint}`.toLowerCase() }));
    return list;
  }, []);
  const q = (query || "").trim().toLowerCase();
  const filtered = q ? items.filter((i) => i._q.includes(q)).slice(0, 10) : items.filter((i) => i.kind === "Filter" || i.kind === "Action").slice(0, 8);
  const groups = filtered.reduce((acc, it) => {(acc[it.kind] = acc[it.kind] || []).push(it);return acc;}, {});
  const order = ["Filter", "Action", "WO", "Property", "Team", "Nav"];
  const kindIcon = { WO: "workorder", Property: "location", Team: "users", Action: "sparkles", Filter: "filter", Nav: "arrow" };
  const kindColor = { WO: "var(--bronze)", Property: "var(--olive)", Team: "var(--slateblue)", Action: "var(--bronze)", Filter: "var(--amber)", Nav: "var(--text-3)" };

  return (
    <div style={{
      position: "absolute", top: 42, left: 0, width: 560, maxHeight: 480,
      background: "var(--surface)", border: "1px solid var(--line-strong)",
      borderRadius: 10, boxShadow: "var(--shadow-lg)", overflow: "hidden",
      animation: "fadeUp 160ms var(--ease)", color: "var(--text)", zIndex: 100
    }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-2)" }}>{q ? `Results for "${query}"` : "Quick filters & actions"}</div>
        <div style={{ display: "flex", gap: 4 }}>
          <kbd style={{ fontSize: 10, padding: "2px 5px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 3 }}>↑↓</kbd>
          <kbd style={{ fontSize: 10, padding: "2px 5px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 3 }}>↵</kbd>
        </div>
      </div>
      <div style={{ overflowY: "auto", maxHeight: 420 }}>
        {filtered.length === 0 && <div className="muted" style={{ padding: 30, textAlign: "center", fontSize: 12 }}>No matches.</div>}
        {order.filter((k) => groups[k]).map((k) =>
        <div key={k}>
            <div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)" }}>{k === "WO" ? "Work orders" : k === "Nav" ? "Jump to" : k}</div>
            {groups[k].map((it, i) =>
          <button key={k + i} onClick={() => onPick(it)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "9px 14px",
            border: 0, background: "transparent", textAlign: "left", cursor: "pointer", color: "var(--text)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: `${kindColor[k]}1A`, color: kindColor[k], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={kindIcon[k]} size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</div>
                  {it.hint && <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{it.hint}</div>}
                </div>
                <Icon name="arrow" size={12} color="var(--text-3)" />
              </button>
          )}
          </div>
        )}
      </div>
    </div>);

}

// ──────────────────────────────────────────────────────────────────────────
// Notifications dropdown
// ──────────────────────────────────────────────────────────────────────────
function NotificationsDropdown({ onNav }) {
  const [tab, setTab] = React.useState("all");
  const items = [
  { id: "n1", kind: "bid", icon: "bid", c: "var(--bronze)", title: "New bid invitation", msg: "WO-3041 · Pool gate operator at Solano Lofts. Compete with 2 other vendors.", when: "12 min ago", unread: true, route: "workorders" },
  { id: "n2", kind: "compliance", icon: "compliance", c: "var(--amber)", title: "COI expires in 14 days", msg: "Hartford General Liability — renew before 2026-05-21 to avoid auto-pause on Meridian properties.", when: "1h ago", unread: true, route: "compliance" },
  { id: "n3", kind: "job", icon: "workorder", c: "var(--olive)", title: "Job complete · WO-3026", msg: "Miguel Padilla closed out the gate reader replacement at Solano. Diego signed off.", when: "2h ago", unread: true, route: "workorders" },
  { id: "n4", kind: "finance", icon: "factoring", c: "var(--slateblue)", title: "Factoring funded", msg: "$2,648 wired to Wells Fargo •••2418 for INV-1078.", when: "3h ago", unread: true, route: "factoring" },
  { id: "n5", kind: "compliance", icon: "shield", c: "var(--terracotta)", title: "Background check expired", msg: "Joel Carrera's Checkr report expired. He cannot check in to Meridian properties until renewed.", when: "5h ago", unread: false, route: "team" },
  { id: "n6", kind: "job", icon: "schedule", c: "var(--bronze)", title: "PTE confirmed", msg: "Maria Rodriguez (Aria · Unit 308) confirmed Tue 9 AM entry. SMS thread archived.", when: "Yesterday", unread: false, route: "inbox" },
  { id: "n7", kind: "bid", icon: "sparkles", c: "var(--olive)", title: "Bid awarded · WO-3038", msg: "Aria on Camelback awarded you the access control retrofit. Sasha sends her congrats.", when: "Yesterday", unread: false, route: "workorders" },
  { id: "n8", kind: "finance", icon: "invoice", c: "var(--amber)", title: "Invoice overdue", msg: "INV-1075 · Palmcrest at 35 days. Auto-reminder sent. Consider escalation.", when: "2d ago", unread: false, route: "invoices" }];

  const tabs = [
  { k: "all", l: "All", c: items.length },
  { k: "job", l: "Jobs", c: items.filter((i) => i.kind === "job").length },
  { k: "bid", l: "Bids", c: items.filter((i) => i.kind === "bid").length },
  { k: "compliance", l: "Compliance", c: items.filter((i) => i.kind === "compliance").length },
  { k: "finance", l: "Finance", c: items.filter((i) => i.kind === "finance").length }];

  const visible = tab === "all" ? items : items.filter((i) => i.kind === tab);
  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <div style={{
      position: "absolute", top: 42, right: 0, width: 420, maxHeight: 540,
      background: "var(--surface)", border: "1px solid var(--line-strong)",
      borderRadius: 10, boxShadow: "var(--shadow-lg)",
      animation: "fadeUp 160ms var(--ease)", color: "var(--text)", zIndex: 100,
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div className="h-serif" style={{ fontSize: 17, fontWeight: 600 }}>Notifications</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{unreadCount} unread · routed by your preferences</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Mark all read</button>
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {tabs.map((t) =>
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: "5px 10px", border: 0, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600,
            background: tab === t.k ? "var(--bronze)" : "var(--surface-2)",
            color: tab === t.k ? "white" : "var(--text-2)",
            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap"
          }}>
              {t.l}<span style={{ opacity: 0.7 }}>{t.c}</span>
            </button>
          )}
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {visible.map((n) =>
        <button key={n.id} onClick={() => onNav(n.route)} style={{
          width: "100%", display: "flex", gap: 12, padding: "12px 16px",
          border: 0, borderBottom: "1px solid var(--line)", textAlign: "left", cursor: "pointer",
          background: n.unread ? "rgba(176,134,84,0.04)" : "transparent",
          color: "var(--text)"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
        onMouseLeave={(e) => e.currentTarget.style.background = n.unread ? "rgba(176,134,84,0.04)" : "transparent"}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${n.c}1A`, color: n.c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
              <Icon name={n.icon} size={15} />
              {n.unread && <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: "var(--terracotta)", border: "2px solid var(--surface)" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                <div className="muted" style={{ fontSize: 10, whiteSpace: "nowrap", flexShrink: 0 }}>{n.when}</div>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{n.msg}</div>
            </div>
          </button>
        )}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => onNav("inbox")}>Open inbox</button>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}><Icon name="settings" size={11} /> Preferences</button>
      </div>
    </div>);

}

// ──────────────────────────────────────────────────────────────────────────
// Profile dropdown — opens from the avatar button in TopBar.
// Lets the operator switch between Admin/Demo View (full sidebar incl. demo
// flows) and Daedalus Pro View (production sidebar — vendor-facing routes).
// ──────────────────────────────────────────────────────────────────────────
function ProfileDropdown({ view, onSetView, onSwitchRole, currentRole }) {
  return (
    <div style={{
      position: "absolute", top: 42, right: 0, width: 300,
      background: "var(--surface)", border: "1px solid var(--line-strong)",
      borderRadius: 10, boxShadow: "var(--shadow-lg)",
      animation: "fadeUp 160ms var(--ease)", color: "var(--text)", zIndex: 100,
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar user={{ initials: currentRole.initials, color: currentRole.color }} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentRole.label}</div>
          <div className="muted" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentRole.sub}</div>
        </div>
      </div>
      <div style={{ padding: "10px 8px" }}>
        <div style={{ padding: "6px 10px", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", fontWeight: 700 }}>View</div>
        <ProfileViewOption
          label="Admin / Demo View"
          desc="Full sidebar — all routes including demo flows"
          active={view === "admin"}
          onClick={() => onSetView("admin")}
        />
        <ProfileViewOption
          label="Daedalus Pro View"
          desc="Production sidebar — vendor-facing routes only"
          active={view === "daedalus-pro"}
          onClick={() => onSetView("daedalus-pro")}
        />
      </div>
      {onSwitchRole &&
        <div style={{ borderTop: "1px solid var(--line)", padding: "8px" }}>
          <button onClick={onSwitchRole} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
            border: 0, background: "transparent", borderRadius: 6, cursor: "pointer", textAlign: "left", color: "var(--text)", fontSize: 12
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Icon name="users" size={14} color="var(--text-3)" />
            <span style={{ flex: 1 }}>Switch role…</span>
            <Icon name="chevRight" size={12} color="var(--text-3)" />
          </button>
        </div>
      }
    </div>
  );
}

function ProfileViewOption({ label, desc, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
      border: 0, background: active ? "rgba(176,134,84,0.08)" : "transparent",
      borderRadius: 6, cursor: "pointer", textAlign: "left", color: "var(--text)"
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <div style={{
        width: 16, height: 16, borderRadius: 999, border: `2px solid ${active ? "var(--bronze)" : "var(--line-strong)"}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {active && <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--bronze)" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{label}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{desc}</div>
      </div>
    </button>
  );
}

Object.assign(window, { Sidebar, TopBar, RoleSwitcher, ToastHost, ROLES, NAV, DaedalusMark, FilterPalette, NotificationsDropdown, ProfileDropdown, ProfileViewOption, DAEDALUS_PRO_NAV_IDS });