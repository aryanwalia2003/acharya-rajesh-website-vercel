import { query } from "./db";

interface PaginationResult<T> {
  data: T[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

/**
 * Encodes cursor data to base64
 */
const encodeCursor = (date: Date, id: string): string => {
  const payload = JSON.stringify({ d: date, i: id });
  return Buffer.from(payload).toString("base64");
};

/**
 * Decodes base64 cursor
 */
const decodeCursor = (cursor: string): { date: Date; id: string } | null => {
  try {
    const payload = Buffer.from(cursor, "base64").toString("utf-8");
    const { d, i } = JSON.parse(payload);
    return { date: new Date(d), id: i };
  } catch {
    return null;
  }
};

/**
 * Fetches paginated data using keyset pagination (created_at, id)
 * Assumes table has `created_at` (timestamp) and `id` (string/uuid) columns.
 * 
 * @param tableName Name of the table to query
 * @param cursor Base64 encoded cursor from previous request (optional)
 * @param limit Number of items to fetch (default 10)
 * @param columns Array of columns to select (default '*')
 * @param whereClause Optional WHERE clause (e.g., "status = 'active'")
 * @param params Optional parameters for the WHERE clause
 */
export const getPaginatedData = async <T extends { id: string; created_at: Date }>(
  tableName: string,
  cursor: string | null = null,
  limit: number = 10,
  columns: string[] = ["*"],
  whereClause: string = "",
  params: any[] = []
): Promise<PaginationResult<T>> => {
  const limitPlusOne = limit + 1;
  const decoded = cursor ? decodeCursor(cursor) : null;
  
  let sql = `SELECT ${columns.join(", ")} FROM ${tableName}`;
  let queryParams = [...params];
  let conditions = [];

  // Add existing WHERE conditions
  if (whereClause) {
    conditions.push(`(${whereClause})`);
  }

  // Add Cursor Condition for Pagination (created_at < date OR (created_at = date AND id < id))
  if (decoded) {
    // Determine parameter indices dynamically
    const p1 = queryParams.length + 1; // date
    const p2 = queryParams.length + 2; // id
    
    conditions.push(`(created_at < $${p1} OR (created_at = $${p1} AND id < $${p2}))`);
    queryParams.push(decoded.date, decoded.id);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Default Sort: Newest First
  sql += ` ORDER BY created_at DESC, id DESC`;
  
  // Limit
  sql += ` LIMIT $${queryParams.length + 1}`;
  queryParams.push(limitPlusOne);

  const result = await query(sql, queryParams);
  const rows = result.rows; // RAW sql returns rows

  const hasNextPage = rows.length > limit;
  const data = hasNextPage ? rows.slice(0, limit) : rows;

  let nextCursor = null;
  if (hasNextPage && data.length > 0) {
    const lastItem = data[data.length - 1];
    nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
  }

  return {
    data: data as T[],
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};
