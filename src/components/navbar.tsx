import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/images/logo.png";
import { Github } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 max-w-screen-2xl justify-center items-center">
        <nav className="flex flex-1 items-center space-x-3 text-sm font-medium">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src={logo} alt="Logo" className="w-[250px]" />
          </Link>
          <Button variant="ghost">Solutions</Button>
          <Button variant="ghost">About Us</Button>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Button>
          <Button variant="ghost">Contact</Button>
          <div className="w-auto h-auto">
            <SignedOut>
              <Button variant="ghost">
                <SignInButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
