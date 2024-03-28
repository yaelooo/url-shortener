import { supabase } from "@lib/supabase"

function generateId(length = 5) {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function validateUrl(url: string) {
  const domainPattern = /([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5})/i
  const portPattern = /(:[0-9]{1,5})?/i
  const pathPattern = /(\/.*)?$/i

  if (!url) {
    return "No URL provided (Must be https://example.com, http://example.com, or example.com)"
  }

  if (typeof url !== "string") {
    return "Invalid URL type (expected string)"
  }

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url
  }

  if (url.length > 2048) {
    return "Invalid URL length (max 2048 characters)"
  }

  if (!domainPattern.test(url)) {
    return "Invalid URL domain (e.g. .com, .org, .net, etc.)"
  }

  if (!portPattern.test(url)) {
    return "Invalid URL port (between 1 and 65535)"
  }

  if (!pathPattern.test(url)) {
    return "Invalid URL path (e.g. /path/to/resource)"
  }

  return { isValid: true, url }
}

async function idExist(id: string) {
  let { data, error } = await supabase.from("url").select("id").eq("id", id)
  if (error) {
    return false
  }

  return data && data.length > 0 ? true : false
}

async function getUrlById(id: string, tableName: string) {
  const { data, error } = await supabase.from(tableName).select("url").eq("id", id)
  if (error) return { error }
  return data && data[0] ? { result: data[0].url } : { error }
}

export async function shortenUrl(url: string, id?: string) {
  // Verify URL is valid
  const validationResult = validateUrl(url)
  if (typeof validationResult === "string") {
    return { error: validationResult }
  }

  url = validationResult.url

  // Check if the custom URL already exists
  if (id && (await idExist(id))) {
    return { error: `Custom URL "${id}" already exists, try with other.` }
  }

  // Generate a random ID
  do {
    id = id || generateId()
  } while (await idExist(id))

  // Insert the URL into the database
  let { error: insertError } = await supabase.from("url").insert([{ id: id, url: url }])
  if (insertError) {
    return { error: insertError.message }
  }

  // Return the shortened URL
  return { result: id }
}

export async function getShortenedUrl(id: string) {
  return getUrlById(id, "url")
}

export async function getSocialUrl(id: string) {
  return getUrlById(id, "social")
}
