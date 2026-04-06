/**
 * Gates CMS-backed / v2 investor routes until PHASE2 is enabled (server env).
 * Match: `our-business/india/therapies/layout.js`
 */
export function isPhase2Enabled() {
  return process.env.PHASE2 === "true";
}
