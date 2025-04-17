"use client";

import { useState } from "react";
import Grid from "@/components/Grid";

// Define interface for your data structure
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
 // other data entries remain the same
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

  const csvData = [
   headers.join(","),
   ...data.map((row) =>
    [
     row.time,
     row.client,
     row.ticker,
     row.side,
     row.product,
     row.qty,
     row.price,
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

    <Grid data={dummyData} downloadDataAsCsv={downloadDataAsCsv} />
   </div>
  </main>
 );
}
