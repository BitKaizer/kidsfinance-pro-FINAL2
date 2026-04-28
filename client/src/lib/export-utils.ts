// Export utilities for data backup and portability
import { AppState } from './store';

export function exportDataAsJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function downloadJSON(state: AppState, filename: string = 'kidsfinance-backup.json') {
  const data = exportDataAsJSON(state);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDataAsCSV(state: AppState): string {
  let csv = 'KidsFinance Pro - Data Export\n';
  csv += `Exported: ${new Date().toLocaleString()}\n\n`;

  // Progress Summary
  csv += 'PROGRESS SUMMARY\n';
  csv += `Child Name,${state.name}\n`;
  csv += `Total XP,${state.xp}\n`;
  csv += `Lessons Completed,${state.dL.length}\n`;
  csv += `Challenges Completed,${state.dC.length}\n`;
  csv += `Streak Days,${state.streak}\n\n`;

  // Piggy Bank
  csv += 'PIGGY BANK\n';
  csv += `Total Saved,$${(state.piggy || 0).toFixed(2)}\n`;
  if (state.goal) {
    csv += `Savings Goal,${state.goal.n}\n`;
    csv += `Goal Amount,$${state.goal.a}\n`;
  }
  csv += '\n';

  // Transactions
  csv += 'TRANSACTIONS\n';
  csv += 'Date,Time,Type,Description,Amount\n';
  (state.tx || []).forEach(tx => {
    csv += `${tx.date},${tx.time},${tx.type === 'in' ? 'Income' : 'Expense'},${tx.desc},$${tx.amt.toFixed(2)}\n`;
  });

  return csv;
}

export function downloadCSV(state: AppState, filename: string = 'kidsfinance-backup.csv') {
  const data = exportDataAsCSV(state);
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(jsonString: string): AppState | null {
  try {
    const data = JSON.parse(jsonString);
    // Validate basic structure
    if (data.name && typeof data.xp === 'number') {
      return data as AppState;
    }
    return null;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return null;
  }
}

export function generateBackupFilename(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `kidsfinance-backup-${year}${month}${day}-${hours}${minutes}.json`;
}
