"use client";

import { createContext, useContext, useState } from "react";

import { useApi } from "../api/roll";
import { COLOR_MAP } from "../constants";
// import { mockAnalytics, mockDefects } from "../mock-data";

const MOCK_ROLL_ID = 1; // ** the ID of the roll seeded in the DB
const API_BASE_URL = "http://localhost:3000/v1/rolls";

interface AnalyticsResult {
  type: string;
  count: number;
  avgTimestamp: number;
}

interface DefectContextType {
  analytics: AnalyticsResult[];
  defectsOnMap: any[];

  selectedDefectType: any;
  setSelectedDefectType: any;
  loading: boolean;
  COLOR_MAP: any;
}

const DefectContext = createContext<DefectContextType | undefined>(undefined);

export const DefectProvider = ({ children }: any) => {
  const { data: analytics, loading: loadingAnalytics } = useApi(
    `${API_BASE_URL}/${MOCK_ROLL_ID}/analytics`,
    // mockAnalytics // The useApi hook expects { analytics: [] } or similar, but since we updated it, we pass the raw data here.
    null
  );
  console.log("data from api analytics:", analytics);

  // 2. API for Defect Map (Raw Defects)
  const { data: defectsOnMap, loading: loadingDefects } = useApi(
    `${API_BASE_URL}/${MOCK_ROLL_ID}/defects`,
    // mockDefects
    null
  );
  console.log("data from api defectsOnMap:", defectsOnMap);

  const [selectedDefectType, setSelectedDefectType] = useState(null);

  const value = {
    analytics,
    defectsOnMap,
    selectedDefectType,
    setSelectedDefectType,
    loading: loadingAnalytics || loadingDefects,
    COLOR_MAP,
  };

  return (
    <DefectContext.Provider value={value}>{children}</DefectContext.Provider>
  );
};

export const useDefect = () => {
  const context = useContext(DefectContext);
  if (context === undefined) {
    throw new Error("useDefect must be used within a DefectProvider");
  }
  return context;
};
