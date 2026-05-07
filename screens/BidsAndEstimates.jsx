// Bids & Estimates — vendor-facing pipeline + AI estimates queue
//
// Two concepts in one screen, separated by a segmented control:
//   • Bids tab — vendor bid pipeline (PRD §3.3.6, Claude Build §6.4)
//       Statuses: drafting | submitted | countered | awarded | lost | expired
//   • Estimates tab — vendor-side AI estimates (PRD §3.3.5)
//       Statuses: ai-generating | draft | pending-review | ready-to-send | sent | change-order
//
// Bids row → opens existing WODetail with initialTab="bids".
// Estimates row → opens an AIEstimatePanel drawer (mode="vendor").
//
// Mobile (<720px): tables collapse to stacked cards, segmented control sticks
// to the top, 44pt touch targets per the mobile-ui-design SOP.

function BidsAndEstimates({ onNav }) {
  const M = window.MOCK;
  const [tab, setTab] = React.useState("bids");
  const [openWoId, setOpenWoId] = React.useState(null);
  const [openEst, setOpenEst] = React.useState(null);
  const [bidFilter, setBidFilter] = React.useState("All");
  const [estFilter, setEstFilter] = React.useState("All");
  const [isMobile, setIsMobile] = React.useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Build unified bid pipeline rows from WOs (live) + BIDS_PIPELINE (history).
  const liveBidRows = (M.WOS || [])
    .filter(w => w.bidStatus)
    .map(w => ({
      kind: "wo",
      id: w.id,
      woId: w.id,
      title: w.title,
      property: w.property,
      category: w.category,
      urgency: w.urgency,
      bidStatus: w.bidStatus,
      myBidAmount: w.myBidAmount,
      aiTotal: w.aiEstimate?.total ?? w.total,
      aiConfidence: w.aiEstimate?.confidence ?? null,
      qualityScore: M.BIDS?.find(b => b.woId === w.id && b.isMine)?.qualityScore ?? null,
      submittedAt: w.bidStatus === "drafting" ? null : w.createdAt,
      expiresAt: w.bidExpiresAt,
      counterAmount: null,
      lossReason: null,
      winner: w.bidStatus === "awarded" ? "Daedalus" : null,
    }));
  const histBidRows = (M.BIDS_PIPELINE || []).map(b => ({
    kind: "history",
    id: b.id,
    woId: b.woRef,
    title: b.title,
    property: b.property,
    category: b.category,
    urgency: b.urgency,
    bidStatus: b.bidStatus,
    myBidAmount: b.myBidAmount,
    aiTotal: b.aiEstimateTotal,
    aiConfidence: null,
    qualityScore: b.qualityScore,
    submittedAt: b.submittedAt,
    expiresAt: b.expiresAt,
    counterAmount: b.counterAmount ?? null,
    counterNote: b.counterNote ?? null,
    lossReason: b.lossReason,
    winner: b.winner,
    winningBidAmount: b.winningBidAmount,
  }));
  const allBidRows = [...liveBidRows, ...histBidRows];

  const bidStatusLabel = {
    "drafting": "Drafting",
    "submitted": "Submitted",
    "countered": "Countered",
    "awarded": "Awarded",
    "lost": "Lost",
    "expired": "Expired",
  };
  const bidStatusFilters = ["All", ...Object.values(bidStatusLabel)];
  const filteredBidRows = bidFilter === "All"
    ? allBidRows
    : allBidRows.filter(r => bidStatusLabel[r.bidStatus] === bidFilter);

  // Estimates queue rows (PRD §3.3.5 vendor POV).
  const estStatusLabel = {
    "ai-generating": "AI generating",
    "draft": "Draft",
    "pending-review": "Pending review",
    "ready-to-send": "Ready to send",
    "sent": "Sent to PM",
    "change-order": "Change order",
  };
  const estStatusFilters = ["All", ...Object.values(estStatusLabel)];
  const allEstRows = M.ESTIMATES_QUEUE || [];
  const filteredEstRows = estFilter === "All"
    ? allEstRows
    : allEstRows.filter(r => estStatusLabel[r.estStatus] === estFilter);

  const bidBadgeCount = allBidRows.filter(r => ["drafting", "submitted", "countered"].includes(r.bidStatus)).length;
  const estBadgeCount = allEstRows.filter(r => ["pending-review", "ready-to-send", "draft", "change-order"].includes(r.estStatus)).length;

  const openWo = openWoId ? M.WOS.find(w => w.id === openWoId) : null;

  return (
    <div className="page" style={{ padding: isMobile ? 18 : 28, maxWidth: 1480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: isMobile ? 26 : 32, margin: 0, fontWeight: 600 }}>Bids &amp; Estimates</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            {tab === "bids"
              ? <>{filteredBidRows.length} of {allBidRows.length} matching · <strong style={{ color: "var(--bronze)" }}>{bidBadgeCount} active</strong></>
              : <>{filteredEstRows.length} of {allEstRows.length} matching · <strong style={{ color: "var(--bronze)" }}>{estBadgeCount} need attention</strong></>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="filter" size={14}/> Filters</button>
          <button className="btn btn-primary" onClick={() => {
            window.toast?.({ kind: "info", title: tab === "bids" ? "Starting new bid draft" : "Generating new AI estimate", msg: "Pick a WO to bid on or upload photos to seed the estimator." });
          }}>
            <Icon name="plus" size={14}/> {tab === "bids" ? "New bid draft" : "New estimate"}
          </button>
        </div>
      </div>

      {/* Segmented control — sticky on mobile so it stays reachable */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 16,
        position: isMobile ? "sticky" : "static", top: 0, zIndex: 5,
        background: "var(--bg)", paddingTop: isMobile ? 6 : 0, paddingBottom: 6,
        borderBottom: "1px solid var(--line)",
      }}>
        {[
          { k: "bids", label: "Bids", badge: bidBadgeCount },
          { k: "estimates", label: "Estimates", badge: estBadgeCount },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: "12px 18px", minHeight: 44, background: "transparent", border: 0, cursor: "pointer",
            color: tab === t.k ? "var(--bronze)" : "var(--text-2)",
            fontSize: 14, fontWeight: tab === t.k ? 600 : 500,
            borderBottom: tab === t.k ? "2px solid var(--bronze)" : "2px solid transparent",
            marginBottom: -1, display: "flex", alignItems: "center", gap: 8,
          }}>
            {t.label}
            {t.badge > 0 && (
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 999,
                background: tab === t.k ? "var(--bronze)" : "var(--surface-3)",
                color: tab === t.k ? "white" : "var(--text-2)", fontWeight: 700,
              }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Status filter chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {(tab === "bids" ? bidStatusFilters : estStatusFilters).map(f => {
          const active = (tab === "bids" ? bidFilter : estFilter) === f;
          return (
            <button key={f} onClick={() => tab === "bids" ? setBidFilter(f) : setEstFilter(f)}
              style={{
                padding: "6px 12px", minHeight: 32, borderRadius: 999, cursor: "pointer",
                background: active ? "var(--bronze)" : "var(--surface)",
                color: active ? "white" : "var(--text-2)",
                border: `1px solid ${active ? "var(--bronze)" : "var(--line)"}`,
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
              }}>{f}</button>
          );
        })}
      </div>

      {/* Tab body */}
      {tab === "bids" && (
        isMobile
          ? <BidsCards rows={filteredBidRows} onOpenWO={(id) => setOpenWoId(id)}/>
          : <BidsTable rows={filteredBidRows} onOpenWO={(id) => setOpenWoId(id)}/>
      )}
      {tab === "estimates" && (
        isMobile
          ? <EstimatesCards rows={filteredEstRows} onOpenEst={(e) => setOpenEst(e)}/>
          : <EstimatesTable rows={filteredEstRows} onOpenEst={(e) => setOpenEst(e)}/>
      )}

      {/* WO detail (Bids tab deep link) */}
      {openWo && window.WODetail && (() => {
        const WODetailC = window.WODetail;
        return <WODetailC wo={openWo} onClose={() => setOpenWoId(null)} onNav={onNav} initialTab="bids"/>;
      })()}

      {/* Estimate review drawer (Estimates tab) */}
      {openEst && (
        <EstimateReviewDrawer est={openEst} onClose={() => setOpenEst(null)}/>
      )}
    </div>
  );
}

// ───────────────── Bids tab ─────────────────

function BidsTable({ rows, onOpenWO }) {
  const M = window.MOCK;
  if (!rows.length) {
    return <EmptyState title="No bids match this filter" hint="Adjust the status filter or check back when new invitations arrive."/>;
  }
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <tr>
            <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, width: 100 }}>Ref</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Title</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Property</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>AI estimate</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>My bid</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>Δ vs AI</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Quality</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Window</th>
            <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const prop = M.PROPERTIES.find(p => p.id === r.property);
            const delta = (r.myBidAmount != null && r.aiTotal != null) ? r.myBidAmount - r.aiTotal : null;
            const interactive = r.kind === "wo";
            return (
              <tr key={r.id} onClick={() => interactive && onOpenWO(r.woId)}
                style={{ borderTop: "1px solid var(--line)", cursor: interactive ? "pointer" : "default", transition: "background var(--tx-fast)" }}
                onMouseEnter={e => interactive && (e.currentTarget.style.background = "var(--hover)")}
                onMouseLeave={e => interactive && (e.currentTarget.style.background = "transparent")}>
                <td className="mono" style={{ padding: "12px 16px", color: "var(--bronze)", fontWeight: 600 }}>{r.woId || r.id}</td>
                <td style={{ padding: "12px 12px", fontWeight: 500 }}>{r.title}</td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{prop?.name || "—"}</td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: "var(--text-2)" }}>{r.aiTotal != null ? fmt$(r.aiTotal) : "—"}</td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600 }}>{r.myBidAmount != null ? fmt$(r.myBidAmount) : "—"}</td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right" }}>
                  {delta == null ? <span className="muted">—</span> : <DeltaPill delta={delta} aiTotal={r.aiTotal}/>}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {r.qualityScore != null ? <QualityBar score={r.qualityScore}/> : <span className="muted">—</span>}
                </td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)" }}><BidWindowCell row={r}/></td>
                <td style={{ padding: "12px 16px" }}><BidStatusPill s={r.bidStatus}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BidsCards({ rows, onOpenWO }) {
  const M = window.MOCK;
  if (!rows.length) {
    return <EmptyState title="No bids match this filter" hint="Adjust the status filter or check back when new invitations arrive."/>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map(r => {
        const prop = M.PROPERTIES.find(p => p.id === r.property);
        const delta = (r.myBidAmount != null && r.aiTotal != null) ? r.myBidAmount - r.aiTotal : null;
        const interactive = r.kind === "wo";
        return (
          <div key={r.id} className="card" onClick={() => interactive && onOpenWO(r.woId)}
            style={{ padding: 14, cursor: interactive ? "pointer" : "default", minHeight: 44 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <div style={{ minWidth: 0 }}>
                <div className="mono" style={{ color: "var(--bronze)", fontWeight: 600, fontSize: 12 }}>{r.woId || r.id}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{r.title}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{prop?.name || "—"} · {r.category}</div>
              </div>
              <BidStatusPill s={r.bidStatus}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <Mini label="AI" v={r.aiTotal != null ? fmt$(r.aiTotal) : "—"}/>
              <Mini label="My bid" v={r.myBidAmount != null ? fmt$(r.myBidAmount) : "—"}/>
              <Mini label="Δ" v={delta == null ? "—" : (delta === 0 ? "match" : (delta > 0 ? "+" : "") + fmt$(Math.abs(delta)))}/>
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 8 }}><BidWindowCell row={r}/></div>
          </div>
        );
      })}
    </div>
  );
}

