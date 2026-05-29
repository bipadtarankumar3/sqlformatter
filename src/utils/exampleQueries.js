export const exampleQueries = [
  {
    id: 'postgres-cte',
    name: 'PostgreSQL: CTE & Window Functions',
    dialect: 'PostgreSQL',
    description: 'Calculates rolling sales averages and customer rank groupings using common table expressions and partition window functions.',
    sql: `WITH quarterly_revenues AS (SELECT customer_id, DATE_TRUNC('quarter', order_date) AS order_quarter, SUM(unit_price * quantity * (1 - discount)) AS total_spent, COUNT(order_id) AS total_orders FROM orders JOIN order_details ON orders.order_id = order_details.order_id GROUP BY customer_id, DATE_TRUNC('quarter', order_date)), customer_rankings AS (SELECT customer_id, order_quarter, total_spent, ROW_NUMBER() OVER (PARTITION BY order_quarter ORDER BY total_spent DESC) AS spend_rank, AVG(total_spent) OVER (PARTITION BY customer_id ORDER BY order_quarter ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS rolling_yearly_avg FROM quarterly_revenues) SELECT c.company_name, cr.order_quarter, ROUND(cr.total_spent::numeric, 2) AS quarterly_spent, cr.spend_rank, ROUND(cr.rolling_yearly_avg::numeric, 2) AS quarterly_rolling_avg FROM customer_rankings cr JOIN customers c ON cr.customer_id = c.customer_id WHERE cr.spend_rank <= 5 ORDER BY cr.order_quarter DESC, cr.total_spent DESC;`
  },
  {
    id: 'mysql-join',
    name: 'MySQL: E-Commerce Multi-Join & Grouping',
    dialect: 'MySQL',
    description: 'Retrieves active inventories, aggregate purchase volumes, and stock evaluations using multiple join conditions and HAVING filters.',
    sql: `SELECT p.product_id, p.product_name, c.category_name, s.supplier_name, SUM(oi.quantity) AS units_sold, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue, p.units_in_stock, CASE WHEN p.units_in_stock = 0 THEN 'OUT OF STOCK' WHEN p.units_in_stock < 10 THEN 'LOW STOCK ALERT' ELSE 'HEALTHY LEVEL' END AS stock_status FROM products p INNER JOIN categories c ON p.category_id = c.category_id INNER JOIN suppliers s ON p.supplier_id = s.supplier_id LEFT JOIN order_items oi ON p.product_id = oi.product_id LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'COMPLETED' WHERE p.discontinued = 0 GROUP BY p.product_id, p.product_name, c.category_name, s.supplier_name HAVING gross_revenue > 1500.00 ORDER BY units_sold DESC, gross_revenue DESC LIMIT 20;`
  },
  {
    id: 'sqlite-schema',
    name: 'SQLite: Table Schema & Index Setup',
    dialect: 'SQLite',
    description: 'Establishes a schema for a user-events database including compound indexes and automatic timestamp triggers.',
    sql: `PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS system_users (
user_id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL UNIQUE,
email TEXT NOT NULL CHECK(email LIKE '%@%.%'),
status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'inactive')),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_activity_logs (
log_id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
event_type TEXT NOT NULL,
ip_address TEXT,
payload JSON,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES system_users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_activity_event_date ON user_activity_logs (event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_users_status_created ON system_users (status, created_at);

CREATE TRIGGER IF NOT EXISTS trg_cleanup_inactive_users 
AFTER INSERT ON user_activity_logs 
WHEN NEW.event_type = 'purge_request'
BEGIN
UPDATE system_users SET status = 'inactive' WHERE user_id = NEW.user_id;
END;`
  },
  {
    id: 'sqlserver-procedure',
    name: 'SQL Server: Transact-SQL Query & Hints',
    dialect: 'SQL Server',
    description: 'Performs locking-safe high performance transaction aggregations with SQL Server system schemas.',
    sql: `SELECT s.store_id, s.store_name, COUNT(o.order_id) AS count_orders, SUM(o.list_price * o.qty) AS total_val, AVG(o.discount * 100.0) AS avg_discount_percentage FROM dbo.stores s WITH (NOLOCK) INNER JOIN dbo.staffs st ON s.store_id = st.store_id INNER JOIN dbo.orders o ON s.store_id = o.store_id WHERE o.order_date >= DATEADD(month, -6, GETDATE()) AND o.order_status IN (2, 3, 4) GROUP BY s.store_id, s.store_name ORDER BY total_val DESC OPTION (RECOMPILE, MAXDOP 4);`
  },
  {
    id: 'mariadb-json',
    name: 'MariaDB: Dynamic JSON Querying',
    dialect: 'MariaDB',
    description: 'Utilizes MariaDB JSON extraction and path manipulation on document columns.',
    sql: `SELECT employee_id, first_name, last_name, JSON_VALUE(additional_info, '$.contact.secondary_phone') AS alt_phone, JSON_QUERY(additional_info, '$.skills') AS skills_array, JSON_UNQUOTE(JSON_EXTRACT(additional_info, '$.address.postal_code')) AS zip_code FROM hr_employees WHERE JSON_EXISTS(additional_info, '$.contact.secondary_phone') = 1 AND JSON_CONTAINS(additional_info, '"SQL"', '$.skills') = 1 ORDER BY last_name ASC, first_name ASC;`
  },
  {
    id: 'oracle-analytical',
    name: 'Oracle: Hierarchical Analytics',
    dialect: 'Oracle',
    description: 'Executes analytical operations, lead/lag comparisons, and hierarchical tree walks inside Oracle SQL.',
    sql: `SELECT employee_id, first_name, last_name, job_id, salary, manager_id, LEVEL, SYS_CONNECT_BY_PATH(last_name, '/') AS organization_path, LAG(salary, 1, 0) OVER (PARTITION BY job_id ORDER BY salary ASC) AS prev_lower_sal, LEAD(salary, 1, 0) OVER (PARTITION BY job_id ORDER BY salary ASC) AS next_higher_sal, ROUND(CUME_DIST() OVER (PARTITION BY job_id ORDER BY salary ASC) * 100, 2) || '%' AS percentile_rank FROM hr_employees START WITH manager_id IS NULL CONNECT BY PRIOR employee_id = manager_id ORDER SIBLINGS BY salary DESC, last_name ASC;`
  }
];
