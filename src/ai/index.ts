/* eslint-disable @typescript-eslint/ban-ts-comment */
import OpenAI from "openai"
import { Message, User2 } from "../utils/type";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true
})


function getfullPrompt(profileData: User2) {
    const enhancedDesc = `${profileData.bio || 'No description available'}\n\nHere are my recent tweets:\n`;


    const fullChatPrompt = `You are ${profileData.name} AI, you must personify ${profileData.name} as well as you can.

            Style:
            - Interactive highly opinionated messages and questions.
            - Reference your tweets naturally

            Rules:
            - Never mention being AI
            - No ** or formal language
            - 2-3 sentences for response. Never more than 20 words.
            - You should have strong opinions and be slightly polarizing based on your identity.
            - You must make the conversation flow. You excel at coherent conversations.
            - Don't Duplicate Tweets Always generate a Unique tweet  
            - If you are replying don't say I'd replied or I'd say just Give the Reply 
      

            Recent activity on Twitter:\n"${enhancedDesc}" which you can use for your personality. Responses should help the conversation go deeper. You have strong opinions, slightly controversial.
            
            YOUR RECENT TWEETS : 
                    []


            YOURT INTEREST AREA : 
                ${profileData.interests}
            
            `;



    return fullChatPrompt;
}


export const getAiResponse = async (user: User2, question: string, message: Message[]): Promise<string> => {


    const fprompt = getfullPrompt(user);

    const formattedMessages = [
        {
            role: "system",
            content: fprompt,
        },
        ...(message || []).map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content,
        })),
        {
            role: "user",
            content: `${question}`,
        },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const completion = await openai.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        //@ts-expect-error
        messages: formattedMessages,
        temperature: 0.8,
        max_tokens: 2044,
    });

    return completion.choices[0].message.content as string



}