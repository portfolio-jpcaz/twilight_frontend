import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { secureFetch } from "@/services/auth";
import { useCallback } from "react";

export function useSecureFetch() {
  const dispatch = useDispatch();
  const router = useRouter();

  // return a stable, memoized wrapper function for secureFetch
  return useCallback(
    (url, accessToken, init = {}) =>
      secureFetch(url, accessToken, init, dispatch, router),
    [dispatch, router]
  );
}
