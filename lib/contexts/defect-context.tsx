import { createContext, useContext, useState } from "react";

import { useApi } from "../api/roll";
import { COLOR_MAP, mockAnalytics, mockDefects } from "../constants";

interface DefectContextType {
  analytics: string[];
  defectsOnMap: any;
  selectedDefectType: any;
  setSelectedDefectType: any;
  loading: boolean;
  COLOR_MAP: any;
}

const DefectContext = createContext<DefectContextType | undefined>(undefined);

export const DefectProvider = ({ children }: any) => {
  const { data: analytics, loading: loadingAnalytics } = useApi("analytics", {
    analytics: mockAnalytics,
  });
  const { data: defectsOnMap, loading: loadingDefects } = useApi("defects", {
    defects: mockDefects,
  });

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
