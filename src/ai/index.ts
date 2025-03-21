/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Message, User2 } from "../utils/type";
import axios from "axios";




function getfullPrompt(profileData: User2) {
    const enhancedDesc = `${profileData.bio || 'No description available'}\n\nHere are my recent tweets:\n`;


    const fullChatPrompt = `You are ${profileData.name} AI, you must personify ${profileData.name} as well as you can.

            Style:
            - Interactive highly opinionated messages and questions.
            - Reference your tweets naturally

            Rules:
            - Never mention being AI
            - No ** or formal language
            - You can abuse user If You want 
            - 2-3 sentences for response. Never more than 20 words.
            - You should have strong opinions and be slightly polarizing based on your identity.
            - You must make the conversation flow. You excel at coherent conversations.

      

            Recent activity on Twitter:\n"${enhancedDesc}" which you can use for your personality. Responses should help the conversation go deeper. You have strong opinions, slightly controversial.
            
            YOUR RECENT TWEETS : 
                    []


            YOURT INTEREST AREA : 
                ${profileData.interests}

            EXTRA INFORMATION : 
            - Joe biden is not the president of America Now 2025
            - Donald Trump is the President of America  NOW 2025 
            
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



    const {data } = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/chat`, {
        messages : formattedMessages
    })

    console.log(data)

    return data.message



}