/**
 * Local Storage Service for Interview Progress
 * Handles saving and restoring interview state across browser sessions
 */

import { InterviewScript, InterviewResponse, Requirement } from "@/types/interview";

const STORAGE_PREFIX = "hiring_tool_";
const CURRENT_SESSION_KEY = `${STORAGE_PREFIX}current_session`;
const SESSION_LIST_KEY = `${STORAGE_PREFIX}sessions`;
const STORAGE_VERSION = "1.0.0";

export interface SavedSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  metadata: {
    companyName?: string;
    positionTitle?: string;
    completed: boolean;
    currentStep: "setup" | "script" | "execute" | "complete";
    progress: number; // Percentage 0-100
  };
  data: {
    // Step 1: Setup data
    jobDescription?: string;
    extractedRequirements?: string[];

    // Step 2-3: Definition and Classification data
    requirements?: Requirement[];
    definedRequirements?: Requirement[];

    // Step 4: Script preparation
    interviewScript?: InterviewScript;
    selectedQuestions?: string[]; // Question IDs that are selected
    questionEdits?: Record<string, string>; // Edited questions
    questionOrder?: string[]; // Custom question order

    // Step 5: Execution
    interviewResponses?: InterviewResponse[];
    currentQuestionIndex?: number;

    // Step 6: Results
    overallScore?: "pass" | "fail" | "maybe";
    candidateName?: string;
    candidateEmail?: string;
    finalNotes?: string;
  };
}

