export type TableParams = {
  page: number;
  perPage: number;
  sort: string;
  dir: "asc" | "desc";
  q: string;
};

export type RawParams = {
  page?: string; sort?: string; dir?: string; q?: string; per?: string;
};

const PER_PAGE = [10, 25, 50];
export const perPageOptions = PER_PAGE;

export function parseTable(
  sp: RawParams,
  allowedSort: string[],
  def: { sort: string; dir: "asc" | "desc" }
): TableParams {
  const per = Number(sp.per);
  return {
    page: Math.max(1, Math.floor(Number(sp.page)) || 1),
    perPage: PER_PAGE.includes(per) ? per : 10,
    sort: allowedSort.includes(sp.sort ?? "") ? sp.sort! : def.sort,
    dir: sp.dir === "asc" || sp.dir === "desc" ? sp.dir : def.dir,
    q: (sp.q ?? "").trim().slice(0, 100),
  };
}

/** keep the page number inside the real range */
export const clampPage = (total: number, p: TableParams) =>
  Math.min(p.page, Math.max(1, Math.ceil(total / p.perPage)));

/** sortMap maps a column key to a fixed SQL expression (never user input) */
export const orderSql = (sortMap: Record<string, string>, p: TableParams) =>
  `${sortMap[p.sort]} ${p.dir === "asc" ? "ASC" : "DESC"}`;