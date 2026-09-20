/**
 * Ping Check: Core Types & Interfaces
 */

// Registered mood keys
type DifficultMoodKey = 'sad' | 'tired' | 'disconnected' | 'heavy' | 'broken' | 'loss';
type PositiveMoodKey = 'happy' | 'content' | 'calm' | 'grateful' | 'excited' | 'hopeful';
type NeutralMoodKey = 'just-okay';
export type MoodKey = DifficultMoodKey | PositiveMoodKey | NeutralMoodKey;

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
  guidanceTips?: string[];
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

// Mixed mood order keeps the check-in welcoming across the full emotional spectrum.
export const SUPPORTED_MOODS: MoodOption[] = [
  { key: 'sad', label: 'Sad', description: 'A heavy heart, sorrow, or tears waiting to fall' },
  { key: 'happy', label: 'Happy', description: 'Light heart, good energy, something is going right' },
  { key: 'tired', label: 'Tired', description: 'Drained to the bone, mentally or emotionally depleted' },
  { key: 'content', label: 'Content', description: 'Settled and at ease, nothing pulling at you' },
  { key: 'disconnected', label: 'Disconnected', description: 'Numb, detached, drifting far from your center' },
  { key: 'calm', label: 'Calm', description: 'Steady breath, quiet mind' },
  { key: 'heavy', label: 'Heavy', description: 'Carrying more weight than one person can hold' },
  { key: 'grateful', label: 'Grateful', description: 'Thankful for someone or something today' },
  { key: 'broken', label: 'Broken', description: 'Hurting, cracked open, fragile in this hour' },
  { key: 'excited', label: 'Excited', description: 'Buzzing, looking forward to what’s next' },
  { key: 'loss', label: 'Loss', description: 'Grieving someone, something, or a part of yourself' },
  { key: 'hopeful', label: 'Hopeful', description: 'Things feel like they can get better' },
  { key: 'just-okay', label: 'Just okay', description: 'Neither up nor down, just getting through the day' },
];
