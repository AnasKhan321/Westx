import { CreationCall } from "./creationcall";

interface apiresponse{
    success : boolean
}

export const DeleteBookmark  =  async(body : CreationCall)=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/remove/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data : apiresponse = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    
  
    }
}





export const DeleteLike =  async(body : CreationCall)=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/remove/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data : apiresponse = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    
  
    }
}



export const DeleteRepost =  async(body : CreationCall)=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/remove/repost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data : apiresponse = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    
  
    }
}