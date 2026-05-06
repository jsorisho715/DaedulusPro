// Invoice & Factoring screens

function Invoices({ onNav }) {
  const M = window.MOCK;
  const [open, setOpen] = React.useState(false);
  const [factoring, setFactoring] = React.useState(false);

  const invoices = [
    { ...M.INVOICE },
    { id: "INV-1077", woId: "WO-3025", issued: "2026-04-22", due: "2026-05-22", status: "Paid", pmc: "Solana Residential", property: "Verdant at Tempe Town", grossTotal: 1820, netToVendor: 1675 },
    { id: "INV-1076", woId: "WO-3022", issued: "2026-04-18", due: "2026-05-18", status: "Sent", pmc: "Meridian Living", property: "Aria on Camelback", grossTotal: 920, netToVendor: 846 },
    { id: "INV-1075", woId: "WO-3019", issued: "2026-04-12", due: "2026-05-12", status: "Overdue", pmc: "Palmcrest Properties", property: "Sage at Chandler Heights", grossTotal: 2240, netToVendor: 2061 },
    { id: "INV-1074", woId: "WO-3017", issued: "2026-04-08", due: "2026-05-08", status: "Paid", pmc: "Red Rock Capital Mgmt", property: "Canyon Ridge Apartments", grossTotal: 4380, netToVendor: 4030 },
  ];
  const ar = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + i.netToVendor, 0);
  const overdue = invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.netToVendor, 0);

  return (
    <div className="page" style={{ padding: 28, maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="h-serif" style={{ fontSize: 32, margin: 0, fontWeight: 600 }}>Invoices</h1>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Generated automatically from completed work orders. Lien waivers and retainage tracked per state.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <KPI label="Outstanding A/R" value={fmt$(ar)} sub={`${invoices.filter(i=>i.status!=="Paid").length} open invoices`} accent="var(--bronze)"/>
        <KPI label="Overdue" value={fmt$(overdue)} sub="1 invoice past due" accent="var(--terracotta)"/>
        <KPI label="Average days to pay" value="22" sub="vs. NET-30 terms" accent="var(--olive)"/>
        <KPI label="Eligible for factoring" value={fmt$(2688)} sub="1 invoice · 1.5% fee" accent="var(--slateblue)"/>
      </div>

      <div className="card" style={{ padding: 0, marginBottom: 22 }}>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--surface-2)", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600 }}>Invoice</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>WO</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Client</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Issued</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Due</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: "right", padding: "10px 16px", fontWeight: 600 }}>Net to vendor</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.id} onClick={() => i === 0 && setOpen(true)} style={{ borderTop: "1px solid var(--line)", cursor: i === 0 ? "pointer" : "default" }}
                onMouseEnter={e => i === 0 && (e.currentTarget.style.background = "var(--hover)")}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="mono" style={{ padding: "12px 16px", color: "var(--bronze)", fontWeight: 600 }}>{inv.id}</td>
                <td className="mono" style={{ padding: "12px 12px", color: "var(--text-2)" }}>{inv.woId}</td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ fontWeight: 500 }}>{inv.pmc}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{inv.property}</div>
                </td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{inv.issued}</td>
                <td style={{ padding: "12px 12px", color: "var(--text-2)" }}>{inv.due}</td>
                <td style={{ padding: "12px 12px" }}>
                  <span className={`pill ${inv.status === "Paid" ? "pill-success" : inv.status === "Overdue" ? "pill-danger" : "pill-info"}`}>{inv.status}</span>
                </td>
                <td className="mono" style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>{fmt$(inv.netToVendor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <InvoiceDetail inv={M.INVOICE} onClose={() => setOpen(false)} onFactor={() => { setOpen(false); setFactoring(true); }}/>}
      {factoring && <FactoringFlow inv={M.INVOICE} onClose={() => setFactoring(false)}/>}
    </div>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <div className="card" style={{ padding: 16, borderTop: `2px solid ${accent}` }}>
      <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div className="mono" style={{ fontSize: 26, fontWeight: 600, marginTop: 4, fontFamily: "var(--serif)", color: accent }}>{value}</div>
      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function InvoiceDetail({ inv, onClose, onFactor }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.6)", zIndex: 90, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 30, overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 880, padding: 0, animation: "fadeUp 200ms var(--ease)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="mono" style={{ color: "var(--bronze)", fontWeight: 700, fontSize: 14 }}>{inv.id}</div>
            <span className="pill pill-info">{inv.status}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> PDF</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
        </div>

        <div style={{ padding: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <DaedalusMark size={36}/>
              <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>Daedalus Trades & Technology, LLC</div>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>1820 W Roosevelt St, Phoenix, AZ 85007<br/>EIN 87-2349911 · AZ ROC KB-2 / CR-67</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="h-serif" style={{ fontSize: 32, fontWeight: 600 }}>Invoice</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--bronze)", fontWeight: 600, marginTop: 2 }}>{inv.id}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>Issued {inv.issued} · Due {inv.due}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 22 }}>
            <div>
              <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Bill to</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }}>{inv.bill_to}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Service location</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                <strong>{inv.property}</strong><br/>
                {inv.propertyAddr}<br/>
                <span className="muted">PO Ref: {inv.poRef}</span>
              </div>
            </div>
          </div>

          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 18 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--line-strong)" }}>
                <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-2)" }}>CSI</th>
                <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-2)" }}>Description</th>
                <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-2)" }}>Qty</th>
                <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-2)" }}>Unit</th>
                <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-2)" }}>Price</th>
                <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 700, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-2)" }}>Ext.</th>
              </tr>
            </thead>
            <tbody>
              {inv.lines.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td className="mono" style={{ padding: "10px 6px", color: "var(--text-3)", fontSize: 11 }}>{l.code}</td>
                  <td style={{ padding: "10px 6px" }}>{l.desc}</td>
                  <td className="mono" style={{ padding: "10px 6px", textAlign: "right" }}>{l.qty}</td>
                  <td className="mono" style={{ padding: "10px 6px", color: "var(--text-3)" }}>{l.unit}</td>
                  <td className="mono" style={{ padding: "10px 6px", textAlign: "right" }}>{fmt$(l.price)}</td>
                  <td className="mono" style={{ padding: "10px 6px", textAlign: "right", fontWeight: 600 }}>{fmt$(l.ext)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginLeft: "auto", width: 320, fontSize: 13 }}>
            <Row l="Subtotal" v={fmt$(inv.subtotal)}/>
            <Row l="Tax" v={fmt$(inv.tax)}/>
            <Row l="AZ retainage hold (5%)" v={fmt$(inv.retainage)} muted/>
            <div style={{ borderTop: "2px solid var(--line-strong)", paddingTop: 8, marginTop: 8 }}>
              <Row l="Gross total (PMC pays)" v={fmt$(inv.grossTotal)} bold/>
            </div>
            <Row l="Daedalus platform fee (8%)" v={fmt$(inv.daedalusFee)} muted/>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 6, marginTop: 6, background: "rgba(176,134,84,0.06)", padding: 8, borderRadius: 6 }}>
              <Row l="Net to vendor" v={fmt$(inv.netToVendor)} accent/>
            </div>
          </div>

          {inv.factoringEligible && (
            <div className="card" style={{ marginTop: 22, padding: 16, background: "linear-gradient(135deg, rgba(74,99,120,0.08), rgba(176,134,84,0.04))", borderLeft: "3px solid var(--slateblue)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--slateblue)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="factoring" size={18}/></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Factoring available · paid in 24h</div>
                    <div className="muted" style={{ fontSize: 12 }}>1.5% fee ({fmt$(inv.factoringFee)}) · receive {fmt$(inv.factoringNet)} tomorrow vs. {fmt$(inv.netToVendor)} in ~30 days</div>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={onFactor}>Factor this invoice</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ l, v, bold, accent, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: muted ? "var(--text-2)" : "var(--text)" }}>
      <span style={{ fontWeight: bold ? 700 : 500 }}>{l}</span>
      <span className="mono" style={{ fontWeight: bold || accent ? 700 : 500, color: accent ? "var(--bronze)" : "inherit", fontSize: accent ? 16 : 13 }}>{v}</span>
    </div>
  );
}

