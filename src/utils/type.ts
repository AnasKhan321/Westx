
export interface Message {
	sender: string;
	content: string;
  }
export type Tweet = {
	id: string;
	type: 'tweet' | 'comment';
	tweetId: string;
	createdBy: string;
	text: string | null;
	userLikes: string[];
	userReplies: number;
	createdAt: Date;
	userRetweets: string[];
	updatedAt: Date | null;
	image: string | null;
	postedBy: 'user' | 'assistant';
	parent: { id: string; username: string } | null;
    user : User;
	bookmarks  : BookMark[] , 
	replies : Reply[]  , 
	repost : Repost[]  , 
	likes : Like[]

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
	tweetid  : string , 
	tweet : Tweet , 
	createdAt: Date;
	updatedAt: Date;
}

export interface Reply extends BookMark {
	content : string,
	children  : Reply[]  , 
	parentId : string  | null
}

export interface Repost{
	id  : string , 
	userid : string , 
	user : User , 
	tweetid  : string , 
	tweet : Tweet , 
	createdAt: Date;
	updatedAt: Date;
}


export interface Like{
	id  : string , 
	userid : string , 
	user : User , 
	tweetid  : string , 
	tweet : Tweet , 
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
