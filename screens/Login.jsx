// Login — bronze wing scene + smooth multi-provider sign-in
// Supports: Google SSO, Microsoft SSO, work email + password + MFA, "Apply as contractor"

function Login({ onSignIn, onAuth, mythicLevel, onApplyContractor }) {
  const finish = onAuth || onSignIn || (() => {});
  const canvasRef = React.useRef(null);
  // step: choose | email | mfa | google | microsoft | loading
  const [step, setStep] = React.useState("choose");
  const [email, setEmail] = React.useState("j.marquez@daedalus.work");
  const [pwd, setPwd] = React.useState("••••••••••••");
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [skipAnim, setSkipAnim] = React.useState(false);
  const codeRefs = React.useRef([]);

  // Three.js wing scene
  React.useEffect(() => {
    if (skipAnim || !canvasRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const canvas = canvasRef.current;
    const w = canvas.clientWidth,h = canvas.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090C, 0.05);
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0.2, 6);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);

    const wingGroup = new THREE.Group();
    const featherCount = 14;
    const featherMat = new THREE.MeshStandardMaterial({ color: 0xB08654, metalness: 0.85, roughness: 0.32, emissive: 0x2A1810, emissiveIntensity: 0.4 });
    const featherMatTip = new THREE.MeshStandardMaterial({ color: 0xD4A857, metalness: 0.95, roughness: 0.25, emissive: 0x3A2A14, emissiveIntensity: 0.5 });
    for (let i = 0; i < featherCount; i++) {
      const t = i / (featherCount - 1);
      const len = 1.6 + t * 1.6;
      const wid = 0.16 + t * 0.10;
      const geo = new THREE.PlaneGeometry(wid, len, 1, 4);
      const pos = geo.attributes.position;
      for (let v = 0; v < pos.count; v++) {
        const y = pos.getY(v);
        const ny = Math.max(0, Math.min(1, (y + len / 2) / len));
        const taper = 1 - Math.pow(ny, 2.4) * 0.85;
        pos.setX(v, pos.getX(v) * taper);
      }
      const mat = i > featherCount * 0.7 ? featherMatTip : featherMat;
      const mesh = new THREE.Mesh(geo, mat);
      const angle = -Math.PI / 2.2 + t * Math.PI * 0.55;
      mesh.position.set(Math.cos(angle) * 0.6, len / 2 - 0.4 + Math.sin(angle) * 0.3, -t * 0.05);
      mesh.rotation.z = angle + Math.PI / 2;
      mesh.userData.baseRotZ = mesh.rotation.z;
      mesh.userData.t = t;
      wingGroup.add(mesh);
    }
    const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.10, 1.4, 12),
    new THREE.MeshStandardMaterial({ color: 0x4A3A28, metalness: 0.6, roughness: 0.5 }));
    quill.rotation.z = Math.PI / 2.2;
    quill.position.set(-0.05, -0.1, 0.05);
    wingGroup.add(quill);
    wingGroup.position.x = -0.4;
    scene.add(wingGroup);

    const key = new THREE.DirectionalLight(0xFFD9A0, 1.4);key.position.set(3, 2, 4);scene.add(key);
    const rim = new THREE.DirectionalLight(0xB08654, 1.0);rim.position.set(-4, 0.5, -2);scene.add(rim);
    scene.add(new THREE.AmbientLight(0x2A1A10, 0.6));
    const glow = new THREE.PointLight(0xD4A857, 0.8, 8);glow.position.set(2, 1, 2);scene.add(glow);

    let mouseX = 0,mouseY = 0;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    canvas.addEventListener("mousemove", onMove);
    let frame,t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      wingGroup.rotation.y = -0.25 + Math.sin(t * 0.18) * 0.55 + mouseX * 0.18;
      wingGroup.rotation.x = Math.sin(t * 0.12) * 0.08 + mouseY * -0.12;
      wingGroup.children.forEach((m) => {
        if (m.userData.baseRotZ !== undefined) m.rotation.z = m.userData.baseRotZ + Math.sin(t * 0.6 + m.userData.t * 6) * 0.025;
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();
    const onResize = () => {
      const w2 = canvas.clientWidth,h2 = canvas.clientHeight;
      camera.aspect = w2 / h2;camera.updateProjectionMatrix();
      renderer.setSize(w2, h2, false);
    };
    window.addEventListener("resize", onResize);
    return () => {cancelAnimationFrame(frame);canvas.removeEventListener("mousemove", onMove);window.removeEventListener("resize", onResize);renderer.dispose();};
  }, [skipAnim]);

  // OAuth simulation flow — original UI, not provider-branded chrome
  const startOAuth = (provider) => {
    setStep(provider);
    setTimeout(() => {setStep("loading");setTimeout(() => finish(), 700);}, 2200);
  };

  const submitEmail = (e) => {
    e?.preventDefault?.();
    setStep("loading");
    setTimeout(() => setStep("mfa"), 600);
  };
  const onCodeKey = (i, e) => {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...code];next[i] = v;setCode(next);
    if (v && i < 5) codeRefs.current[i + 1]?.focus();
    if (next.every((x) => x.length === 1)) {
      setStep("loading");
      setTimeout(() => finish(), 700);
    }
  };

  const fadeKey = step;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#07090C", color: "#F4F1EA", overflow: "hidden" }}>
      {/* Left: 3D scene */}
      <div style={{ flex: "1 1 60%", position: "relative", minWidth: 0, background: "radial-gradient(ellipse at 30% 50%, #14110D 0%, #07090C 70%)" }}>
        {!skipAnim ?
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", opacity: "1" }} /> :
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="wing" size={120} color="#B08654" strokeWidth={1} />
            </div>}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(7,9,12,0.85) 100%)" }} />
        <div style={{ position: "absolute", top: 32, left: 40, display: "flex", alignItems: "center", gap: 12 }}>
          <DaedalusMark size={28} />
          <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 22, letterSpacing: "0.02em" }}>
            Daedalus<span style={{ color: "var(--bronze)" }}> Pro</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 60, left: 40, right: 40, maxWidth: 480 }}>
          <div className="meander" style={{ width: 96, "--mythic-opacity": 0.6, marginBottom: 14 }} />
          <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            Built by craftsmen.<br /><span style={{ color: "var(--bronze-soft)" }}>Run by code.</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(244,241,234,0.5)", marginTop: 12, lineHeight: 1.6 }}>
            The vendor portal for the Daedalus Pro multifamily marketplace. Compliance, dispatch, AI estimates, and pay — in one workspace.
          </div>
        </div>
        <button onClick={() => setSkipAnim((s) => !s)}
        style={{ position: "absolute", bottom: 20, right: 24, background: "transparent", border: 0, color: "rgba(244,241,234,0.45)", fontSize: 11, cursor: "pointer" }}>
          {skipAnim ? "Resume animation" : "Skip animation"}
        </button>
      </div>

      {/* Right: form pane */}
      <div style={{ width: 480, flexShrink: 0, background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", borderLeft: "1px solid var(--line)", position: "relative", overflow: "hidden" }}>
        <div key={fadeKey} style={{ maxWidth: 380, width: "100%", animation: "fadeUp 280ms var(--ease)" }}>
          {step === "choose" &&
          <>
              <div className="h-serif" style={{ fontSize: 28, marginBottom: 6, fontFamily: "var(--serif)", fontWeight: 600 }}>Welcome back</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 28 }}>Sign in to your Daedalus Pro workspace.</div>

              <SSOButton kind="google" onClick={() => startOAuth("google")} />
              <div style={{ height: 10 }} />
              <SSOButton kind="microsoft" onClick={() => startOAuth("microsoft")} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0", color: "var(--text-3)", fontSize: 11 }}>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />OR<div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>

              <button className="btn btn-secondary btn-lg" style={{ width: "100%" }} onClick={() => setStep("email")}>
                <Icon name="mail" size={14} /> Continue with work email
              </button>

              <div style={{ marginTop: 32, padding: 14, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(176,134,84,0.16)", color: "var(--bronze)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="sparkles" size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>New to Daedalus?</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>Apply to join the contractor network.</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => onApplyContractor?.()} style={{ color: "var(--bronze)", fontWeight: 600 }}>
                    Apply <Icon name="arrow" size={11} />
                  </button>
                </div>
              </div>
            </>
          }

          {step === "email" &&
          <form onSubmit={submitEmail}>
              <button type="button" onClick={() => setStep("choose")} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 14, color: "var(--text-3)" }}>
                <Icon name="chevLeft" size={12} /> Back
              </button>
              <div className="h-serif" style={{ fontSize: 26, marginBottom: 6 }}>Sign in with email</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Use your work email and password.</div>

              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)" }}>Work email</label>
              <input className="input" style={{ marginTop: 6, marginBottom: 14 }} value={email} onChange={(e) => setEmail(e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)" }}>Password</label>
                <a href="#" style={{ fontSize: 11 }}>Forgot password?</a>
              </div>
              <input type="password" className="input" style={{ marginTop: 6, marginBottom: 14 }} value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-2)", marginBottom: 18 }}>
                <input type="checkbox" defaultChecked /> Remember this device for 30 days
              </label>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>Continue</button>
            </form>
          }

          {step === "mfa" &&
          <div>
              <div className="h-serif" style={{ fontSize: 26, marginBottom: 6 }}>Two-factor</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Enter the 6-digit code from your authenticator app.</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                {code.map((c, i) =>
              <input key={i} ref={(el) => codeRefs.current[i] = el}
              value={c} onChange={(e) => onCodeKey(i, e)}
              inputMode="numeric" maxLength={1} autoFocus={i === 0}
              style={{ width: 48, height: 56, textAlign: "center", fontSize: 22, fontFamily: "var(--mono)", fontWeight: 600,
                border: "1px solid var(--line-strong)", borderRadius: 8, background: "var(--surface)", color: "var(--text)" }} />
              )}
              </div>
              <a href="#" style={{ fontSize: 12 }}>Use a recovery code instead</a>
              <div style={{ marginTop: 28 }}>
                <button onClick={() => setStep("email")} className="btn btn-ghost" style={{ paddingLeft: 0 }}>
                  <Icon name="chevLeft" size={14} /> Back
                </button>
              </div>
            </div>
          }

          {(step === "google" || step === "microsoft") &&
          <SSOConsent provider={step} onCancel={() => setStep("choose")} />
          }

          {step === "loading" &&
          <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 18px", borderRadius: 999,
              border: "3px solid var(--surface-3)", borderTopColor: "var(--bronze)",
              animation: "spin 800ms linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Signing you in…</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Verifying credentials and loading your workspace.</div>
            </div>
          }
        </div>
      </div>
    </div>);

}

