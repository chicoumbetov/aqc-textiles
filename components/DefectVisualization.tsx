import DefectChart from "@/components/DefectChart";
import DefectMap from "@/components/DefectMap";
import { DefectProvider } from "@/lib/contexts/defect-context";

export default function RollVisualizationPage() {
  return (
    <DefectProvider>
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-8">Roll Analysis</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-1">
            <DefectChart />
          </div>
          <div className="lg:col-span-5">
            <DefectMap />
          </div>
        </div>
      </div>
    </DefectProvider>
  );
}
