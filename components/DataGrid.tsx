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

interface ColumnDefinition<T> {
 key: keyof T | null;
 label: string;
 fullLabel?: string;
 filterable?: boolean;
 sortable?: boolean;
 renderCell?: (value: any, row: T) => React.ReactNode;
}

interface DataGridProps<T> {
 data: T[];
 columns: ColumnDefinition<T>[];
 uniqueIdentifier: keyof T;
 filterableFields?: Array<keyof T>;
 onDownload?: (data: T[]) => void;
 showSearch?: boolean;
 searchPlaceholder?: string;
 rowsPerPage?: number;
 showUserProfile?: boolean;
 userId?: string;
 userName?: string;
 onUserChange?: (userId: string) => void;
 onRowAction?: (row: T, action: string) => void;
 selectableRows?: boolean;
 taggableField?: keyof T;
 allowFiltering?: boolean;
}

interface SortConfig<T> {
 key: keyof T | null;
 direction: "asc" | "desc" | null;
}

type FilterState = Record<string, string[]>;

export default function DataGrid<T extends Record<string, any>>({
 data,
 columns,
 uniqueIdentifier,
 filterableFields = [],
 onDownload,
 showSearch = true,
 searchPlaceholder = "Search...",
 rowsPerPage = 10,
 showUserProfile = false,
 userId,
 userName,
 onUserChange,
 onRowAction,
 selectableRows = false,
 taggableField,
 allowFiltering = true,
}: DataGridProps<T>) {
 const [selectedItems, setSelectedItems] = useState<any[]>([]);
 const [filters, setFilters] = useState<FilterState>({});
 const [tempFilters, setTempFilters] = useState<FilterState>({});
 const [filterDropdown, setFilterDropdown] = useState<string | null>(null);
 const [currentPage, setCurrentPage] = useState<number>(1);
 const [tooltip, setTooltip] = useState<string | null>(null);
 const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
  key: null,
  direction: null,
 });
 const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
 const [searchTerm, setSearchTerm] = useState<string>("");

 useEffect(() => {
  const initialFilters: FilterState = {};
  filterableFields.forEach((field) => {
   initialFilters[field as string] = [];
  });
  setFilters(initialFilters);
  setTempFilters(initialFilters);
 }, [filterableFields]);

 const toggleSelectItem = (item: any) => {
  if (!taggableField) return;

  const value = item[taggableField];
  setSelectedItems((prev) =>
   prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
  );
 };

 const resetAllFilters = () => {
  setSelectedItems([]);
  const resetFilters: FilterState = {};
  filterableFields.forEach((field) => {
   resetFilters[field as string] = [];
  });
  setFilters(resetFilters);
  setTempFilters(resetFilters);
  setSortConfig({ key: null, direction: null });
  setSearchTerm("");
 };

 const handleSort = (key: keyof T) => {
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

 let processedData = [...data];

 if (searchTerm) {
  processedData = processedData.filter((item) => {
   return Object.values(item).some(
    (val) =>
     val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
   );
  });
 }

 processedData = processedData.filter((item) => {
  return Object.entries(filters).every(([field, allowedValues]) => {
   if (!allowedValues.length) return true; // No filter applied
   return allowedValues.includes(item[field]?.toString());
  });
 });

 if (sortConfig.key && sortConfig.direction) {
  processedData.sort((a, b) => {
   const aValue = a[sortConfig.key as keyof T];
   const bValue = b[sortConfig.key as keyof T];

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
 const totalPages = Math.max(1, Math.ceil(processedData.length / rowsPerPage));

 const uniqueValues = (field: string) => {
  const set = new Set<string>(
   data
    .map((item) => item[field]?.toString())
    .filter((val): val is string => val !== undefined && val !== null)
  );
  return Array.from(set);
 };

 const handleTempChange = (filterKey: string, value: string) => {
  setTempFilters((prev) => {
   const alreadySelected = prev[filterKey]?.includes(value) || false;
   return {
    ...prev,
    [filterKey]: alreadySelected
     ? prev[filterKey].filter((v) => v !== value)
     : [...(prev[filterKey] || []), value],
   };
  });
 };

 const applyFilters = (key: string) => {
  setFilters((prev) => ({
   ...prev,
   [key]: tempFilters[key] || [],
  }));
  setFilterDropdown(null);
 };

 const clearFilters = (key: string) => {
  setFilters((prev) => ({ ...prev, [key]: [] }));
  setTempFilters((prev) => ({ ...prev, [key]: [] }));
  setFilterDropdown(null);
 };

 const handleDownload = () => {
  onDownload?.(processedData);
 };

 const renderSortIcon = (key: keyof T) => {
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

 const handleClickOutside = (e: MouseEvent) => {
  if (
   filterDropdown &&
   !(e.target as Element).closest(".filter-dropdown") &&
   !(e.target as Element).closest(".filter-button")
  ) {
   setFilterDropdown(null);
  }
 };

 useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, [filterDropdown]);

 useEffect(() => {
  setCurrentPage(1);
 }, [filters, data, searchTerm]);

 return (
  <div className="space-y-6">
   {/* Header Row with User Profile and Search Bar */}
   <div className="flex flex-col md:flex-row md:items-center gap-4">
    {/* User Profile - Optional */}
    {showUserProfile && (
     <div className="flex items-center gap-2">
      <div className="flex items-center gap-0 bg-gray-50 rounded-lg border-[0.05px] border-gray-400 overflow-hidden w-fit">
       <input
        className="bg-transparent text-sm font-medium px-3 py-2 outline-none w-[85px] border-r border-gray-400"
        value={userId || ""}
        readOnly={!onUserChange}
        onChange={(e) => onUserChange?.(e.target.value)}
       />
       <div className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 cursor-pointer">
        <UserPlus className="h-5 w-5 text-black" />
       </div>
      </div>

      {userName && (
       <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 transition-colors">
        <span>{userName}</span>
        <X className="h-4 w-4 text-gray-500" />
       </button>
      )}
     </div>
    )}

    {/* Search & Tags - mobile responsive */}
    <div className="flex flex-1 flex-wrap items-center gap-3 mt-4 md:mt-0">
     {showSearch && (
      <div className="flex w-full max-w-md items-center gap-2 rounded-lg border bg-white px-3 py-2">
       <Search className="h-5 w-5 text-gray-400" />
       <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchPlaceholder}
        className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
       />
      </div>
     )}

     {/* Selected items */}
     {taggableField && (
      <div className="flex gap-2 flex-wrap">
       {selectedItems.map((item) => (
        <button
         key={item}
         onClick={() => toggleSelectItem({ [taggableField]: item })}
         className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1 text-sm">
         <span>{item}</span>
         <X className="h-4 w-4 text-gray-500" />
        </button>
       ))}
      </div>
     )}

     {/* Action buttons */}
     <div className="ml-auto mr-auto md:mr-0 flex gap-2 mt-4 sm:mt-0">
      {allowFiltering && (
       <button
        className="md:hidden flex items-center justify-center bg-neutral-400 bg-opacity-20 w-20 h-10 font-medium text-base text-black hover:text-gray-600 rounded-lg px-4"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
        Filters
       </button>
      )}

      {onDownload && (
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
          Download data
         </div>
        )}
       </div>
      )}

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
   {allowFiltering && mobileFiltersOpen && (
    <div className="md:hidden bg-white rounded-lg border p-4 space-y-4">
     <div className="flex justify-between items-center">
      <h3 className="font-medium">Filters</h3>
      <X
       className="h-5 w-5 cursor-pointer"
       onClick={() => setMobileFiltersOpen(false)}
      />
     </div>

     {/* Filter groups */}
     {filterableFields.map((filterKey) => (
      <div key={filterKey as string} className="space-y-2">
       <h4 className="text-sm font-medium capitalize">{filterKey as string}</h4>
       <div className="space-y-1">
        {uniqueValues(filterKey as string).map((val) => (
         <label key={val} className="flex items-center gap-2 text-sm">
          <input
           type="checkbox"
           checked={filters[filterKey as string]?.includes(val) || false}
           onChange={() => {
            handleTempChange(filterKey as string, val);
            // Immediately apply on mobile
            setFilters((prev) => {
             const alreadySelected =
              prev[filterKey as string]?.includes(val) || false;
             return {
              ...prev,
              [filterKey as string]: alreadySelected
               ? prev[filterKey as string].filter((v) => v !== val)
               : [...(prev[filterKey as string] || []), val],
             };
            });
           }}
          />
          {val}
         </label>
        ))}
       </div>
      </div>
     ))}

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

   {/* Table Container */}
   <div className="rounded-lg border bg-white">
    {/* Table Header */}
    <div className="relative overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
       <tr>
        {columns.map((column, idx) => {
         const isFilterable =
          column.key && filterableFields.includes(column.key as keyof T);
         const columnKeyString = column.key as string;

         return (
          <th
           key={idx}
           className="relative px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
           <div className="flex items-center gap-1">
            <span className="hidden sm:inline">
             {column.fullLabel || column.label}
            </span>
            <span className="sm:hidden">{column.label}</span>

            {isFilterable && allowFiltering && column.key && (
             <button
              className="hidden md:block filter-button"
              onClick={() => {
               setTempFilters((prevFilters) => ({
                ...prevFilters,
                [columnKeyString]: [...(filters[columnKeyString] || [])],
               }));
               setFilterDropdown(
                filterDropdown === columnKeyString ? null : columnKeyString
               );
              }}>
              <Filter className="h-4 w-4 text-gray-400 hover:text-gray-600" />
             </button>
            )}

            {column.key &&
             column.sortable !== false &&
             renderSortIcon(column.key)}
           </div>

           {filterDropdown === columnKeyString && isFilterable && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded border bg-white shadow-lg p-2 space-y-2 text-sm z-50 filter-dropdown">
             <div className="max-h-48 overflow-y-auto pb-1">
              {uniqueValues(columnKeyString).map((val) => (
               <label
                key={val}
                className="flex items-center gap-2 py-1 px-1 hover:bg-gray-50">
                <input
                 type="checkbox"
                 checked={tempFilters[columnKeyString]?.includes(val) || false}
                 onChange={() => handleTempChange(columnKeyString, val)}
                />
                <span className="truncate">{val}</span>
               </label>
              ))}
             </div>
             <div className="flex justify-between pt-2 border-t">
              <button
               onClick={() => applyFilters(columnKeyString)}
               className="text-blue-600 hover:underline text-xs px-2 py-1">
               Apply
              </button>
              <button
               onClick={() => clearFilters(columnKeyString)}
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
        paginatedData.map((row) => (
         <tr key={row[uniqueIdentifier] as string} className="hover:bg-gray-50">
          {columns.map((column, cellIdx) => {
           if (column.key === null) {
            return (
             <td
              key={cellIdx}
              className="whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900">
              {column.renderCell ? (
               column.renderCell(null, row)
              ) : (
               <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => onRowAction?.(row, "more")}>
                <MoreVertical className="h-5 w-5" />
               </button>
              )}
             </td>
            );
           }

           const cellValue = row[column.key];
           const isTaggable = taggableField && column.key === taggableField;

           return (
            <td
             key={cellIdx}
             className={`whitespace-nowrap px-2 md:px-6 py-4 text-xs md:text-sm text-gray-900 ${
              isTaggable ? "cursor-pointer" : ""
             }`}
             onDoubleClick={
              isTaggable ? () => toggleSelectItem(row) : undefined
             }>
             {column.renderCell ? (
              column.renderCell(cellValue, row)
             ) : isTaggable ? (
              <div className="flex items-center gap-1">
               {cellValue}
               {selectedItems.includes(cellValue) && (
                <Wifi className="h-4 w-4 text-blue-500" />
               )}
              </div>
             ) : column.key === "side" ? (
              <span
               className={
                cellValue === "Buy" ? "text-green-600" : "text-red-600"
               }>
               {cellValue}
              </span>
             ) : (
              cellValue
             )}
            </td>
           );
          })}
         </tr>
        ))
       ) : (
        <tr>
         <td
          colSpan={columns.length}
          className="px-6 py-4 text-center text-sm text-gray-500">
          No data matches the current filters
         </td>
        </tr>
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 border-t">
     {/* Info note */}
     {taggableField && (
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 sm:mb-0">
       <Info className="h-3 w-3" />
       <span>
        Double-click on {taggableField as string} cell to add/remove tag
       </span>
      </div>
     )}

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
        Page {currentPage} of {totalPages}
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
