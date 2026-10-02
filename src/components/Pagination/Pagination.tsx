"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { generatePaginationRange } from "./generatePaginationRange";
import Left from "@/../public/left.svg";
import Right from "@/../public/right.svg";

interface DesktopPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: DesktopPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const paginationRange = generatePaginationRange(currentPage, totalPages);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const baseButtonStyles =
    "w-8 h-8 flex items-center justify-center text-xs font-medium rounded-sm transition-colors shrink-0";

  return (
    <nav
      className="hidden md:flex items-center justify-end gap-1.5 my-8 w-full"
      aria-label="Pagination"
    >
      {isFirstPage ? (
        <span
          className={`${baseButtonStyles} bg-white border border-nav-border text-slate-300 cursor-not-allowed select-none`}
        >
          <Left />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className={`${baseButtonStyles} bg-white border border-nav-border text-neytral-dark`}
          aria-label="Previous Page"
        >
          <Left />
        </Link>
      )}

      {paginationRange.map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className={`${baseButtonStyles} bg-white border border-van-border text-neutral-dark select-none`}
            >
              ...
            </span>
          );
        }

        const isCurrent = item === currentPage;

        return isCurrent ? (
          <span
            key={item}
            aria-current="page"
            className={`${baseButtonStyles} bg-primary text-white font-semibold border border-primary select-none`}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={createPageURL(item)}
            className={`${baseButtonStyles} bg-white border border-nav-border text-neutral-dark`}
          >
            {item}
          </Link>
        );
      })}

      {isLastPage ? (
        <span
          className={`${baseButtonStyles} bg-white border border-nav-border text-slate-300 cursor-not-allowed select-none`}
        >
          <Right />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className={`${baseButtonStyles} bg-white border border-nav-border text-neutral-dark `}
          aria-label="Next Page"
        >
          <Right />
        </Link>
      )}
    </nav>
  );
}
