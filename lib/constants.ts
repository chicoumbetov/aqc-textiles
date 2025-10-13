export const MOCK_ROLL_ID = "42";
export const BASE_API_URL = "http://localhost:3000/v1/rolls";

export const mockAnalytics = [
  { type: "Stain", count: 125, avgTimestamp: 1678886400 },
  { type: "Hole", count: 80, avgTimestamp: 1678886500 },
  { type: "Knot", count: 30, avgTimestamp: 1678886600 },
  { type: "Slub", count: 15, avgTimestamp: 1678886700 },
];

// * simplified mock map data (just random points, ignoring tile/segment complexity for speed)
export const mockDefects = [
  ...Array(125).fill({
    type: "Stain",
    x: Math.random() * 800,
    y: Math.random() * 400,
  }),
  ...Array(80).fill({
    type: "Hole",
    x: Math.random() * 800,
    y: Math.random() * 400,
  }),
  ...Array(30).fill({
    type: "Knot",
    x: Math.random() * 800,
    y: Math.random() * 400,
  }),
  ...Array(15).fill({
    type: "Slub",
    x: Math.random() * 800,
    y: Math.random() * 400,
  }),
];

export const COLOR_MAP = {
  Stain: "#FF6384",
  Hole: "#36A2EB",
  Knot: "#FFCE56",
  Slub: "#4BC0C0",
  Default: "#D3D3D3",
};

export const ROLL_WIDTH = 800;
export const ROLL_HEIGHT = 400;