function BidStatusPill({ s }) {
  const map = {
    "drafting":  { bg: "rgba(176,134,84,0.12)",  fg: "var(--bronze)",     label: "Drafting" },
    "submitted": { bg: "rgba(74,99,120,0.14)",   fg: "var(--slateblue)",  label: "Submitted" },
    "countered": { bg: "rgba(208,138,46,0.14)",  fg: "var(--amber)",      label: "Countered" },
    "awarded":   { bg: "rgba(122,139,76,0.16)",  fg: "var(--olive)",      label: "Awarded" },
    "lost":      { bg: "rgba(176,70,58,0.14)",   fg: "var(--terracotta)", label: "Lost" },
    "expired":   { bg: "rgba(120,120,120,0.16)", fg: "var(--text-3)",     label: "Expired" },
  };
  const x = map[s] || map.expired;
  return <span style={{
    display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999,
    background: x.bg, color: x.fg, fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
  }}>{x.label}</span>;
}

function DeltaPill({ delta, aiTotal }) {
  if (delta === 0) return <span className="muted">match</span>;
  const pct = aiTotal ? Math.abs(delta) / aiTotal : 0;
  const color = pct < 0.05 ? "var(--text-2)" : delta < 0 ? "var(--olive)" : "var(--amber)";
  return <span style={{ color, fontWeight: 600 }}>{delta > 0 ? "+" : "−"}{fmt$(Math.abs(delta))}</span>;
}

