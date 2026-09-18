import React from "react";
import Image from "next/image";

export default function Pagination() {
  return (
    <div>
      <div className="flex items-center justify-end gap-2 mt-8 py-4">
        {/* Previous Button */}

        <button className="w-8 h-8 flex items-center justify-center rounded-xs border border-neutral-border text-neutral-muted hover:bg-surface-highest disabled:opacity-50 disabled:cursor-not-allowed">
          <Image src="/left.svg" alt="left-icon" width={4} height={7} />
        </button>

        {/* Page 1 (Active) */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xs bg-primary text-white font-medium text-sm">
          1
        </button>

        {/* Page 2 */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xs border border-neutral-border text-neutral-dark hover:bg-surface-highest text-sm">
          2
        </button>

        {/* Page 3 */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xs border border-neutral-border text-neutral-dark hover:bg-surface-highest text-sm">
          3
        </button>

        {/* Dots */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xs border border-neutral-border text-neutral-muted hover:bg-surface-highest text-sm">
          ...
        </button>

        {/* Page 15 */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xs border border-neutral-border text-neutral-dark hover:bg-surface-highest text-sm">
          15
        </button>

        {/* Next Button */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xs border border-neutral-border text-neutral-dark hover:bg-surface-highest">
          <Image src="/right.svg" alt="right-icon" width={4} height={7} />
        </button>
      </div>
    </div>
  );
}
