"use client";
import TweetEditor from "./TweetEditor";
import LastTweets from "./LastTweets";
import { useState } from "react";

// component that defines the middle area of the screen
// includes a title, a TweetEditor and a lastTweets component
// contains the displayed tweets data as a state.
export default function TweetZone({ title, hashtag }) {
  const [ reloadFlag, setReloadFlag ]= useState(false);
  console.log('TweetZone: reloadFlag', reloadFlag);
  return (
    <div>
      <h2 className="txt-primary-color font-text txt-large">{title}</h2>
      <TweetEditor hashtag={hashtag} onNewTweet={()=>setReloadFlag(!reloadFlag)}/>
      <LastTweets hashtag={hashtag} reload={reloadFlag}/>
    </div>
  );
}
