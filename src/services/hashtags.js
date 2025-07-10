
// services functions : calls to the backend routes related to hashtags

// get the latest and most trendy hashtags
// in principle should return {result:true, hashtags:[{hashtag:string, count:number}]}
export async function  lastHashtags(accessToken, secureFetch) {
    const getHashtagsURL =`${process.env.NEXT_PUBLIC_BACKEND_URL}/hashtags`;
    const res = await secureFetch(getHashtagsURL,accessToken, {})
    return res;
}