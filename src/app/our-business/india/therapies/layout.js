import { notFound } from "next/navigation";

function isPhase2Enabled() {
  return process.env.PHASE2 === "true";
}

export default function TherapiesLayout({ children }) {
  if (!isPhase2Enabled()) {
    notFound();
  }
  return children;
}
