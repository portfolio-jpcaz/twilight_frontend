"use client";
import { useState } from "react";
import {MAX_TWEET_LENGTH} from "@/app/constants"
import styles from "./TweetEditor.module.css"
import { useSelector, useDispatch } from "react-redux";
import MsgModal from "./MsgModal";
import { newTweet } from "@/services/tweets";
import { useRouter } from "next/navigation";

// input box to enter a new tweet, contains a character counter 
// and a Tweet button to validate.
// if this component is used in a /hashtags page then there is only an
// input box with a preset value : the passed hashtag
export default function TweetEditor ({hashtag}) {
    const [counter, setCounter]=useState(0);
    const [message, setMessage]=useState(!hashtag?"":hashtag);
    const ctrlsVisible = (hashtag == undefined);
    const [error, setError]= useState(null);
    const dispatch= useDispatch();
    const router = useRouter();
    const accessToken = useSelector((state)=> state.user.accessToken);
      
    const handleChange = (e) => {
        const nbChars = e.target.value.length;
        setMessage(e.target.value.slice(0,MAX_TWEET_LENGTH));
        setCounter(Math.min(nbChars,MAX_TWEET_LENGTH));
    }
    const handleClick = async ()=>{
        // create a new tweet with the entered message
        const response = await newTweet(message,accessToken,dispatch,router);
        if (response.result){
            // success : reinit the tweet editor
            setMessage("");
            setCounter(0);
        } else {
            setError(response.message);
        }


    }
    return (
        <div className={styles.tweetEditor}>
            <input
            className="font-text txt-primary-color"
            type="text"
            name="TweetInput"
            placeholder="What's Up?"
            value={message}
            onChange={handleChange}
            ></input>
            <div className={styles.tweetEditorControls} style={{display:ctrlsVisible? 'flex':'none'}}>
                <span className="font-text txt-small txt-primary-color">{counter}/{MAX_TWEET_LENGTH}</span>
                <button className="btn btn-primary" onClick={handleClick}>Tweet</button>
            </div>
            <MsgModal
                isOpen={error}
                setMsg={setError}
                title= "Tweet Creation Error"
                message={error}
            />
        </div>
    );
} ;