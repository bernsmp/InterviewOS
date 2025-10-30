/**
 * React Hook for Local Storage with Auto-Save
 * Provides automatic saving and restoration of interview progress
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { storageService, SavedSession, saveProgress, loadProgress } from "@/lib/storage";
import { InterviewScript, InterviewResponse, Requirement } from "@/types/interview";

interface UseLocalStorageOptions {
  autoSave?: boolean; // Enable auto-save (default: true)
  autoSaveDelay?: number; // Debounce delay in ms (default: 1000)
  onSaveSuccess?: () => void; // Callback on successful save
  onSaveError?: (error: Error) => void; // Callback on save error
  onRestore?: (session: SavedSession) => void; // Callback when restoring session
}

export function useLocalStorage(options: UseLocalStorageOptions = {}) {
  const {
    autoSave = true,
    autoSaveDelay = 1000,
    onSaveSuccess,
    onSaveError,
    onRestore,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentSession, setCurrentSession] = useState<SavedSession | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<Partial<SavedSession["data"]> | null>(null);

  // Initialize and load existing session on mount
  useEffect(() => {
    const session = loadProgress();
    if (session) {
      setCurrentSession(session);
      setLastSaved(new Date(session.updatedAt));
      onRestore?.(session);
    } else {
      // Create a new session
      const newSession = storageService.createNewSession();
      setCurrentSession(newSession);
    }
    setIsLoading(false);
  }, []);

  // Save data to localStorage (debounced)
  const save = useCallback((
    data: Partial<SavedSession["data"]>,
    metadata?: Partial<SavedSession["metadata"]>,
    immediate = false
  ) => {
    // Store pending data
    pendingDataRef.current = { ...pendingDataRef.current, ...data };

    const performSave = () => {
      setIsSaving(true);
      setHasUnsavedChanges(false);

      try {
        const success = saveProgress(pendingDataRef.current || data, metadata);

        if (success) {
          setLastSaved(new Date());
          onSaveSuccess?.();

          // Update current session
          const updatedSession = loadProgress();
          if (updatedSession) {
            setCurrentSession(updatedSession);
          }
        } else {
          throw new Error("Failed to save to localStorage");
        }
      } catch (error) {
        console.error("Save error:", error);
        onSaveError?.(error as Error);
      } finally {
        setIsSaving(false);
        pendingDataRef.current = null;
      }
    };

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (immediate || !autoSave) {
      performSave();
    } else {
      setHasUnsavedChanges(true);
      saveTimeoutRef.current = setTimeout(performSave, autoSaveDelay);
    }
  }, [autoSave, autoSaveDelay, onSaveSuccess, onSaveError]);

  // Force immediate save
  const saveNow = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (pendingDataRef.current) {
      save(pendingDataRef.current, undefined, true);
    }
  }, [save]);

  // Clear current session
  const clearSession = useCallback(() => {
    if (currentSession) {
      storageService.deleteSession(currentSession.id);
      setCurrentSession(null);
      setLastSaved(null);
      setHasUnsavedChanges(false);
    }
  }, [currentSession]);

  // Start a new session
  const startNewSession = useCallback((initialData?: Partial<SavedSession["data"]>) => {
    // Save current session if it has changes
    if (hasUnsavedChanges) {
      saveNow();
    }

    const newSession = storageService.createNewSession(initialData);
    storageService.saveSession(newSession);
    setCurrentSession(newSession);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);

    return newSession;
  }, [hasUnsavedChanges, saveNow]);

  // Get all available sessions
  const getAllSessions = useCallback(() => {
    return storageService.getAllSessions();
  }, []);

  // Load a specific session
  const loadSession = useCallback((sessionId: string) => {
    // Save current session first
    if (hasUnsavedChanges) {
      saveNow();
    }

    const session = storageService.loadSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setLastSaved(new Date(session.updatedAt));
      onRestore?.(session);
      return true;
    }
    return false;
  }, [hasUnsavedChanges, saveNow, onRestore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Save any pending changes
      if (pendingDataRef.current && autoSave) {
        saveProgress(pendingDataRef.current);
      }
    };
  }, [autoSave]);

  // Auto-save on window blur or before unload
  useEffect(() => {
    const handleBlur = () => {
      if (hasUnsavedChanges) {
        saveNow();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        saveNow();
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, saveNow]);

  return {
    // State
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    currentSession,

    // Methods
    save,
    saveNow,
    clearSession,
    startNewSession,
    getAllSessions,
    loadSession,

    // Storage info
    storageInfo: storageService.getStorageInfo(),
  };
}

/**
 * Specialized hook for interview workflow
 */
export function useInterviewStorage() {
  const storage = useLocalStorage({
    autoSave: true,
    autoSaveDelay: 1500,
  });

  const saveJobDescription = useCallback((jobDescription: string, requirements?: string[]) => {
    storage.save({
      jobDescription,
      extractedRequirements: requirements,
    }, {
      currentStep: "setup",
    });
  }, [storage]);

  const saveRequirements = useCallback((requirements: Requirement[]) => {
    storage.save({
      requirements,
      definedRequirements: requirements.filter(r => r.definition),
    }, {
      currentStep: "setup",
    });
  }, [storage]);

  const saveClassifications = useCallback((requirements: Requirement[]) => {
    storage.save({
      requirements,
    }, {
      currentStep: "script",
    });
  }, [storage]);

  const saveInterviewScript = useCallback((script: InterviewScript, selectedQuestions?: string[]) => {
    storage.save({
      interviewScript: script,
      selectedQuestions,
    }, {
      currentStep: "script",
      companyName: script.companyName,
      positionTitle: script.positionTitle,
    });
  }, [storage]);

  const saveInterviewResponse = useCallback((
    responses: InterviewResponse[],
    currentIndex: number,
    totalQuestions: number
  ) => {
    storage.save({
      interviewResponses: responses,
      currentQuestionIndex: currentIndex,
    }, {
      currentStep: "execute",
      progress: Math.round((responses.length / totalQuestions) * 100),
    });
  }, [storage]);

  const saveInterviewComplete = useCallback((
    responses: InterviewResponse[],
    candidateName?: string,
    candidateEmail?: string,
    overallScore?: "pass" | "fail" | "maybe",
    notes?: string
  ) => {
    storage.save({
      interviewResponses: responses,
      candidateName,
      candidateEmail,
      overallScore,
      finalNotes: notes,
    }, {
      currentStep: "complete",
      completed: true,
      progress: 100,
    });
  }, [storage]);

  const restoreSession = useCallback(() => {
    return storage.currentSession?.data;
  }, [storage.currentSession]);

  return {
    ...storage,

    // Specialized save methods
    saveJobDescription,
    saveRequirements,
    saveClassifications,
    saveInterviewScript,
    saveInterviewResponse,
    saveInterviewComplete,

    // Restore data
    restoreSession,
  };
}