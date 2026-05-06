// Compliance Vault — redesigned. Cleaner, calmer, audit-readiness focused.
// Layout: left rail (score + category nav) · main (timeline + table) · drawer (doc detail).

function Compliance({ onNav }) {
  const M = window.MOCK;
  const [filter, setFilter] = React.useState("All");
  const [openDoc, setOpenDoc] = React.useState(null);
  const [query, setQuery] = React.useState("");

  const categories = [
    { id: "All", label: "All documents", icon: "file" },
    { id: "COI", label: "Insurance (COI)", icon: "shield" },
    { id: "License", label: "Licenses & bonds", icon: "compliance" },
    { id: "Certification", label: "Certifications", icon: "sparkles" },
    { id: "W-9", label: "Tax & legal", icon: "file" },
    { id: "Background", label: "Background checks", icon: "user" },
    { id: "Drug Screen", label: "Drug screens", icon: "info" },
    { id: "Lien Waiver", label: "Lien waivers", icon: "edit" },
  ];

  const counts = {
    current: M.DOCS.filter(d => d.status === "current").length,
    expiring: M.DOCS.filter(d => d.status === "expiring").length,
    expired: M.DOCS.filter(d => d.status === "expired").length,
  };
  const total = M.DOCS.length;
  const readiness = Math.round((counts.current / total) * 100);

  const filtered = M.DOCS.filter(d => {
    if (filter !== "All" && d.type !== filter) return false;
    if (query && !`${d.name} ${d.carrier || ""} ${d.type}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const catCount = (id) => id === "All" ? M.DOCS.length : M.DOCS.filter(d => d.type === id).length;

  return (
    <div className="page" style={{ padding: "24px 28px 40px", maxWidth: 1480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
        <div>
          <div className="muted" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Compliance</div>
          <h1 style={{ fontSize: 28, margin: 0, fontWeight: 600, letterSpacing: "-0.01em" }}>Vault</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Every certificate, license, and check Meridian, Solana &amp; Red Rock require — kept current.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="download" size={14} /> Export bundle</button>
          <button className="btn btn-primary"><Icon name="upload" size={14} /> Upload document</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22, alignItems: "flex-start" }}>
        {/* ── Left rail ───────────────────────────────────── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 16 }}>
          <ReadinessCard readiness={readiness} counts={counts} total={total}/>

          <div className="card" style={{ padding: 8 }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, padding: "8px 10px 6px" }}>Browse</div>
            {categories.map(c => {
              const isA = filter === c.id;
              const n = catCount(c.id);
              return (
                <button key={c.id} onClick={() => setFilter(c.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", border: 0, background: isA ? "rgba(176,134,84,0.10)" : "transparent",
                  color: isA ? "var(--bronze)" : "var(--text-2)", cursor: "pointer", borderRadius: 6,
                  fontSize: 13, fontWeight: isA ? 600 : 500, textAlign: "left", marginBottom: 1,
                }}
                onMouseEnter={e => { if (!isA) e.currentTarget.style.background = "var(--hover)"; }}
                onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}>
                  <Icon name={c.icon} size={14}/>
                  <span style={{ flex: 1 }}>{c.label}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{n}</span>
                </button>
              );
            })}
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Distributed to</div>
            {[
              { name: "Meridian Living", c: "var(--olive)", n: "12 docs" },
              { name: "Solana Residential", c: "var(--bronze)", n: "10 docs" },
              { name: "Red Rock Capital", c: "var(--slateblue)", n: "9 docs" },
              { name: "Aria Properties", c: "var(--terracotta)", n: "8 docs" },
            ].map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: p.c }}/>
                <span style={{ flex: 1 }}>{p.name}</span>
                <span className="muted mono" style={{ fontSize: 10 }}>{p.n}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main pane ───────────────────────────────────── */}
        <div>
          {/* Renewal timeline */}
          <RenewalTimeline docs={M.DOCS}/>

          {/* Search + view bar */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, marginTop: 22 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Icon name="search" size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, carrier, policy #…" style={{
                width: "100%", height: 36, paddingLeft: 32, paddingRight: 12, border: "1px solid var(--line)",
                borderRadius: 8, background: "var(--surface)", fontSize: 13, color: "var(--text)", outline: "none",
              }}/>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{filtered.length} {filtered.length === 1 ? "doc" : "docs"}</div>
          </div>

          {/* Doc list (table-style, calm) */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--surface-2)", borderBottom: "1px solid var(--line)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-3)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>Document</div>
              <div style={{ width: 90, flexShrink: 0 }}>Issuer</div>
              <div style={{ width: 90, flexShrink: 0 }}>Expires</div>
              <div style={{ width: 80, flexShrink: 0 }}>Status</div>
            </div>
            {filtered.map((d, i) => <DocRow key={d.id} doc={d} onClick={() => setOpenDoc(d)} last={i === filtered.length - 1}/>)}
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Icon name="search" size={20} color="var(--text-3)"/>
                <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>No documents match your filters.</div>
              </div>
            )}
          </div>

          <div className="muted" style={{ fontSize: 11, marginTop: 14, textAlign: "center" }}>
            Documents auto-route to PMC compliance portals. Daedalus monitors expirations and re-requests carriers 30 days out.
          </div>
        </div>
      </div>

      {openDoc && <COIDrawer doc={openDoc} onClose={() => setOpenDoc(null)}/>}
    </div>
  );
}

// ── Audit-readiness ring ────────────────────────────────────────────────
function ReadinessCard({ readiness, counts, total }) {
  const ring = (pct, color) => {
    const r = 32, c = 2 * Math.PI * r;
    return (
      <svg width={84} height={84} viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--line)" strokeWidth="6"/>
        <circle cx="42" cy="42" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${c * pct/100} ${c}`} transform="rotate(-90 42 42)"/>
        <text x="42" y="46" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--text)" fontFamily="var(--mono)">{pct}</text>
      </svg>
    );
  };
  const color = readiness >= 90 ? "var(--olive)" : readiness >= 75 ? "var(--bronze)" : "var(--terracotta)";
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Audit readiness</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {ring(readiness, color)}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{readiness >= 90 ? "Audit-ready" : readiness >= 75 ? "Mostly ready" : "Needs attention"}</div>
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{counts.current} of {total} current</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 14, fontSize: 10 }}>
        <Pip label="Current" n={counts.current} color="var(--olive)"/>
        <Pip label="Expiring" n={counts.expiring} color="var(--amber)"/>
        <Pip label="Expired" n={counts.expired} color="var(--terracotta)"/>
      </div>
    </div>
  );
}
function Pip({ label, n, color }) {
  return (
    <div style={{ flex: 1, padding: "8px 6px", background: "var(--surface-2)", borderRadius: 6, textAlign: "center" }}>
      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color }}>{n}</div>
      <div className="muted" style={{ fontSize: 10, marginTop: 1 }}>{label}</div>
    </div>
  );
}

