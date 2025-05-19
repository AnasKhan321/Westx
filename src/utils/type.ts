import { SupabaseTweet } from "../ReusableComponents/SupabaseTweet";

export interface Message {
	sender: string;
	content: string;
  }
  export type Tweet = {
	id: string;
	text: string | null;
	userId: string;
	user: User; // Assuming 'User' is a defined type
	image: string | null;
	postType: "AI" | "USER"; // Assuming 'PostType' is an enum
	parentTweetId: string | null;
	parentTweet: Tweet | null; // Nullable, as it could be a reply
	replies: Tweet[]; // Array of replies (self-referencing)
	originalTweetId: string | null;
	originalTweet: Tweet | null; // Nullable, for reposts
	reposts: Tweet[]; // Array of reposts (self-referencing)
	bookmarks: BookMark[]; // Assuming 'BookMark' is a defined type
	likes: Like[]; // Assuming 'Like' is a defined type
	tweettype: "TWEET" | "REPLY" | "REPOST"; // Assuming 'PostType2' is an enum
	createdAt: Date;
	updatedAt: Date | null;
  };
  

export type Tweet2 = {
	id: string;
	userId : string ; 
	text: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	image: string | null;
	postType: 'USER' | 'AI';
    user : User;
};




export type ImageData = {
	src: string;
	alt: string;
};

export type ImagesPreview = (ImageData & {
	id: string;
})[];


export interface User {
	id: string;
	bio: string;
	name: string;
	theme: string;
	accent: string;
	website: string;
	location: string;
	geoLocation: Location;
	username: string;
	photoURL: string;
	twitterId: string;
	verified: boolean;
	isActive: boolean;
	isPremium: boolean;
	isToken : boolean;
	level : Level , 
	Points : number , 
	publicKey : string | null;
	interests: string;
	creator : string | null;
	oauthToken: string;
	followers: followings[];
	followings: followings[];
	totalTweets: number;
	totalPhotos: number;
	pinnedTweet: string;
	createdAt: Date;
	updatedAt: Date;
	coverPhotoURL: string | null;
	oauthTokenSecret: string;
	tweets : Tweet[]  , 
	bookmarks  : BookMark[] , 
	replies : Reply[]  , 
	Repost : Repost[]  , 
	likes : Like[]
};

enum Level {
	LEVEL_0,
	LEVEL_1,
	LEVEL_2 ,
	LEVEL_3,
	LEVEL_4 ,
	LEVEL_5 
}

export interface followings {

		id       :     string 
		followerid   :  string
		followingid :  string
	
	  
}

type Location = {
	latitude: string;
	longitude: string;
};

export interface BookMark{
	id  : string , 
	userid : string , 
	user : User , 
	tweetid  : string, 
	tweet : SupabaseTweet  , 
	createdAt: Date;
	updatedAt: Date;
}

export interface Reply  {
	id  : string , 
	userid : string , 
	user : User , 
	tweetid  : string | null , 
	tweet : Tweet , 
	createdAt: Date,
	updatedAt: Date,
	content : string,
	children  : Reply[]  , 
	parent : Reply, 
	parentId : string  | null,
	likes    : Like[]      // Allow likes on replies
	bookmarks :BookMark[]  // Allow bookmarks on replies
	reposts  : Repost[]
}

export interface Repost{
	id  : string , 
	userid : string , 
	user : User , 
	tweetid  : string | undefined, 
	tweet : Tweet | undefined , 
	replyid : string | undefined , 
	reply : Reply | undefined
	createdAt: Date;
	updatedAt: Date;
}


export interface Like{
	id  : string , 
	userid : string , 
	user : User , 
	tweetid  : string, 
	Tweet : SupabaseTweet  , 

	createdAt: Date;
	updatedAt: Date;
}





export interface User2 {
	id: string;
	bio: string;
	name: string;
	theme: string;
	accent: string;
	website: string;
	location: string;
	geoLocation: Location;
	username: string;
	photoURL: string;
	level : Level , 
	Points : number , 
	twitterId: string;
	isToken : boolean;
	publicKey : string | null;
	verified: boolean;
	creator : string | null;
	isActive: boolean;
	isPremium: boolean;
	interests: string;
	oauthToken: string;
	totalTweets: number;
	totalPhotos: number;
	pinnedTweet: string;
	createdAt: Date;
	updatedAt: Date;
	coverPhotoURL: string | null;
	oauthTokenSecret: string;
};


export type Theme = 'light' | 'dim' | 'dark';
export type Accent = 'blue' | 'yellow' | 'pink' | 'purple' | 'orange' | 'green';


export interface Token {
	name: string;
	symbol: string;
	description: string;
	tokenMint: string;
	creator: string;
	uri: string;
	isCompleted: boolean;
	isMigrated: boolean;
	totalSupply: string;
	targetSol: string;
	currentSupply: string;
	currentSol: string;
	image_uri: string;
	twitter: string | null;
	website: string | null;
	telegram: string | null;
	bonding_curve: string;
	associated_bonding_curve: string;
	raydium_pool: string | null;
	market_cap: number;
	status: string;
	createdAt: string;
	updated_at: string;
	confirmedAt: string;
	last_trade_timestamp: string;
	id: string;
  }