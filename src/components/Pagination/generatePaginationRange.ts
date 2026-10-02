export type PaginationItem = number | "...";

export function generatePaginationRange(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 1) return [];

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PaginationItem[] = [];

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 2) {
    endPage = 3;
  } else if (currentPage >= totalPages - 1) {
    startPage = totalPages - 2;
  }

  pages.push(1);

  if (startPage > 2) {
    if (startPage === 3) {
      pages.push(2);
    } else {
      pages.push("...");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    if (endPage === totalPages - 2) {
      pages.push(totalPages - 1);
    } else {
      pages.push("...");
    }
  }

  pages.push(totalPages);

  return pages;
}
