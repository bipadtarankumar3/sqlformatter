'use client';

import { useSelector, useDispatch } from 'react-redux';
import { actions } from './reduxStore';

export function useSqlStore(selectorFn) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.sql);

  // Expose both variables and state mutations wrapped in dispatch calls
  const stateAndActions = {
    ...state,
    setTheme: (theme) => dispatch(actions.setTheme(theme)),
    toggleTheme: () => dispatch(actions.toggleTheme()),
    setCommandPaletteOpen: (isOpen) => dispatch(actions.setCommandPaletteOpen(isOpen)),
    setDialect: (dialect) => dispatch(actions.setDialect(dialect)),
    setIndentSize: (indentSize) => dispatch(actions.setIndentSize(indentSize)),
    setUseTabs: (useTabs) => dispatch(actions.setUseTabs(useTabs)),
    setKeywordCase: (keywordCase) => dispatch(actions.setKeywordCase(keywordCase)),
    setCompactMode: (compactMode) => dispatch(actions.setCompactMode(compactMode)),
    setPreserveComments: (preserveComments) => dispatch(actions.setPreserveComments(preserveComments)),
    setWordWrap: (wordWrap) => dispatch(actions.setWordWrap(wordWrap)),
    setAutoFormat: (autoFormat) => dispatch(actions.setAutoFormat(autoFormat)),
    addHistory: (originalSql, formattedSql, dialect) => dispatch(actions.addHistory({ originalSql, formattedSql, dialect })),
    clearHistory: () => dispatch(actions.clearHistory()),
    addFavorite: (name, sql, dialect) => dispatch(actions.addFavorite({ name, sql, dialect })),
    removeFavorite: (id) => dispatch(actions.removeFavorite(id)),
  };

  if (selectorFn) {
    return selectorFn(stateAndActions);
  }
  return stateAndActions;
}
