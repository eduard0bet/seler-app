import "../../app/globals.css";
import DashboardNav from "@/components/DashboardNav";
import DashboardTopBar from "@/components/DashboardTopBar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";


export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Dashboard Beerz",
  description: "Beerz control panel.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
    <TailwindIndicator></TailwindIndicator>
    <main className="min-h-screen bg-gray-200 dark:bg-[#212325]" >
      <div className="h-full w-full flex">
        <DashboardNav />
        <div className="flex-1 flex flex-col">
          <div className="m-8 xl:ml-28 lg:ml-28 2xl:ml-28">{children}</div>
          <Toaster />
        </div>
      </div>
      </main>
    </>
  );
}
