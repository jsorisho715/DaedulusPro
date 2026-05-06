// Work Orders — list, detail with tabs, bid submission, scorecard

function WorkOrders({ onNav }) {
  const M = window.MOCK;
  const [openId, setOpenId] = React.useState(null);
  const [filter, setFilter] = React.useState("All");
  const [showNew, setShowNew] = React.useState(false);

  React.useEffect(() => { window.openWO = (id) => setOpenId(id); }, []);

  const tabs = ["All", "Awaiting Bid", "Scheduled", "In Progress", "Completed"];
  const map = {
    "All": () => true,
    "Awaiting Bid": w => w.status === "awaiting-bid",
    "Scheduled": w => w.status === "scheduled" || w.status === "assigned",
    "In Progress": w => w.status === "en-route" || w.status === "on-site",
    "Completed": w => ["completed", "invoiced", "paid"].includes(w.status),
  };
  const list = M.WOS.filter(map[filter]);

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Work Orders</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{list.length} of {M.WOS.length} matching</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="filter" size={14}/> Filters</button>
          <button className="btn btn-primary" onClick={() => setShowNew(true)}><Icon name="plus" size={14}/> New work order</button>
        </div>
      </div>

      {showNew && <NewWOModal onClose={() => setShowNew(false)} onCreate={() => { setShowNew(false); window.toast({ kind: "success", title: "Work order drafted", msg: "Template applied · scope auto-filled · routed for review." }); }}/>}

      <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "1px solid var(--line)" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "10px 14px", background: "transparent", border: 0, cursor: "pointer",
            color: filter === t ? "var(--bronze)" : "var(--text-2)",
            fontSize: 13, fontWeight: filter === t ? 600 : 500,
            borderBottom: filter === t ? "2px solid var(--bronze)" : "2px solid transparent",
            marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, width: 90 }}>WO</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Title</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Property</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Category</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Urgency</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>SLA</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Tech</th>
              <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {list.map(w => {
              const prop = M.PROPERTIES.find(p => p.id === w.property);
              const tech = M.TEAM.find(t => t.id === w.techId);
              return (
                <tr key={w.id} onClick={() => setOpenId(w.id)}
                  style={{ borderTop: "1px solid var(--line)", cursor: "pointer", transition: "background var(--tx-fast)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="mono" style={{ padding: "12px 16px", color: "var(--bronze)", fontWeight: 600 }}>{w.id}</td>
                  <td style={{ padding: "12px 12px", fontWeight: 500 }}>{w.title}</td>
                  <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{prop?.name}</td>
                  <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{w.category}</td>
                  <td style={{ padding: "12px 12px" }}><UrgencyPill u={w.urgency}/></td>
                  <td style={{ padding: "12px 12px" }}><StatusPill s={w.status}/></td>
                  <td style={{ padding: "12px 12px" }}>{w.sla.remaining > 0 ? <SLARing remaining={w.sla.remaining} total={w.sla.hours}/> : <span className="muted">—</span>}</td>
                  <td style={{ padding: "12px 12px" }}>{tech ? <Avatar user={tech} size={24}/> : <span className="muted">—</span>}</td>
                  <td className="mono" style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>{fmt$(w.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openId && <WODetail wo={M.WOS.find(w => w.id === openId)} onClose={() => setOpenId(null)} onNav={onNav}/>}
    </div>
  );
}

function WODetail({ wo, onClose, onNav }) {
  const M = window.MOCK;
  const [tab, setTab] = React.useState(wo.status === "awaiting-bid" ? "bids" : "overview");
  const [showBidForm, setShowBidForm] = React.useState(false);
  const [showPTE, setShowPTE] = React.useState(false);
  const [showCO, setShowCO] = React.useState(false);
  const [showAI, setShowAI] = React.useState(false);
  const prop = M.PROPERTIES.find(p => p.id === wo.property);
  const tech = M.TEAM.find(t => t.id === wo.techId);
  const pmc = M.PMCS.find(p => p.id === prop?.pmc);
  const bids = M.BIDS.filter(b => b.woId === wo.id);

  const tabs = ["overview", "activity", "photos", ...(bids.length ? ["bids"] : []), "materials", "comms", "documents"];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 90, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0, left: 80,
        background: "var(--bg)", boxShadow: "var(--shadow-lg)",
        display: "flex", animation: "slideIn 250ms var(--ease)", overflow: "hidden",
      }}>
        {/* Left rail */}
        <div style={{ width: 280, borderRight: "1px solid var(--line)", padding: 22, background: "var(--surface-2)", overflowY: "auto", flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 14 }}><Icon name="chevLeft" size={14}/> Back</button>
          <div className="mono" style={{ color: "var(--bronze)", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{wo.id}</div>
          <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginBottom: 12 }}>{wo.title}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            <UrgencyPill u={wo.urgency}/><StatusPill s={wo.status}/>
          </div>

          <Meta label="Property" value={prop?.name} sub={prop?.addr}/>
          <Meta label="Client" value={pmc?.name}/>
          <Meta label="Category" value={wo.category}/>
          <Meta label="Location" value={wo.location}/>
          {wo.unit && <Meta label="Unit" value={wo.unit}/>}
          <Meta label="Created" value={fmtTime(wo.createdAt)} sub={wo.createdBy}/>
          {wo.scheduled && <Meta label="Scheduled" value={fmtTime(wo.scheduled)}/>}

          {wo.sla.remaining > 0 && (
            <div style={{ marginTop: 18, padding: 12, background: "var(--surface)", borderRadius: 10, border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
              <SLARing remaining={wo.sla.remaining} total={wo.sla.hours} size={44}/>
              <div>
                <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>SLA remaining</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{Math.round(wo.sla.remaining)} hours</div>
              </div>
            </div>
          )}

          {tech && (
            <div style={{ marginTop: 14, padding: 12, background: "var(--surface)", borderRadius: 10, border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar user={tech} size={36}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Assigned tech</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{tech.name}</div>
                <div className="muted" style={{ fontSize: 11 }}>{tech.role}</div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: "linear-gradient(135deg, rgba(176,134,84,0.10), rgba(212,168,87,0.04))", border: "1px solid rgba(176,134,84,0.30)" }}>
            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Total estimate</div>
            <div className="mono" style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 600, color: "var(--bronze)" }}>{fmt$(wo.total)}</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ padding: "0 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "14px 14px", background: "transparent", border: 0, cursor: "pointer",
                  color: tab === t ? "var(--bronze)" : "var(--text-2)",
                  fontSize: 13, fontWeight: tab === t ? 600 : 500,
                  borderBottom: tab === t ? "2px solid var(--bronze)" : "2px solid transparent", textTransform: "capitalize",
                }}>{t}{t === "bids" && <span style={{ marginLeft: 6, fontSize: 10, padding: "1px 6px", borderRadius: 999, background: "var(--bronze)", color: "white" }}>{bids.length}</span>}</button>
              ))}
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ alignSelf: "center" }}><Icon name="x" size={14}/></button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {tab === "overview" && <WOOverview wo={wo}/>}
            {tab === "activity" && <WOActivity wo={wo}/>}
            {tab === "photos" && <WOPhotos wo={wo}/>}
            {tab === "bids" && <WOBids wo={wo} bids={bids} onSubmitBid={() => setShowBidForm(true)}/>}
            {tab === "materials" && <div className="muted">No materials logged yet.</div>}
            {tab === "comms" && <WOComms/>}
            {tab === "documents" && <WODocs wo={wo}/>}
          </div>
        </div>

        {/* Right action rail */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: "1px solid var(--line)", padding: 22, background: "var(--surface-2)", overflowY: "auto" }}>
          {wo.status === "awaiting-bid" && (
            <>
              <div className="card" style={{ padding: 14, marginBottom: 14, borderLeft: "3px solid var(--bronze)" }}>
                <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Bid window</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{Math.round(wo.sla.remaining)}h remaining</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>Top vendor (you) gets first refusal. Cascades to Ironcrest if no bid in 6h.</div>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 8 }} onClick={() => setShowBidForm(true)}>
                <Icon name="bid" size={14}/> {wo.mine?.draft ? "Resume bid draft" : "Submit bid"}
              </button>
              <button className="btn btn-ghost" style={{ width: "100%" }}>Decline this bid</button>
            </>
          )}
          {wo.status === "scheduled" && (
            <>
              <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 8 }} onClick={() => window.toast({ kind: "success", title: "Confirmed with PM", msg: "Marcus Greene was notified." })}>
                Confirm with PM
              </button>
              <button className="btn btn-secondary" style={{ width: "100%", marginBottom: 8 }}>Reassign tech</button>
              <button className="btn btn-secondary" style={{ width: "100%" }}>Reschedule</button>
            </>
          )}
          {(wo.status === "en-route" || wo.status === "on-site") && (
            <>
              <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 8 }} onClick={() => onNav("field")}>
                <Icon name="field" size={14}/> Open in field app
              </button>
              <button className="btn btn-secondary" style={{ width: "100%" }}>Message tech</button>
            </>
          )}
          {wo.status === "completed" && (
            <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => onNav("invoices")}>
              <Icon name="invoice" size={14}/> Generate invoice
            </button>
          )}
          {wo.status === "invoiced" && (
            <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => onNav("invoices")}>
              <Icon name="invoice" size={14}/> View invoice
            </button>
          )}

          <div className="hr" style={{ margin: "18px 0" }}/>

          <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setShowPTE(true)}><Icon name="shield" size={12}/> Send Permission-to-Enter</button>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setShowAI(true)}><Icon name="sparkles" size={12}/> Why was I matched?</button>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setShowCO(true)}><Icon name="alert" size={12}/> Request change order</button>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}><Icon name="upload" size={12}/> Upload photo</button>
            <button className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start", color: "var(--terracotta)" }}><Icon name="flag" size={12}/> Open dispute</button>
          </div>
        </div>
      </div>

      {showBidForm && <BidForm wo={wo} onClose={() => setShowBidForm(false)} />}
      {showPTE && <PTEModal wo={wo} onClose={() => setShowPTE(false)} />}
      {showCO && <ChangeOrderModal wo={wo} onClose={() => setShowCO(false)} />}
      {showAI && <AIMatchModal onClose={() => setShowAI(false)} />}
    </div>
  );
}

