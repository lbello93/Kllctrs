// Gemini 2.5 Flash init, chat + generation helpers


import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
})

export async function generateChatResponse(prompt: string): Promise<string> {
  const result = await geminiFlash.generateContent(prompt)
  return result.response.text()
}

export async function generateBlogPost(eventData: {
  name: string
  date: string
  city: string
  state: string
  venue: string
}): Promise<string> {
  const prompt = `Write a 300-400 word SEO-optimised blog post about this upcoming sports card show.
Event: ${eventData.name}
Date: ${eventData.date}
Location: ${eventData.city}, ${eventData.state}
Venue: ${eventData.venue}

Requirements:
- Title as H1
- Engaging intro paragraph
- Key details section
- Why collectors should attend
- End with a CTA to view on KLLCTBLS
- Tone: enthusiastic but informative
- Do NOT invent details not provided`

  return generateChatResponse(prompt)
}

export async function generateLinkedInPost(eventName: string, city: string, state: string, date: string): Promise<string> {
  const prompt = `Write a LinkedIn post (max 200 words) announcing this card show for KLLCTBLS, a card show discovery platform.
Event: ${eventName}, ${city} ${state} on ${date}.
Tone: professional, excited. Include 3 relevant hashtags. End with "Find it on KLLCTBLS."`
  return generateChatResponse(prompt)
}