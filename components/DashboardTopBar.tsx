import { ModeToggle } from "@/components/ThemeToggler";
import Image from "next/image";

export default function DashboardTopBar() {
  return (
    <>
      <nav className="px-4 flex justify-between bg-white h-16 border-b-2">
        <ul className="flex items-center lg:hidden">
          <li className="h-6 w-6">
            <Image
              className="h-full w-full mx-auto"
              src="/beerz-ico.svg"
              alt="Beerz Delivery"
              width="100"
              height="100"
            />
          </li>
        </ul>

        <ul className="flex items-center"></ul>

        <ul className="flex items-center">
          <li className="pr-4">
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </>
  );
}
