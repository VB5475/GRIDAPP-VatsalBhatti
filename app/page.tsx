"use client";

import { useState } from "react";
import DataGrid from "@/components/DataGrid";
import { MoreVertical } from "lucide-react";

interface TradeData {
 time: string;
 client: string;
 ticker: string;
 hasSignal: boolean;
 side: string;
 product: string;
 qty: string;
 price: string;
}

const dummyData: TradeData[] = [
 {
  time: "08:14:31",
  client: "AAA001",
  ticker: "RELIANCE",
  hasSignal: true,
  side: "Buy",
  product: "CNC",
  qty: "50/100",
  price: "250.50",
 },
 {
  time: "08:14:31",
  client: "AAA003",
  ticker: "MRF",
  hasSignal: false,
  side: "Buy",
  product: "NRML",
  qty: "10/20",
  price: "2,700.00",
 },
 {
  time: "08:14:31",
  client: "AAA002",
  ticker: "ASIANPAINT",
  hasSignal: true,
  side: "Buy",
  product: "NRML",
  qty: "10/30",
  price: "1,500.60",
 },
 {
  time: "08:14:31",
  client: "AAA002",
  ticker: "TATAINVEST",
  hasSignal: false,
  side: "Sell",
  product: "INTRADAY",
  qty: "10/10",
  price: "2,300.10",
 },
];

export default function Home() {
 const downloadDataAsCsv = (data: TradeData[]) => {
  const headers = [
   "Time",
   "Client",
   "Ticker",
   "Side",
   "Product",
   "Qty",
   "Price",
  ];

  const escapeField = (field: string, isQty: boolean = false): string => {
   if (isQty) {
    return `"'${field.replace(/"/g, '""')}"`;
   }

   if (
    field &&
    (field.includes(",") || field.includes('"') || field.includes("\n"))
   ) {
    return `"${field.replace(/"/g, '""')}"`;
   }
   return field;
  };

  const csvData = [
   headers.join(","),
   ...data.map((row) =>
    [
     escapeField(row.time),
     escapeField(row.client),
     escapeField(row.ticker),
     escapeField(row.side),
     escapeField(row.product),
     escapeField(row.qty, true),
     escapeField(row.price),
    ].join(",")
   ),
  ].join("\n");

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trading_data.csv";
  a.click();
  URL.revokeObjectURL(url);
 };

 const columns = [
  { key: "time" as keyof TradeData, label: "Time", filterable: true },
  { key: "client" as keyof TradeData, label: "Client" },
  { key: "ticker" as keyof TradeData, label: "Ticker" },
  { key: "side" as keyof TradeData, label: "Side", filterable: true },
  { key: "product" as keyof TradeData, label: "Product", filterable: true },
  {
   key: "qty" as keyof TradeData,
   label: "Qty",
   fullLabel: "Qty (Executed/Total)",
  },
  { key: "price" as keyof TradeData, label: "Price" },
  {
   key: null,
   label: "Actions",
   renderCell: (_: any, row: TradeData) => (
    <button
     className="text-gray-400 hover:text-gray-600"
     onClick={() => console.log("Action clicked for:", row.ticker)}>
     <MoreVertical className="h-5 w-5" />
    </button>
   ),
  },
 ];

 const handleRowAction = (row: TradeData, action: string) => {
  console.log(`Action ${action} on row:`, row);
 };

 return (
  <main className="min-h-screen bg-gray-50 p-4 md:p-6">
   <div className="mx-auto max-w-[1400px]">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
     <h1 className="text-2xl font-semibold text-gray-900">Open Orders</h1>
     <div className="text-sm text-gray-500">
      <p>Project created by Vatsal Bhatti</p>
      <p>Responsive for Desktop And Mobile devices</p>
     </div>
    </div>

    <DataGrid
     data={dummyData}
     columns={columns}
     uniqueIdentifier="ticker"
     filterableFields={["time", "side", "product"]}
     onDownload={downloadDataAsCsv}
     showSearch={true}
     searchPlaceholder="Search for a stock, future, option or index"
     rowsPerPage={10}
     showUserProfile={true}
     userId="AAA002"
     userName="Lalit"
     taggableField="ticker"
     allowFiltering={true}
     onRowAction={handleRowAction}
    />
   </div>
  </main>
 );
}
