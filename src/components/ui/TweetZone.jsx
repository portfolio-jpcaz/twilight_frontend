"use client";
import TweetEditor from "./TweetEditor";
import LastTweets from "./LastTweets";


// component that defines the middle area of the screen
// includes a title, a TweetEditor and a lastTweets component
// contains the displayed tweets data as a state.
export default function TweetZone({ title, hashtag }) {
 
  return (
    <div>
      <h2 className="txt-primary-color font-text txt-large">{title}</h2>
      <TweetEditor hashtag={hashtag} />
      <LastTweets />
    </div>
  );
}
