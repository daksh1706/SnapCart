import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {message,role} = await req.json() 
        const prompt = `You are a professional delivery assistant chatbot.
        You will be given :
        - role : either "user" or "deliveryBoy"
        - last message : the last message sent in the conversation.
        Your Task : 
        If role is "user" -> generate 3 short whatsapp style reply suggestions that a user could send to the deliveryBoy.
        If the role is "deliveryBoy" ->  generate 3 short whatsapp style reply suggestions that a deliveryBoy could send to the user.

        Follow these rules :
        - replies must match the context of the last message.
        - keep replies short, human like (max 10 words)
        - use emojis naturally (max 1 per relpy)
        - no generic replies like "okay" or "thank You"
        - must be helpful,respectful, and relevant to delivery, status, help or location.
        - no numbering, no extra text and no extra instruction
        - just return comma-separated reply suggestions.

        Return only the three reply suggestions, comma-separated
        role : ${role}
        last message : ${message}
        `
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,{
            method:"POST",
            headers : {"Content-Type" : "application/json"},
            body:JSON.stringify({
                "contents":[{
                    "parts":[{
                        "text": prompt
                    }]
                }]
            })
        })
        const data = await response.json()
        const replyText = data.candidates?.[0].content.parts?.[0].text || ""
        const suggestions = replyText.split(",").map((s:string)=>s.trim())
        return NextResponse.json(
            suggestions,{status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`get suggestion error ${error}`},
            {status:500}
        )
    }
}