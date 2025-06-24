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

export async function refreshToken() {
  try {
    const refreshURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/refresh_token`;
    const response = await fetch(refreshURL, {
      method: "POST",
      credentials: "include", // to include the http only cookie
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      result: false,
      message: error.message || "Error while refreshing token",
    };
  }
}
/**
 * Middleware function that provides the JWT access token
 * prior to calling a backend route at the given URL.
 * In case of expired token:
 *   - Calls the refresh token route to get a new access token,
 *   - Retries the backend route again with the new token.
 * Returns the JSON-decoded response of the route.
 * If the refresh token does not work, returns
 *   { result: false, message: 'Session has expired, please login again.' }
 * and redirects the user to the login page.
 *
 * @param {string} URL         The URL of the backend route to be called.
 * @param {string} accessToken The current access token.
 * @param {object} init        The options for the HTTP request (optional).
 * @returns {Promise<object>}  The JSON-decoded response of the backend route.
 */
export async function secureFetch(
  URL,
  accessToken,
  init = {},
  dispatch = null,
  router = null
) {
  try {
    // update the headers of the request to include the access token
    const headers = new Headers(init.headers || {});
    if (accessToken) {
      console.log("access token : " + accessToken);
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
    const refreshData = await refreshToken();

    if (refreshData.result && refreshData.accessToken) {
      // save the new acces token into the User reducer
      if (dispatch) {
        console.log("saving new access token : " + refreshData.accessToken);
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
      // refresh token failed - redirect to the login page
      if (router) router.push("/auth");
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
