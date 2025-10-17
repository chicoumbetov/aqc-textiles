"use client";
import { MOCK_ROLL_ID } from "@/lib/constants";
import { useDefect } from "@/lib/contexts/defect-context";

const DefectChart = () => {
  const {
    analytics,
    selectedDefectType,
    setSelectedDefectType,
    COLOR_MAP,
    loading,
  } = useDefect();

  const handleTypeClick = (type: any) => {
    setSelectedDefectType(type === selectedDefectType ? null : type);
  };

  if (loading)
    return <div className="text-center p-8">Loading analytics...</div>;

  const analyticsData = analytics || [];

  console.log("analyticsData :", analyticsData);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Defect Analytics (Roll {MOCK_ROLL_ID})
      </h2>
      <div className="space-y-3 overflow-y-auto">
        {analyticsData?.map((item: any) => (
          <button
            key={item.type}
            onClick={() => handleTypeClick(item.type)}
            className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200
              ${
                item.type === selectedDefectType
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-50 text-gray-700 hover:bg-blue-100"
              }`}
            style={{
              borderLeft: `5px solid ${
                COLOR_MAP[item.type] || COLOR_MAP.Default
              }`,
            }}
          >
            <span className="font-semibold">{item.type}</span>
            <span className="text-lg font-extrabold">{item.count}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        {`Total Defects: ${analyticsData.reduce(
          (sum: any, item: any) => sum + item.count,
          0
        )}`}
      </p>
    </div>
  );
};

export default DefectChart;
