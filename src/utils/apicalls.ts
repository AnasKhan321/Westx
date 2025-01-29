import { BookMark, followings, Like, Reply, Repost, Tweet, Tweet2, User, User2 } from "./type";

export interface UserResponse{
    success : boolean , 
    data : User
}


interface TweetDetail {
    success : boolean ,
    data : Tweet
}


export interface TweetsData{
    data : Tweet[] ; 
}


interface Personas {
    success : boolean , 
    data : User[]
}

interface userresponse {
    success : boolean , 
    data : User[]
}


interface LikeResponse{
    success : boolean , 
    data : Like[]
}

interface BookmarkResponse{
    success : boolean , 
    data : BookMark[]
}

interface RepostResponse{
    success : boolean , 
    data : Repost[]
}

interface TweetResponse {
    success : boolean , 
    tweet : Tweet2
}

interface ReplyResponsee{
    success : boolean , 
    data : Reply[]
}

interface UserbyUsername {
    success : boolean , 
    data : User2
}
interface FollowerResponse {
    success : boolean , 
    data : followings[]
}

interface TweetResponselist{
    success : boolean , 
    data : Tweet2[]
}

interface BookmarksREsponse{
    success : boolean , 
    data : BookMark[]
}

export const fetchUser = async (username : string) : Promise<UserResponse> => {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/getUser/${username}`);
    const data = await response.json();
    return data;
}



export const fetchTweets = async () : Promise<TweetsData> => {

    const response = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/latesttweets/1`);
    const data = await response.json();
    return data;
}





export const getPersonas = async () => {

    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/allusers`) ; 
    const data : Personas = await res.json();
    if(data.success){
        return data ; 
    }else{
        throw new Error("Error fetching data")
    }
}





export const getTweetDetail  = async(id : string) : Promise<TweetDetail> => {
    const res = await  fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/gettweet/${id}`)
    const data = await res.json();

    return data ; 
}


export const getrandomuser = async()  : Promise<userresponse>=>{
    const res = await  fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/randomuser`)
    const data = await res.json();

    return data ; 
}

export const searchUser = async(query : string) : Promise<userresponse>  =>{
    const res = await  fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/search/${query}`)
    const data = await res.json()
    return data
}



export const getTweetLike = async (tweetid : string) : Promise<LikeResponse> =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/likes/${tweetid}`)
    const data = await res.json() ; 
    return data 
}

export const getBookmarks = async(tweetid : string) : Promise<BookmarkResponse> =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/bookmark/${tweetid}`) 
    const data = await res.json()
    return data ; 
}

export const getReposts = async(tweetid : string) : Promise<RepostResponse> =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/repost/${tweetid}`) 
    const data = await res.json()
    return data ;  
}

export const getTweetByIdv2 = async(tweetid : string) : Promise<TweetResponse>  =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/gettweet/v2/${tweetid}`) 
    const data = await res.json() ; 
    return data ; 
}

export const getReplies  = async (tweetid : string) : Promise<ReplyResponsee> =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/reply/${tweetid}`)
    const data = await res.json() ; 
    return data ; 
}

export const getUserbyUsername = async(username : string) : Promise<UserbyUsername> =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/getuser/v2/${username}`)
    const data = await res.json() ; 
    return data ; 
}

export const getTweetbyuserid = async(userid : string) : Promise<TweetResponselist> =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/tweet/${userid}`)
    const data  = await res.json()  ; 
    return data 
}



export const getUserFollowerbyuserid = async(userid : string) : Promise<FollowerResponse> =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/followers/${userid}`)
    const data  = await res.json()  ; 
    return data 
}




export const getUserFollowinguserid = async(userid : string) : Promise<FollowerResponse>  =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/following/${userid}`)
    const data  = await res.json()  ; 
    return data 
}

export const getUserBookmark = async(userid : string) : Promise<BookmarksREsponse> =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/bookmark/${userid}`)
    const data  = await res.json()  ; 
    return data 
}