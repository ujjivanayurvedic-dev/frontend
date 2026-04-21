/**
 * 🚀 High-Performance Persistence Layer
 * Handles caching and incremental merging of game results.
 */

const STORAGE_KEYS = {
  GAME_RESULTS: 'satta_king_results_cache',
  LAST_SYNC: 'satta_king_last_sync_ts',
};

const Persistence = {
  /**
   * Load base data from LocalStorage
   */
  loadResults: () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return {
        data: cached ? JSON.parse(cached) : [],
        lastSync: lastSync ? parseInt(lastSync) : 0,
      };
    } catch (e) {
      console.error("Failed to load cache:", e);
      return { data: [], lastSync: 0 };
    }
  },

  /**
   * Merge new delta data into the existing cache
   * @param {Array} currentData - The data currently in state/storage
   * @param {Array} newData - The fresh data from API
   * @param {number} syncTimestamp - The timestamp from the server
   */
  mergeAndSave: (currentData, newData, syncTimestamp) => {
    try {
      if (!newData || newData.length === 0) {
        // Just update timestamp if no new data but call was successful
        if (syncTimestamp) {
          localStorage.setItem(STORAGE_KEYS.LAST_SYNC, syncTimestamp.toString());
        }
        return currentData;
      }

      // 1. Create a Map for O(1) lookup
      const dataMap = new Map();
      
      // 2. Add existing data
      currentData.forEach(item => {
        if (item.date) dataMap.set(item.date, item);
      });

      // 3. Merge New Data (Overwrites existing dates)
      newData.forEach(item => {
        if (item.date) {
          // If merging, we want to combine game objects if they exist
          const existing = dataMap.get(item.date);
          if (existing) {
             dataMap.set(item.date, {
               ...existing,
               ...item,
               games: { ...existing.games, ...item.games }
             });
          } else {
             dataMap.set(item.date, item);
          }
        }
      });

      // 4. Convert back to array & Sort by isoDate (descending)
      const mergedArray = Array.from(dataMap.values()).sort((a, b) => {
        return (b.isoDate || 0) - (a.isoDate || 0);
      });

      // 5. Persist to LocalStorage
      // We limit to last 730 days (2 years) to keep storage under 5MB limit safely
      const trimmedArray = mergedArray.slice(0, 730);
      
      localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(trimmedArray));
      if (syncTimestamp) {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, syncTimestamp.toString());
      }

      return trimmedArray;
    } catch (e) {
      console.error("Failed to persist data:", e);
      return currentData; // Return old data on failure
    }
  },

  /**
   * Clear cache (useful for debugging or forced refresh)
   */
  clearCache: () => {
    localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  }
};

export default Persistence;
