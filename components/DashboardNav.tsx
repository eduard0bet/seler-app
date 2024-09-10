'use client'
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ThemeToggler";
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";

export default function DashboardNav() {
  const { setTheme } = useTheme()


  return (
    <>
      <aside className="hidden lg:flex flex-col items-center bg-[#0c0417] dark:bg-[#292B2D] dark:text-gray-400 text-white h-screen fixed">
        <div className="h-16 flex items-center w-full">
          <Link className="h-10 w-10 mx-auto mt-6" href="/dashboard">
            <Image
              className="h-8 w-8 mx-auto"
              src="/beerz-ico-blank.svg"
              alt="Beerz logo"
              width="100"
              height="100"
              priority
            />
          </Link>
        </div>

        <ul>
          <li className="hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F]">
            <Link
              href="/dashboard"
              className="h-16 px-6 flex justify-center items-center w-full
					"
            >
              <svg
                className="w-6 h-6"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
                </g>
              </svg>
            </Link>
          </li>

          <li className="hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F]">
            <Link
              href="/dashboard/orders"
              className="h-16 px-6 flex justify-center items-center w-full
					"
            >
              <svg
                className="w-6 h-6"
                width="24"
                height="24"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="4"
                >
                  <path d="M41 14L24 4L7 14v20l17 10l17-10V14Z" />
                  <path strokeLinecap="round" d="M24 22v8m8-12v12m-16-4v4" />
                </g>
              </svg>
            </Link>
          </li>

          <li className="hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F]">
            <Link
              href="/dashboard/products"
              className="h-16 px-6 flex justify-center items-center w-full
					"
            >
              <svg
                className="h-7 w-7"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M17 24h4v4h-4zm7 0h4v4h-4zm-7-7h4v4h-4zm7 0h4v4h-4z"
                />
                <path
                  fill="currentColor"
                  d="M28 11h-6V7c0-1.7-1.3-3-3-3h-6c-1.7 0-3 1.3-3 3v4H4c-.6 0-1 .4-1 1v.2l1.9 12.1c.1 1 1 1.7 2 1.7H15v-2H6.9L5.2 13H28v-2zM12 7c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v4h-8V7z"
                />
              </svg>
            </Link>
          </li>

          <li className="hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F]">
            <Link
              href="/dashboard/products/categories"
              className="h-16 px-6 flex justify-center items-center w-full
					"
            >
              <svg
                width="24"
                height="24"
                className="h7 w-7"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="m6.76 6l.45.89L7.76 8H12v5H4V6h2.76m.62-2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9l-.72-1.45a1 1 0 0 0-.9-.55zm15.38 2l.45.89l.55 1.11H28v5h-8V6h2.76m.62-2H19a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-4l-.72-1.45a1 1 0 0 0-.9-.55zM6.76 19l.45.89l.55 1.11H12v5H4v-7h2.76m.62-2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H9l-.72-1.45a1 1 0 0 0-.9-.55zm15.38 2l.45.89l.55 1.11H28v5h-8v-7h2.76m.62-2H19a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-4l-.72-1.45a1 1 0 0 0-.9-.55z"
                />
              </svg>
            </Link>
          </li>

          <li className="hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F]">
            <Link
              href="/dashboard/users"
              className="h-16 px-6 flex justify-center items-center w-full
					"
            >
              <svg
                className="h-6 w-6"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75" />
                </g>
              </svg>
            </Link>
          </li>

          <li className="hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F]">
            <Link
              href="/dashboard/configuration"
              className="h-16 px-6 flex justify-center items-center w-full
					"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1
							0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0
							0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2
							2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0
							0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1
							0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0
							0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65
							0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0
							1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0
							1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2
							0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0
							1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0
							2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0
							0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65
							1.65 0 0 0-1.51 1z"
                ></path>
              </svg>
            </Link>
          </li>
        </ul>

        <div className="mt-auto h-32 w-full">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-16 mx-auto flex justify-center items-center w-full dark:text-gray-400 hover:bg-[#7C67FF] dark:hover:bg-[#3B3C3F] focus:outline-none border-0 rounded-none bg-transparent" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

          <form action="/auth/sign-out" className="w-full" method="post">
            <button className="h-16 mx-auto flex justify-center items-center w-full dark:text-gray-400 hover:bg-red-600 dark:hover:bg-[#3B3C3F] focus:outline-none">
              <svg
                className="h-5 w-5 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </form>
        </div>
      </aside>
      <nav
        className="fixed bottom-0 w-full border bg-white dark:bg-background lg:hidden flex
		overflow-x-auto"
      >
        <Link
          href="/dashboard/orders"
          className="flex flex-col flex-grow items-center justify-center
			overflow-hidden whitespace-no-wrap text-sm transition-colors
			duration-100 ease-in-out hover:bg-gray-200 focus:text-orange-500"
        >
          <svg
                className="w-6 h-6"
                width="24"
                height="24"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="4"
                >
                  <path d="M41 14L24 4L7 14v20l17 10l17-10V14Z" />
                  <path strokeLinecap="round" d="M24 22v8m8-12v12m-16-4v4" />
                </g>
              </svg>

          <span className=" text-sm capitalize">Pedidos</span>
        </Link>
        <Link
          href="."
          className="flex flex-col flex-grow items-center justify-center
			overflow-hidden whitespace-no-wrap text-sm transition-colors
			duration-100 ease-in-out hover:bg-gray-200 focus:text-orange-500"
        >
          <svg
                className="h-7 w-7"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M17 24h4v4h-4zm7 0h4v4h-4zm-7-7h4v4h-4zm7 0h4v4h-4z"
                />
                <path
                  fill="currentColor"
                  d="M28 11h-6V7c0-1.7-1.3-3-3-3h-6c-1.7 0-3 1.3-3 3v4H4c-.6 0-1 .4-1 1v.2l1.9 12.1c.1 1 1 1.7 2 1.7H15v-2H6.9L5.2 13H28v-2zM12 7c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v4h-8V7z"
                />
              </svg>

          <span className=" text-sm capitalize">Productos</span>
        </Link>
        <Link
          href="/dashboard/products/categories"
          className="flex flex-col flex-grow items-center justify-center
			overflow-hidden whitespace-no-wrap text-sm transition-colors
			duration-100 ease-in-out hover:bg-gray-200 focus:text-orange-500"
        >
          <svg
                width="24"
                height="24"
                className="h7 w-7"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="m6.76 6l.45.89L7.76 8H12v5H4V6h2.76m.62-2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9l-.72-1.45a1 1 0 0 0-.9-.55zm15.38 2l.45.89l.55 1.11H28v5h-8V6h2.76m.62-2H19a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-4l-.72-1.45a1 1 0 0 0-.9-.55zM6.76 19l.45.89l.55 1.11H12v5H4v-7h2.76m.62-2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H9l-.72-1.45a1 1 0 0 0-.9-.55zm15.38 2l.45.89l.55 1.11H28v5h-8v-7h2.76m.62-2H19a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-4l-.72-1.45a1 1 0 0 0-.9-.55z"
                />
              </svg>

          <span className=" text-sm capitalize">Categorias</span>
        </Link>
      </nav>
    </>
  );
}
