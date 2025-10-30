"use client";

import { useRouter } from "next/navigation";
import { NavigationHeader } from "@/components/navigation-header";
import { SessionManager } from "@/components/session-manager";
import { storageService } from "@/lib/storage";

export default function SessionsPage() {
  const router = useRouter();

  const handleLoadSession = (sessionId: string) => {
    // Load the session and navigate to the interview page
    const session = storageService.loadSession(sessionId);
    if (session) {
      // Set as current session
      localStorage.setItem("hiring_tool_current_session", sessionId);
      router.push("/interview");
    }
  };

  const handleNewSession = () => {
    // Clear current session and start fresh
    localStorage.removeItem("hiring_tool_current_session");
    router.push("/interview");
  };

  const getCurrentSessionId = () => {
    return localStorage.getItem("hiring_tool_current_session") || undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FBFD] to-white">
      <NavigationHeader showBackButton={true} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1F2937]">
            Manage Your Interviews
          </h1>
          <p className="mt-3 text-lg text-[#4A5568]">
            Continue where you left off or start a new interview session
          </p>
        </div>

        <SessionManager
          onLoadSession={handleLoadSession}
          onNewSession={handleNewSession}
          currentSessionId={getCurrentSessionId()}
        />
      </div>
    </div>
  );
}