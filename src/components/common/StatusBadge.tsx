import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const normalized = (status || '').trim();

  // Color mapping based on specification
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';

  if (
    normalized === 'Completed' ||
    normalized === 'Approved' ||
    normalized === 'Pass' ||
    normalized === 'Feasible' ||
    normalized === 'Customer Accepted' ||
    normalized === 'Fully Cleared' ||
    normalized === 'Paid' ||
    normalized === 'Green' ||
    normalized === 'Resolved' ||
    normalized === 'Closed' ||
    normalized === 'Final Terms Agreed' ||
    normalized === 'Received' ||
    normalized === 'Commercial Production'
  ) {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium';
  } else if (
    normalized === 'In Progress' ||
    normalized === 'Active' ||
    normalized === 'Trial Running' ||
    normalized === 'Vehicle Arranged' ||
    normalized === 'In Transit' ||
    normalized === 'Dispatched' ||
    normalized === 'Assigned' ||
    normalized === 'Sent' ||
    normalized === 'Blue'
  ) {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-300 font-medium';
  } else if (
    normalized === 'Pending' ||
    normalized === 'Awaiting Customer' ||
    normalized === 'Awaiting Approval' ||
    normalized === 'Orange' ||
    normalized === 'Due' ||
    normalized === 'Partially Paid' ||
    normalized === 'Partially Cleared' ||
    normalized === 'Partially Received' ||
    normalized === 'Conditional Pass' ||
    normalized === 'Feasible With Modification' ||
    normalized === 'Amber' ||
    normalized === 'Open' ||
    normalized === 'Waiting' ||
    normalized === 'Waiting Customer' ||
    normalized === 'Waiting Parts'
  ) {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
  } else if (
    normalized === 'Delayed' ||
    normalized === 'Rejected' ||
    normalized === 'Fail' ||
    normalized === 'Not Feasible' ||
    normalized === 'Red' ||
    normalized === 'Overdue' ||
    normalized === 'Cancelled' ||
    normalized === 'Lost' ||
    normalized === 'Hold' ||
    normalized === 'Pending Correction'
  ) {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-300 font-medium';
  } else if (
    normalized === 'Approval Required' ||
    normalized === 'Purple' ||
    normalized === 'Revision Required'
  ) {
    bgClass = 'bg-purple-50 text-purple-700 border-purple-300 font-medium';
  } else if (
    normalized === 'Not Started' ||
    normalized === 'Draft' ||
    normalized === 'Not Due' ||
    normalized === 'Not Applicable' ||
    normalized === 'Grey'
  ) {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap leading-none ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          bgClass.includes('emerald')
            ? 'bg-emerald-500'
            : bgClass.includes('rose')
            ? 'bg-rose-500'
            : bgClass.includes('blue')
            ? 'bg-blue-500'
            : bgClass.includes('amber')
            ? 'bg-amber-500'
            : bgClass.includes('purple')
            ? 'bg-purple-500'
            : 'bg-slate-400'
        }`}
      />
      {normalized}
    </span>
  );
};
