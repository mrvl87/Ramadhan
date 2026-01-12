import { supabase } from "./supabase"

export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: "google",
  })
}

export const signOut = async () => {
  return supabase.auth.signOut()
}

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}
