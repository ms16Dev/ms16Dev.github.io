// src/analytics.js
import ReactGA from "react-ga4";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Only initialize GA in production (skip localhost/dev)
export const initGA = () => {
  if (window.location.hostname === "localhost") return; // skip GA in dev
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

// Only log page views in production
export const logPageView = (page) => {
  if (window.location.hostname === "localhost") return; // skip GA in dev
  ReactGA.send({ hitType: "pageview", page });
};

// Optional: event tracking, also skipped in dev
export const logEvent = ({ category, action, label }) => {
  if (window.location.hostname === "localhost") return; // skip GA in dev
  ReactGA.event({ category, action, label });
};
