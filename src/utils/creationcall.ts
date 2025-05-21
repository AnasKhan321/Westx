import { BookMark, Like, Reply, Repost } from "./type";

export interface CreationCall {
    userid: string,
    tweetid: string
}

export interface Followuser {
    followerid: string,
    followingid: string
}

export interface Replybody extends CreationCall {
    text: string
}


export interface ParentBody {
    userid: string,
    replyid: string,
    text: string
}
export interface BookmakrResponse {
    success: boolean,
    bookmark: BookMark
}


export interface LikeResponse {
    success: boolean,
    like: Like
}

export interface ReplyResponse {
    reply: Reply,
    success: boolean
}

export interface RepostResponse {
    success: boolean,
    repost: Repost
}


export interface followResponse {
    success: boolean
}

export interface CreationCall2 {
    replyid: string,
    userid: string
}

export const CreateBookmark = async (body: CreationCall): Promise<BookmakrResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: BookmakrResponse = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);


    }
};



export const CreateRepost = async (body: CreationCall): Promise<RepostResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/repost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};




export const addLike = async (body: CreationCall): Promise<LikeResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};


export const addReply = async (body: Replybody): Promise<ReplyResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}



export const addReplyParent = async (body: ParentBody): Promise<ReplyResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/addreplyonreply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


export const followuser = async (body: Followuser): Promise<followResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


export const unfollowuser = async (body: Followuser): Promise<followResponse | undefined> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}