// Original-design SSO button — generic glyph + provider name, not a recreation of provider chrome
function SSOButton({ kind, onClick }) {
  const cfg = {
    google: { label: "Continue with Google", glyph: <GoogleGlyph />, sub: "@daedalus.work via Google Workspace" },
    microsoft: { label: "Continue with Microsoft", glyph: <MicrosoftGlyph />, sub: "Entra ID / Microsoft 365" }
  }[kind];
  return (
    <button onClick={onClick} type="button"
    style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12,
      height: 52, padding: "0 14px", borderRadius: 10,
      background: "var(--surface)", border: "1px solid var(--line-strong)",
      color: "var(--text)", cursor: "pointer", textAlign: "left",
      transition: "all var(--tx-fast)"
    }}
    onMouseEnter={(e) => {e.currentTarget.style.background = "var(--surface-2)";e.currentTarget.style.borderColor = "var(--bronze)";}}
    onMouseLeave={(e) => {e.currentTarget.style.background = "var(--surface)";e.currentTarget.style.borderColor = "var(--line-strong)";}}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {cfg.glyph}
      </div>
      <div style={{ flex: 1, lineHeight: 1.25 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{cfg.label}</div>
        <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{cfg.sub}</div>
      </div>
      <Icon name="arrow" size={14} color="var(--text-3)" />
    </button>);

}