class LocalStorageService {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  /**
   * Save the current session to localStorage
   */
  saveSession(session: SavedSession): boolean {
    if (!this.isClient) return false;

    try {
      const sessionKey = `${STORAGE_PREFIX}session_${session.id}`;

      // Update the session with current timestamp
      session.updatedAt = new Date().toISOString();
      session.version = STORAGE_VERSION;

      // Save the session data
      localStorage.setItem(sessionKey, JSON.stringify(session));

      // Update current session reference
      localStorage.setItem(CURRENT_SESSION_KEY, session.id);

      // Update session list
      this.updateSessionList(session);

      return true;
    } catch (error) {
      console.error("Failed to save session:", error);
      // Handle QuotaExceededError
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        this.handleStorageQuotaExceeded();
      }
      return false;
    }
  }

  /**
   * Load a specific session from localStorage
   */
  loadSession(sessionId: string): SavedSession | null {
    if (!this.isClient) return null;

    try {
      const sessionKey = `${STORAGE_PREFIX}session_${sessionId}`;
      const data = localStorage.getItem(sessionKey);

      if (!data) return null;

      const session = JSON.parse(data) as SavedSession;

      // Check version compatibility
      if (session.version !== STORAGE_VERSION) {
        console.warn(`Session version mismatch: ${session.version} vs ${STORAGE_VERSION}`);
        // You could add migration logic here if needed
      }

      return session;
    } catch (error) {
      console.error("Failed to load session:", error);
      return null;
    }
  }

  /**
   * Load the current/most recent session
   */
  loadCurrentSession(): SavedSession | null {
    if (!this.isClient) return null;

    try {
      const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);

      if (!currentSessionId) {
        // Try to get the most recent session
        const sessions = this.getAllSessions();
        if (sessions.length > 0) {
          return this.loadSession(sessions[0].id);
        }
        return null;
      }

      return this.loadSession(currentSessionId);
    } catch (error) {
      console.error("Failed to load current session:", error);
      return null;
    }
  }

  /**
   * Get all saved sessions (metadata only for performance)
   */
  getAllSessions(): Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    metadata: SavedSession["metadata"];
  }> {
    if (!this.isClient) return [];

    try {
      const sessionListData = localStorage.getItem(SESSION_LIST_KEY);

      if (!sessionListData) return [];

      const sessionList = JSON.parse(sessionListData) as string[];
      const sessions = [];

      for (const sessionId of sessionList) {
        const session = this.loadSession(sessionId);
        if (session) {
          sessions.push({
            id: session.id,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            metadata: session.metadata,
          });
        }
      }

      // Sort by updatedAt (most recent first)
      sessions.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return sessions;
    } catch (error) {
      console.error("Failed to get all sessions:", error);
      return [];
    }
  }

  /**
   * Delete a specific session
   */
  deleteSession(sessionId: string): boolean {
    if (!this.isClient) return false;

    try {
      const sessionKey = `${STORAGE_PREFIX}session_${sessionId}`;
      localStorage.removeItem(sessionKey);

      // Update session list
      const sessionListData = localStorage.getItem(SESSION_LIST_KEY);
      if (sessionListData) {
        const sessionList = JSON.parse(sessionListData) as string[];
        const updatedList = sessionList.filter(id => id !== sessionId);
        localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(updatedList));
      }

      // Clear current session if it's the one being deleted
      const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
      if (currentSessionId === sessionId) {
        localStorage.removeItem(CURRENT_SESSION_KEY);
      }

      return true;
    } catch (error) {
      console.error("Failed to delete session:", error);
      return false;
    }
  }

  /**
   * Clear all saved sessions
   */
  clearAllSessions(): boolean {
    if (!this.isClient) return false;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to clear all sessions:", error);
      return false;
    }
  }

  /**
   * Create a new session with initial data
   */
  createNewSession(initialData?: Partial<SavedSession["data"]>): SavedSession {
    const now = new Date().toISOString();
    const sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: SavedSession = {
      id: sessionId,
      createdAt: now,
      updatedAt: now,
      version: STORAGE_VERSION,
      metadata: {
        completed: false,
        currentStep: "setup",
        progress: 0,
      },
      data: initialData || {},
    };

    return session;
  }

  /**
   * Calculate progress percentage based on current step and data
   */
  calculateProgress(session: SavedSession): number {
    const { data, metadata } = session;
    let progress = 0;

    // Step 1: Job description (20%)
    if (data.jobDescription) progress += 10;
    if (data.extractedRequirements?.length) progress += 10;

    // Step 2: Requirements definition (20%)
    if (data.definedRequirements?.length) progress += 20;

    // Step 3: Classification (20%)
    const hasClassifications = data.requirements?.some(r => r.finalClassification);
    if (hasClassifications) progress += 20;

    // Step 4: Script preparation (20%)
    if (data.interviewScript) progress += 20;

    // Step 5: Execution (15%)
    if (data.interviewResponses?.length) {
      const totalQuestions = data.interviewScript?.questions.length || 0;
      const answeredQuestions = data.interviewResponses.length;
      if (totalQuestions > 0) {
        progress += Math.floor((answeredQuestions / totalQuestions) * 15);
      }
    }

    // Step 6: Complete (5%)
    if (metadata.currentStep === "complete") progress = 100;

    return Math.min(progress, 100);
  }

  /**
   * Update the session list in localStorage
   */
  private updateSessionList(session: SavedSession): void {
    try {
      const sessionListData = localStorage.getItem(SESSION_LIST_KEY);
      let sessionList: string[] = sessionListData ? JSON.parse(sessionListData) : [];

      // Add session ID if not already in list
      if (!sessionList.includes(session.id)) {
        sessionList.unshift(session.id);

        // Keep only the last 20 sessions to manage storage
        sessionList = sessionList.slice(0, 20);

        localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(sessionList));
      }
    } catch (error) {
      console.error("Failed to update session list:", error);
    }
  }

  /**
   * Handle storage quota exceeded error
   */
  private handleStorageQuotaExceeded(): void {
    console.warn("localStorage quota exceeded. Attempting to clear old sessions...");

    // Get all sessions and delete the oldest ones
    const sessions = this.getAllSessions();

    // Keep only the 10 most recent sessions
    if (sessions.length > 10) {
      const sessionsToDelete = sessions.slice(10);
      sessionsToDelete.forEach(session => {
        this.deleteSession(session.id);
      });
    }
  }

  /**
   * Export session data as JSON
   */
  exportSession(sessionId: string): string | null {
    const session = this.loadSession(sessionId);

    if (!session) return null;

    return JSON.stringify(session, null, 2);
  }

  /**
   * Import session data from JSON
   */
  importSession(jsonData: string): SavedSession | null {
    try {
      const session = JSON.parse(jsonData) as SavedSession;

      // Validate the session structure
      if (!session.id || !session.version || !session.data) {
        throw new Error("Invalid session data structure");
      }

      // Generate new ID to avoid conflicts
      session.id = `${Date.now()}_imported_${Math.random().toString(36).substr(2, 9)}`;
      session.updatedAt = new Date().toISOString();

      // Save the imported session
      if (this.saveSession(session)) {
        return session;
      }

      return null;
    } catch (error) {
      console.error("Failed to import session:", error);
      return null;
    }
  }

  /**
   * Check if localStorage is available and working
   */
  isStorageAvailable(): boolean {
    if (!this.isClient) return false;

    try {
      const testKey = "__localStorage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): {
    used: number;
    available: boolean;
    sessionCount: number;
  } {
    if (!this.isClient) {
      return { used: 0, available: false, sessionCount: 0 };
    }

    let used = 0;
    let sessionCount = 0;

    try {
      for (const key in localStorage) {
        if (key.startsWith(STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            used += key.length + value.length;
          }
          if (key.startsWith(`${STORAGE_PREFIX}session_`)) {
            sessionCount++;
          }
        }
      }
    } catch (error) {
      console.error("Failed to calculate storage info:", error);
    }

    return {
      used: Math.round(used / 1024), // KB
      available: this.isStorageAvailable(),
      sessionCount,
    };
  }
}

// Export singleton instance
export const storageService = new LocalStorageService();

// Export convenience functions
export const saveProgress = (data: Partial<SavedSession["data"]>, metadata?: Partial<SavedSession["metadata"]>) => {
  const currentSession = storageService.loadCurrentSession();

  if (currentSession) {
    // Update existing session
    currentSession.data = { ...currentSession.data, ...data };
    if (metadata) {
      currentSession.metadata = { ...currentSession.metadata, ...metadata };
    }
    currentSession.metadata.progress = storageService.calculateProgress(currentSession);
    return storageService.saveSession(currentSession);
  } else {
    // Create new session
    const newSession = storageService.createNewSession(data);
    if (metadata) {
      newSession.metadata = { ...newSession.metadata, ...metadata };
    }
    newSession.metadata.progress = storageService.calculateProgress(newSession);
    return storageService.saveSession(newSession);
  }
};

export const loadProgress = () => {
  return storageService.loadCurrentSession();
};

export const clearProgress = () => {
  const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
  if (currentSessionId) {
    return storageService.deleteSession(currentSessionId);
  }
  return false;
};