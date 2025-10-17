// src/frontend/components/DefectMap.jsx

import { useEffect, useMemo, useState } from "react";
import { Circle, Layer, Rect, Stage } from "react-konva";

import { ROLL_HEIGHT, ROLL_WIDTH } from "@/lib/constants";
import { useDefect } from "@/lib/contexts/defect-context";

const DefectMap = () => {
  const { defectsOnMap, selectedDefectType, COLOR_MAP, loading } = useDefect();

  // * Conditional rendering for client-side Konva initialization
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDefects = useMemo(() => {
    if (!selectedDefectType) return defectsOnMap;
    return defectsOnMap.filter((d) => d.type === selectedDefectType);
  }, [defectsOnMap, selectedDefectType]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-2xl text-gray-500">Loading map data...</div>
      </div>
    );

  // Only render Konva elements if mounted (client-side)
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg text-gray-500 p-8 bg-white rounded-xl shadow-lg w-full h-full">
          Initializing visualization...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold mb-3 text-gray-800">
        Roll Defect Map Visualization
      </h2>
      <div
        className="relative border border-gray-300 rounded-lg bg-gray-100 flex-grow"
        style={{ height: ROLL_HEIGHT }}
      >
        <Stage width={ROLL_WIDTH} height={ROLL_HEIGHT} className="mx-auto">
          <Layer>
            {/* 1. Background Rectangle representing the Roll */}
            <Rect
              x={0}
              y={0}
              width={ROLL_WIDTH}
              height={ROLL_HEIGHT}
              fill="#F7F7F9"
            />

            {/* // * All Defects (faded if filter is active) */}
            {defectsOnMap.map((defect, index) => {
              const isSelected = defect.type === selectedDefectType;
              const isFaded = selectedDefectType !== null && !isSelected;

              return (
                <Circle
                  key={index}
                  x={defect.x}
                  y={defect.y}
                  radius={isSelected ? 5 : 3}
                  fill={COLOR_MAP[defect.type] || COLOR_MAP.Default}
                  opacity={isFaded ? 0.15 : 0.8}
                  shadowBlur={isSelected ? 10 : 0}
                  shadowColor={
                    isSelected ? COLOR_MAP[defect.type] : "transparent"
                  }
                />
              );
            })}
          </Layer>
        </Stage>
        <div className="absolute top-2 left-4 text-xs font-medium text-gray-500">
          Roll Dimensions: {ROLL_WIDTH}m x {ROLL_HEIGHT}m (Simplified scale)
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Click a defect type on the left to highlight its distribution on the
        map.
      </p>
    </div>
  );
};

export default DefectMap;
