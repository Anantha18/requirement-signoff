import type { Metadata } from "next";
import { LeadsViewer } from "./leads-viewer";

export const metadata: Metadata = {
  title: "Leads · AV Room Configurator",
  description: "Protected AV room configuration leads.",
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return <LeadsViewer/>;
}
