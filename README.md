# 🔥 DevStreak

## 📋 Bugs & Improvements

### 🐛 Known Issues

| # | Issue | Description | Priority |
|---|-------|-------------|----------|
| 1 | **Calendar Alignment** | Months above calendar don't align perfectly with days below them. The tracking calendar needs to be more professional like GitHub's | 🔴 High |
| 2 | **Auto-refresh Logic** | User needs to reload page the next day to insert entry for that particular day (need auto refresh or some logic to fix this) | 🟡 Medium |
| 3 | **Color Consistency** | Colors on left side box (productivity input) and streak calendar are different. Should be: Not Productive (Red) → Very Productive (Green) | 🟡 Medium |
| 4 | **Pending Issue** | *To be documented* | ⚪ TBD |

### 💡 Planned Improvements

| # | Improvement | Description | Status |
|---|-------------|-------------|--------|
| 1 | **Mobile Responsiveness** | Make it mobile responsive, especially the Grid View tab | 🔄 In Progress |

---

**💭 Have more suggestions?** Feel free to suggest more bugs/improvements! 😊

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevStreak.git
   cd DevStreak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

---

## 📖 About DevStreak

**DevStreak** is a productivity tracking application designed to help developers and professionals build consistent daily habits. Inspired by GitHub's contribution graph, it provides a visual representation of your daily productivity levels over time.

### ✨ Key Features

- **Daily Productivity Tracking**: Log your productivity level (1-4 scale) each day
- **Visual Progress**: GitHub-style contribution grid showing your productivity journey
- **Multiple Views**: 
  - Grid View: GitHub-style contribution graph
  - Calendar View: Traditional calendar layout
  - Progress Card: Detailed statistics and insights
- **Streak Counter**: Track consecutive productive days
- **Local Storage**: All data is stored locally in your browser
- **Responsive Design**: Works on desktop and mobile devices
- **Bug Reporting**: Built-in bug reporting system
- **Export Functionality**: Download your progress as images

### 🎯 Productivity Levels

1. **Level 1** - Low Productivity (Light color)
2. **Level 2** - Moderate Productivity 
3. **Level 3** - Good Productivity
4. **Level 4** - High Productivity (Darkest color)

---

## 🏗️ Architecture & Data Storage

### Data Storage
The application uses **browser localStorage** for data persistence:

- **Storage Key**: `devstreak-data`
- **Data Format**: JSON object with date strings as keys and productivity levels as values
- **Example**: 
  ```json
  {
    "2024-01-15": 3,
    "2024-01-16": 4,
    "2024-01-17": 2
  }
  ```

### State Management
- **React Hooks**: Uses useState and useEffect for state management
- **Local State**: All application state is managed locally within components
- **No External Store**: No Redux, Zustand, or other state management libraries

### Storage Utilities (`src/utils/storageUtils.ts`)
- `saveProductivityData()` - Saves data to localStorage
- `loadProductivityData()` - Retrieves data from localStorage  
- `clearAllData()` - Removes all stored data

---

## 📁 Folder Structure

```
DevStreak/
├── public/                     # Public assets
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── BugReportForm.tsx   # Bug reporting functionality
│   │   ├── CalendarView.tsx    # Calendar layout view
│   │   ├── ContributionGrid.tsx # GitHub-style grid view
│   │   ├── ProductivitySelector.tsx # Daily productivity input
│   │   ├── ProgressCard.tsx    # Statistics and progress insights
│   │   ├── StreakCounter.tsx   # Consecutive days counter
│   │   ├── Toast.tsx          # Toast notifications
│   │   └── Tooltip.tsx        # Hover tooltips for grid cells
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # Main interfaces and types
│   ├── utils/                  # Utility functions
│   │   ├── dateUtils.ts       # Date formatting and manipulation
│   │   ├── storageUtils.ts    # localStorage operations
│   │   └── streakUtils.ts     # Streak calculation logic
│   ├── App.tsx                # Main application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles
│   └── vite-env.d.ts         # Vite type declarations
├── index.html                 # HTML template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

### Component Overview

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Main application logic and routing |
| `ContributionGrid.tsx` | GitHub-style productivity grid |
| `CalendarView.tsx` | Traditional calendar layout |
| `ProgressCard.tsx` | Statistics and analytics view |
| `ProductivitySelector.tsx` | Daily productivity level input |
| `StreakCounter.tsx` | Current streak display |
| `BugReportForm.tsx` | Bug reporting interface |
| `Toast.tsx` | Success/error notifications |
| `Tooltip.tsx` | Hover information display |

### Utility Functions

| File | Purpose |
|------|---------|
| `dateUtils.ts` | Date formatting (YYYY-MM-DD), today's date |
| `storageUtils.ts` | localStorage operations for data persistence |
| `streakUtils.ts` | Calculate consecutive productive days |

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Screenshot**: html2canvas
- **Linting**: ESLint
- **Package Manager**: npm

---

## 🎨 Design System

- **Color Scheme**: Dark mode with gray-900 background
- **Productivity Colors**: Green gradient (light to dark based on levels)
- **Typography**: System fonts with good contrast
- **Responsive**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Proper contrast ratios and semantic HTML
