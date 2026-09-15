/**
 * Ping Check: Core Types & Interfaces
 */

// Registered mood keys
export type MoodKey = 'sad' | 'tired' | 'disconnected' | 'heavy' | 'broken' | 'loss';

// Configuration for each mood selector button
export interface MoodOption {
  key: MoodKey;
  label: string;
  description: string;
}

// Empathetic affirmation & reflection content
export interface MoodQuote {
  quote: string;
  author?: string;
  reflection: string;
  groundingExercise?: string;
}

// Mapping of moods to their respective quotes and exercises
export type MoodQuotesRegistry = Record<MoodKey, MoodQuote>;

// Payload sent by the client when logging an anonymous scan
export interface LogPayload {
  mood: MoodKey;
  referrer?: string | null;
}

// Database record schema in Supabase logs table
export interface LogEntry {
  id?: string;
  created_at?: string;
  mood: string;
  referrer?: string | null;
}

// Standard API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  fallback?: boolean;
}

// List of supported moods for easy iteration and configuration
export const SUPPORTED_MOODS: MoodOption[] = [
  {
    key: 'sad',
    label: 'Sad',
    description: 'A heavy heart, sorrow, or tears waiting to fall',
  },
  {
    key: 'tired',
    label: 'Tired',
    description: 'Drained to the bone, mentally or emotionally depleted',
  },
  {
    key: 'disconnected',
    label: 'Disconnected',
    description: 'Numb, detached, drifting far from your center',
  },
  {
    key: 'heavy',
    label: 'Heavy',
    description: 'Carrying more weight than one person can hold',
  },
  {
    key: 'broken',
    label: 'Broken',
    description: 'Hurting, cracked open, fragile in this hour',
  },
  {
    key: 'loss',
    label: 'Loss',
    description: 'Grieving someone, something, or a part of yourself',
  },
];
