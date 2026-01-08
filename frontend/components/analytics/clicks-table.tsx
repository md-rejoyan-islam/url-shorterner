"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { IClick } from "@/types";

interface ClicksTableProps {
  clicks: IClick[];
}

export function ClicksTable({ clicks }: ClicksTableProps) {
  if (!clicks || clicks.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No clicks recorded yet
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="hidden md:table-cell">Device</TableHead>
            <TableHead className="hidden lg:table-cell">Browser</TableHead>
            <TableHead className="hidden lg:table-cell">OS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clicks.map((click) => (
            <TableRow key={click._id}>
              <TableCell className="text-muted-foreground">
                {formatDate(click.createdAt)}
              </TableCell>
              <TableCell>{click.location?.country || "Unknown"}</TableCell>
              <TableCell>{click.location?.city || "Unknown"}</TableCell>
              <TableCell className="hidden md:table-cell">
                {click.device?.type || "Unknown"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {click.device?.browser || "Unknown"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {click.device?.os || "Unknown"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
