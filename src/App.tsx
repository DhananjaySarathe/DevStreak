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
    <div className="flex justify-center mb-6 sm:mb-8 px-4">
      <div className="inline-flex bg-gray-800 rounded-lg p-1 border border-gray-700 w-full max-w-md sm:w-auto">
        <button
          onClick={() => setViewMode('grid')}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
            viewMode === 'grid' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Grid View</span>
          <span className="sm:hidden">Grid</span>
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
            viewMode === 'calendar' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Calendar View</span>
          <span className="sm:hidden">Calendar</span>
        </button>
        <button
          onClick={() => setViewMode('progress')}
          className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${
            viewMode === 'progress' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Progress Card</span>
          <span className="sm:hidden">Progress</span>
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
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Productivity Input - Left Column */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
            {todayLogged ? (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-4">✅</div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-2">
                  Today's productivity logged!
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                  Great job tracking your progress. Come back tomorrow to log another day!
                </p>
                <button
                  onClick={handleChangeEntry}
                  className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors underline"
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
        <div className="lg:col-span-2 order-1 lg:order-2">
          {viewMode === 'grid' ? (
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Your Productivity Journey</h2>
              <ContributionGrid data={productivityData} key={dataVersion} />
            </div>
          ) : (
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white px-4 lg:px-0">Calendar View</h2>
              <CalendarView data={productivityData} key={dataVersion} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            DevStreak
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-2">Track your daily productivity</p>
          <p className="text-sm sm:text-base text-gray-400">Build consistent habits, one day at a time</p>
        </div>

        {/* View Mode Toggle */}
        {renderViewModeButtons()}

        {/* Main Content */}
        {renderMainContent()}

        {/* Streak Counter - Only show in grid and calendar views */}
        {viewMode !== 'progress' && <StreakCounter streak={currentStreak} />}

        {/* Actions - Only show in grid and calendar views */}
        {viewMode !== 'progress' && (
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button
              onClick={() => setShowBugReport(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors border border-orange-500 text-sm sm:text-base"
            >
              <Bug size={16} />
              Report Bug
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors border border-red-500 text-sm sm:text-base"
            >
              <Trash2 size={16} />
              Reset All Data
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-xs sm:text-sm px-4">
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