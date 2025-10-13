import { useEffect, useState } from "react";
// import { BASE_API_URL, MOCK_ROLL_ID } from '../constants';

// * utility to switch between mock and real API
export const useApi = (endpoint: any, initialData: any) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // const response = await fetch(`${BASE_API_URL}/${MOCK_ROLL_ID}/${endpoint}`);
      // const result = await response.json();

      // * simulates network latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (endpoint === "analytics") setData(initialData.analytics);
      if (endpoint === "defects") setData(initialData.defects);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading };
};
