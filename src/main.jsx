// Daedalus Pro — Vite entry point.
//
// CRITICAL ORDER NOTE: ES module imports are hoisted and dependencies are
// evaluated in topological + source order BEFORE the importing module's
// body runs. So we must put global setup inside `./globals.js` and import
// it FIRST. Putting `globalThis.React = React` in this file's body would
// run too late — after all the sibling .jsx imports below have already
// executed and tried to read `React`.

// 1. Sets globalThis.React, globalThis.ReactDOM, globalThis.THREE.
import './globals.js';

// 2. Design tokens.
import '../styles/tokens.css';

// 3. Mock data — populates window.MOCK that every screen reads.
import '../data/mock.js';

// 4. Shared primitives + shell (other files reference Icon, Sidebar, TopBar).
import '../components/Primitives.jsx';
import '../components/Shell.jsx';
import '../tweaks-panel.jsx';

// 5. Screens — order mirrors the original Daedalus Pro.html script tags.
import '../screens/Login.jsx';
import '../screens/Home.jsx';
import '../screens/Onboarding.jsx';
import '../screens/Apply.jsx';
import '../screens/Compliance.jsx';
import '../screens/WorkOrders.jsx';
import '../screens/Dispatcher.jsx';
import '../screens/Field.jsx';
import '../screens/Invoices.jsx';
import '../screens/Scorecard.jsx';
import '../screens/SalesHub.jsx';
import '../screens/TechMarket.jsx';
import '../screens/PMC.jsx';
import '../screens/More.jsx';
import '../screens/ConsumerSubmit.jsx';
import '../screens/ClaimJob.jsx';
import '../screens/BidJob.jsx';
import '../screens/HomeownerBids.jsx';
import '../screens/ConsumerMarket.jsx';
import '../screens/CMTechModals.jsx';

// 6. Modals last among components.
import '../components/Modals.jsx';

// 7. App.jsx renders into #root on import (it ends with
//    ReactDOM.createRoot(...).render(<App/>)).
import '../App.jsx';
