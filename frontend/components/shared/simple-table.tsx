"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { ReactNode } from "react";

export interface PaginationConfig {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  isFetching?: boolean;
}

export interface SimpleTableProps {
  columns: ReactNode[];
  rows: ReactNode[][];
  isLoading?: boolean;
  notFoundMessage?: string;
  pagination?: PaginationConfig;
}

export function SimpleTable({
  columns,
  rows,
  isLoading = false,
  notFoundMessage = "No data found",
  pagination,
}: SimpleTableProps) {
  const limitOptions = pagination?.limitOptions || [10, 20, 50, 100];
  const showPagination = pagination && pagination.totalPages > 1;

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand/5  hover:bg-brand/5">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={clsx(
                    index === 0 && "pl-4",
                    index === columns.length - 1 && "pr-4",
                    "font-medium"
                  )}
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <p className="text-muted-foreground">{notFoundMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="group hover:bg-brand/5 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={clsx(
                        cellIndex === 0 && "pl-4",
                        cellIndex === row.length - 1 && "pr-4"
                      )}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && pagination && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t bg-brand/2">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> items
            </p>
            {pagination.onLimitChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows:</span>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={(value) =>
                    pagination.onLimitChange?.(Number(value))
                  }
                >
                  <SelectTrigger className="h-8 w-[70px] border-brand/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {limitOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-brand/20"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || pagination.isFetching}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            {(() => {
              const pages: (number | string)[] = [];
              const effectiveTotalPages = Math.max(1, pagination.totalPages);

              if (effectiveTotalPages <= 7) {
                for (let i = 1; i <= effectiveTotalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);

                if (pagination.page <= 3) {
                  pages.push(2, 3, 4, "...", effectiveTotalPages);
                } else if (pagination.page >= effectiveTotalPages - 2) {
                  pages.push(
                    "...",
                    effectiveTotalPages - 3,
                    effectiveTotalPages - 2,
                    effectiveTotalPages - 1,
                    effectiveTotalPages
                  );
                } else {
                  pages.push(
                    "...",
                    pagination.page - 1,
                    pagination.page,
                    pagination.page + 1,
                    "...",
                    effectiveTotalPages
                  );
                }
              }

              return pages.map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${pageNum}`}
                    variant="outline"
                    size="icon"
                    className={`h-9 w-9 ${
                      pagination.page === pageNum
                        ? "bg-brand text-white border-brand hover:bg-brand-hover hover:text-white"
                        : "border-brand/20"
                    }`}
                    onClick={() => pagination.onPageChange(pageNum as number)}
                    disabled={pagination.isFetching}
                  >
                    {pageNum}
                  </Button>
                )
              );
            })()}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-brand/20"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >= pagination.totalPages ||
                pagination.isFetching
              }
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
