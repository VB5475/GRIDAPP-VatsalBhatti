"use client";

import { useState, useEffect } from "react";
import {
 Search,
 Filter,
 MoreVertical,
 Wifi,
 UserPlus,
 X,
 Download,
 ArrowUp,
 ArrowDown,
 Info,
 Menu,
} from "lucide-react";

// Define interfaces for type safety
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

interface GridProps {
 data: TradeData[];
 downloadDataAsCsv: (data: TradeData[]) => void;
}

interface SortConfig {
 key: keyof TradeData | null;
 direction: "asc" | "desc" | null;
}

interface FilterState {
 time: string[];
 side: string[];
 product: string[];
}

export default function Grid({ data, downloadDataAsCsv }: GridProps) {
 const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
 const [filters, setFilters] = useState<FilterState>({
  time: [],
  side: [],
  product: [],
 });
 const [tempFilters, setTempFilters] = useState<FilterState>({
  time: [],
  side: [],
  product: [],
 });
 const [filterDropdown, setFilterDropdown] = useState<string | null>(null);
 const [currentPage, setCurrentPage] = useState<number>(1);
 const [tooltip, setTooltip] = useState<string | null>(null);
 const [sortConfig, setSortConfig] = useState<SortConfig>({
  key: null,
  direction: null,
 });
 const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

 const rowsPerPage = 10;

 const toggleTicker = (ticker: string) => {
  setSelectedTickers((prev) =>
   prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
  );
 };

 const resetAllFilters = () => {
  setSelectedTickers([]);
  setFilters({
   time: [],
   side: [],
   product: [],
  });
  setTempFilters({
   time: [],
   side: [],
   product: [],
  });
  setSortConfig({ key: null, direction: null });
 };

 const handleSort = (key: keyof TradeData) => {
  let direction: "asc" | "desc" | null = "asc";

  if (sortConfig.key === key) {
   if (sortConfig.direction === "asc") {
    direction = "desc";
   } else if (sortConfig.direction === "desc") {
    direction = null;
   }
  }

  setSortConfig({ key, direction });
 };

 // Apply sorting and filtering
 let processedData = [...data];

 // Apply filters
 processedData = processedData.filter((order) => {
  const matchTime = filters.time.length
   ? filters.time.includes(order.time)
   : true;
  const matchSide = filters.side.length
   ? filters.side.includes(order.side)
   : true;
  const matchProduct = filters.product.length
   ? filters.product.includes(order.product)
   : true;
  return matchTime && matchSide && matchProduct;
 });

 // Apply sorting
 if (sortConfig.key && sortConfig.direction) {
  processedData.sort((a, b) => {
   const aValue = a[sortConfig.key as keyof TradeData];
   const bValue = b[sortConfig.key as keyof TradeData];

   if (aValue < bValue) {
    return sortConfig.direction === "asc" ? -1 : 1;
   }
   if (aValue > bValue) {
    return sortConfig.direction === "asc" ? 1 : -1;
   }
   return 0;
  });
 }

 const paginatedData = processedData.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
 );
 const totalPages = Math.ceil(processedData.length / rowsPerPage);

 const uniqueValues = (key: keyof FilterState) => {
  const set = new Set<string>(data.map((item) => item[key]));
  return Array.from(set);
 };

 const handleTempChange = (filterKey: keyof FilterState, value: string) => {
  setTempFilters((prev) => {
   const alreadySelected = prev[filterKey].includes(value);
   return {
    ...prev,
    [filterKey]: alreadySelected
     ? prev[filterKey].filter((v) => v !== value)
     : [...prev[filterKey], value],
   };
  });
 };

 const applyFilters = (key: keyof FilterState) => {
  setFilters((prev) => ({
   ...prev,
   [key]: tempFilters[key],
  }));
  setFilterDropdown(null);
 };

 const clearFilters = (key: keyof FilterState) => {
  setFilters((prev) => ({ ...prev, [key]: [] }));
  setTempFilters((prev) => ({ ...prev, [key]: [] }));
  setFilterDropdown(null);
 };

 const handleDownload = () => {
  downloadDataAsCsv(processedData);
 };

 const renderSortIcon = (key: keyof TradeData) => {
  if (sortConfig.key !== key) {
   return (
    <button
     onClick={() => handleSort(key)}
     className="ml-1 text-gray-300 hover:text-gray-600">
     <ArrowUp className="h-3 w-3" />
    </button>
   );
  }

  if (sortConfig.direction === "asc") {
   return (
    <button onClick={() => handleSort(key)} className="ml-1 text-blue-500">
     <ArrowUp className="h-3 w-3" />
    </button>
   );
  }

  if (sortConfig.direction === "desc") {
   return (
    <button onClick={() => handleSort(key)} className="ml-1 text-blue-500">
     <ArrowDown className="h-3 w-3" />
    </button>
   );
  }

  return null;
 };

 // Close filter dropdown when clicking outside
 const handleClickOutside = (e: MouseEvent) => {
  if (
   filterDropdown &&
   !(e.target as Element).closest(".filter-dropdown") &&
   !(e.target as Element).closest(".filter-button")
  ) {
   setFilterDropdown(null);
  }
 };

 // Add click event listener
 useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, [filterDropdown]);

 return (
  <div className="space-y-6">
   {/* User Profile and Search Bar Row */}
   <div className="flex flex-col md:flex-row md:items-center gap-4">
    {/* User Profile */}
    <div className="flex items-center gap-2">
     <div className="flex items-center gap-0 bg-gray-50 rounded-lg border-[0.05px] border-gray-400 overflow-hidden w-fit">
      <input
       className="bg-transparent text-sm font-medium px-3 py-2 outline-none w-[85px] border-r border-gray-400"
       value="AAA002"
       readOnly
      />
      <div className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 cursor-pointer">
       <UserPlus className="h-5 w-5 text-black" />
      </div>
     </div>

     <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 transition-colors">
      <span>Lalit</span>
      <X className="h-4 w-4 text-gray-500" />
     </button>
    </div>

    {/* Search & Tags - mobile responsive */}
    <div className="flex flex-1 flex-wrap items-center gap-3 mt-4 md:mt-0">
     <div className="flex w-full max-w-md items-center gap-2 rounded-lg border bg-white px-3 py-2">
      <Search className="h-5 w-5 text-gray-400" />
      <input
       type="text"
       placeholder="Search for a stock, future, option or index"
       className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
     </div>
     <div className="flex gap-2 flex-wrap">
      {selectedTickers.map((ticker) => (
       <button
        key={ticker}
        onClick={() => toggleTicker(ticker)}
        className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1 text-sm">
        <span>{ticker}</span>
        <X className="h-4 w-4 text-gray-500" />
       </button>
      ))}
     </div>

     {/* Mobile filter button */}

     <div className="ml-auto mr-auto md:mr-0 flex gap-2 mt-4 sm:mt-0  ">
      <button
       className="md:hidden flex items-center justify-center bg-neutral-400 bg-opacity-20 w-20 h-10 font-medium text-base text-black hover:text-gray-600 rounded-lg px-4"
       onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
       Filters
      </button>
      <div
       className="relative"
       onMouseEnter={() => setTooltip("download")}
       onMouseLeave={() => setTooltip(null)}>
       <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 bg-neutral-400 bg-opacity-20 w-32 h-10 font-medium text-base text-black hover:text-gray-600 rounded-lg px-3">
        <Download className="h-5 w-5" />
        <span>Download</span>
       </button>
       {tooltip === "download" && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
         Download data as Excel
        </div>
       )}
      </div>
      <div
       className="relative"
       onMouseEnter={() => setTooltip("cancel")}
       onMouseLeave={() => setTooltip(null)}>
       <button
        className="rounded-lg border bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        onClick={resetAllFilters}>
        Cancel all
       </button>
       {tooltip === "cancel" && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
         Reset all filters and selections
        </div>
       )}
      </div>
     </div>
    </div>
   </div>

   {/* Mobile filters panel */}
   {mobileFiltersOpen && (
    <div className="md:hidden bg-white rounded-lg border p-4 space-y-4">
     <div className="flex justify-between items-center">
      <h3 className="font-medium">Filters</h3>
      <X
       className="h-5 w-5 cursor-pointer"
       onClick={() => setMobileFiltersOpen(false)}
      />
     </div>

     {/* Filter groups */}
     {(["time", "side", "product"] as Array<keyof FilterState>).map(
      (filterKey) => (
       <div key={filterKey} className="space-y-2">
        <h4 className="text-sm font-medium capitalize">{filterKey}</h4>
        <div className="space-y-1">
         {uniqueValues(filterKey).map((val) => (
          <label key={val} className="flex items-center gap-2 text-sm">
           <input
            type="checkbox"
            checked={filters[filterKey].includes(val)}
            onChange={() => {
             handleTempChange(filterKey, val);
             // Immediately apply on mobile
             setFilters((prev) => {
              const alreadySelected = prev[filterKey].includes(val);
              return {
               ...prev,
               [filterKey]: alreadySelected
                ? prev[filterKey].filter((v) => v !== val)
                : [...prev[filterKey], val],
              };
             });
            }}
           />
           {val}
          </label>
         ))}
        </div>
       </div>
      )
     )}

     <button
      onClick={() => {
       resetAllFilters();
       setMobileFiltersOpen(false);
      }}
      className="w-full bg-red-600 text-white py-2 rounded-lg text-sm">
      Clear All Filters
     </button>
    </div>
   )}

   {/* Fixed Table Container */}
   <div className="rounded-lg border bg-white">
    {/* Table Header - Fixed */}
    <div className="relative overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
       <tr>
        {[
         { label: "Time", key: "time" as keyof TradeData },
         { label: "Client", key: "client" as keyof TradeData },
         { label: "Ticker", key: "ticker" as keyof TradeData },
         { label: "Side", key: "side" as keyof TradeData },
         { label: "Product", key: "product" as keyof TradeData },
         {
          label: "Qty",
          key: "qty" as keyof TradeData,
          fullLabel: "Qty (Executed/Total)",
         },
         { label: "Price", key: "price" as keyof TradeData },
         { label: "Actions", key: null as null },
        ].map((header, idx) => {
         const fieldMap: Record<string, keyof FilterState> = {
          Time: "time",
          Side: "side",
          Product: "product",
         };
         const filterKey =
          header.label in fieldMap ? fieldMap[header.label] : null;
         return (
          <th
           key={idx}
           className="relative px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
           <div className="flex items-center gap-1">
            <span className="hidden sm:inline">
             {header.fullLabel || header.label}
            </span>
            <span className="sm:hidden">{header.label}</span>
            {filterKey && (
             <button
              className="hidden md:block filter-button"
              onClick={() => {
               setTempFilters({
                ...filters,
                [filterKey]: [...filters[filterKey]],
               });
               setFilterDropdown(
                filterDropdown === filterKey ? null : filterKey
               );
              }}>
              <Filter className="h-4 w-4 text-gray-400 hover:text-gray-600" />
             </button>
            )}
            {header.key && renderSortIcon(header.key)}
           </div>
           {filterDropdown === filterKey && filterKey && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded border bg-white shadow-lg p-2 space-y-2 text-sm z-50 filter-dropdown">
             <div className="max-h-48 overflow-y-auto pb-1">
              {uniqueValues(filterKey).map((val) => (
               <label
                key={val}
                className="flex items-center gap-2 py-1 px-1 hover:bg-gray-50">
                <input
                 type="checkbox"
                 checked={tempFilters[filterKey].includes(val)}
                 onChange={() => handleTempChange(filterKey, val)}
                />
                <span className="truncate">{val}</span>
               </label>
              ))}
             </div>
             <div className="flex justify-between pt-2 border-t">
              <button
               onClick={() => applyFilters(filterKey)}
               className="text-blue-600 hover:underline text-xs px-2 py-1">
               Apply
              </button>
              <button
               onClick={() => clearFilters(filterKey)}
               className="text-red-500 hover:underline text-xs px-2 py-1">
               Clear
              </button>
             </div>
            </div>
           )}
          </th>
         );
        })}
       </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
       {paginatedData.length > 0 ? (
        paginatedData.map((order, index) => (
         <tr key={index} className="hover:bg-gray-50">
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900">
           {order.time}
          </td>
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900">
           {order.client}
          </td>
          <td
           className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900 cursor-pointer"
           onDoubleClick={() => toggleTicker(order.ticker)}>
           <div className="flex items-center gap-1">
            {order.ticker}
            {selectedTickers.includes(order.ticker) && (
             <Wifi className="h-4 w-4 text-blue-500" />
            )}
           </div>
          </td>
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm">
           <span
            className={
             order.side === "Buy" ? "text-green-600" : "text-red-600"
            }>
            {order.side}
           </span>
          </td>
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900">
           {order.product}
          </td>
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900">
           {order.qty}
          </td>
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900">
           {order.price}
          </td>
          <td className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm">
           <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
           </button>
          </td>
         </tr>
        ))
       ) : (
        <tr>
         <td
          colSpan={8}
          className="px-6 py-4 text-center text-sm text-gray-500">
          No orders match the current filters
         </td>
        </tr>
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination - Fixed */}
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 border-t">
     {/* Ticker note */}
     <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 sm:mb-0">
      <Info className="h-3 w-3" />
      <span>Double-click on ticker cell to add/remove ticker tag</span>
     </div>

     {/* Pagination controls */}
     <div className="flex items-center justify-end gap-1">
      <button
       className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:hover:bg-transparent"
       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
       disabled={currentPage === 1}>
       Previous
      </button>
      <div className="flex items-center gap-1">
       <span className="px-3 py-1 text-sm text-gray-600">
        Page {currentPage}
       </span>
      </div>
      <button
       className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:hover:bg-transparent"
       onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
       disabled={currentPage === totalPages}>
       Next
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
