// calls to backend services related to tweets
import { secureFetch } from "./auth";
import { NB_MAX_TWEETS } from "@/app/constants";
// creation of a new tweet
export async function newTweet(message, accessToken, dispatch) {
  // call to the "/tweets/new" backend route
  const newTweetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tweets/new`;
  const data = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  };
  
  // secured call with verification of access token
  const res = await secureFetch(newTweetURL, accessToken,data,dispatch);
  return res;
}
// get the nbMaxTweets latest tweets data, if new tweets have been published since the tweet with
// id : sinceTweet. if sinceTweet = 0 then the nbMaxTweets latest tweets are returned irrespective 
// of when they have been published.
export async function lastTweets(accessToken, dispatch, sinceTweet=0, nbMaxTweets=NB_MAX_TWEETS) {
  const lastTweetsURL =`${process.env.NEXT_PUBLIC_BACKEND_URL}/tweets?since=${sinceTweet}&nbMaxTweets=${nbMaxTweets}`;
  const res = await secureFetch(lastTweetsURL,accessToken,{},dispatch );
  return res;
}