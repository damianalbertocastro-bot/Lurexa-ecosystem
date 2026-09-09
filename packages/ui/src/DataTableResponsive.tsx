"use client";

import React, { useRef, useState, useEffect } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableResponsiveProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  caption?: string;
}

export function DataTableResponsive<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyMessage = "No records found",
  className = "",
  caption,
}: DataTableResponsiveProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // Monitor scroll position to show visual scroll hints on mobile
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [data]);

  return (
    <div className={`relative w-full rounded-2xl border border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-surface,#ffffff)] shadow-xs overflow-hidden ${className}`}>
      {/* Scroll indicator overlay for touch devices */}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--lx-surface,#ffffff)]/80 to-transparent z-20 flex items-center justify-end pr-1 text-[var(--lx-muted,#64748b)] md:hidden"
        >
          <span className="text-xs animate-pulse">→</span>
        </div>
      )}

      {/* Horizontal Scrollable Table Viewport */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="w-full overflow-x-auto touch-scroll-x overscroll-x-contain"
        tabIndex={0}
        aria-label={caption || "Data table"}
      >
        <table className="w-full border-collapse text-left text-xs md:text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}

          {/* Table Header */}
          <thead className="border-b border-[var(--lx-border,#e2e8f0)] bg-[var(--lx-canvas,#f8fafc)] text-[11px] font-bold uppercase tracking-wider text-[var(--lx-muted,#64748b)]">
            <tr>
              {columns.map((col, idx) => {
                const isPinned = idx === 0;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={`py-3.5 px-4 font-extrabold select-none ${
                      isPinned
                        ? "sticky left-0 z-10 bg-[var(--lx-canvas,#f8fafc)] shadow-[2px_0_6px_-2px_rgba(0,0,0,0.12)] border-r border-[var(--lx-border,#e2e8f0)]/60"
                        : ""
                    } ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--lx-border,#e2e8f0)] bg-[var(--lx-surface,#ffffff)]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-xs text-[var(--lx-muted,#64748b)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowKey(row, rowIdx)}
                  onClick={() => onRowClick?.(row)}
                  className={`group transition-colors duration-150 ${
                    onRowClick ? "cursor-pointer hover:bg-[var(--lx-canvas,#f8fafc)]" : ""
                  }`}
                >
                  {columns.map((col, colIdx) => {
                    const isPinned = colIdx === 0;
                    const content = col.render
                      ? col.render(row, rowIdx)
                      : (row as Record<string, unknown>)[col.key] != null
                      ? String((row as Record<string, unknown>)[col.key])
                      : "—";

                    return (
                      <td
                        key={col.key}
                        className={`py-3.5 px-4 whitespace-nowrap text-[var(--lx-ink,#0a1c55)] ${
                          isPinned
                            ? "sticky left-0 z-10 bg-[var(--lx-surface,#ffffff)] group-hover:bg-[var(--lx-canvas,#f8fafc)] shadow-[2px_0_6px_-2px_rgba(0,0,0,0.12)] border-r border-[var(--lx-border,#e2e8f0)]/60 font-semibold"
                            : ""
                        } ${
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${col.className || ""}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
