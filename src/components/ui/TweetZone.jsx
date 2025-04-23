import TweetEditor from "./TweetEditor";
import LastTweets from "./LastTweets";
export default function TweetZone({title, tweets, hashtag}){
 return (
    <div>
      <h2 className="txt-primary-color font-text txt-large">{title}</h2>
      <TweetEditor hashtag={hashtag}/>
      <LastTweets tweets={tweets}/>
    </div>
  );
};