function QualityBar({ score }) {
  const color = score > 80 ? "var(--olive)" : score > 65 ? "var(--amber)" : "var(--terracotta)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color }}/>
      </div>
      <span className="mono" style={{ fontSize: 11 }}>{score}</span>
    </div>
  );
}

function BidWindowCell({ row }) {
  if (row.bidStatus === "drafting" && row.expiresAt) {
    const ms = new Date(row.expiresAt).getTime() - Date.now();
    const hrs = Math.max(0, Math.round(ms / (1000 * 60 * 60)));
    return <span style={{ color: hrs < 12 ? "var(--terracotta)" : "var(--text-2)" }}>{hrs}h to submit</span>;
  }
  if (row.bidStatus === "submitted" && row.expiresAt) {
    return <span>Decision by {fmtDate(row.expiresAt)}</span>;
  }
  if (row.bidStatus === "countered" && row.counterAmount != null) {
    return <span style={{ color: "var(--amber)" }}>Counter {fmt$(row.counterAmount)}</span>;
  }
  if (row.bidStatus === "awarded") {
    return <span style={{ color: "var(--olive)" }}>Awarded {row.submittedAt ? fmtDate(row.submittedAt) : ""}</span>;
  }
  if (row.bidStatus === "lost") {
    return <span style={{ color: "var(--terracotta)" }}>Lost · {row.winner || ""} {row.winningBidAmount ? `(${fmt$(row.winningBidAmount)})` : ""}</span>;
  }
  if (row.bidStatus === "expired") {
    return <span className="muted">Window closed {row.expiresAt ? fmtDate(row.expiresAt) : ""}</span>;
  }
  return <span className="muted">—</span>;
}

