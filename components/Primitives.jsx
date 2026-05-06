// Shared icons + small primitives used across the prototype.
// Lucide-style 1.5px stroke line icons rendered as SVG.

const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.5, style }) => {
  const paths = {
    home:        <><path d="M3 11l9-8 9 8"/><path d="M5 9.5V21h14V9.5"/></>,
    inbox:       <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3 7v7a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1v-7l3-7z"/></>,
    workorder:   <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
    bid:         <><path d="M3 7h18M3 12h18M3 17h12"/><circle cx="19" cy="17" r="2"/></>,
    dispatch:    <><rect x="3" y="4" width="6" height="16" rx="1"/><rect x="11" y="4" width="6" height="11" rx="1"/><rect x="19" y="4" width="2" height="7" rx="1"/></>,
    schedule:    <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    field:       <><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    compliance:  <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></>,
    invoice:     <><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/></>,
    factoring:   <><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-.7-1.5-1-2.5-1-1.7 0-3 1-3 2.4 0 1.4 1.2 2 2.5 2.3l1.6.4c1.3.3 2.5.9 2.5 2.3 0 1.4-1.3 2.4-3 2.4-1 0-2-.3-2.5-1"/><path d="M12 6v2M12 16v2"/></>,
    report:      <><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-5"/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    bell:        <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    search:      <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    chevDown:    <><path d="m6 9 6 6 6-6"/></>,
    chevUp:      <><path d="m6 15 6-6 6 6"/></>,
    zap:         <><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></>,
    chevRight:   <><path d="m9 6 6 6-6 6"/></>,
    chevLeft:    <><path d="m15 6-6 6 6 6"/></>,
    plus:        <><path d="M12 5v14M5 12h14"/></>,
    check:       <><path d="m5 12 5 5L20 7"/></>,
    x:           <><path d="M6 6l12 12M18 6L6 18"/></>,
    upload:      <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/></>,
    download:    <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></>,
    map:         <><path d="m1 6 7-3 8 3 7-3v15l-7 3-8-3-7 3z"/><path d="M8 3v15M16 6v15"/></>,
    camera:      <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    clock:       <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    location:    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    file:        <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    shield:      <><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/></>,
    wing:        <><path d="M3 12c4-6 9-9 18-9-1 8-7 13-13 14-2 .3-4 .3-5-1z"/><path d="M3 12c2-1 5-2 8-2"/></>,
    key:         <><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9 1 1-2 2 2 2-3 3-2-2-2 2"/></>,
    column:      <><path d="M5 3h14M5 21h14M7 3v18M17 3v18M5 6h14M5 18h14"/></>,
    drag:        <><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></>,
    edit:        <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    arrow:       <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    phone:       <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.1 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.9z"/></>,
    mail:        <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></>,
    flag:        <><path d="M4 22V4M4 4l11 4-3 4 3 4H4"/></>,
    sparkles:    <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"/></>,
    info:        <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></>,
    alert:       <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>,
    layers:      <><path d="m12 2 10 6-10 6L2 8z"/><path d="m2 14 10 6 10-6"/></>,
    list:        <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>,
    grid:        <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    truck:       <><path d="M1 17V5h13v12"/><path d="M14 9h5l3 4v4h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    play:        <><path d="m6 4 14 8-14 8z"/></>,
    pause:       <><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></>,
    moon:        <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
    sun:         <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    refresh:     <><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></>,
    user:        <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    users:       <><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M22 21a7 7 0 0 0-6-7"/></>,
    sliders:     <><path d="M4 6h12M4 12h8M4 18h14"/><circle cx="18" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="20" cy="18" r="2"/></>,
    money:       <><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></>,
    lock:        <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    eye:         <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    car:         <><path d="M6 11h12l-1.4-4.2A2 2 0 0 0 14.7 5H9.3a2 2 0 0 0-1.9 1.8z"/><path d="M3 11h18v6H3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></>,
    message:     <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    star:        <><path d="m12 2 3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z"/></>,
    wifi:        <><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.8a15 15 0 0 1 20 0"/><circle cx="12" cy="20" r="1"/></>,
    trophy:      <><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a2 2 0 0 1 0 4 4 4 0 0 1-3 2"/><path d="M7 5H4a2 2 0 0 0 0 4 4 4 0 0 0 3 2"/></>,
    mic:         <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>,
    chip:        <><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>,
    compass:     <><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2z"/></>,
    medal:       <><path d="M7 4 5 8l4 6h6l4-6-2-4z"/><circle cx="12" cy="17" r="5"/><path d="M12 14v6"/></>,
    target:      <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>,
    flame:       <><path d="M8.5 14a3.5 3.5 0 1 0 7 0c0-2-1-3-2-4-1.5-1.5-1-3.5 0-5-2 .5-5 2.5-5 5 0 1 0 2-1 2.5"/></>,
    leaf:        <><path d="M11 20A7 7 0 0 1 4 13c0-5 3-9 9-11 1 4 1 7 0 10s-3 5-7 7"/><path d="M2 22c4-2 6-5 7-9"/></>,
    bolt:        <><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" stroke="none"/></>,
    pin:         <><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5" fill="currentColor"/></>,
  };
  const p = paths[name];
  if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>{p}</svg>
  );
};

