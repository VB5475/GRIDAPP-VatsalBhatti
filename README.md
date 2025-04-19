# Trading Dashboard

Hey there! 👋 This is my trading dashboard app made with Next.js and Tailwind CSS for the 021 Trade internship assignment.

[Check out the deployed app here! 🚀](https://gridapp-vatsal-bhatti-um7y.vercel.app/)

## What I built

I created a responsive trading dashboard that works on both phones and computers. It shows trading data in a table with some cool features.

## Features I added

- 📱 Works on mobile phones and desktop computers
- 🔍 Search box to find anything in the table
- 🔄 Sort columns by clicking the arrow icons
- 🏷️ Filter data using dropdown menus
- 📥 Download button to save data as CSV (Excel file)
- 🍔 Mobile menu that opens when you click the hamburger icon
- 📊 Market data display on the navbar

## How I made it

I used:

- Next.js (React framework)
- Tailwind CSS (for styling without writing tons of CSS)
- TypeScript
- Lucide icons

## Project folders

```
/app - Main pages
/components - Reusable parts like DataGrid and Navbar
```

## Cool stuff I Implemented

1. How to make things work on mobile:

   - Used a hamburger menu for phones
   - Created special filter buttons for small screens
   - Made the table scroll horizontally on phones

2. How to build the data grid:

   - Added sorting when you click column headers
   - Created filter dropdowns
   - Made the search work across all data

3. CSV export:
   - Fixed the formatting so Excel opens it correctly
   - Made sure numbers with commas export properly

## How to run it

1. Clone this repo
2. Install stuff:

```
npm install
```

3. Run the dev server:

```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

Thanks for checking out my project! Looking forward to hearing your feedback! 😊

~ Vatsal Bhatti
