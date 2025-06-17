// authentication services that invoke the backend authentication routes
import { setAccessToken } from "@/reducers/userSlice";

// signup service : expected data are those of the signup form
// creates a new user on the backend side
// return { result : boolean, message : string }
export async function signup(data) {
  const signupURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`;
  try {
    const res = await fetch(signupURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    const response = { result: false, message: err.message };
    return response;
  }
}

// Login service : expected data are those of the signin form : username, password
// return { result : boolean, message : string }
export async function signin(data) {
  const signinURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signin`;
  try {
    const res = await fetch(signinURL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    const response = { result: false, message: err.message };
    return response;
  }
}
// logout service : disconnect the user
// returns { result:boolean, message: string in case of error}
export async function logout() {
  const logoutURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/logout`;
  try {
    const res = await fetch(logoutURL, {
      method: "POST",
      credentials: "include", // ⚠️ in order to include httponly cookies
    });
    return { result: res.status == 204 }; // 204 status expected in case of success
  } catch (err) {
    const response = { result: false, message: err.message };
    return response;
  }
}
// reset Password service : returns {  result, message }
// input : reset password token, new password
export async function newPassword(token, password) {
  const resetPasswordURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/reset-password`;
  // call the resetPassword route in secure mode (token verification)
  const response = await fetch(resetPasswordURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });
  return await response.json();
}

export async function forgotPassword(email) {
  const forgotPasswordURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/forgot-password`;
  const res = await fetch(forgotPasswordURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

// middleWare function that provides the jwt access token
// prior to calling a backend route. In case of expired token
// calls the refresh token route to get a new access token
// and calls the backend route again with the new token.
// returns the json decoded response of the route,
// or { result:false, message:'Session has expired, please login again.'}
// if refresh token did not work
// inputs
//    URL : the URL of the backend route to be called
//    accessToken : the current access token
//    init : the object containing the options of the http request
//    dispatch : object to be used to call reducer functions
export async function secureFetch(
  URL,
  accessToken,
  init = {},
  dispatch = null
) {
  if (typeof window === "undefined") {
    console.log("secureFetch called SERVER-SIDE !", URL);
  } else {
    console.log("secureFetch called CLIENT-SIDE !", URL);
  }
  try {
    // update the headers of the request to include the access token
    const headers = new Headers(init.headers || {});
    if (accessToken) {
      console.log ("access token : "+ accessToken);
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    // call the route
    let response = await fetch(URL, {
      ...init,
      headers,
      credentials: "include",
    });

    if (response.status !== 401) {
      // we'll handle the 401 status (unauthorized) separately
      // here we just add the status to the returned response
      const res = await response.json();
      return {
        status: response.status,
        ...res,
      };
    }

    // 401 status : Token has expired : try to refresh the token
    const refreshURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/refresh_token`;
    const refresh = await fetch(refreshURL, {
      method: "POST",
      credentials: "include", // to include the http only cookie
    });
    const refreshData = await refresh.json();

    if (refreshData.result && refreshData.accessToken) {
      // save the new acces token into the User reducer
      if (dispatch) {
        console.log ("saving new access token : "+refreshData.accessToken);
        dispatch(setAccessToken(refreshData.accessToken));
      }
      // update the headers with the new token and try to call the route again
      headers.set("Authorization", `Bearer ${refreshData.accessToken}`);
      const retryResponse = await fetch(URL, {
        ...init,
        headers,
        credentials: "include",
      });
      const retryRes = await retryResponse.json();
      return {
        status: retryResponse.status,
        ...retryRes,
      };
    } else {
      // refresh token failed
      return {
        status: 401,
        result: false,
        message: "Session has expired, please login again.",
      };
    }
  } catch (error) {
    return {
      status: 500,
      result: false,
      message: error.message,
    };
  }
}
