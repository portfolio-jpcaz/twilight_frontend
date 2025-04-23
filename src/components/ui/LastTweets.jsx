import styles from "./LastTweets.module.css"
import Tweet from "./Tweet";
export default function LastTweets({tweets}){

    
    return (
        <div className={styles.tweets}>
            {tweets.map( (tweet)=>(<Tweet key ={tweet.id} tweet={tweet}/>))}
        </div>
    )
}