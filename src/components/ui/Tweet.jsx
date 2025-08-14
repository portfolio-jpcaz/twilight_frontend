"use client"
import { EGG_PATH } from "@/app/constants";
import Image from "next/image";
import styles from "./Tweet.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useSelector } from "react-redux";
import { deleteTweet, toggleLike } from "@/services/tweets";
import { useSecureFetch } from "@/hooks/useSecureFetch";
// tweet component :
// contains :
export default function Tweet({tweet, onDelete, onError}) {
  const { id, author, message, since, nbLikes, liked }=tweet;
  const [isLiked, setLiked]= useState(liked);
  const [likesCount, setLikesCount] = useState(Number(nbLikes));
  const secureFetch =useSecureFetch();
  const loggedInUser = useSelector(state=>state.user.user.id);
  const accessToken = useSelector(state=> state.user.accessToken);
  //console.log(`author.id = ${author.id} `);
  const isAuthor = (author.id == loggedInUser);
  const handleHashtagClick = (hashtag)=>{
    console.log(`${hashtag} clicked`);
    // redirect to the Trends page
  }
  const renderMessage = (text) => {
    return text.split(/(\#\w+)/g).map((part, index) => {
      let htmlPart = null;
      if (part) {
        htmlPart = part.startsWith("#") ? (
          <span key={index}
           className={styles.hashtag}
           onClick={(event)=> handleHashtagClick(event.target.textContent)}
           >
            {part}
          </span>
        ) : (
          part
        );
      }
      return htmlPart;
    });
  };
  const handleDelete = async ()=>{
    // call the secured backend route that deletes the tweet
    const res= await deleteTweet({tweetId:id}, accessToken,secureFetch );
    if ( res.status == 200){
      // succesful destruction - refresh the list of tweets
      onDelete(id);
    } else {
      onError(res.message);
    }
    return;
  }

  const handleLike = async ()=>{
    // call the secured backend route to update the list of users that like the tweet
    const res = await toggleLike({tweetId:id,isLiked}, accessToken,secureFetch);
    if (res.status == 200){
      setLikesCount(likesCount + (isLiked? -1 : 1));
      setLiked(!isLiked); // this call changes the color of the heart icon
    }  else {
      onError(res.message);
    }
    
  }
  const getHeartStyle = (isLiked, isAuthor) =>{
    const style = {};
    if (isLiked) { style.color="red"} ;
    if ( isAuthor){   
      style.opacity = 0.4;
      style.cursor = "not-allowed";
    } else {
      style.cursor="pointer";
    }
    return style
  };

  return (
    <div className={styles.tweet}>
      <div className={styles.tweetLine1}>
        <Image
        className={styles.avatar}
          src={EGG_PATH}
          alt="Twitter-like egg logo"
          width={40}
          height={40}
        />
        <span className="font-text txt-small txt-primary-color text-bold">
          {author.firstName}
        </span>
        <span className="font-text txt-small txt-greyed-color">@{author.username} - {since}</span>
      </div>
      <p className="font-text txt-small txt-primary-color">{renderMessage(message)}</p>
      <div className={styles.tweetLine3}>
        <FontAwesomeIcon 
          icon={faHeart} 
          className="txt-small txt-primary-color"
          style= {getHeartStyle(isLiked,isAuthor)}
          onClick ={(isAuthor)?null:handleLike}
          aria-label={(isLiked ? "liked":"Not liked")+ "by logged in User"} 
          />
        <span className="font-text txt-primary-color txt-small">{likesCount}</span>
        <FontAwesomeIcon
        className="txt-primary-color txt-small"
        icon={faTrash}
        aria-label="delete this tweet"
        onClick={(isAuthor)? handleDelete:undefined}
        style={!isAuthor ? { opacity: 0.4, cursor: "not-allowed" } : {cursor:"pointer"}}
         />
      </div>
    </div>
  );
}
