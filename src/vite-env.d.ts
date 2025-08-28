/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_CDP_PROJECT_ID?: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}