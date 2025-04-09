import React from 'react';
import Image from 'next/image';

interface NavbarProps {
  undo: () => void;
  redo: () => void;
  exportWebsite: () => void;
  historyIndex: number;
  historyLength: number;
}

const Navbar = ({ undo, redo, exportWebsite, historyIndex, historyLength }: NavbarProps) => {
  return (
    <nav className="flex justify-between items-center h-16 px-6 bg-slate-900 text-white shadow-md">
      <div className="flex items-center gap-3">
        <Image 
          src="/parsonlabs.png" 
          alt="ParsonLabs Logo" 
          width={36} 
          height={36} 
          className="rounded-lg"
        />
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-base text-white">ParsonLabs</span>
          <span className="text-sm text-slate-400">Builder</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors text-sm font-medium
            ${historyIndex <= 0 
              ? 'bg-slate-700/30 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-700/50 hover:bg-slate-700/70 text-white cursor-pointer'}`}
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo (Ctrl+Z)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3L3.5 7L7.5 11V8.5C10.5 8.5 12.5 9.5 14 12C13.5 9 11.5 6 7.5 5.5V3Z" fill="currentColor"/>
          </svg>
          <span>Undo</span>
        </button>
        
        <button 
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors text-sm font-medium
            ${historyIndex >= historyLength - 1 
              ? 'bg-slate-700/30 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-700/50 hover:bg-slate-700/70 text-white cursor-pointer'}`}
          onClick={redo}
          disabled={historyIndex >= historyLength - 1}
          title="Redo (Ctrl+Y)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 3L12.5 7L8.5 11V8.5C5.5 8.5 3.5 9.5 2 12C2.5 9 4.5 6 8.5 5.5V3Z" fill="currentColor"/>
          </svg>
          <span>Redo</span>
        </button>
        
        <button 
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium"
          onClick={exportWebsite}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L8 2L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 10V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Export</span>
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors" title="Help">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14V14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 10.5C10 9 11 8.5 11.5 8C12 7.5 12.5 7 12 6C11.5 5 10.5 5 10 5C9.5 5 9 5.1 8.5 5.5C8 5.9 7.5 6.5 7.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
          <span>PL</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;