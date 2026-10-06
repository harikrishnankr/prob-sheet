import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Optional footer cell, e.g. a column total. */
  footer?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({ columns, rows, getRowKey, emptyMessage = "No data." }: DataTableProps<T>) {
  const hasFooter = columns.some((col) => col.footer !== undefined);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-foreground/[.03] text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn("px-4 py-2.5 font-medium", alignClasses[col.align ?? "left"], col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-foreground/[.02]">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3", alignClasses[col.align ?? "left"], col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {hasFooter && (
          <tfoot className="border-t border-border bg-foreground/[.03] font-medium">
            <tr>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn("px-4 py-2.5", alignClasses[col.align ?? "left"], col.className)}
                >
                  {col.footer}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
