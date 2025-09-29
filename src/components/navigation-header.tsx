"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationHeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  onBack?: () => void;
  className?: string;
}

export function NavigationHeader({
  showBackButton = true,
  backButtonText = "Back",
  backButtonHref,
  onBack,
  className = "",
}: NavigationHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  return (
    <header className={`border-b-2 border-[#E5E7EB] bg-white shadow-md sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && !isHomePage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 text-[#295B74] hover:text-[#1e4358]"
              >
                <ArrowLeft className="h-4 w-4" />
                {backButtonText}
              </Button>
            )}
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image 
                src="/THD Logo.png" 
                alt="The Hiring Diagnostic - Home" 
                width={300}
                height={60}
                className="h-12 w-auto cursor-pointer"
                priority
              />
            </Link>
          </div>
          {!isHomePage && (
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#295B74] hover:text-[#1e4358]"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}