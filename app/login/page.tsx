import { Metadata } from "next"
import Image from "next/image"
import Login from "@/components/user-auth-form"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    
        <div className="relative hidden h-screen flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-[#0c0417]" />
          <div className="relative z-20 flex items-center text-lg font-medium">
          {/* <Image
              className="ml-2 h-12 w-12 mx-auto"
              src="/beerz-ico-blank.svg"
              alt="Beerz logo"
              width="100"
              height="100"
              priority
            /> */}
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
            
              <footer className="text-sm">2023 | Beerz Delivery</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
            <Image
              className=" h-24 w-30 mx-auto"
              src="/beerz.svg"
              alt="Beerz logo"
              width="150"
              height="150"
              priority
            />
            </div>
            <Login />
           
          </div>
        </div>
      </div>
    </>
  )
}