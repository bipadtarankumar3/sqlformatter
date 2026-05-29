import { format } from 'sql-formatter';

/**
 * Maps standard UI dialect names to sql-formatter dialect identifiers.
 */
export const getDialectId = (dialect) => {
  switch (dialect?.toLowerCase()) {
    case 'postgresql':
    case 'postgres':
      return 'postgresql';
    case 'mysql':
      return 'mysql';
    case 'sqlite':
      return 'sqlite';
    case 'sql server':
    case 'sqlserver':
    case 'tsql':
      return 'transactsql';
    case 'mariadb':
      return 'mariadb';
    case 'oracle':
    case 'plsql':
      return 'plsql';
    default:
      return 'sql';
  }
};

/**
 * Formats a SQL query with various options.
 */
export const formatSql = (sql, options = {}) => {
  if (!sql || sql.trim() === '') return '';

  const {
    dialect = 'mysql',
    indentSize = 2,
    useTabs = false,
    keywordCase = 'upper', // 'upper', 'lower', 'preserve'
    compactMode = false,
    preserveComments = true,
  } = options;

  try {
    const formatterOptions = {
      language: getDialectId(dialect),
      tabWidth: useTabs ? undefined : indentSize,
      useTabs: useTabs,
      keywordCase: keywordCase === 'preserve' ? undefined : keywordCase,
      linesBetweenQueries: 2,
    };

    let formatted = format(sql, formatterOptions);

    if (compactMode) {
      // Post-process to remove extra line breaks if compact mode is enabled
      formatted = formatted.replace(/\n\s*\n/g, '\n');
    }

    if (!preserveComments) {
      // Strip block and single-line comments
      formatted = formatted
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/--.*$/gm, '')
        .replace(/^\s*\n/gm, ''); // remove empty lines caused by comment removal
    }

    return formatted;
  } catch (error) {
    console.error('SQL Formatting Error:', error);
    // Return original sql if formatting fails
    return sql;
  }
};

/**
 * Minifies a SQL query by removing unnecessary whitespace and comments.
 */