function NewWOModal({ onClose, onCreate }) {
  const templates = [
    { k: "access", t: "Access Control", icon: "shield", desc: "Reader replace, controller swap, credential reissue", trade: "Low-voltage", est: "$420 – $1,800", sla: "12h", cnt: 8 },
    { k: "gate",   t: "Gate Operator",  icon: "field",   desc: "Vehicle gate stuck, photo eye, motor service", trade: "Gate ops", est: "$640 – $4,200", sla: "8h",  cnt: 5 },
    { k: "hvac",   t: "HVAC Service",   icon: "schedule",desc: "RTU repair, mini-split swap, thermostat", trade: "HVAC", est: "$280 – $9,500", sla: "24h", cnt: 12 },
    { k: "plumb",  t: "Plumbing",       icon: "alert",   desc: "Leak, water heater, drain clear", trade: "Plumbing", est: "$180 – $2,400", sla: "6h",  cnt: 9 },
    { k: "elec",   t: "Electrical",     icon: "sparkles",desc: "Panel, outlet, lighting, common-area", trade: "Electrical", est: "$220 – $3,800", sla: "12h", cnt: 7 },
    { k: "blank",  t: "Blank work order",icon: "edit",   desc: "Build from scratch — no template", trade: "—", est: "—", sla: "—", cnt: 0 },
  ];
  const [picked, setPicked] = React.useState(null);
  const [step, setStep] = React.useState(1);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 30 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 880, maxHeight: "90vh", padding: 0, animation: "fadeUp 200ms var(--ease)", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>New work order · Step {step} of 2</div>
            <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>{step === 1 ? "Pick a job template" : `Configure · ${picked?.t}`}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        {step === 1 && (
          <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>Templates auto-fill scope, materials, SLA, and trade routing. Daedalus has run <strong style={{ color: "var(--text)" }}>1,840 jobs</strong> across these — pricing bands reflect actual outcomes.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {templates.map(tp => (
                <button key={tp.k} onClick={() => setPicked(tp)} className="card" style={{
                  padding: 14, textAlign: "left", cursor: "pointer",
                  border: picked?.k === tp.k ? "2px solid var(--bronze)" : "1px solid var(--line)",
                  background: picked?.k === tp.k ? "rgba(176,134,84,0.06)" : "var(--surface)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={tp.icon} size={16}/></div>
                    <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{tp.t}</div>
                    {tp.cnt > 0 && <span className="pill pill-neutral" style={{ fontSize: 10 }}>{tp.cnt} runs</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 12, lineHeight: 1.4, marginBottom: 8 }}>{tp.desc}</div>
                  <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--text-3)" }}>
                    <span><strong style={{ color: "var(--text-2)" }}>{tp.trade}</strong></span>
                    <span>{tp.est}</span>
                    <span>SLA {tp.sla}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && picked && (
          <div style={{ padding: 22, overflowY: "auto", flex: 1, background: "var(--surface)" }}>
            <div className="card" style={{ padding: 12, marginBottom: 16, background: "var(--surface-2)", borderLeft: "3px solid var(--bronze)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="sparkles" size={14} color="var(--bronze)"/>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Auto-filled from template · {picked.t}</div>
              </div>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>Scope, materials, SLA, and trade routing pre-populated. Edit anything before sending.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <FormField label="Property" value="Solano Lofts" />
              <FormField label="Urgency" value="Routine" />
              <FormField label="Reported by" value="Maria Rodriguez · Unit 308" />
              <FormField label="Trade" value={picked.trade} />
              <FormField label="SLA" value={picked.sla} />
              <FormField label="Pricing band" value={picked.est} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Scope of work</label>
              <textarea className="textarea" defaultValue={`${picked.t}: investigate reported issue at site; perform standard diagnostic; replace failed component if within scope. Confirm operation, capture before/after photos with EXIF, obtain customer sign-off.`} style={{ marginTop: 6, minHeight: 90, width: "100%" }}/>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Materials (suggested)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                {["HID Signo 20 reader — Mullion · 1 ea", "Wiegand 22/6 cable · 10 ft", "Tap connectors · 4 ea", "Multimeter (truck stock)"].map(m => (
                  <div key={m} className="card" style={{ padding: "8px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)" }}>
                    <Icon name="check" size={12} color="var(--olive)"/> {m}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormField label="Schedule window" value="Tue 5/6 · 8–10 AM" />
              <FormField label="Routing" value="Daedalus T&T (Preferred)" />
            </div>
          </div>
        )}

        <div style={{ padding: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 8, background: "var(--surface-2)" }}>
          {step === 2 && <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!picked} onClick={() => step === 1 ? setStep(2) : onCreate()}>
            {step === 1 ? "Continue" : "Create draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div className="card" style={{ padding: "8px 10px", fontSize: 13, background: "var(--surface)" }}>{value}</div>
    </div>
  );
}

function Meta({ label, value, sub }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
      {sub && <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function WOOverview({ wo }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Description</div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)", marginTop: 0 }}>{wo.desc}</p>

      <div className="card" style={{ padding: 18, marginTop: 18, background: "linear-gradient(135deg, rgba(176,134,84,0.06), rgba(212,168,87,0.02))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bronze)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="sparkles" size={14}/>
          </div>
          <div className="h-serif" style={{ fontSize: 16 }}>AI Estimate</div>
          <span className="pill pill-bronze">High confidence</span>
        </div>
        <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>Composed from photos, gate operator template, RSMeans labor for 85254, and your team's prior 14 gate jobs.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Stat label="Labor" v={fmt$(1440)}/>
          <Stat label="Materials" v={fmt$(1255)}/>
          <Stat label="Travel + after-hours" v={fmt$(265)}/>
          <Stat label="Suggested markup" v="12%"/>
        </div>
      </div>

      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 22, marginBottom: 8 }}>Photos from PM</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {Array.from({ length: wo.photos || 4 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: "4/3", borderRadius: 8, background: `linear-gradient(135deg, hsl(${30 + i * 8}, 22%, 28%), hsl(${22 + i * 6}, 30%, 18%))`, position: "relative", border: "1px solid var(--line)" }}>
            <span className="pill" style={{ position: "absolute", top: 6, left: 6, fontSize: 9, height: 18, background: "rgba(0,0,0,0.6)", color: "white" }}><Icon name="check" size={10}/> EXIF</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, v }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
    </div>
  );
}

function WOActivity({ wo }) {
  const events = [
    { t: "WO created", who: wo.createdBy, when: wo.createdAt, icon: "plus" },
    { t: "Photos uploaded (4)", who: wo.createdBy, when: wo.createdAt, icon: "camera" },
    { t: "AI estimate generated · $4,280 · high confidence", who: "Daedalus AI", when: wo.createdAt, icon: "sparkles" },
    { t: "Bid invitations sent · 3 vendors", who: "Daedalus Ops", when: wo.createdAt, icon: "mail" },
    { t: "Apex Mechanical submitted bid · $3,260 (2 flags)", who: "Apex Mechanical", when: "2026-05-02T14:00:00", icon: "bid" },
    { t: "Ironcrest submitted bid · $5,720 (2 flags)", who: "Ironcrest Gate Co.", when: "2026-05-03T10:15:00", icon: "bid" },
    { t: "Daedalus draft bid started · $4,280", who: "Elena Sato (Estimator)", when: "2026-05-03T18:42:00", icon: "edit" },
  ];
  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 1, background: "var(--line)" }}/>
      {events.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18, position: "relative" }}>
          <div style={{ position: "absolute", left: -24, top: 0, width: 22, height: 22, borderRadius: 999, background: "var(--surface)", border: "1px solid var(--line-strong)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bronze)" }}>
            <Icon name={e.icon} size={11}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{e.t}</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{e.who} · {fmtTime(e.when)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WOPhotos({ wo }) {
  const phases = wo.photos > 0 ? [
    { name: "Intake", n: Math.min(4, wo.photos) },
    { name: "Before", n: Math.min(2, Math.max(0, wo.photos - 4)) },
    { name: "During", n: Math.min(3, Math.max(0, wo.photos - 6)) },
    { name: "After", n: Math.max(0, wo.photos - 9) },
  ].filter(p => p.n > 0) : [];
  if (!phases.length) return <div className="muted">No photos yet.</div>;
  return phases.map(ph => (
    <div key={ph.name} style={{ marginBottom: 22 }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{ph.name} · {ph.n} photos</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {Array.from({ length: ph.n }).map((_, i) => (
          <div key={i} style={{ aspectRatio: "4/3", borderRadius: 8, background: `linear-gradient(135deg, hsl(${30 + i * 14}, 22%, 28%), hsl(${22 + i * 6}, 30%, 18%))`, position: "relative", border: "1px solid var(--line)" }}>
            <span className="pill" style={{ position: "absolute", top: 6, left: 6, fontSize: 9, height: 18, background: "rgba(0,0,0,0.6)", color: "white" }}><Icon name="check" size={10}/> EXIF</span>
          </div>
        ))}
      </div>
    </div>
  ));
}

function WOBids({ wo, bids, onSubmitBid }) {
  const sorted = [...bids].sort((a, b) => a.total - b.total);
  return (
    <div>
      <div className="card" style={{ padding: 16, marginBottom: 18, background: "rgba(74,99,120,0.06)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="info" color="var(--slateblue)" size={18}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Competitive bid · 3 vendors invited</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Marcus Greene (PM) will see this leveling table when bids close. AI flags concerns but never auto-rejects.</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Vendor</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Tier</th>
              <th style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>Total</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Quality</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Earliest start</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Flags</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(b => (
              <tr key={b.id} style={{ borderTop: "1px solid var(--line)", background: b.isMine ? "rgba(176,134,84,0.06)" : "transparent" }}>
                <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                  {b.vendor} {b.isMine && <span className="pill pill-bronze" style={{ marginLeft: 6 }}>You</span>}
                </td>
                <td style={{ padding: "12px 12px" }}><TierBadge tier={b.tier}/></td>
                <td className="mono" style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600 }}>{fmt$(b.total)}</td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
                      <div style={{ width: `${b.qualityScore}%`, height: "100%", background: b.qualityScore > 80 ? "var(--olive)" : b.qualityScore > 65 ? "var(--amber)" : "var(--terracotta)" }}/>
                    </div>
                    <span className="mono" style={{ fontSize: 11 }}>{b.qualityScore}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{fmtDate(b.schedule.startEarliest)}</td>
                <td style={{ padding: "12px 12px" }}>
                  {b.flags.length === 0 ? <span className="pill pill-success">clean</span> : (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {b.flags.map(f => <span key={f} className="pill pill-warn" style={{ fontSize: 10 }}>{f.replace(/_/g, " ").replace(/missing scope/i, "missing:")}</span>)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {wo.mine?.draft && (
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={onSubmitBid}><Icon name="bid" size={14}/> Resume your bid draft</button>
          <button className="btn btn-secondary">View full leveling</button>
        </div>
      )}
    </div>
  );
}

function WOComms() {
  const items = [
    { from: "Marcus Greene · PM", text: "Resident reports the gate hits the safety loop most often after 6pm. Anything you find on photo eye 2?", when: "Today 9:14 AM", mine: false },
    { from: "Daedalus", text: "Will inspect both photo eyes on arrival. Reverse-on-close usually points to misalignment + dust on the lens. Will scope any rack/pinion wear in the bid.", when: "Today 9:42 AM", mine: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((m, i) => (
        <div key={i} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
          <div style={{
            maxWidth: "70%", padding: 12,
            background: m.mine ? "var(--bronze)" : "var(--surface)",
            color: m.mine ? "white" : "var(--text)",
            border: m.mine ? 0 : "1px solid var(--line)",
            borderRadius: 12, borderTopRightRadius: m.mine ? 4 : 12, borderTopLeftRadius: m.mine ? 12 : 4,
          }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{m.from} · {m.when}</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
          </div>
        </div>
      ))}
      <textarea className="textarea" placeholder="Reply to Marcus…" style={{ marginTop: 8 }}/>
    </div>
  );
}

function WODocs({ wo }) {
  const docs = wo.status === "invoiced" || wo.status === "completed"
    ? [
        { name: "Invoice INV-1078.pdf", icon: "invoice", color: "var(--olive)" },
        { name: "Lien waiver — AZ conditional final.pdf", icon: "edit", color: "var(--bronze)" },
        { name: "Sign-off photo set (11).zip", icon: "camera", color: "var(--slateblue)" },
      ]
    : [{ name: "PM intake notes.txt", icon: "file", color: "var(--text-3)" }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {docs.map((d, i) => (
        <div key={i} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: `${d.color}1A`, color: d.color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={d.icon} size={14}/></div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{d.name}</div>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/></button>
        </div>
      ))}
    </div>
  );
}

// Bid form modal
function BidForm({ wo, onClose }) {
  const M = window.MOCK;
  const myBid = M.BIDS.find(b => b.woId === wo.id && b.isMine);
  const [lines, setLines] = React.useState(myBid.lines);
  const [step, setStep] = React.useState("compose"); // compose | review | submitted
  const [aiReview, setAiReview] = React.useState(null);

  const total = lines.reduce((s, l) => s + l.total, 0);

  const runReview = () => {
    setStep("review");
    setAiReview(null);
    setTimeout(() => {
      setAiReview({
        passed: true,
        score: 92,
        notes: [
          { kind: "good", text: "All scope items addressed (loop detector, photo eyes, rack/pinion, PM service)." },
          { kind: "good", text: "Labor estimate within 4% of market median for AZ gate jobs." },
          { kind: "good", text: "Materials sourced from your standard HD Supply & Ferguson catalogs." },
          { kind: "info", text: "Markup 12% — below your 90-day average of 14.2%. Confirm intentional." },
        ],
      });
    }, 900);
  };

  const submit = () => {
    setStep("submitted");
    setTimeout(() => {
      window.toast({ kind: "success", title: "Bid submitted", msg: `${fmt$(total)} · Daedalus is the lowest of 3 bids on ${wo.id}.` });
      onClose();
    }, 1100);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.7)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 30, animation: "fadeUp 200ms var(--ease)" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 920, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Submit bid · {wo.id}</div>
            <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>{wo.title}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ width: 32, padding: 0 }}><Icon name="x" size={14}/></button>
        </div>

        {step === "submitted" && (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ display: "inline-block", animation: "fadeUp 400ms var(--ease)" }}>
              <Icon name="check" size={64} color="var(--olive)" strokeWidth={2}/>
              <div className="h-serif" style={{ fontSize: 22, marginTop: 12 }}>Bid submitted</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Marcus Greene (PM) will be notified when the bid window closes in 6h.</div>
            </div>
          </div>
        )}

        {step !== "submitted" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
            <div className="card" style={{ padding: 14, marginBottom: 18, background: "var(--surface-2)" }}>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                <strong>Scope:</strong> {wo.desc}
              </div>
            </div>

            <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Line items</div>
            <div className="card" style={{ padding: 0, marginBottom: 18 }}>
              <table style={{ width: "100%", fontSize: 13 }}>
                <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Scope</th>
                    <th style={{ textAlign: "right", padding: "8px 8px", fontWeight: 600, width: 60 }}>Qty</th>
                    <th style={{ textAlign: "left", padding: "8px 8px", fontWeight: 600, width: 50 }}>Unit</th>
                    <th style={{ textAlign: "right", padding: "8px 8px", fontWeight: 600, width: 100 }}>Unit cost</th>
                    <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, width: 100 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ padding: "9px 12px" }}>{l.scope}</td>
                      <td className="mono" style={{ padding: "9px 8px", textAlign: "right" }}>{l.qty}</td>
                      <td className="mono" style={{ padding: "9px 8px", color: "var(--text-3)" }}>{l.unit}</td>
                      <td className="mono" style={{ padding: "9px 8px", textAlign: "right" }}>{fmt$(l.unitCost)}</td>
                      <td className="mono" style={{ padding: "9px 12px", textAlign: "right", fontWeight: 600 }}>{fmt$(l.total)}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid var(--line-strong)", background: "var(--surface-2)" }}>
                    <td colSpan={4} style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Total</td>
                    <td className="mono" style={{ padding: "12px", textAlign: "right", fontWeight: 700, fontSize: 16, color: "var(--bronze)" }}>{fmt$(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>Earliest start</label>
                <input className="input" defaultValue="2026-05-06" style={{ marginTop: 4 }}/>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>Estimated duration</label>
                <input className="input" defaultValue="1 day" style={{ marginTop: 4 }}/>
              </div>
            </div>

            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>Notes / assumptions / exclusions</label>
            <textarea className="textarea" defaultValue={myBid.notes} style={{ marginTop: 4 }}/>

            {aiReview && (
              <div className="card" style={{ padding: 18, marginTop: 18, background: "linear-gradient(135deg, rgba(176,134,84,0.06), rgba(122,139,76,0.04))", borderLeft: "3px solid var(--olive)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--olive)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="sparkles" size={14}/>
                  </div>
                  <div className="h-serif" style={{ fontSize: 16 }}>AI bid quality review</div>
                  <span className="pill pill-success">Passed · Score {aiReview.score}</span>
                </div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Advisory only — Marcus Greene awards. Daedalus AI never auto-rejects bids.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {aiReview.notes.map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5 }}>
                      <Icon name={n.kind === "good" ? "check" : "info"} size={14} color={n.kind === "good" ? "var(--olive)" : "var(--slateblue)"} style={{ marginTop: 2, flexShrink: 0 }}/>
                      <div>{n.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === "review" && !aiReview && (
              <div className="card" style={{ padding: 22, marginTop: 18, textAlign: "center" }}>
                <div style={{ display: "inline-block", animation: "spin 1.4s linear infinite" }}>
                  <Icon name="sparkles" size={28} color="var(--bronze)"/>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Reviewing your bid against market data and your job history…</div>
              </div>
            )}
          </div>
        )}

        {step !== "submitted" && (
          <div style={{ padding: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)" }}>
            <div className="muted" style={{ fontSize: 12 }}>
              Total bid: <span className="mono" style={{ color: "var(--bronze)", fontWeight: 700, fontSize: 15 }}>{fmt$(total)}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost">Save draft</button>
              {step === "compose" && <button className="btn btn-secondary" onClick={runReview}><Icon name="sparkles" size={14}/> Run AI review</button>}
              <button className="btn btn-primary" onClick={submit} disabled={step === "compose" || !aiReview}>Submit bid</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.WorkOrders = WorkOrders;
