"use client";

import { useState, useEffect } from "react";
import { BarChart2, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

const marketData = [
 { name: "SIGNORIA", value: "0.00", color: "text-green-600" },
 { name: "NIFTY BANK", value: "52,323.30", color: "text-green-600" },
 { name: "NIFTY FIN SERVICE", value: "25,255.75", color: "text-green-600" },
 { name: "RELCHEMQ", value: "162.73", color: "text-green-600" },
];

const navItems = [
 { name: "MARKETWATCH", href: "#" },
 { name: "EXCHANGE FILES", href: "#" },
 { name: "PORTFOLIO", href: "#", hasDropdown: true },
 { name: "FUNDS", href: "#", hasDropdown: true },
];

export default function Navbar() {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [windowWidth, setWindowWidth] = useState(0);

 useEffect(() => {
  setWindowWidth(window.innerWidth);

  const handleResize = () => {
   setWindowWidth(window.innerWidth);
   if (window.innerWidth >= 768) {
    setMobileMenuOpen(false);
   }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
 }, []);

 const isMobile = windowWidth < 768;

 return (
  <div className="border-b bg-white">
   <div className="mx-auto max-w-[1400px]">
    <div className="flex items-center justify-between px-4 py-2 md:px-6">
     <div className="flex items-center gap-6 overflow-x-auto">
      <Link href="/" className="flex-shrink-0">
       <BarChart2 className="h-6 w-6 text-amber-600" />
      </Link>

      <div className="hidden sm:flex items-center gap-4 overflow-x-auto">
       {marketData.map((item, index) => (
        <div
         key={index}
         className="flex flex-col items-start whitespace-nowrap text-sm">
         <span className="font-medium text-gray-600">{item.name}</span>
         <div className={`${item.color} w-full flex justify-center`}>
          {item.value}
         </div>
        </div>
       ))}
      </div>
     </div>

     <div className="flex items-center gap-4">
      {isMobile ? (
       <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-gray-600 hover:text-gray-900">
        {mobileMenuOpen ? (
         <X className="h-6 w-6" />
        ) : (
         <Menu className="h-6 w-6" />
        )}
       </button>
      ) : (
       <div className="hidden md:flex items-center gap-6">
        {navItems.map((item, index) => (
         <Link
          key={index}
          href={item.href}
          className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900">
          {item.name}
          {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
         </Link>
        ))}
       </div>
      )}

      <button className="w-9 h-9 rounded-full bg-neutral-400 bg-opacity-20 text-lg font-medium flex items-center justify-center">
       LK
      </button>
     </div>
    </div>
   </div>

   {mobileMenuOpen && (
    <div className="md:hidden bg-white border-t border-gray-200">
     <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
       {marketData.map((item, index) => (
        <div key={index} className="flex flex-col text-sm">
         <span className="font-medium text-gray-600">{item.name}</span>
         <div className={`${item.color}`}>{item.value}</div>
        </div>
       ))}
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-200">
       {navItems.map((item, index) => (
        <Link
         key={index}
         href={item.href}
         className="flex items-center justify-between py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
         {item.name}
         {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
        </Link>
       ))}
      </div>
     </div>
    </div>
   )}
  </div>
 );
}
