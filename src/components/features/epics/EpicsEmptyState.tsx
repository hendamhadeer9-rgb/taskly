import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EpicsEmptyState({ projectId }: { projectId: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      {/* Icon Box */}
      <div className="w-24 h-24 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-2 text-[#003D9B]">
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-xs font-bold">
            🚀
          </span>
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-xs font-bold">
            📐
          </span>
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-xs font-bold">
            田
          </span>
          <span className="w-5 h-5 border border-dashed border-blue-300 rounded flex items-center justify-center text-xs font-bold">
            +
          </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">
        No epics in this project yet.
      </h2>
      <p className="text-slate-500 max-w-md text-sm mb-6 leading-relaxed">
        Break down your large project into manageable epics to track progress
        better and maintain architectural clarity.
      </p>

      <Link href={`/project/${projectId}/epics/new`}>
        <Button
          variant="primary"
          className="bg-[#003D9B] hover:bg-blue-800 px-6 py-2.5 font-medium flex items-center gap-2"
        >
          <span>⚡</span> Create First Epic
        </Button>
      </Link>
    </div>
  );
}
