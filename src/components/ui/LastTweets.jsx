"use client";
import styles from "./LastTweets.module.css";
import Tweet from "./Tweet";
import MsgModal from "./MsgModal";
import { usePollingData } from "@/hooks/usePollingData";
import { useEffect, useRef, useCallback } from "react";
import { lastTweets } from "@/services/tweets";
import { POLLING_FREQ_SECONDS } from "@/app/constants";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { usePathname } from "next/navigation";
export default function LastTweets({ hashtag, reload }) {
  const pathname = usePathname();

 
  const secureFetch = useSecureFetch();
  const tweetsRef = useRef([]);
  // keep track of the current hashtag
  const hashtagRef = useRef(null);

  // Async function for polling data (explicitly declared async for clarity)
  // We wrap fetchNewTweets in useCallback so that its reference only changes
  // when "hashtag" or "secureFetch" change.
  // This prevents unnecessary re-creation of the polling interval in the
  // usePollingData hook (which depends on fetchNewTweets in its dependencies).
  // Without useCallback, fetchNewTweets would be a new function at each render,
  // causing the polling to reset too often and potentially flooding the API.
  const fetchNewTweets = useCallback(
    async (accessToken) => {
      let lastTweetId;
      // during normal polling we keep track of the id of the latest tweet
      // if unchanged : no need to fetch new tweets
      //  lastTweetId need to be reset to zero when a new hashtag is selected
      // because the list of tweets needs to be filtered with the hashtag
      //  another case when it needs to be reset is when the user goes back to the Home page,
      // no filtering by hashtag: in both cases hashtag != hashtagRef.current
      const hashtagChanged = hashtag !== hashtagRef.current;

      if (hashtagChanged) {
        // reinit lastTweetId
        lastTweetId = 0;
        hashtagRef.current = hashtag; // keep track o the new hashtag
      } else {
        // no change : normal polling
        lastTweetId = tweetsRef.current[0]?.id || 0;
      }
      // Optionally pass hashtag or other params as needed
      return await lastTweets(
        { sinceTweet: lastTweetId, hashtag },
        accessToken,
        secureFetch
      );
    },
    [hashtag, secureFetch]
  );
  // Use the custom polling hook to get the latest tweets on a regular basis
  const {
    data: tweets,
    error,
    setData: setTweets,
    setError,
    refetch,
  } = usePollingData(fetchNewTweets, {
    interval: POLLING_FREQ_SECONDS * 1000,
    autoStart: true,
  });
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
