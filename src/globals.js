// Compat-shim globals. Imported FIRST from src/main.jsx so it evaluates
// before any legacy .jsx file is executed (ES module imports are hoisted
// and evaluated in source order — so this whole module's body runs before
// the next sibling import in main.jsx).
//
// Why this exists: the legacy prototype was written for Babel-in-browser,
// where React/ReactDOM/THREE were free globals provided by <script src="cdn">
// tags. Files like App.jsx do `const { useState } = React` at module top
// level, which throws ReferenceError under Vite unless React is already
// on the global object.

import React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import * as THREE from 'three';

const ReactDOMWithClient = Object.assign({}, ReactDOM, { createRoot, hydrateRoot });

globalThis.React = React;
globalThis.ReactDOM = ReactDOMWithClient;
globalThis.THREE = THREE;

if (typeof window !== 'undefined') {
  window.React = React;
  window.ReactDOM = ReactDOMWithClient;
  window.THREE = THREE;
}
