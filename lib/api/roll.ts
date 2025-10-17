"use client";

import { useEffect, useState } from "react";

const USE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_MOCK_DATA === "true";

// * utility to switch between mock and real API
export const useApi = (endpoint: string, initialData: any) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let fetchedData = initialData;
    let success = false;

    try {
      // ** Attempt to fetch from the live API
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          `API call failed with status: ${response.status} for ${endpoint}`
        );
      }

      let responseData = await response.json();
      console.log("responseData fetchData:", responseData);
      if (
        endpoint.includes("/analytics") &&
        responseData &&
        responseData.analytics
      ) {
        fetchedData = responseData.analytics;
      } else {
        fetchedData = responseData;
      }
      success = true;
    } catch (error) {
      console.error(
        `Error fetching ${endpoint}: Fallback to mock data.`,
        error
      );

      // fetchedData = initialData;
    } finally {
      /*
      if (USE_MOCK_FALLBACK || !success) {
        const key = endpoint.includes("analytics") ? "analytics" : "defects";
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData(initialData);
      } else {
        setData(fetchedData);
      }
      */
      setData(fetchedData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading };
};
