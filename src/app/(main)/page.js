import TweetEditor from "@/components/ui/TweetEditor";
import LastTweets from "@/components/ui/LastTweets";
import TweetZone from "@/components/ui/TweetZone";

export default function Home() {
  const tweets = [
    {
      id: 1,
      author: { user: "jpcaz", firstName: "Jean-Pierre" },
      message: "bonjour Fleurieu #valdesaone il fait beau!🤣",
      since: "2h30",
      likesCounter: 10,
      liked: false,
    },
    {
      id: 2,
      author: { user: "awp", firstName: "Yvonne" },
      message: "merde à celui qui le lit #vulgaire #fun",
      since: "5h30",
      likesCounter: 1,
      liked: true,
    },
  ];
  return (
    <TweetZone title={"Home"} tweets={tweets}></TweetZone>
  );
}