// Generic geometric glyphs — original, not provider logos
function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="7" fill="none" stroke="#B08654" strokeWidth="1.4" />
      <path d="M9 5v4l3 1.5" stroke="#B08654" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1.4" fill="#B08654" />
    </svg>);

}
function MicrosoftGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="none" stroke="#B08654" strokeWidth="1.4" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="#B08654" opacity="0.4" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="#B08654" opacity="0.7" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="none" stroke="#B08654" strokeWidth="1.4" />
    </svg>);

}

// SSO redirect/consent simulation — shows the smooth handoff without recreating provider UI
function SSOConsent({ provider, onCancel }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    const a = setTimeout(() => setPhase(1), 500);
    const b = setTimeout(() => setPhase(2), 1100);
    return () => {clearTimeout(a);clearTimeout(b);};
  }, []);
  const label = provider === "google" ? "Google Workspace" : "Microsoft Entra ID";
  return (
    <div>
      <div className="h-serif" style={{ fontSize: 22, marginBottom: 6 }}>Connecting to {label}</div>
      <div className="muted" style={{ fontSize: 13, marginBottom: 22 }}>You're being securely redirected. Approve the consent, then we'll bring you back here.</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {provider === "google" ? <GoogleGlyph /> : <MicrosoftGlyph />}
        </div>
        <DotTrail active={phase} />
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #2A1E12, #4A3520)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DaedalusMark size={28} />
        </div>
      </div>

      <div className="card" style={{ padding: 14, background: "var(--surface)", marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Daedalus Pro will receive:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <ScopeRow label="Your name and primary email" />
          <ScopeRow label="Profile photo (optional)" />
          <ScopeRow label={provider === "microsoft" ? "Tenant directory membership" : "Workspace domain"} />
        </div>
      </div>

      <button onClick={onCancel} className="btn btn-ghost btn-sm" style={{ marginTop: 14, paddingLeft: 0 }}>
        <Icon name="chevLeft" size={12} /> Cancel
      </button>
    </div>);

}
function ScopeRow({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-2)" }}>
      <Icon name="check" size={12} color="var(--olive)" /> {label}
    </div>);

}
function DotTrail({ active }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      {[0, 1, 2, 3, 4].map((i) =>
      <div key={i} style={{
        width: 6, height: 6, borderRadius: 999,
        background: i <= active * 2.5 ? "var(--bronze)" : "var(--line-strong)",
        transition: "all 220ms var(--ease)"
      }} />
      )}
    </div>);

}

window.Login = Login;