function FactoringFlow({ inv, onClose }) {
  const [step, setStep] = React.useState(1);
  const next = () => step < 3 ? setStep(s => s + 1) : (window.toast({ kind: "success", title: "Funded", msg: `${fmt$(inv.factoringNet)} on its way to your account` }), onClose());
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,13,16,0.7)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 30 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 560, padding: 28, animation: "fadeUp 200ms var(--ease)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div className="muted" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Factor invoice · Step {step} of 3</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        {step === 1 && (
          <>
            <div className="h-serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Get paid tomorrow.</div>
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>Daedalus advances {fmt$(inv.factoringNet)} on this invoice. We collect {fmt$(inv.grossTotal)} from {inv.pmc} on net-30 and keep the {fmt$(inv.factoringFee)} fee. No recourse to you.</div>
            <div className="card" style={{ padding: 16, background: "var(--surface-2)", marginBottom: 14 }}>
              <Row l="Net invoice value" v={fmt$(inv.netToVendor)}/>
              <Row l="Factoring fee (1.5%)" v={`-${fmt$(inv.factoringFee)}`} muted/>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 6, marginTop: 6 }}>
                <Row l="You receive" v={fmt$(inv.factoringNet)} accent/>
              </div>
              <div style={{ marginTop: 10, padding: 10, background: "var(--bg)", borderRadius: 6 }}>
                <div className="muted" style={{ fontSize: 11 }}>Funding ETA</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Tomorrow 9:00 AM · ACH to Wells Fargo •••2418</div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="h-serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Confirm assignment.</div>
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>You're assigning this invoice to Daedalus Capital LLC. {inv.pmc} pays Daedalus directly. Standard for 92% of vendors on the platform.</div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14, background: "var(--surface-2)", borderRadius: 8, cursor: "pointer", marginBottom: 10 }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 4 }}/>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>I authorize Daedalus Capital LLC to receive payment for {inv.id} from {inv.pmc} per the assignment agreement.</div>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14, background: "var(--surface-2)", borderRadius: 8, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 4 }}/>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>I confirm work is complete and signed off (Diego Martín · 4/30).</div>
            </label>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--olive)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon name="check" size={32} strokeWidth={2.5}/>
            </div>
            <div className="h-serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Funding initiated.</div>
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 400, margin: "0 auto" }}>{fmt$(inv.factoringNet)} arrives at Wells Fargo •••2418 by 9 AM tomorrow. We'll send a confirmation email + receipt.</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
          {step > 1 && step < 3 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn btn-primary" onClick={next}>{step < 3 ? "Continue" : "Done"}</button>
        </div>
      </div>
    </div>
  );
}

window.Invoices = Invoices;
