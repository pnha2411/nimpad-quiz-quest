/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_SUPABASE_PROJECT_ID: string
  readonly VITE_CDP_PROJECT_ID: string
  readonly VITE_WC_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}