"use client";
import styles from "./Trends.module.css";
import {lastHashtags} from "@/services/hashtags";
import { usePollingData } from "@/hooks/usePollingData";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import MsgModal  from "./MsgModal";
import { POLLING_FREQ_SECONDS } from "@/app/constants";
import { useRouter } from "next/navigation";
import { useCallback} from "react";
// components that shows the most trendy hashtags in the recent tweets
export default function Trends() {

  const secureFetch = useSecureFetch();
  const router= useRouter();
  const fetchHashtags = useCallback ( async (accessToken) => {
    console.log("fetchHashtags called", Date.now());
    return await lastHashtags(accessToken, secureFetch);
  },[secureFetch]);
  
  // Use the custom polling hook to get the latest tweets on a regular basis
  const {
    data: trends,
    error,
    setData: setTrends,
    setError,
    refetch,
  } = usePollingData(fetchHashtags, { interval: POLLING_FREQ_SECONDS * 1000 , autoStart:true});
  
  // hashtag clicked : filter the tweets with this hashtag 
  // switch to the /hashtags/[tag] URL where tag is the clicked hashtag without the # prefix
  const handleClick = (event) => {
    console.log(`hashtag : ${event.target.textContent} clicked`);
    const hashtag = event.target.textContent.slice(1);// slice(1) to remove the # prefix
    const newURL= `/hashtags/${hashtag}`
    router.push(newURL);

  };
  return (
    <div>
      {trends.map((trend, index) => (
        <div key={index}>
          <p
            className={`font-text txt-small txt-primary-color text-bold ${styles.hashtag}`}
            onClick={handleClick}
          >
            {trend.hashtag}
          </p>
          <p className="font-text txt-small txt-greyed-color">
            {trend.count} Tweet{trend.count > 1 ? "s" : ""}
          </p>
        </div>
      ))}
      <MsgModal
        isOpen={error}
        setMsg={setError}
        title="Trends"
        message={error}
      />
    </div>
  );
}