// ───────────────── Estimates tab ─────────────────

function EstimatesTable({ rows, onOpenEst }) {
  const M = window.MOCK;
  if (!rows.length) {
    return <EmptyState title="No estimates match this filter" hint="Upload photos to a WO or trigger AI re-estimate to populate."/>;
  }
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <tr>
            <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, width: 100 }}>Estimate</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Title</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Property</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>AI total</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Confidence</th>
            <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>My net</th>
            <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Last revision</th>
            <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const prop = M.PROPERTIES.find(p => p.id === r.property);
            return (
              <tr key={r.id} onClick={() => onOpenEst(r)}
                style={{ borderTop: "1px solid var(--line)", cursor: "pointer", transition: "background var(--tx-fast)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="mono" style={{ padding: "12px 16px", color: "var(--bronze)", fontWeight: 600 }}>{r.id}</td>
                <td style={{ padding: "12px 12px", fontWeight: 500 }}>
                  {r.title}
                  {r.flaggedForReview && <span className="pill pill-warn" style={{ marginLeft: 8, fontSize: 10 }}>flagged</span>}
                </td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{prop?.name || "—"}</td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600 }}>{r.total != null ? fmt$(r.total) : "—"}</td>
                <td style={{ padding: "12px 12px" }}><ConfidencePill c={r.confidence}/></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", color: "var(--bronze)", fontWeight: 600 }}>{r.netToVendor != null ? fmt$(r.netToVendor) : "—"}</td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)", fontSize: 12 }}>
                  <div>{fmtTime(r.lastRevisionAt)}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{r.revisionAuthor} · v{r.version}</div>
                </td>
                <td style={{ padding: "12px 16px" }}><EstStatusPill s={r.estStatus}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EstimatesCards({ rows, onOpenEst }) {
  const M = window.MOCK;
  if (!rows.length) {
    return <EmptyState title="No estimates match this filter" hint="Upload photos to a WO or trigger AI re-estimate to populate."/>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map(r => {
        const prop = M.PROPERTIES.find(p => p.id === r.property);
        return (
          <div key={r.id} className="card" onClick={() => onOpenEst(r)}
            style={{ padding: 14, cursor: "pointer", minHeight: 44 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <div style={{ minWidth: 0 }}>
                <div className="mono" style={{ color: "var(--bronze)", fontWeight: 600, fontSize: 12 }}>{r.id}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{r.title}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{prop?.name || "—"} · {r.category}</div>
              </div>
              <EstStatusPill s={r.estStatus}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
              <Mini label="AI total" v={r.total != null ? fmt$(r.total) : "—"}/>
              <Mini label="My net" v={r.netToVendor != null ? fmt$(r.netToVendor) : "—"} accent/>
              <Mini label="Confidence" v={r.confidence === "—" ? "—" : (r.confidence?.[0]?.toUpperCase() + r.confidence?.slice(1))}/>
            </div>
            {r.flaggedForReview && (
              <div className="pill pill-warn" style={{ marginTop: 8, fontSize: 10 }}>{r.flagReason || "Flagged for review"}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EstStatusPill({ s }) {
  const map = {
    "ai-generating":  { bg: "rgba(74,99,120,0.14)",   fg: "var(--slateblue)",  label: "AI generating" },
    "draft":          { bg: "rgba(120,120,120,0.16)", fg: "var(--text-2)",     label: "Draft" },
    "pending-review": { bg: "rgba(208,138,46,0.16)",  fg: "var(--amber)",      label: "Pending review" },
    "ready-to-send":  { bg: "rgba(176,134,84,0.14)",  fg: "var(--bronze)",     label: "Ready to send" },
    "sent":           { bg: "rgba(122,139,76,0.16)",  fg: "var(--olive)",      label: "Sent to PM" },
    "change-order":   { bg: "rgba(176,70,58,0.14)",   fg: "var(--terracotta)", label: "Change order" },
  };
  const x = map[s] || map.draft;
  return <span style={{
    display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999,
    background: x.bg, color: x.fg, fontSize: 11, fontWeight: 600,
  }}>{x.label}</span>;
}

function ConfidencePill({ c }) {
  if (!c || c === "—") return <span className="muted">—</span>;
  const map = {
    high:   { bg: "rgba(122,139,76,0.16)", fg: "var(--olive)",      label: "High" },
    medium: { bg: "rgba(208,138,46,0.14)", fg: "var(--amber)",      label: "Medium" },
    low:    { bg: "rgba(176,70,58,0.14)",  fg: "var(--terracotta)", label: "Low" },
  };
  const x = map[c] || map.medium;
  return <span style={{
    display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999,
    background: x.bg, color: x.fg, fontSize: 11, fontWeight: 600,
  }}>{x.label}</span>;
}

// ───────────────── Estimate review drawer (vendor) ─────────────────

function EstimateReviewDrawer({ est, onClose }) {
  const M = window.MOCK;
  const wo = est.woRef ? M.WOS.find(w => w.id === est.woRef) : null;
  const prop = M.PROPERTIES.find(p => p.id === est.property);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;

  const handleAction = (action) => {
    if (action === "send-to-pm") {
      window.toast?.({ kind: "success", title: "Estimate sent to PM", msg: `${est.id} routed to ${prop?.name || "PM"}. They'll see ${fmt$(est.total || 0)}.` });
    } else if (action === "edit") {
      window.toast?.({ kind: "info", title: "Edit lines", msg: "Opening line-item editor (stub for prototype)." });
    } else if (action === "rerun") {
      window.toast?.({ kind: "info", title: "Re-running AI", msg: "Daedalus AI is regenerating with the latest photos." });
    }
    onClose();
  };

  // Build a minimal wo-like object so AIEstimatePanel can render even when the
  // estimate isn't yet linked to a live WO.
  const woLike = wo || {
    id: est.id, title: est.title, total: est.total,
    aiEstimate: {
      confidence: est.confidence,
      labor: Math.round((est.total || 0) * 0.45),
      materials: Math.round((est.total || 0) * 0.40),
      travel: Math.round((est.total || 0) * 0.05),
      markupPct: 12,
      total: est.total,
      netToVendor: est.netToVendor,
      flaggedForReview: est.flaggedForReview,
      version: est.version,
      source: `${est.category} template · ${prop?.name || "property"} · v${est.version}`,
      callouts: [],
    },
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 90, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: isMobile ? "100%" : "min(640px, 100%)",
        background: "var(--bg)", boxShadow: "var(--shadow-lg)",
        display: "flex", flexDirection: "column", animation: "slideIn 250ms var(--ease)", overflow: "hidden",
      }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "var(--surface-2)" }}>
          <div style={{ minWidth: 0 }}>
            <div className="mono" style={{ color: "var(--bronze)", fontWeight: 600, fontSize: 12 }}>{est.id}{est.woRef ? ` · ${est.woRef}` : ""}</div>
            <div className="h-serif" style={{ fontSize: 22, marginTop: 2, lineHeight: 1.2 }}>{est.title}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{prop?.name || "Pre-bid draft"} · {est.category} · v{est.version}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0, minHeight: 44 }}><Icon name="x" size={14}/></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {est.flaggedForReview && (
            <div className="card" style={{ padding: 12, marginBottom: 14, borderLeft: "3px solid var(--terracotta)", background: "rgba(176,70,58,0.06)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="alert" size={14} color="var(--terracotta)" style={{ marginTop: 2, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Flagged for human review</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{est.flagReason || "Confidence below threshold (PRD §3.3.5)."}</div>
                </div>
              </div>
            </div>
          )}

          {est.estStatus === "change-order" && (
            <div className="card" style={{ padding: 12, marginBottom: 14, borderLeft: "3px solid var(--amber)", background: "rgba(208,138,46,0.06)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="alert" size={14} color="var(--amber)" style={{ marginTop: 2, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Change order delta · {fmt$(est.coDelta || 0)}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{est.coReason || "Tech identified additional scope mid-job."}</div>
                </div>
              </div>
            </div>
          )}

          {window.AIEstimatePanel && (() => {
            const AIPanel = window.AIEstimatePanel;
            return <AIPanel wo={woLike} mode="vendor" onAction={handleAction}/>;
          })()}
        </div>
      </div>
    </div>
  );
}

// ───────────────── Shared bits ─────────────────

function Mini({ label, v, accent }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: accent ? "var(--bronze)" : "var(--text)" }}>{v}</div>
    </div>
  );
}

function EmptyState({ title, hint }) {
  return (
    <div className="card" style={{ padding: 40, textAlign: "center" }}>
      <div style={{ display: "inline-flex", width: 48, height: 48, borderRadius: 12, background: "var(--surface-2)", color: "var(--text-3)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <Icon name="bid" size={20}/>
      </div>
      <div className="h-serif" style={{ fontSize: 18, marginBottom: 4 }}>{title}</div>
      <div className="muted" style={{ fontSize: 13 }}>{hint}</div>
    </div>
  );
}

window.BidsAndEstimates = BidsAndEstimates;
