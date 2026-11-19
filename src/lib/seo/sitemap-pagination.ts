export type SitemapPage<T> = {
  pagination: { total: number; totalPages: number };
  records: T[];
};

export async function collectSitemapPages<T>(
  fetchPage: (page: number, limit: number) => Promise<SitemapPage<T>>,
  firstPage: SitemapPage<T>,
  options: {
    pageSize: number;
    maxRecords: number;
    batchSize?: number;
    recordKey?: (record: T) => string;
  }
): Promise<T[]> {
  const { pageSize, maxRecords, batchSize = 4 } = options;
  const { total, totalPages } = firstPage.pagination;
  const paginationValuesAreValid =
    Number.isInteger(total) && total >= 0 &&
    Number.isInteger(totalPages) && totalPages >= 0;
  const optionsAreValid =
    Number.isInteger(pageSize) && pageSize > 0 &&
    Number.isInteger(maxRecords) && maxRecords >= 0 &&
    Number.isInteger(batchSize) && batchSize > 0;

  if (
    !paginationValuesAreValid ||
    !optionsAreValid ||
    total > maxRecords ||
    totalPages !== Math.ceil(total / pageSize)
  ) {
    throw new Error("Sitemap pagination metadata or limits are invalid.");
  }

  const expectedFirstPageCount = Math.min(pageSize, total);
  if (firstPage.records.length !== expectedFirstPageCount) {
    throw new Error("Sitemap first page is incomplete.");
  }

  const records = [...firstPage.records];
  const recordKeys = new Set<string>();
  const addRecordKeys = (pageRecords: T[]) => {
    if (!options.recordKey) return;
    for (const record of pageRecords) {
      const key = options.recordKey(record);
      if (recordKeys.has(key)) {
        throw new Error("Sitemap pagination returned duplicate records.");
      }
      recordKeys.add(key);
    }
  };
  addRecordKeys(records);

  for (let start = 2; start <= totalPages; start += batchSize) {
    const pages = Array.from(
      { length: Math.min(batchSize, totalPages - start + 1) },
      (_, index) => start + index
    );
    const results = await Promise.all(pages.map((page) => fetchPage(page, pageSize)));
    for (const [index, result] of results.entries()) {
      const page = pages[index];
      if (
        result.pagination.total !== total ||
        result.pagination.totalPages !== totalPages
      ) {
        throw new Error("Sitemap pagination metadata changed during collection.");
      }

      const expectedPageCount = Math.min(pageSize, total - (page - 1) * pageSize);
      if (result.records.length !== expectedPageCount) {
        throw new Error("Sitemap content page is incomplete.");
      }

      addRecordKeys(result.records);
      records.push(...result.records);
    }
  }

  if (records.length !== total) {
    throw new Error("Sitemap pagination returned an incomplete record set.");
  }
  return records;
}
