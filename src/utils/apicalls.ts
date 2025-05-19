import { SupabaseTweet } from "../ReusableComponents/SupabaseTweet";
import { followings, Like, Tweet, User, User2 } from "./type";
import axios  from "axios";
export interface UserResponse{
    success : boolean , 
    data : User
}


interface TweetDetail {
    success : boolean ,
    data : SupabaseTweet
}

export interface Followings {
    id: string,
    followerid: string,
    followingid: string,
    createdAt: Date;
	updatedAt: Date;
    following : User
}

export interface Followings2 {
    id: string,
    followerid: string,
    followingid: string,
    createdAt: Date;
	updatedAt: Date;
    follower : User
}

interface Followingresponse{
    success : boolean , 
    data : Followings[]
}


interface Followingresponse2{
    success : boolean , 
    data : Followings2[]
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





interface UserbyUsername {
    success : boolean , 
    data : User2
}
interface FollowerResponse {
    success : boolean , 
    data : followings[]
}



export interface TweetResponselist2{
    success : boolean , 
    data : Tweet[] , 
    tweets : number
}





export interface UserLikesResponse{
    success : boolean , 
    data : Like[]  , 
    hasMore : boolean
}

interface UserReposts {
    success : boolean , 
    data : Tweet[]
}




interface TrendingRespnse {
    success : boolean , 
    data : {
        trendingKeywords : string[] , 
        trendingTweets : Tweet[] , 
        trendingReposts : Tweet[] 
    }
}




//using
export const getPersonas = async () => {

    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/allusers`) ; 
    const data : Personas = await res.json();
    if(data.success){
        return data ; 
    }else{
        throw new Error("Error fetching data")
    }
}




//using
export const getTweetDetail  = async(id : string) : Promise<TweetDetail> => {
    const res = await  fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/tweet/gettweet/${id}`)
    const data = await res.json();

    return data ; 
}



//using
export const searchUser = async(query : string) : Promise<userresponse>  =>{
    const res = await  fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/search/${query}`)
    const data = await res.json()
    return data
}





// using
export const getUserbyUsername = async(username : string) : Promise<UserbyUsername> =>{
    const {data} = await axios.get<UserbyUsername>(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/getuser/v2/${username}`)
    return data ; 
}



//using
export const getUserFollowerbyuserid = async(userid : string) : Promise<FollowerResponse> =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/following/${userid}`)
    const data  = await res.json()  ; 
    return data 
}






//using
export const getUserFollowinguserid = async(userid : string) : Promise<FollowerResponse>  =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/follower/${userid}`)
    const data  = await res.json()  ; 
    return data 
}

//using
export const getUserFollowing = async(userid : string) : Promise<Followingresponse> =>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/following/${userid}`)
    const data  = await res.json()  ; 
    return data 
}

//using
export const getUserFollower = async(userid : string)  : Promise<Followingresponse2>=>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/follower/${userid}`)
    const data  = await res.json()  ; 
    return data 
}


//using
export const getUserLikes  = async(userid : string) : Promise<UserLikesResponse>=>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/alllikes/${userid}/1`)
    const data  = await res.json()  ; 
    return data 
}



//using

export const getUserReposts  = async(userid : string) : Promise<UserReposts>=>{
    const res  = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/allreposts/${userid}/1`)
    const data  = await res.json()  ; 
    return data 
}

//using


//using

export const getTrending = async() : Promise<TrendingRespnse> =>{
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/trending`)
    const data = await res.json() ; 
    return  data  ;
}