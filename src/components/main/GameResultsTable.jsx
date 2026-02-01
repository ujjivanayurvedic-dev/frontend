import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import api from '../../api/api';

// --- CONFIGURATION ---
const COLUMNS = [
  { key: 'DESAWAR', label: 'DS' },
  { key: 'SHRI GANESH', label: 'SG' },
  { key: 'DELHI BAZAR', label: 'DB' },
  { key: 'GALI', label: 'GL' },
  { key: 'GHAZIABAD', label: 'GB' },
  { key: 'FARIDABAD', label: 'FB' },
  { key: 'NOIDA KING', label: 'NK' }
];

// Split columns for Mobile Stacked View
// Table 1: DS, SG, DB, GL
const MOBILE_TABLE_1_COLS = COLUMNS.slice(0, 4);
// Table 2: GB, FB, NK
const MOBILE_TABLE_2_COLS = COLUMNS.slice(4);

// --- HELPER: Generate Empty Data Structure (Instant Load) ---
const generateFullYearData = (dataMap = new Map(), year = new Date().getFullYear()) => {
  const fullYearGroups = [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const monthRows = [];
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const title = `${monthNames[monthIndex]} ${year}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${dayStr}-${monthStr}-${year}`;
      const foundData = dataMap.get(dateStr);
      
      const rowData = foundData ? { ...foundData } : { games: {} };
      rowData.date = dateStr;
      rowData.dayOnly = dayStr;
      
      monthRows.push(rowData);
    }
    fullYearGroups.push({ id: `${monthIndex}-${year}`, title: title, rows: monthRows });
  }
  return fullYearGroups;
};

const GameResultsTable = () => {
  const currentYear = new Date().getFullYear();
  const [allMonthsData, setAllMonthsData] = useState(() => generateFullYearData(new Map(), currentYear));
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => new Date().getMonth());
  const [error, setError] = useState(null);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      try {
        const response = await axios.get(api.NewScrapeData.gameChartFull);
        if (!isMounted) return;

        if (response.data && response.data.success) {
          const rawData = response.data.data;
          let dataYear = currentYear;
          if (rawData.length > 0 && rawData[0].date) {
             dataYear = parseInt(rawData[0].date.split('-')[2], 10);
          }
          const dataMap = new Map();
          rawData.forEach(item => dataMap.set(item.date, item));
          setAllMonthsData(generateFullYearData(dataMap, dataYear));
        }
      } catch (err) {
        console.error(err);
        // Silent fail or minimal error state
      }
    };
    fetchResults();
    return () => { isMounted = false; };
  }, [currentYear]);

  const handlePrevMonth = () => currentMonthIndex > 0 && setCurrentMonthIndex(c => c - 1);
  const handleNextMonth = () => currentMonthIndex < 11 && setCurrentMonthIndex(c => c + 1);
  
  const currentData = allMonthsData[currentMonthIndex];

  return (
    <article className="w-full flex flex-col items-center min-h-[80vh] bg-slate-50">
      
      {/* --- STICKY NAV BAR (Month Selector) --- */}
      <header className="sticky top-0 z-50 w-full bg-slate-100/95 backdrop-blur-sm shadow-md border-b border-gray-300">
        <div className="w-full max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={handlePrevMonth} 
            disabled={currentMonthIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-slate-700 active:scale-95 disabled:opacity-30"
          >
            ←
          </button>
          
          <h1 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-wide">
            {currentData.title}
          </h1>
          
          <button 
            onClick={handleNextMonth} 
            disabled={currentMonthIndex === 11}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 shadow-lg text-white active:scale-95 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl pb-10">
        
        {/* =========================================
            MOBILE VIEW: Two Stacked Tables
           ========================================= */}
        <div className="block md:hidden space-y-8 mt-2">
          
          {/* Table 1: First Batch of Columns */}
          <MobileTableBlock 
            title="Part 1"
            columns={MOBILE_TABLE_1_COLS} 
            rows={currentData.rows} 
            todayStr={todayStr} 
          />

          {/* Table 2: Second Batch of Columns */}
          <MobileTableBlock 
            title="Part 2"
            columns={MOBILE_TABLE_2_COLS} 
            rows={currentData.rows} 
            todayStr={todayStr} 
          />
        </div>


        {/* =========================================
            DESKTOP VIEW: One Unified Table
           ========================================= */}
        <div className="hidden md:block bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 mt-4">
          <table className="w-full text-center border-collapse table-fixed">
            <thead className="bg-slate-800 text-white text-sm sticky top-0 z-40">
              <tr>
                <th className="w-16 p-3 border-r border-slate-600">Day</th>
                {COLUMNS.map(col => (
                  <th key={col.key} className="p-3 border-r border-slate-600">{col.key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {currentData.rows.map((row, idx) => (
                <RowItem 
                  key={row.date} 
                  row={row} 
                  columns={COLUMNS} 
                  idx={idx} 
                  todayStr={todayStr} 
                  isMobile={false}
                />
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </article>
  );
};

// --- SUB-COMPONENTS ---

// 1. Mobile Table Block (Reusable for stacked tables)
const MobileTableBlock = ({ columns, rows, todayStr }) => {
  return (
    <div className="bg-white shadow-md border-y border-gray-200">
      <table className="w-full text-center border-collapse table-fixed">
        {/* Sticky Header: 'top-[65px]' accounts for the sticky Navbar height */}
        <thead className="bg-slate-800 text-white text-[10px] uppercase sticky top-16 z-40 shadow-sm">
          <tr>
            <th className="w-12 py-3 border-r border-slate-600 bg-slate-800">Day</th>
            {columns.map(col => (
              <th key={col.key} className="py-3 border-r border-slate-600 last:border-r-0">
                {col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {rows.map((row, idx) => (
            <RowItem 
              key={row.date} 
              row={row} 
              columns={columns} 
              idx={idx} 
              todayStr={todayStr} 
              isMobile={true}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 2. Single Row Component
const RowItem = React.memo(({ row, columns, idx, todayStr, isMobile }) => {
  const isToday = row.date === todayStr;
  const rowBaseClass = isToday ? 'bg-yellow-100' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50');

  return (
    <tr className={`${rowBaseClass} ${isMobile ? 'h-9' : 'h-10'}`}>
      <td className={`font-black text-gray-700 border-r border-gray-200 ${rowBaseClass}`}>
        {row.dayOnly}
      </td>
      {columns.map(col => (
        <td key={`${row.date}-${col.key}`} className="border-r border-gray-200 font-bold text-slate-900 last:border-r-0">
          {row.games?.[col.key]?.result || <span className="text-gray-200"></span>}
        </td>
      ))}
    </tr>
  );
});

export default GameResultsTable;