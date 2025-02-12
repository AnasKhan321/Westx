
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
	interests: string;
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
	tweet : Tweet  , 
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
	tweet : Tweet  , 

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
	twitterId: string;
	verified: boolean;
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
