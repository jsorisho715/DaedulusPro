// Home dashboard for the vendor — varies subtly by role

function Home({ role, onNav }) {
  const M = window.MOCK;
  const myWOs = M.WOS;
  const counts = {
    awaitingBid: myWOs.filter(w => w.status === "awaiting-bid").length,
    scheduled:   myWOs.filter(w => w.status === "scheduled").length,
    onSite:      myWOs.filter(w => w.status === "en-route" || w.status === "on-site").length,
    completed:   myWOs.filter(w => w.status === "completed" || w.status === "invoiced" || w.status === "paid").length,
  };

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div className="muted" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="h-serif" style={{ fontSize: 38, margin: "6px 0 4px", fontWeight: 500 }}>
            Good morning, {role.label.split(" ")[0]}.
          </h1>
          <div className="muted" style={{ fontSize: 14 }}>
            You have <strong style={{ color: "var(--bronze)" }}>{counts.awaitingBid} bid {counts.awaitingBid === 1 ? "request" : "requests"}</strong>, {counts.scheduled} scheduled jobs, and {counts.onSite} crews active in the field.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => onNav("compliance")}><Icon name="upload" size={14}/> Upload doc</button>
          <button className="btn btn-primary" onClick={() => onNav("bids")}><Icon name="bid" size={14}/> Open bid queue</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <KPI icon="bid"        label="Bids requested"  value={counts.awaitingBid} delta="+2 vs last week" tone="bronze" onClick={() => onNav("bids")}/>
        <KPI icon="schedule"   label="Scheduled jobs"  value={counts.scheduled}   delta="+1"            tone="info" onClick={() => onNav("dispatcher")}/>
        <KPI icon="field"      label="Active in field" value={counts.onSite}      delta="2 crews"       tone="success" onClick={() => onNav("dispatcher")}/>
        <KPI icon="money"      label="MTD revenue"     value="$48,210"            delta="+12.4%"        tone="bronze" onClick={() => onNav("invoices")}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        {/* Action required */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="h-serif" style={{ fontSize: 18 }}>Action required</div>
              <div className="muted" style={{ fontSize: 12 }}>Five items waiting on Daedalus Trades.</div>
            </div>
            <button className="btn btn-ghost btn-sm">View all <Icon name="chevRight" size={12}/></button>
          </div>
          <div>
            <ActionRow icon="bid" iconColor="var(--bronze)"
              title="Submit bid: Front gate operator failing" sub="Canyon Ridge · Urgent · responds within 6h"
              cta="Open bid" onCta={() => { onNav("workorders"); window.openWO("WO-3041"); }} ctaTone="primary" />
            <ActionRow icon="alert" iconColor="var(--terracotta)"
              title="J. Carter background check expired" sub="Cannot be assigned to in-unit work · re-run via Checkr"
              cta="Re-run" onCta={() => window.toast({ kind: "info", title: "Background check ordered", msg: "Checkr report typically returns in 24–48 hours." })} ctaTone="secondary" />
            <ActionRow icon="compliance" iconColor="var(--amber)"
              title="AZ ROC license expires in 17 days" sub="Renewal window opens at 30 days · upload renewal once received"
              cta="Manage" onCta={() => onNav("compliance")} ctaTone="secondary" />
            <ActionRow icon="schedule" iconColor="var(--slateblue)"
              title="Confirm tomorrow's Aria smart lock pairing" sub="12 units · J. Carter assigned · PTE not required (vacant turn)"
              cta="Confirm" onCta={() => window.toast({ kind: "success", title: "Schedule confirmed", msg: "Aria on Camelback · 8:00 AM · J. Carter" })} ctaTone="secondary" />
            <ActionRow icon="invoice" iconColor="var(--olive)"
              title="Invoice INV-1078 sent — Red Rock viewed" sub="$2,979 · net 30 · factoring eligible (1.5%)"
              cta="View" onCta={() => onNav("invoices")} ctaTone="ghost" />
          </div>
        </div>

        {/* Tier card */}
        <div className="card" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -10, opacity: 0.06, pointerEvents: "none" }}>
            <Icon name="wing" size={180} color="var(--bronze)" strokeWidth={1}/>
          </div>
          <div style={{ position: "relative" }}>
            <div className="muted" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Vendor tier</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, marginBottom: 14 }}>
              <TierBadge tier={M.VENDOR.tier} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 600, lineHeight: 1 }}>{M.VENDOR.score}</div>
                <div className="muted" style={{ fontSize: 11 }}>out of 100</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(M.VENDOR.scoreBreakdown).map(([k, v]) => (
                <div key={k}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span className="muted" style={{ textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</span>
                    <span style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>{v}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${v}%`, height: "100%", background: "linear-gradient(90deg, var(--bronze) 0%, var(--brass) 100%)", borderRadius: 999 }}/>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: 14 }} onClick={() => onNav("scorecard")}>
              Open scorecard <Icon name="chevRight" size={12}/>
            </button>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card" style={{ marginTop: 18, padding: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="h-serif" style={{ fontSize: 18 }}>Recent work orders</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav("workorders")}>All work orders <Icon name="chevRight" size={12}/></button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 20px", fontWeight: 600 }}>WO</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Title</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Property</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Urgency</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Tech</th>
              <th style={{ textAlign: "right", padding: "10px 20px", fontWeight: 600 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {myWOs.slice(0, 6).map(w => {
              const prop = M.PROPERTIES.find(p => p.id === w.property);
              const tech = M.TEAM.find(t => t.id === w.techId);
              return (
                <tr key={w.id} onClick={() => { onNav("workorders"); window.openWO(w.id); }}
                  style={{ borderTop: "1px solid var(--line)", cursor: "pointer", transition: "background var(--tx-fast)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="mono" style={{ padding: "12px 20px", color: "var(--bronze)", fontWeight: 600 }}>{w.id}</td>
                  <td style={{ padding: "12px 12px", fontWeight: 500 }}>{w.title}</td>
                  <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{prop?.name}</td>
                  <td style={{ padding: "12px 12px" }}><UrgencyPill u={w.urgency}/></td>
                  <td style={{ padding: "12px 12px" }}><StatusPill s={w.status}/></td>
                  <td style={{ padding: "12px 12px" }}>{tech ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Avatar user={tech} size={22}/><span style={{ fontSize: 12 }}>{tech.name.split(" ")[0]}</span></div> : <span className="muted">—</span>}</td>
                  <td className="mono" style={{ padding: "12px 20px", textAlign: "right", fontWeight: 600 }}>{fmt$(w.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, delta, tone, onClick }) {
  const toneColors = {
    bronze: "var(--bronze)", success: "var(--olive)", info: "var(--slateblue)", warn: "var(--amber)", danger: "var(--terracotta)",
  };
  return (
    <button onClick={onClick} className="card" style={{ padding: 18, textAlign: "left", cursor: "pointer", transition: "all var(--tx-fast)", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${toneColors[tone]}1A`, color: toneColors[tone], display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={16}/>
        </div>
      </div>
      <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--olive)", marginTop: 8 }}>{delta}</div>
    </button>
  );
}

function ActionRow({ icon, iconColor, title, sub, cta, onCta, ctaTone = "secondary" }) {
  return (
    <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${iconColor}1A`, color: iconColor, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={16}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div className="muted" style={{ fontSize: 12 }}>{sub}</div>
      </div>
      <button onClick={onCta} className={`btn btn-${ctaTone} btn-sm`}>{cta}</button>
    </div>
  );
}

window.Home = Home;
