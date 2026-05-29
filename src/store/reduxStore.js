import { configureStore, createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const defaults = {
    theme: 'light',
    commandPaletteOpen: false,
    dialect: 'PostgreSQL',
    indentSize: 2,
    useTabs: false,
    keywordCase: 'upper', // 'upper', 'lower', 'preserve'
    compactMode: false,
    preserveComments: true,
    wordWrap: true,
    autoFormat: false,
    history: [],
    favorites: [],
  };

  if (typeof window !== 'undefined') {
    try {
      const persisted = localStorage.getItem('sqlbeast-store-redux');
      if (persisted) {
        return { ...defaults, ...JSON.parse(persisted) };
      }
    } catch (e) {
      console.error('Error loading persisted state:', e);
    }
  }
  return defaults;
};

const sqlSlice = createSlice({
  name: 'sql',
  initialState: getInitialState(),
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setCommandPaletteOpen(state, action) {
      state.commandPaletteOpen = action.payload;
    },
    setDialect(state, action) {
      state.dialect = action.payload;
    },
    setIndentSize(state, action) {
      state.indentSize = Number(action.payload);
    },
    setUseTabs(state, action) {
      state.useTabs = action.payload;
    },
    setKeywordCase(state, action) {
      state.keywordCase = action.payload;
    },
    setCompactMode(state, action) {
      state.compactMode = action.payload;
    },
    setPreserveComments(state, action) {
      state.preserveComments = action.payload;
    },
    setWordWrap(state, action) {
      state.wordWrap = action.payload;
    },
    setAutoFormat(state, action) {
      state.autoFormat = action.payload;
    },
    addHistory(state, action) {
      const { originalSql, formattedSql, dialect } = action.payload;
      if (!originalSql || !originalSql.trim()) return;

      const newItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        originalSql,
        formattedSql,
        dialect,
      };

      // Avoid duplicates if the SQL is exactly the same as the last one
      if (state.history.length > 0 && state.history[0].originalSql.trim() === originalSql.trim()) {
        return;
      }
      const filtered = state.history.filter((item) => item.originalSql.trim() !== originalSql.trim());
      state.history = [newItem, ...filtered].slice(0, 20);
    },
    clearHistory(state) {
      state.history = [];
    },
    addFavorite(state, action) {
      const { name, sql, dialect } = action.payload;
      if (!sql || !sql.trim()) return;

      const newFav = {
        id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name || `Saved Query - ${new Date().toLocaleDateString()}`,
        sql,
        dialect,
        timestamp: new Date().toISOString(),
      };

      state.favorites = [newFav, ...state.favorites];
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter((fav) => fav.id !== action.payload);
    },
  },
});

export const { actions } = sqlSlice;

export const store = configureStore({
  reducer: {
    sql: sqlSlice.reducer,
  },
});

// Subscribe to store updates to persist to localStorage
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      const state = store.getState().sql;
      // We don't want to persist the commandPaletteOpen state
      const { commandPaletteOpen, ...toPersist } = state;
      localStorage.setItem('sqlbeast-store-redux', JSON.stringify(toPersist));
    } catch (e) {
      console.error('Error saving persisted state:', e);
    }
  });
}