// ── Renewal timeline (next 12 months) ───────────────────────────────────
function RenewalTimeline({ docs }) {
  const today = new Date("2026-05-06");
  const items = docs
    .filter(d => d.expires && d.expires !== "Lifetime")
    .map(d => {
      const exp = new Date(d.expires);
      const days = Math.round((exp - today) / 86400000);
      return { ...d, daysOut: days, exp };
    })
    .filter(d => d.daysOut >= -180 && d.daysOut <= 365)
    .sort((a, b) => a.daysOut - b.daysOut);

  // 12-month axis from today
  const monthLabels = [];
  for (let i = 0; i < 12; i++) {
    const m = new Date(today.getFullYear(), today.getMonth() + i, 1);
    monthLabels.push({ label: m.toLocaleString("en-US", { month: "short" }), idx: i });
  }
  const pos = (days) => Math.max(0, Math.min(100, ((days + 30) / 395) * 100)); // -30d → +365d span

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Renewal timeline</div>
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{items.length} docs need action in the next 12 months</div>
        </div>
        <div className="muted" style={{ fontSize: 11 }}>Today · May 6, 2026</div>
      </div>

      <div style={{ position: "relative", height: 92, paddingTop: 24 }}>
        {/* axis */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, height: 1, background: "var(--line)" }}/>
        {/* today marker */}
        <div style={{ position: "absolute", left: `${pos(0)}%`, top: 16, bottom: 0, width: 1, background: "var(--bronze)", opacity: 0.5 }}/>
        <div style={{ position: "absolute", left: `${pos(0)}%`, top: 6, transform: "translateX(-50%)", fontSize: 9, color: "var(--bronze)", fontWeight: 700, letterSpacing: "0.05em" }}>TODAY</div>

        {/* month ticks */}
        {monthLabels.map((m, i) => {
          const left = ((i + 1) / 12) * (365/395) * 100 + (30/395)*100 - 100/12;
          return (
            <div key={i} style={{ position: "absolute", left: `${left}%`, top: 70, fontSize: 9, color: "var(--text-3)", letterSpacing: "0.04em" }}>{m.label}</div>
          );
        })}

        {/* doc dots */}
        {items.map((d, i) => {
          const color = d.status === "expired" ? "var(--terracotta)" : d.status === "expiring" || d.daysOut < 30 ? "var(--amber)" : "var(--olive)";
          const above = i % 2 === 0;
          return (
            <div key={d.id} title={`${d.name} · ${fmtDate(d.expires)}`} style={{
              position: "absolute", left: `${pos(d.daysOut)}%`, top: above ? 30 : 56,
              transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: color, border: "2px solid var(--surface)" }}/>
              {(d.status === "expired" || d.status === "expiring") && (
                <div style={{ position: "absolute", top: above ? -16 : 14, fontSize: 9, fontWeight: 600, color, whiteSpace: "nowrap" }}>{d.type}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Single row ──────────────────────────────────────────────────────────
function DocRow({ doc, onClick, last }) {
  const statusMap = {
    current:  { color: "var(--olive)",      label: "Current" },
    expiring: { color: "var(--amber)",      label: "Expiring" },
    expired:  { color: "var(--terracotta)", label: "Expired" },
  };
  const s = statusMap[doc.status];
  const typeIcon = {
    "COI": "shield", "License": "compliance", "Certification": "sparkles", "W-9": "file",
    "Lien Waiver": "edit", "Background": "user", "Drug Screen": "info"
  }[doc.type] || "file";

  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "14px 14px", border: 0, borderBottom: last ? 0 : "1px solid var(--line)",
      background: "transparent", textAlign: "left", cursor: "pointer", color: "var(--text)",
      transition: "background var(--tx-fast)",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--surface-2)", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={typeIcon} size={14}/>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
          <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{doc.type} · {doc.size}</div>
        </div>
      </div>
      <div className="muted" style={{ width: 90, flexShrink: 0, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.carrier || "—"}</div>
      <div className="mono" style={{ width: 90, flexShrink: 0, fontSize: 12, color: "var(--text-2)" }}>
        {doc.expires === "Lifetime" ? "Lifetime" : doc.expires === null ? "—" : fmtDate(doc.expires)}
      </div>
      <div style={{ width: 80, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: s.color, flexShrink: 0 }}/>
        <span style={{ fontSize: 12, fontWeight: 500, color: s.color }}>{s.label}</span>
      </div>
    </button>
  );
}

// ── COI Drawer (kept, lightly polished) ─────────────────────────────────
function COIDrawer({ doc, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(11, 13, 16, 0.55)",
      backdropFilter: "blur(2px)", zIndex: 100, animation: "fadeUp 200ms var(--ease)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 720,
        background: "var(--bg)", borderLeft: "1px solid var(--line-strong)",
        boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column",
        animation: "slideIn 250ms var(--ease)"
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{doc.type}</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{doc.name}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="x" size={14}/></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex" }}>
          <div style={{ width: "44%", background: "var(--surface-3)", borderRight: "1px solid var(--line)", padding: 22, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", aspectRatio: "8.5/11", background: "white", boxShadow: "var(--shadow-md)", padding: 18, color: "#222", fontSize: 6, lineHeight: 1.4 }}>
              <div style={{ textAlign: "center", borderBottom: "1px solid #888", paddingBottom: 4, marginBottom: 6 }}>
                <div style={{ fontSize: 8, fontWeight: 700 }}>ACORD</div>
                <div style={{ fontSize: 6 }}>CERTIFICATE OF LIABILITY INSURANCE</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <div>PRODUCER<br/>Marsh USA Inc.<br/>Phoenix, AZ</div>
                <div>INSURED<br/><strong>Daedalus Trades & Tech, LLC</strong><br/>1820 W Roosevelt St<br/>Phoenix, AZ 85007</div>
              </div>
              <div style={{ borderTop: "1px solid #888", marginTop: 6, paddingTop: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 6 }}>COVERAGES</div>
                <table style={{ width: "100%", fontSize: 5, marginTop: 2 }}>
                  <tbody>
                    <tr><td>Each Occurrence</td><td>$1,000,000</td></tr>
                    <tr><td>General Aggregate</td><td>$2,000,000</td></tr>
                    <tr><td>Auto · CSL</td><td>$1,000,000</td></tr>
                    <tr><td>Workers Comp · Each</td><td>$1,000,000</td></tr>
                    <tr><td>Umbrella</td><td>$5,000,000</td></tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 8, padding: 4, background: "rgba(176,134,84,0.18)", border: "1px solid #B08654" }}>
                <strong>ADDITIONAL INSURED:</strong> Per attached endorsement, all certificate holders.
              </div>
              <div style={{ marginTop: 10, fontSize: 5, color: "#666" }}>Effective 01/01/2026 · Expires 12/31/2026</div>
            </div>
            <div className="muted" style={{ fontSize: 10, marginTop: 10 }}>Page 1 of 2 · {doc.size}</div>
          </div>

          <div style={{ flex: 1, padding: 22, overflowY: "auto" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              <span className="pill pill-success"><span className="dot"/>Verified</span>
              {doc.carrier && <span className="pill pill-neutral">{doc.carrier}</span>}
            </div>

            <div style={{ marginBottom: 22 }}>
              <div className="muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Insured entity</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Daedalus Trades & Technology, LLC</div>
              <div className="muted" style={{ fontSize: 12 }}>1820 W Roosevelt St, Phoenix, AZ 85007</div>
            </div>

            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Coverage</div>
            <div className="card" style={{ padding: 0, marginBottom: 22 }}>
              <table style={{ width: "100%", fontSize: 12 }}>
                <thead style={{ background: "var(--surface-2)" }}>
                  <tr style={{ color: "var(--text-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Line</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Policy #</th>
                    <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600 }}>Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["General Liability — Each Occurrence", "GL-77-2294-X", "$1,000,000"],
                    ["General Liability — Aggregate", "GL-77-2294-X", "$2,000,000"],
                    ["Auto Liability — CSL", "BA-12-8430", "$1,000,000"],
                    ["Workers Comp — Each Accident", "WC-44-1108", "$1,000,000"],
                    ["Umbrella", "UM-09-3320", "$5,000,000"],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ padding: "10px 12px" }}>{row[0]}</td>
                      <td className="mono" style={{ padding: "10px 12px", color: "var(--text-2)" }}>{row[1]}</td>
                      <td className="mono" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ padding: 14, marginBottom: 22, background: "rgba(122,139,76,0.08)", borderColor: "rgba(122,139,76,0.32)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="check" color="var(--olive)" size={16}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--olive)" }}>Additional Insured language present</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Matches Meridian Living, Solana Residential, and Red Rock Capital requirements.</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary"><Icon name="mail" size={14}/> Send to PMC</button>
              <button className="btn btn-secondary"><Icon name="refresh" size={14}/> Request renewal</button>
              <button className="btn btn-ghost"><Icon name="download" size={14}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Compliance = Compliance;
