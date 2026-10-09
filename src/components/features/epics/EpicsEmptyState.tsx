import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Epicempty from "@/../public/emptyepic.svg";
import Light from "@/../public/light.svg";

export function EpicsEmptyState({ projectId }: { projectId: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      {/* Icon Box */}
      <Epicempty />

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
          className="shadow-lg px-6 py-2.5 font-medium flex items-center gap-2"
        >
          <Light /> Create First Epic
        </Button>
      </Link>
    </div>
  );
}
