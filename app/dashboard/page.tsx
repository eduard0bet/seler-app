import { Metadata } from "next";
import { TailwindIndicator } from "@/components/tailwind-indicator";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Beerz control panel.",
};

export default async function Dashboard() {
  return (
    <>
      <main className="m-0">
        <TailwindIndicator/>
        <h1>Dashboard</h1>
      </main>
    </>
  );
}
