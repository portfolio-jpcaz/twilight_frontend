"use client";
import TweetEditor from "./TweetEditor";
import LastTweets from "./LastTweets";
import MsgModal from "./MsgModal";

import { useState, useEffect, useRef } from "react";
import { lastTweets } from "@/services/tweets";
import { useDispatch, useSelector } from "react-redux";
import { POLLING_FREQ_SECONDS } from "@/app/constants";

// component that defines the middle area of the screen
// includes a title, a TweetEditor and a lastTweets component
// contains the displayed tweets data as a state.
export default function TweetZone({ title, hashtag }) {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);
  const accessToken = useSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();
  // a reference to the tweets state that is kept up to date on each tweets state change
  const tweetsRef = useRef([]);
  // a reference to the intervalID of the setInterval(). In case of an error,
  // ability to get and clear the interval to avoid repeated display of the message
  const intervalRef = useRef(null);

  // a reference to the access token of the logged in user: to get the
  // updated version in case of refresh
  const accessTokenRef = useRef(accessToken);
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
    console.log("useEffect (fetchNewTweets) lancé côté CLIENT");
    const fetchNewTweets = async () => {
      // need the up-to-date "latest tweet Id" in order the change the tweets list"
      // only if new tweets have arrived, hence the use of tweetRef
      const lastTweetId = tweetsRef.current[0]?.id || 0;
      // pass the up-to-date value of the access token (vs accessToken : initial value at component loading)
      const res = await lastTweets(accessTokenRef.current, dispatch, lastTweetId);
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
    // get the initial list of tweets
    fetchNewTweets();
    // poll for new tweets on a regular basis
    intervalRef.current = setInterval(
      fetchNewTweets,
      POLLING_FREQ_SECONDS * 1000
    );

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <h2 className="txt-primary-color font-text txt-large">{title}</h2>
      <TweetEditor hashtag={hashtag} />
      <LastTweets tweets={tweets} />
      <MsgModal
        isOpen={error}
        setMsg={setError}
        title="Get Latest Tweets"
        message={error}
      />
    </div>
  );
}
