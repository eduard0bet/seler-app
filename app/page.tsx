import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import Image from "next/image";
import { ModeToggle } from "@/components/ThemeToggler";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-black dark:bg-transparent text-white">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <Image
            src="/beerz-ico-blank.svg"
            width={500}
            height={500}
            alt="Picture of the author"
            className="w-8"
            priority
          />
          <div />
          <div>
            {user ? (
              <div className="flex items-center gap-4 ">
                <Link  href="/dashboard" className="py-2 px-4 rounded-md no-underline bg-btn-background text-white hover:bg-btn-background-hover">
                  Dashboard
                </Link>
                <LogoutButton />
                <ModeToggle />
              </div>
            ) : (
              <div className="flex items-center gap-4 ">
                <Link
                  href="/login"
                  className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-white"
                >
                  Login
                </Link>
                <ModeToggle />
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="animate-in flex flex-col gap-14 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex flex-col items-center mb-4 lg:mb-12">
        
          <h1 className="sr-only">Beerz Delivery</h1>
          <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            La manera mas economica y segura de recibir {" "}
            <strong>Licores</strong> y <strong>Snacks</strong>
          </p>
          <div className="bg-foreground py-3 px-6 rounded-lg font-mono text-sm text-background dark:text-black">
            Proximamente, pide un <strong>beerz</strong>
          </div>
        </div>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      </div>
    </div>
  );
}
