import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
/**
 * Custom React hook to poll data from an async function at regular intervals.
 * Handles accessToken via Redux, error management, manual refetch, and cleanup.
 * 
 * On each poll, the hook updates local React state with the new data,
 * which causes the component using the hook to re-render automatically
 * with the latest data.
 * 
 * @param {Function} fetchFunction - Async function to fetch data. Must accept accessToken as first arg.
 * @param {Object} options -  settings.
 * @param {number} options.interval - Polling frequency in ms .
 * @param {boolean} options.autoStart - Whether to start polling automatically.
 * @returns {Object} { data, error, refetch, setData, setError }
 *    - data: The last value fetched from your async function. Whenever data changes,
 *           your component will re-render to display the latest result.
 *   - error: An error message string, or null. Set if the latest fetch failed.
 *           Use this to display an error message or a modal in your UI.
 *   - refetch: A function you can call to manually trigger a new fetch, for example after
 *           creating or deleting an item, or when the user clicks a “Refresh” button.
 *   - setData: A setter function to manually override the data state (for advanced cases,
 *           such as optimistic updates).
 *   - setError: A setter function to manually set or clear the error state, for example
 *           after dismissing an error message.
 */
export function usePollingData(
  fetchFunction,
  { interval , autoStart } = {}
) {
  // Get accessToken from Redux store (e.g., state.user.accessToken)
  const accessToken = useSelector((state) => state.user.accessToken);

  // Store accessToken in a ref to always get the latest value inside async functions
  const accessTokenRef = useRef(accessToken);
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // State to hold fetched data and error messages
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Ref to store the interval ID for polling
  const intervalRef = useRef(null);

  /**
   * Fetch new data using fetchFunction and update state.
   * If an error occurs, polling stops and the error is set.
   */
  const fetchData = async () => {
    try {
      // Always use the latest accessToken via ref
      const res = await fetchFunction(accessTokenRef.current);
      if (res.result) {
        if (res.data.length) setData(res.data);
        setError(null);
      } else {
        setError(res.message);
        // Stop polling if error
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (err) {
      setError("Unknown error : "+ err.message);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  // Start polling on mount (if autoStart), and cleanup on unmount
  useEffect(() => {
    if (!autoStart) return;
    fetchData(); // Initial fetch
    intervalRef.current = setInterval(fetchData, interval);
    return () => clearInterval(intervalRef.current);
    // 
  }, [autoStart, interval, fetchFunction]); 
// IMPORTANT: fetchFunction is included in the dependency array.
// This ensures the polling interval always uses the latest fetchFunction,
// which may capture updated props or variables (like filters, tokens, etc.).
// If fetchFunction is omitted from dependencies, the polling could call
// a stale function and not react to changes in its closure (e.g. updated hashtag).

  // Manual refetch (can be used after actions, or for a refresh button)
  const refetch = fetchData;

  // Expose data, error, setters and manual refetch
  return { data, error, setData, setError, refetch };
}