import React, { useState } from 'react';
import { Bug, Calendar, Camera, Clock, Monitor, AlertTriangle } from 'lucide-react';
import { ProductivityData } from '../types';
import { getTodayFormatted } from '../utils/dateUtils';

interface BugReportFormProps {
  data: ProductivityData;
  onClose: () => void;
}

export const BugReportForm: React.FC<BugReportFormProps> = ({ data, onClose }) => {
  const [reportData, setReportData] = useState({
    affectedDate: getTodayFormatted(),
    stepsToReproduce: '',
    calendarViewStatus: '',
    progressCardStatus: '',
    gridViewStatus: '',
    expectedBehavior: '',
    actualBehavior: '',
    browserInfo: `${navigator.userAgent}`,
    deviceInfo: `Screen: ${window.screen.width}x${window.screen.height}, Viewport: ${window.innerWidth}x${window.innerHeight}`,
    errorMessages: '',
    timeNoticed: new Date().toISOString(),
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const generateReport = () => {
    const report = `
# DevStreak Bug Report - Productivity Status Synchronization Issue

## Issue Summary
**Issue Type:** Data Synchronization  
**Severity:** High  
**Component:** Productivity Tracking System  
**Date Reported:** ${new Date().toLocaleDateString()}  
**Time Reported:** ${new Date().toLocaleTimeString()}  

---

## Affected Date
**Date of Logged Productive Day:** ${reportData.affectedDate}  
**Current Data Value:** ${data[reportData.affectedDate] || 'No data found'}  

---

## Steps to Reproduce
${reportData.stepsToReproduce || 'Please provide detailed steps...'}

---

## Component Status Analysis

### Calendar View
**Current Status:** ${reportData.calendarViewStatus || 'Not specified'}  
**Expected:** Should show green level 4 indicator for "Highly Productive" day  

### Progress Card View  
**Current Status:** ${reportData.progressCardStatus || 'Not specified'}  
**Expected:** Should reflect in statistics and contribution grid  

### Grid View (GitHub-style)
**Current Status:** ${reportData.gridViewStatus || 'Not specified'}  
**Expected:** Should display darkest green color (level 4)  

---

## Behavior Comparison

### Expected Behavior
${reportData.expectedBehavior || 'All components should consistently show the same productivity level across views'}

### Actual Behavior  
${reportData.actualBehavior || 'Please describe what you observe instead...'}

---

## Technical Environment

### Browser Information
\`\`\`
${reportData.browserInfo}
\`\`\`

### Device Information
\`\`\`
${reportData.deviceInfo}
\`\`\`

### Local Storage Data
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

---

## Error Messages
${reportData.errorMessages || 'No error messages reported'}

---

## Timeline
**Issue First Noticed:** ${reportData.timeNoticed}  
**Data Last Modified:** ${localStorage.getItem('devstreak-data') ? 'Data exists in localStorage' : 'No localStorage data found'}  

---

## Additional Notes
${reportData.additionalNotes || 'No additional notes provided'}

---

## Debugging Checklist
- [ ] Check localStorage data integrity
- [ ] Verify date formatting consistency  
- [ ] Test component re-rendering after data updates
- [ ] Validate productivity level mapping (1-4 vs 0-4)
- [ ] Check for race conditions in state updates
- [ ] Verify tooltip and legend accuracy
- [ ] Test across different browsers
- [ ] Check mobile responsiveness

---

## Potential Root Causes
1. **State Synchronization:** Components not updating after localStorage changes
2. **Date Format Mismatch:** Inconsistent date string formatting across components  
3. **Caching Issues:** Browser or component-level caching preventing updates
4. **Race Conditions:** Rapid state updates causing inconsistent rendering
5. **Data Persistence:** localStorage write/read timing issues

---

*Report generated automatically by DevStreak Bug Reporter v1.0*
    `.trim();

    // Create downloadable report
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devstreak-bug-report-${reportData.affectedDate}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bug className="text-red-400" size={24} />
              <h2 className="text-xl font-semibold text-white">Bug Report - Productivity Status Issue</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Issue Overview */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-400" size={16} />
              <h3 className="font-semibold text-red-400">Issue Description</h3>
            </div>
            <p className="text-gray-300 text-sm">
              A "Highly Productive" day status is not being reflected consistently across the application's components.
              This form will help generate a detailed bug report for diagnosis.
            </p>
          </div>

          {/* Affected Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Calendar size={16} />
              Date of Affected Productive Day
            </label>
            <input
              type="date"
              value={reportData.affectedDate}
              onChange={(e) => handleInputChange('affectedDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-400">
              Current data for this date: {data[reportData.affectedDate] ? `Level ${data[reportData.affectedDate]}` : 'No data found'}
            </p>
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Steps Taken to Mark as "Highly Productive"</label>
            <textarea
              value={reportData.stepsToReproduce}
              onChange={(e) => handleInputChange('stepsToReproduce', e.target.value)}
              placeholder="1. Opened DevStreak application&#10;2. Selected 'Highly Productive' option&#10;3. Confirmed selection&#10;4. Navigated to different views..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
            />
          </div>

          {/* Component Status Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Calendar View Status</label>
              <textarea
                value={reportData.calendarViewStatus}
                onChange={(e) => handleInputChange('calendarViewStatus', e.target.value)}
                placeholder="Describe what you see in calendar view..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-20 resize-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Progress Card Status</label>
              <textarea
                value={reportData.progressCardStatus}
                onChange={(e) => handleInputChange('progressCardStatus', e.target.value)}
                placeholder="Describe progress card display..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-20 resize-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Grid View Status</label>
              <textarea
                value={reportData.gridViewStatus}
                onChange={(e) => handleInputChange('gridViewStatus', e.target.value)}
                placeholder="Describe contribution grid display..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-20 resize-none text-sm"
              />
            </div>
          </div>

          {/* Expected vs Actual Behavior */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-400">Expected Behavior</label>
              <textarea
                value={reportData.expectedBehavior}
                onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                placeholder="All components should show consistent 'Highly Productive' status with darkest green color..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-400">Actual Behavior</label>
              <textarea
                value={reportData.actualBehavior}
                onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                placeholder="Describe what actually happens instead..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
              />
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Monitor size={18} />
              Technical Environment
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Browser Information</label>
                <textarea
                  value={reportData.browserInfo}
                  onChange={(e) => handleInputChange('browserInfo', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-16 resize-none text-xs"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Device Information</label>
                <textarea
                  value={reportData.deviceInfo}
                  onChange={(e) => handleInputChange('deviceInfo', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-16 resize-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Error Messages */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Error Messages (if any)</label>
            <textarea
              value={reportData.errorMessages}
              onChange={(e) => handleInputChange('errorMessages', e.target.value)}
              placeholder="Paste any console errors, warnings, or error messages..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-20 resize-none"
            />
          </div>

          {/* Time Information */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Clock size={16} />
              When was this issue first noticed?
            </label>
            <input
              type="datetime-local"
              value={reportData.timeNoticed.slice(0, 16)}
              onChange={(e) => handleInputChange('timeNoticed', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Additional Notes</label>
            <textarea
              value={reportData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any other relevant information, patterns noticed, or context that might help..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Bug size={16} />
            Generate Bug Report
          </button>
        </div>
      </div>
    </div>
  );
};