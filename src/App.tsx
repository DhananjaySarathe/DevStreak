import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, BarChart3, Bug } from 'lucide-react';
import { ProductivityData, ProductivityLevel } from './types';
import { ContributionGrid } from './components/ContributionGrid';
import { ProductivitySelector } from './components/ProductivitySelector';
import { StreakCounter } from './components/StreakCounter';
import { Toast } from './components/Toast';
import { ProgressCard } from './components/ProgressCard';
import { CalendarView } from './components/CalendarView';
import { BugReportForm } from './components/BugReportForm';
import { loadProductivityData, saveProductivityData, clearAllData } from './utils/storageUtils';
import { calculateCurrentStreak } from './utils/streakUtils';
import { getTodayFormatted } from './utils/dateUtils';

type ViewMode = 'grid' | 'calendar' | 'progress';

function App() {
  const [productivityData, setProductivityData] = useState<ProductivityData>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showBugReport, setShowBugReport] = useState(false);
  const [dataVersion, setDataVersion] = useState(0); // Force re-renders

  // Load data on mount
  useEffect(() => {
    const savedData = loadProductivityData();
    setProductivityData(savedData);
    setCurrentStreak(calculateCurrentStreak(savedData));
  }, []);

  const handleProductivitySelect = (level: ProductivityLevel) => {
    const today = getTodayFormatted();
    const newData = {
      ...productivityData,
      [today]: level,
    };
    
    // Update state and save to localStorage
    setProductivityData(newData);
    saveProductivityData(newData);
    setCurrentStreak(calculateCurrentStreak(newData));
    setDataVersion(prev => prev + 1); // Force component updates
    
    setToastMessage('Productivity logged! 🎉');
    setShowToast(true);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all productivity data? This cannot be undone.')) {
      clearAllData();
      const emptyData = {};
      setProductivityData(emptyData);
      setCurrentStreak(0);
      setDataVersion(prev => prev + 1);
      setToastMessage('All data cleared');
      setShowToast(true);
    }
  };

  const handleChangeEntry = () => {
    const today = getTodayFormatted();
    const newData = { ...productivityData };
    delete newData[today];
    setProductivityData(newData);
    saveProductivityData(newData);
    setCurrentStreak(calculateCurrentStreak(newData));
    setDataVersion(prev => prev + 1);
  };

  const todayLogged = productivityData[getTodayFormatted()] > 0;

  const renderViewModeButtons = () => (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-gray-800 rounded-lg p-1 border border-gray-700">
        <button
          onClick={() => setViewMode('grid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            viewMode === 'grid' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 size={16} />
          Grid View
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            viewMode === 'calendar' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar size={16} />
          Calendar View
        </button>
        <button
          onClick={() => setViewMode('progress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            viewMode === 'progress' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 size={16} />
          Progress Card
        </button>
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (viewMode === 'progress') {
      return (
        <div className="max-w-4xl mx-auto">
          <ProgressCard data={productivityData} key={dataVersion} />
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Productivity Input - Left Column */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {todayLogged ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  Today's productivity logged!
                </h3>
                <p className="text-gray-400 mb-6">
                  Great job tracking your progress. Come back tomorrow to log another day!
                </p>
                <button
                  onClick={handleChangeEntry}
                  className="text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  Want to change your entry?
                </button>
              </div>
            ) : (
              <ProductivitySelector onSelect={handleProductivitySelect} />
            )}
          </div>
        </div>

        {/* Main View - Right Columns */}
        <div className="lg:col-span-2">
          {viewMode === 'grid' ? (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-6 text-white">Your Productivity Journey</h2>
              <ContributionGrid data={productivityData} key={dataVersion} />
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-6 text-white">Calendar View</h2>
              <CalendarView data={productivityData} key={dataVersion} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            DevStreak
          </h1>
          <p className="text-xl text-gray-300 mb-2">Track your daily productivity</p>
          <p className="text-gray-400">Build consistent habits, one day at a time</p>
        </div>

        {/* View Mode Toggle */}
        {renderViewModeButtons()}

        {/* Main Content */}
        {renderMainContent()}

        {/* Streak Counter - Only show in grid and calendar views */}
        {viewMode !== 'progress' && <StreakCounter streak={currentStreak} />}

        {/* Actions - Only show in grid and calendar views */}
        {viewMode !== 'progress' && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowBugReport(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors border border-orange-500"
            >
              <Bug size={16} />
              Report Bug
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors border border-red-500"
            >
              <Trash2 size={16} />
              Reset All Data
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Built for developers who want to track their daily productivity habits
          </p>
        </div>
      </div>

      {/* Toast */}
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Bug Report Modal */}
      {showBugReport && (
        <BugReportForm 
          data={productivityData}
          onClose={() => setShowBugReport(false)}
        />
      )}
    </div>
  );
}

export default App;