export const minifySql = (sql) => {
  if (!sql) return { minified: '', originalSize: 0, minifiedSize: 0, ratio: 0 };

  const originalSize = new Blob([sql]).size;

  // Remove block comments
  let minified = sql.replace(/\/\*[\s\S]*?\*\//g, ' ');
  // Remove single line comments
  minified = minified.replace(/--.*$/gm, ' ');
  // Replace all whitespace characters (including newlines) with a single space
  minified = minified.replace(/\s+/g, ' ');
  // Trim spaces around commas, parentheses, operators
  minified = minified
    .replace(/\s*([,()=<>!+*/-])\s*/g, '$1')
    .trim();

  const minifiedSize = new Blob([minified]).size;
  const ratio = originalSize > 0 
    ? Math.max(0, Math.round(((originalSize - minifiedSize) / originalSize) * 100))
    : 0;

  return {
    minified,
    originalSize,
    minifiedSize,
    ratio,
  };
};

/**
 * Validates a SQL query for obvious syntax discrepancies and security risks.
 */
export const validateSql = (sql) => {
  const issues = [];
  const warnings = [];
  const metrics = {
    length: sql ? sql.length : 0,
    words: sql ? sql.trim().split(/\s+/).length : 0,
  };

  if (!sql || sql.trim() === '') {
    return { valid: true, issues, warnings, metrics };
  }

  const cleanSql = sql.toUpperCase().replace(/\/\*[\s\S]*?\*\//g, '').replace(/--.*$/gm, '');

  // 1. Basic Parentheses matching
  const openParenCount = (cleanSql.match(/\(/g) || []).length;
  const closeParenCount = (cleanSql.match(/\)/g) || []).length;
  if (openParenCount !== closeParenCount) {
    issues.push({
      type: 'syntax',
      severity: 'error',
      message: `Unmatched parentheses: found ${openParenCount} opening '(' and ${closeParenCount} closing ')'.`,
    });
  }

  // 2. Quote matching
  const singleQuotes = (cleanSql.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    issues.push({
      type: 'syntax',
      severity: 'error',
      message: `Unclosed single quote. Found odd number (${singleQuotes}) of single quotes.`,
    });
  }

  const doubleQuotes = (cleanSql.match(/"/g) || []).length;
  if (doubleQuotes % 2 !== 0) {
    issues.push({
      type: 'syntax',
      severity: 'error',
      message: `Unclosed double quote. Found odd number (${doubleQuotes}) of double quotes.`,
    });
  }

  // 3. Semicolon warnings (standard practice to terminate statements)
  if (!cleanSql.trim().endsWith(';')) {
    warnings.push({
      type: 'convention',
      severity: 'warning',
      message: 'Statement is missing a terminating semicolon (;). It is recommended to use semicolons to separate statements.',
    });
  }

  // 4. Dangerous query detection
  const hasDrop = /\bDROP\b/i.test(cleanSql);
  const hasTruncate = /\bTRUNCATE\b/i.test(cleanSql);
  const hasDelete = /\bDELETE\b/i.test(cleanSql);
  const hasWhere = /\bWHERE\b/i.test(cleanSql);
  const hasAlter = /\bALTER\b/i.test(cleanSql);

  if (hasDrop) {
    warnings.push({
      type: 'security',
      severity: 'high',
      message: 'CRITICAL WARNING: "DROP" statement detected. This operation will permanently delete database structures.',
    });
  }

  if (hasTruncate) {
    warnings.push({
      type: 'security',
      severity: 'high',
      message: 'CRITICAL WARNING: "TRUNCATE" statement detected. This will instantly empty all records in the target table.',
    });
  }

  if (hasDelete && !hasWhere) {
    warnings.push({
      type: 'security',
      severity: 'high',
      message: 'CRITICAL WARNING: "DELETE" query without "WHERE" clause. This will erase all rows in the table.',
    });
  }

  if (hasAlter) {
    warnings.push({
      type: 'security',
      severity: 'medium',
      message: 'WARNING: "ALTER" statement detected. Be cautious as schema mutations can lock tables.',
    });
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    metrics,
  };
};

/**
 * Performs query analysis to discover tables, columns, joins, aggregates, and potential performance bottlenecks.
 */
export const analyzeQuery = (sql) => {
  const analysis = {
    tables: [],
    columns: [],
    joins: 0,
    subqueries: 0,
    aggregates: [],
    warnings: [],
    complexity: {
      score: 0,
      label: 'Low', // 'Low', 'Medium', 'High', 'Extreme'
    },
  };

  if (!sql || sql.trim() === '') return analysis;

  // Cleanup SQL for regex matching
  const cleanSql = sql.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/--.*$/gm, ' ').replace(/\s+/g, ' ');
  const upperSql = cleanSql.toUpperCase();

  // 1. Joins count
  const joinMatches = upperSql.match(/\bJOIN\b/g) || [];
  analysis.joins = joinMatches.length;

  // 2. Tables used extraction
  // Matches FROM <table_name> or JOIN <table_name> (handling basic aliases or subqueries)
  const fromJoinRegex = /\b(?:FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_$.]*)/gi;
  let match;
  const rawTables = new Set();
  while ((match = fromJoinRegex.exec(cleanSql)) !== null) {
    const tableName = match[1];
    // Filter out SQL keywords that might accidentally be matched
    if (!['SELECT', '(', 'VALUES', 'UNNEST'].includes(tableName.toUpperCase())) {
      rawTables.add(tableName);
    }
  }
  analysis.tables = Array.from(rawTables);

  // 3. Subqueries count
  // Simple heuristic: count SELECTs inside parentheses or nested queries
  const selectMatches = upperSql.match(/\bSELECT\b/g) || [];
  analysis.subqueries = Math.max(0, selectMatches.length - 1);

  // 4. Columns used extraction
  // Simple regex to extract column references (heuristics based on SELECT statement)
  const selectSegmentMatch = cleanSql.match(/\bSELECT\s+(.+?)\s+FROM\b/i);
  if (selectSegmentMatch && selectSegmentMatch[1]) {
    const rawColumns = selectSegmentMatch[1]
      .split(',')
      .map(col => {
        col = col.trim();
        // Remove ALIAS expressions (AS col_alias)
        const asMatch = col.match(/(.+?)\s+AS\s+/i) || col.match(/(.+?)\s+[a-zA-Z_][a-zA-Z0-9_]*$/i);
        const colName = asMatch ? asMatch[1].trim() : col;
        // Strip out functions (e.g. SUM(col) -> col)
        return colName.replace(/[a-zA-Z_][a-zA-Z0-9_]*\(([^)]+)\)/g, '$1').trim();
      })
      .filter(col => col && col !== '*' && !col.startsWith('\'') && !col.startsWith('"') && !isNaN(col));

    const uniqueCols = new Set(rawColumns);
    analysis.columns = Array.from(uniqueCols).slice(0, 15); // limit to 15 columns for visual display
  }

  // 5. Aggregate functions
  const aggregatesMap = {
    SUM: /\bSUM\s*\(/i.test(upperSql),
    COUNT: /\bCOUNT\s*\(/i.test(upperSql),
    AVG: /\bAVG\s*\(/i.test(upperSql),
    MIN: /\bMIN\s*\(/i.test(upperSql),
    MAX: /\bMAX\s*\(/i.test(upperSql),
  };
  Object.keys(aggregatesMap).forEach(key => {
    if (aggregatesMap[key]) {
      analysis.aggregates.push(key);
    }
  });

  // 6. Complexity score computation
  // Base score 10
  let score = 10;
  score += analysis.joins * 15;        // +15 per join
  score += analysis.subqueries * 20;   // +20 per nested subquery
  score += analysis.tables.length * 5;  // +5 per table reference
  score += analysis.aggregates.length * 8; // +8 per aggregate function
  
  if (upperSql.includes('GROUP BY')) score += 12;
  if (upperSql.includes('ORDER BY')) score += 8;
  if (upperSql.includes('HAVING')) score += 15;
  if (upperSql.includes('UNION')) score += 20;
  if (upperSql.includes('PARTITION BY') || upperSql.includes('OVER')) score += 25; // Window functions

  analysis.complexity.score = score;
  if (score < 30) {
    analysis.complexity.label = 'Low';
  } else if (score < 75) {
    analysis.complexity.label = 'Medium';
  } else if (score < 150) {
    analysis.complexity.label = 'High';
  } else {
    analysis.complexity.label = 'Extreme';
  }

  // 7. Performance warnings
  if (upperSql.includes('SELECT *')) {
    analysis.warnings.push({
      code: 'SELECT_ALL',
      severity: 'warning',
      message: 'Avoid "SELECT *". Explicitly name columns to minimize network payload, memory overhead, and leverage index cover.',
    });
  }

  if (analysis.joins > 3) {
    analysis.warnings.push({
      code: 'HIGH_JOIN_COUNT',
      severity: 'warning',
      message: `Query contains ${analysis.joins} joins. Highly-nested table joining can severely degrade search optimizer performance. Verify index alignment on join columns.`,
    });
  }

  if (upperSql.includes('LIKE \'%')) {
    analysis.warnings.push({
      code: 'LEADING_WILDCARD',
      severity: 'warning',
      message: 'Leading wildcard in LIKE clause (e.g. \'%term\') prevents the engine from utilizing standard B-Tree index lookups, forcing full table scans.',
    });
  }

  if (upperSql.includes('GROUP BY') && !upperSql.includes('ORDER BY')) {
    analysis.warnings.push({
      code: 'GROUP_BY_ORDER',
      severity: 'info',
      message: 'Ensure fields in GROUP BY are indexed to skip sort temp-tables if grouping massive datasets.',
    });
  }

  if (analysis.subqueries > 1 && (upperSql.includes('IN (') || upperSql.includes('EXISTS ('))) {
    analysis.warnings.push({
      code: 'SUBQUERY_OPTIMIZE',
      severity: 'info',
      message: 'Deep subqueries found. Consider rewriting IN/EXISTS clauses into explicit INNER or LEFT JOIN structures for improved optimizer scaling.',
    });
  }

  return analysis;
};

/**
 * Highlights SQL code using regex-based tokenization.
 * Returns HTML string with styling classes.
 */
export const highlightSql = (sql) => {
  if (!sql) return '';

  const regex = /(\/\*[\s\S]*?\*\/|--[^\n]*)|('(?:''|[^'])*'|"(?:""|[^"])*")|(\b\d+(?:\.\d+)?\b)|(\b(?:SELECT|FROM|WHERE|INSERT|INTO|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|AND|OR|NOT|IN|IS|NULL|LIKE|ILIKE|AS|UNION|ALL|CREATE|TABLE|DROP|ALTER|TRUNCATE|INDEX|VIEW|DATABASE|WITH|OVER|PARTITION|CASE|WHEN|THEN|ELSE|END|ASC|DESC|TRUE|FALSE|EXISTS|BETWEEN|USING|RETURNING|VALUES|CONSTRAINT|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|CHECK|UNIQUE)\b)|(\b(?:SUM|COUNT|AVG|MIN|MAX|COALESCE|CONCAT|SUBSTR|SUBSTRING|NOW|DATE|YEAR|MONTH|DAY|CAST|ROUND|TRIM|UPPER|LOWER|REPLACE|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD)(?=\s*\())|([+\-*/%=<>!|&^~]+)|([(),.;])|([a-zA-Z_][a-zA-Z0-9_]*)/gi;

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  let lastIndex = 0;
  let html = '';

  sql.replace(regex, (match, comment, string, number, keyword, func, op, punc, word, offset) => {
    // Add any unmatched text (like spaces, newlines) before this match
    if (offset > lastIndex) {
      html += escapeHtml(sql.substring(lastIndex, offset));
    }

    const escaped = escapeHtml(match);
    if (comment !== undefined) {
      html += `<span class="token-comment">${escaped}</span>`;
    } else if (string !== undefined) {
      html += `<span class="token-string">${escaped}</span>`;
    } else if (number !== undefined) {
      html += `<span class="token-number">${escaped}</span>`;
    } else if (keyword !== undefined) {
      html += `<span class="token-keyword">${escaped}</span>`;
    } else if (func !== undefined) {
      html += `<span class="token-function">${escaped}</span>`;
    } else if (op !== undefined) {
      html += `<span class="token-operator">${escaped}</span>`;
    } else if (punc !== undefined) {
      html += `<span class="token-punctuation">${escaped}</span>`;
    } else {
      html += escaped;
    }

    lastIndex = offset + match.length;
    return match;
  });

  // Add any remaining unmatched text
  if (lastIndex < sql.length) {
    html += escapeHtml(sql.substring(lastIndex));
  }

  return html;
};
