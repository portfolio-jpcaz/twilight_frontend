"use client";
import styles from "./LastTweets.module.css";
import Tweet from "./Tweet";
import MsgModal from "./MsgModal";
import { usePollingData } from "@/hooks/usePollingData";
import { useEffect, useRef } from "react";
import { lastTweets } from "@/services/tweets";
import { POLLING_FREQ_SECONDS } from "@/app/constants";
import { useSecureFetch } from "@/hooks/useSecureFetch";

export default function LastTweets({ hashtag, reload }) {
  const secureFetch = useSecureFetch();
  const tweetsRef = useRef([]);

  // Async function for polling data (explicitly declared async for clarity)
  const fetchNewTweets = async (accessToken) => {
    const lastTweetId = tweetsRef.current[0]?.id || 0;
    // Optionally pass hashtag or other params as needed
    return await lastTweets(
      { sinceTweet: lastTweetId, hashtag },
      accessToken,
      secureFetch
    );
  };

  // Use the custom polling hook to get the latest tweets on a regular basis
  const {
    data: tweets,
    error,
    setData: setTweets,
    setError,
    refetch,
  } = usePollingData(fetchNewTweets, { interval: POLLING_FREQ_SECONDS * 1000, autoStart:true });
  // Keep the ref always in sync with latest data for polling
  tweetsRef.current = tweets;

  // Optional: refetch when reload flag changes (after new tweet, etc.)
  useEffect(() => {
    if (reload) refetch();
  }, [reload, refetch]);

  function handleDeleteTweet(id) {
    setTweets((tweets) => tweets.filter((t) => t.id != id));
  }

  return (
    <div className={styles.tweets}>
      {tweets.length === 0 ? (
        <p>No tweets to display yet.</p>
      ) : (
        tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweet={tweet}
            onDelete={handleDeleteTweet}
            onError={setError}
          />
        ))
      )}
      <MsgModal
        isOpen={error}
        setMsg={setError}
        title="Last Tweets"
        message={error}
      />
    </div>
  );
}
