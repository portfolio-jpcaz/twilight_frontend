'use client';
import TweetZone from "@/components/ui/TweetZone";
import { useParams } from 'next/navigation';


export default function Hashtags() {
   const params = useParams(); 
   const hashtag = "#"+params.tag;
   return(
    <TweetZone title={"Hashtag"} hashtag= {hashtag}></TweetZone>
  );
}
