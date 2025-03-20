import { Monitor, Moon, Plus, Play, Clock } from 'lucide-react';

export function Schedule() {
  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-200">Schedule</h2>
      
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-slate-700 text-slate-200 rounded flex items-center gap-2 hover:bg-slate-600">
          <Clock className="h-4 w-4" /> Add to Schedule
        </button>
      </div>
    </div>
  );
}