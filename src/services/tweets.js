// calls to backend services related to tweets
import { NB_MAX_TWEETS } from "@/app/constants";
// creation of a new tweet
export async function newTweet({message}, accessToken, secureFetch) {
  // call to the "/tweets/new" backend route
  const newTweetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tweets/new`;
  const data = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  };
  
  // secured call with verification of access token
  const res = await secureFetch(newTweetURL, accessToken,data);
  return res;
}
// get the nbMaxTweets latest tweets data, if new tweets have been published since the tweet with
// id : sinceTweet. if sinceTweet = 0 then the nbMaxTweets latest tweets are returned irrespective 
// of when they have been published.
export async function lastTweets( { sinceTweet=0, hashtag, nbMaxTweets=NB_MAX_TWEETS }, accessToken,secureFetch) {
  let lastTweetsURL =`${process.env.NEXT_PUBLIC_BACKEND_URL}/tweets?since=${sinceTweet}&nbMaxTweets=${nbMaxTweets}`;
  // add hashtag filter to the URL: remove the # prefix
  if (hashtag) lastTweetsURL += `&hashtag=${encodeURIComponent(hashtag.replace(/^#/, ''))}`;
  const res = await secureFetch(lastTweetsURL,accessToken,{} );
  return res;
}

// delete the tweet with Id twwetID
export async function deleteTweet({tweetId}, accessToken, secureFetch){
  const delTweetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tweets/${tweetId}`;
  const res = await secureFetch(delTweetURL, accessToken,{method:'DELETE'});
  return res;
}

// if the input tweet ("tweetId" is the id of the tweet) is liked ("isLiked"=true)
// then removes the like, else add a like to the tweet from the logged in user
// id of logged in user can be obtained from the access token
export async function toggleLike({tweetId,isLiked},accessToken,secureFetch){
  const tweetLikeURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tweets/${tweetId}/like`;
  const method = isLiked?'DELETE':'POST';
  const res = await secureFetch(tweetLikeURL, accessToken, {method})
  return res;
}