// Tier badge with optional Elite wing motif
const TierBadge = ({ tier = "Verified", size = "md" }) => {
  const colors = {
    Applicant: { bg: "var(--surface-3)", color: "var(--text-2)", line: "var(--line-strong)" },
    Verified:  { bg: "rgba(74, 99, 120, 0.16)", color: "var(--slateblue)", line: "rgba(74, 99, 120, 0.32)" },
    Preferred: { bg: "rgba(176, 134, 84, 0.18)", color: "var(--bronze)", line: "rgba(176, 134, 84, 0.40)" },
    Elite:     { bg: "linear-gradient(135deg, #2A1E12 0%, #4A3520 100%)", color: "#F0D6A8", line: "var(--bronze)" },
  };
  const c = colors[tier] || colors.Verified;
  const padding = size === "lg" ? "8px 14px" : "4px 10px";
  const fontSize = size === "lg" ? 14 : 11;
  const isElite = tier === "Elite";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding, borderRadius: 999, background: c.bg, color: c.color,
      border: `1px solid ${c.line}`, fontSize, fontWeight: 600, fontFamily: "var(--serif)",
      letterSpacing: "0.02em",
    }}>
      {isElite && <Icon name="wing" size={size === "lg" ? 16 : 12} />}
      {tier}
    </span>
  );
};

const UrgencyPill = ({ u }) => {
  const map = {
    emergency: { cls: "pill-danger",  label: "Emergency" },
    urgent:    { cls: "pill-warn",    label: "Urgent" },
    routine:   { cls: "pill-info",    label: "Routine" },
    scheduled: { cls: "pill-neutral", label: "Scheduled" },
  };
  const m = map[u] || map.routine;
  return <span className={`pill ${m.cls}`}><span className="dot"/>{m.label}</span>;
};

const StatusPill = ({ s }) => {
  const map = {
    "unassigned":        { cls: "pill-neutral", label: "Unassigned" },
    "awaiting-bid":      { cls: "pill-warn",    label: "Awaiting Bid" },
    "scheduled":         { cls: "pill-info",    label: "Scheduled" },
    "assigned":          { cls: "pill-info",    label: "Assigned" },
    "en-route":          { cls: "pill-bronze",  label: "En Route" },
    "on-site":           { cls: "pill-bronze",  label: "On Site" },
    "completed":         { cls: "pill-success", label: "Completed" },
    "invoiced":          { cls: "pill-success", label: "Invoiced" },
    "paid":              { cls: "pill-success", label: "Paid" },
    "on-hold":           { cls: "pill-danger",  label: "On Hold" },
    "awaiting-approval": { cls: "pill-warn",    label: "Awaiting Approval" },
  };
  const m = map[s] || map["unassigned"];
  return <span className={`pill ${m.cls}`}><span className="dot"/>{m.label}</span>;
};

const Avatar = ({ user, size = 28, ring = false }) => {
  if (!user) {
    return <div style={{
      width: size, height: size, borderRadius: 999,
      background: "var(--surface-3)", color: "var(--text-3)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 600, border: "1px dashed var(--line-strong)"
    }}>?</div>;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: user.color || "var(--bronze)",
      color: "#fff", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 600,
      boxShadow: ring ? `0 0 0 2px var(--surface), 0 0 0 4px var(--bronze)` : "none",
      flexShrink: 0,
    }} title={user.name}>{user.initials}</div>
  );
};

// SLA countdown ring (visual progress)
const SLARing = ({ remaining, total, size = 36 }) => {
  const pct = Math.max(0, Math.min(1, remaining / total));
  const angle = pct * 360;
  let color;
  if (pct > 0.5) color = "var(--olive)";
  else if (pct > 0.2) color = "var(--amber)";
  else color = "var(--terracotta)";
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `conic-gradient(${color} ${angle}deg, var(--surface-3) ${angle}deg)`,
      display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <div style={{
        width: size - 8, height: size - 8, borderRadius: 999,
        background: "var(--surface)", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 600, color, fontVariantNumeric: "tabular-nums",
      }}>
        {remaining < 1 && remaining > 0 ? `${Math.round(remaining * 60)}m` :
         remaining === 0 ? "✓" :
         `${Math.round(remaining)}h`}
      </div>
    </div>
  );
};

const fmt$ = (n) => "$" + Math.round(n).toLocaleString();
const fmtTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

Object.assign(window, { Icon, TierBadge, UrgencyPill, StatusPill, Avatar, SLARing, fmt$, fmtTime, fmtDate });
