import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { secureFetch } from "@/services/auth"

export function useSecureFetch() {
  const dispatch = useDispatch();
  const router = useRouter();

  // return a wrapper function for secureFetch
  return (url, accessToken, init = {}) =>
    secureFetch(url, accessToken, init, dispatch, router);
}