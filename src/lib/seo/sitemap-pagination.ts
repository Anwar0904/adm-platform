export type SitemapPage<T> = {
  pagination: { total: number; totalPages: number };
  records: T[];
};

export async function collectSitemapPages<T>(
  fetchPage: (page: number, limit: number) => Promise<SitemapPage<T>>,
  firstPage: SitemapPage<T>,
  options: { pageSize: number; maxRecords: number; batchSize?: number }
): Promise<T[]> {
  const { pageSize, maxRecords, batchSize = 4 } = options;
  const totalPages = firstPage.pagination.totalPages;
  if (
    !Number.isInteger(totalPages) ||
    totalPages < 1 ||
    firstPage.pagination.total > maxRecords ||
    totalPages > Math.ceil(maxRecords / pageSize)
  ) {
    throw new Error("Sitemap content exceeds the supported limit.");
  }

  const records = [...firstPage.records];
  for (let start = 2; start <= totalPages; start += batchSize) {
    const pages = Array.from(
      { length: Math.min(batchSize, totalPages - start + 1) },
      (_, index) => start + index
    );
    const results = await Promise.all(pages.map((page) => fetchPage(page, pageSize)));
    for (const result of results) records.push(...result.records);
  }

  if (records.length !== firstPage.pagination.total) {
    throw new Error("Sitemap pagination returned an incomplete record set.");
  }
  return records;
}
