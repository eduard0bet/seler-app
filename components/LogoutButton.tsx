import Link from "next/link";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <Button  className="py-2 px-4 rounded-md no-underline bg-btn-background text-white hover:bg-btn-background-hover">
        Logout
      </Button>
    </form>
  )
}
