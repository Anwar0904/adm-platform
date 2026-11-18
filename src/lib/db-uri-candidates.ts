export function getMongoUriCandidates(
  configuredUri: string,
  fallbackUri: string,
  allowLocalFallback = process.env.NODE_ENV !== "production"
) {
  const candidates = [
    configuredUri,
    ...(allowLocalFallback ? [fallbackUri] : []),
  ].filter(Boolean);

  return candidates.filter((uri, index) => candidates.indexOf(uri) === index);
}
