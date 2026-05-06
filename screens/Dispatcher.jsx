// Dispatcher Board — Kanban with HTML5 drag-and-drop

function Dispatcher({ onNav }) {
  const M = window.MOCK;
  const initialCols = M.TODAY_DISPATCH;
  const [cols, setCols] = React.useState(initialCols);
  const [dragId, setDragId] = React.useState(null);
  const [dragFrom, setDragFrom] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(null);
  const [filter, setFilter] = React.useState("all");

  const colOrder = ["Unassigned", "Assigned", "En Route", "On Site", "Completed Today"];

  const onDragStart = (woId, from) => { setDragId(woId); setDragFrom(from); };
  const onDragEnd = () => { setDragId(null); setDragFrom(null); setDragOver(null); };
  const onDrop = (col) => {
    if (!dragId || dragFrom === col) { onDragEnd(); return; }
    setCols(c => {
      const next = { ...c };
      next[dragFrom] = next[dragFrom].filter(id => id !== dragId);
      next[col] = [...next[col], dragId];
      return next;
    });
    const wo = M.WOS.find(w => w.id === dragId);
    window.toast({ kind: "success", title: `${dragId} → ${col}`, msg: wo?.title });
    onDragEnd();
  };

  return (
    <div className="page" style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Dispatcher Board</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            Today · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} ·
            <span style={{ color: "var(--olive)", marginLeft: 6 }}>● 3 crews active</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 8, padding: 2, background: "var(--surface)" }}>
            {[{k:"all",l:"All"},{k:"urgent",l:"Urgent"},{k:"emergency",l:"Emergency"}].map(f => (
              <button key={f.k} onClick={()=>setFilter(f.k)} style={{
                padding:"6px 12px", border:0, borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600,
                background: filter===f.k ? "var(--bronze)" : "transparent",
                color: filter===f.k ? "white" : "var(--text-2)"
              }}>{f.l}</button>
            ))}
          </div>
          <button className="btn btn-secondary"><Icon name="map" size={14}/> Map view</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> New WO</button>
        </div>
      </div>

      <CMDispatcherStrip onNav={onNav}/>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${colOrder.length}, 1fr)`, gap: 14, minHeight: 0 }}>
        {colOrder.map(col => (
          <div key={col}
            onDragOver={e => { e.preventDefault(); setDragOver(col); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => onDrop(col)}
            style={{
              display: "flex", flexDirection: "column", minHeight: 0,
              background: dragOver === col ? "rgba(176,134,84,0.08)" : "var(--surface-2)",
              border: dragOver === col ? "1px dashed var(--bronze)" : "1px solid var(--line)",
              borderRadius: 12, transition: "background var(--tx-fast)",
            }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ColDot col={col}/>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{col}</div>
                <span className="pill" style={{ background: "var(--surface)", color: "var(--text-2)", fontSize: 10, height: 18 }}>{cols[col].length}</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: 24, padding: 0 }}><Icon name="plus" size={12}/></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {cols[col].map(woId => {
                const wo = M.WOS.find(w => w.id === woId);
                if (!wo) return null;
                if (filter !== "all" && wo.urgency !== filter) return null;
                return <DispatchCard key={woId} wo={wo} onDragStart={() => onDragStart(woId, col)} onDragEnd={onDragEnd} dragging={dragId === woId} onClick={() => { onNav("workorders"); setTimeout(() => window.openWO?.(woId), 50); }}/>;
              })}
              {cols[col].length === 0 && (
                <div className="muted" style={{ padding: 20, textAlign: "center", fontSize: 12, fontStyle: "italic" }}>Drop a job here</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColDot({ col }) {
  const c = { "Unassigned": "var(--text-3)", "Assigned": "var(--slateblue)", "En Route": "var(--amber)", "On Site": "var(--olive)", "Completed Today": "var(--bronze)" }[col];
  return <div style={{ width: 8, height: 8, borderRadius: 999, background: c }}/>;
}

function DispatchCard({ wo, onDragStart, onDragEnd, dragging, onClick }) {
  const M = window.MOCK;
  const prop = M.PROPERTIES.find(p => p.id === wo.property);
  const tech = M.TEAM.find(t => t.id === wo.techId);
  return (
    <div draggable
      onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick}
      className="card"
      style={{
        padding: 12, cursor: "grab", opacity: dragging ? 0.4 : 1,
        transition: "opacity var(--tx-fast), transform var(--tx-fast)",
        borderLeft: `3px solid ${wo.urgency === "emergency" ? "var(--terracotta)" : wo.urgency === "urgent" ? "var(--amber)" : "var(--slateblue)"}`,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--bronze)" }}>{wo.id}</span>
        <UrgencyPill u={wo.urgency} small/>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{wo.title}</div>
      <div className="muted" style={{ fontSize: 11, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="location" size={11}/> {prop?.name}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {tech ? <Avatar user={tech} size={22}/> : <span className="muted" style={{ fontSize: 11, fontStyle: "italic" }}>Unassigned</span>}
        {wo.scheduled && <span className="mono muted" style={{ fontSize: 10 }}>{new Date(wo.scheduled).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>}
      </div>
    </div>
  );
}

window.Dispatcher = Dispatcher;

// Compact strip above the kanban: shows techs with capacity gaps and lets the
// GC flip "Open to consumer market" inline. Clicking the row deep-links to the
// full Consumer Market screen.
function CMDispatcherStrip({ onNav }) {
  const [techs, setTechs] = React.useState([
    { id: "t1", name: "Miguel Padilla", initials: "MP", color: "#B0463A", gap: "3 hrs free · 2-5 PM", open: true,  earned: 84,   suggested: true },
    { id: "t3", name: "Aria Chen",      initials: "AC", color: "#4A6378", gap: "Available now",       open: true,  earned: 142,  suggested: false },
    { id: "t5", name: "Renata Cole",    initials: "RC", color: "#B08654", gap: "2 hrs free · 4-6 PM", open: false, earned: 0,    suggested: true },
    { id: "t4", name: "Jordan Sands",   initials: "JS", color: "#D08A2E", gap: "Idle today",          open: false, earned: 0,    suggested: false, pending: true },
  ]);
  const toggle = id => setTechs(arr => arr.map(t => t.id === id ? { ...t, open: !t.open } : t));
  const totalToday = techs.reduce((s, t) => s + t.earned, 0);

  return (
    <div className="card" style={{ marginBottom: 14, padding: "12px 14px", background: "linear-gradient(135deg, var(--surface), var(--surface-2))", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="zap" size={12} color="var(--bronze)"/>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-2)" }}>Consumer market</div>
        </div>
        <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>Today's cut · <span className="mono" style={{ color: "var(--bronze)", fontWeight: 700 }}>+${(totalToday * 0.05).toFixed(2)}</span></div>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 8, overflowX: "auto" }}>
        {techs.map(t => (
          <div key={t.id} style={{
            flexShrink: 0, padding: "8px 12px", borderRadius: 10, border: t.open ? "1px solid var(--olive)" : "1px solid var(--line)",
            background: t.open ? "rgba(122,139,76,0.06)" : "var(--surface)",
            display: "flex", alignItems: "center", gap: 10, minWidth: 220, position: "relative",
          }}>
            {t.suggested && !t.open && <span style={{ position: "absolute", top: -6, right: 6, fontSize: 9, padding: "2px 6px", borderRadius: 999, background: "var(--bronze)", color: "white", fontWeight: 700, letterSpacing: "0.04em" }}>SUGGEST</span>}
            <div style={{ width: 28, height: 28, borderRadius: 999, background: t.color, color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div>
              <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{t.gap}</div>
            </div>
            {t.pending ? (
              <span className="pill" style={{ background: "rgba(208,138,46,0.12)", color: "#7A4F1B", fontSize: 9, height: 18 }}>Pending</span>
            ) : (
              <button onClick={() => toggle(t.id)} style={{
                width: 30, height: 18, borderRadius: 999, position: "relative", cursor: "pointer", flexShrink: 0,
                background: t.open ? "var(--olive)" : "var(--surface-3)", border: 0,
              }}>
                <span style={{ position: "absolute", top: 2, left: t.open ? 14 : 2, width: 14, height: 14, borderRadius: 999, background: "white", transition: "all var(--tx-fast)", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}/>
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => onNav("consumer-market")} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
        Manage <Icon name="chevRight" size={11}/>
      </button>
    </div>
  );
}
window.CMDispatcherStrip = CMDispatcherStrip;
