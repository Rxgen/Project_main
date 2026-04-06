import { notFound } from "next/navigation";
import { isPhase2Enabled } from "@/lib/phase2";

export default function PresentationsV2Layout({ children }) {
  if (!isPhase2Enabled()) {
    notFound();
  }
  return children;
}
