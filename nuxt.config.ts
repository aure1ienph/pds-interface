// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    airtableAccessToken: process.env.AIRTABLE_ACCESS_TOKEN,
    googleCredentials: process.env.GOOGLE_CREDENTIALS,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase']
})