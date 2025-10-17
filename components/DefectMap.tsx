"use client";
import { useDefect } from "@/lib/contexts/defect-context";
import { useEffect, useState } from "react";
import { Layer, Rect, Shape, Stage } from "react-konva";

const TILE_COUNT_X = 5;
const MAP_BASE_WIDTH = 1200;
const MAP_BASE_HEIGHT = 600;
const TILE_SIZE_X = MAP_BASE_WIDTH / TILE_COUNT_X; // 240
const TILE_SIZE_Y = 120;

// Convert local segment coordinates to global map coordinates
const getGlobalPoints = (
  tileRow: number,
  tileColumn: number,
  localPoints: number[]
) => {
  const correctedRow = tileRow > 0 ? tileRow - 1 : tileRow;
  const correctedColumn = tileColumn > 0 ? tileColumn - 1 : tileColumn;

  const tileOffsetX = correctedColumn * TILE_SIZE_X;
  const tileOffsetY = correctedRow * TILE_SIZE_Y;

  const scaleFactorX = TILE_SIZE_X / 1000;
  const scaleFactorY = TILE_SIZE_Y / 1000;

  const globalPoints = [];
  for (let i = 0; i < localPoints?.length; i += 2) {
    globalPoints.push(tileOffsetX + localPoints[i] * scaleFactorX);
    globalPoints.push(tileOffsetY + localPoints[i + 1] * scaleFactorY);
  }
  return globalPoints;
};

const DefectMap = () => {
  const { defectsOnMap, selectedDefectType, COLOR_MAP, loading } = useDefect();

  const allSegments = defectsOnMap || [];
  // Key to force Layer redraw when defects load
  const defectLoadKey = allSegments.length > 0 ? "loaded" : "loading";

  const maxTileRow = allSegments.reduce(
    (max, segment) => Math.max(max, segment.tileRow),
    5
  );

  const MAP_TOTAL_HEIGHT = maxTileRow * TILE_SIZE_Y;

  const [stageSize, setStageSize] = useState({
    width: MAP_BASE_WIDTH,
    height: MAP_BASE_HEIGHT,
    scale: 1,
  });

  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = document.getElementById("map-container");
    if (!container) return;

    const fitStageIntoContainer = () => {
      const containerWidth = container.offsetWidth;
      const scale = containerWidth / MAP_BASE_WIDTH;

      setStageSize({
        width: containerWidth,
        height: MAP_BASE_HEIGHT * scale,
        scale: scale,
      });
    };

    fitStageIntoContainer();
    window.addEventListener("resize", fitStageIntoContainer);
    return () => window.removeEventListener("resize", fitStageIntoContainer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading map data...</div>
    );
  }

  // Dragging Logic
  const maxNegativeY = -(MAP_TOTAL_HEIGHT * stageSize.scale - stageSize.height);
  const isScrollable = MAP_TOTAL_HEIGHT * stageSize.scale > stageSize.height;

  const dragBoundary = (pos: { x: number; y: number }) => {
    if (!isScrollable) {
      return { x: 0, y: 0 };
    }

    return {
      x: 0, // Lock horizontal drag
      y: Math.max(Math.min(0, pos.y), maxNegativeY),
    };
  };

  const handleDragState = (isDragging: boolean) => {
    const container = document.getElementById("map-viewport");
    if (container) {
      container.style.cursor = isDragging && isScrollable ? "grabbing" : "grab";
    }
  };
  // End Dragging Logic

  return (
    <div
      id="map-container"
      className="bg-white p-3 rounded-xl shadow-lg h-full"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Roll Map Visualization
      </h2>

      <div
        id="map-viewport"
        style={{
          width: "100%",
          height: `${stageSize.height}px`,
          overflow: "hidden",
          cursor: isScrollable ? "grab" : "default", // Default cursor
        }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          scaleX={stageSize.scale}
          scaleY={stageSize.scale}
        >
          <Layer
            key={defectLoadKey}
            x={stagePosition.x}
            y={stagePosition.y}
            draggable={isScrollable} // Only draggable if map is bigger than viewport
            onMouseDown={() => handleDragState(true)}
            onMouseUp={() => handleDragState(false)}
            onDragStart={() => handleDragState(true)}
            onDragEnd={(e) => {
              handleDragState(false);
              const node = e.target;
              const y = node.y();
              const clampedY = Math.max(maxNegativeY, Math.min(0, y));

              setStagePosition({
                x: 0,
                y: clampedY,
              });
            }}
            dragBoundFunc={dragBoundary}
          >
            {/* Background Rect (Total Map Size) */}
            <Rect
              x={0}
              y={0}
              width={MAP_BASE_WIDTH}
              height={MAP_TOTAL_HEIGHT}
              fill="#f0f0f0"
              stroke="#ccc"
              strokeWidth={2 / stageSize.scale}
            />

            {/* Tiles (Grid) */}
            {[...Array(maxTileRow)].map((_, r) =>
              [...Array(TILE_COUNT_X)].map((_, c) => (
                <Rect
                  key={`${r}-${c}`}
                  x={c * TILE_SIZE_X}
                  y={r * TILE_SIZE_Y}
                  width={TILE_SIZE_X}
                  height={TILE_SIZE_Y}
                  stroke="#ddd"
                  strokeWidth={1 / stageSize.scale}
                />
              ))
            )}

            {/* Defect Segments (The Core Visualization) */}
            {allSegments.map((segment: any) => {
              const { segmentPath, defectType, tileRow, tileColumn } = segment;

              const isVisible = selectedDefectType
                ? selectedDefectType === defectType
                : true;

              if (!isVisible) return null;

              const isScratch = defectType === "Scratch";
              const color = COLOR_MAP[defectType] || COLOR_MAP.Default;
              const globalPoints = getGlobalPoints(
                tileRow,
                tileColumn,
                segmentPath?.points
              );

              // DEBUG LOG: Must show valid coordinates and a non-transparent color
              console.log(
                `Defect ${segment.defectId}: R${tileRow}, C${tileColumn}, Color=${color}, Pts=${globalPoints.length}`
              );

              return (
                <Shape
                  key={segment.defectId + "-" + segment.tileId}
                  sceneFunc={(context, shape) => {
                    context.beginPath();

                    if (globalPoints.length > 1) {
                      context.moveTo(globalPoints[0], globalPoints[1]);
                      for (let i = 2; i < globalPoints.length; i += 2) {
                        context.lineTo(globalPoints[i], globalPoints[i + 1]);
                      }

                      if (!isScratch) {
                        context.closePath();
                      }

                      context.fillStrokeShape(shape);
                    }
                  }}
                  fill={!isScratch ? color : undefined}
                  opacity={selectedDefectType ? 0.8 : 0.6}
                  stroke={color}
                  strokeWidth={isScratch ? 3 : 2}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default DefectMap;
