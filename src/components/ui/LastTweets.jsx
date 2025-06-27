"use client";
import styles from "./LastTweets.module.css";
import Tweet from "./Tweet";
import MsgModal from "./MsgModal";

import { useState, useEffect, useRef } from "react";
import { lastTweets } from "@/services/tweets";
import { useDispatch, useSelector } from "react-redux";
import { POLLING_FREQ_SECONDS } from "@/app/constants";
import { useRouter } from "next/navigation";
import { useSecureFetch } from "@/hooks/useSecureFetch";

export default function LastTweets({ hashtag , reload}) {
  console.log('LastTweets mounted with reload=', reload);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);
  const accessToken = useSelector((state) => state.user.accessToken);
  const secureFetch= useSecureFetch();
  // a reference to the tweets state that is kept up to date on each tweets state change
  const tweetsRef = useRef([]);
  // a reference to the intervalID of the setInterval(). In case of an error,
  // ability to get and clear the interval to avoid repeated display of the message
  const intervalRef = useRef(null);

  // a reference to the access token of the logged in user: to get the
  // updated version in case of refresh
  const accessTokenRef = useRef(accessToken);
  // function that gets the list of the latest tweets from the backend
  const fetchNewTweets = async () => {
    
      // need the up-to-date "latest tweet Id" in order the change the tweets list"
      // only if new tweets have arrived, hence the use of tweetRef
      const lastTweetId = tweetsRef.current[0]?.id || 0;
      // pass the up-to-date value of the access token (vs accessToken : initial value at component loading)
      
      const res = await lastTweets(
        {sinceTweet:lastTweetId},
        accessTokenRef.current,
        secureFetch
      );
      if (!res.result) {
        setError(res.message); // display the error in a modal dialog
        if (intervalRef.current) {
          // error : stop the setInterval
          clearInterval(intervalRef.current);
        }
      }
      if (res.result && res.lastTweets.length) {
        // new Tweets to be displayed
        setTweets(res.lastTweets);
      }
    };
  // Sync accessToken ref with the latest value
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);
  useEffect(() => {
    tweetsRef.current = tweets;
  }, [tweets]);

 
 
  // on component initialisation get the last tweets from the backend and then
  // on a regular basis update this list (using setInterval)
  useEffect(() => {
    
    // get the initial list of tweets
    fetchNewTweets();
    // poll for new tweets on a regular basis
    intervalRef.current = setInterval(
      fetchNewTweets,
      POLLING_FREQ_SECONDS * 1000
    );

    return () => clearInterval(intervalRef.current);
  }, []);
  // each time a new tweet is created, reload the list of tweets
  useEffect(()=>{
    console.log('useEffect [reload] fired, reload=', reload);
    fetchNewTweets();}, [reload]);

  function handleDeleteTweet(id) {
    setTweets((tweets) => tweets.filter((t) => t.id != id));
  }
  return (
    <div className={styles.tweets}>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} onDelete={handleDeleteTweet} onError={setError} />
      ))}
      <MsgModal
        isOpen={error}
        setMsg={setError}
        title="Last Tweets"
        message={error}
      />
    </div>
  );
}
