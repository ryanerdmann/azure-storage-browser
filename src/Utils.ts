import { Directory } from "./Types";

export const getPathSegments = (path: string): Directory[] => {
  if (!path.startsWith('/') || !path.endsWith('/')) {
    throw 'Invalid path';
  }

  // Example: /
  // Example: /pictures/
  // Example: /pictues/nature/

  let segments: Directory[] = [];

  let idx = 0;
  while (idx >= 0) {
    const prefix = path.substring(0, idx + 1);
    const name = prefix === '/' ? prefix : getFileName(prefix);

    segments.push({ name: name, path: prefix });
    idx = path.indexOf('/', idx + 1);
  }

  return segments;
};

export const getFileExtension = (name: string): string => {
  const idx = name.lastIndexOf('.');
  if (idx > 0) return name.substring(idx + 1);
  return '';
};

export const getFileName = (path: string): string => {
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }

  const idx = path.lastIndexOf('/');
  if (idx > 0) {
    path = path.substring(idx + 1);
  }

  return path;
}

export const getDefaultWebUri = (): string => {
  return window.location.protocol + '//' + window.location.hostname;
}

export const getDefaultContainerUri = (): string => {
  const WEB = '.web.';
  const BLOB = '.blob.';

  const host = window.location.hostname;

  const suffixIdx = host.lastIndexOf(WEB);
  if (suffixIdx < 0) {
    throw 'Cannot detect storage endpoint. Configure with data-container-uri';
  }

  const accountIdx = host.indexOf('.');
  if (accountIdx < 0) {
    throw 'Cannot detect storage endpoint. Configure with data-container-uri';
  }

  const hostSuffix = host.substring(suffixIdx + WEB.length);
  const accountName = host.substring(0, accountIdx);

  return window.location.protocol + '//' + accountName + BLOB + hostSuffix + '/$web';
}

// Ensures a base path has a leading and trailing slash. Example: 'static' -> '/static/'
export const normalizeBasePath = (basePath: string | undefined): string => {
  let p = (basePath ?? '/').trim();
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p = p + '/';
  return p;
};

// Converts a browser location pathname (URL-encoded) into a directory path inside
// the container, relative to basePath. Example: ('/static/foo%20bar/', '/static/') -> '/foo bar/'
export const toContainerPath = (pathname: string, basePath: string): string => {
  let p = pathname;
  try { p = decodeURIComponent(pathname); } catch { /* keep raw */ }

  const baseNoSlash = basePath.substring(0, basePath.length - 1);
  if (p.startsWith(basePath)) {
    p = p.substring(basePath.length);
  } else if (p === baseNoSlash) {
    p = '';
  }

  // Drop the hosting page's file name (index.html); treat any other last segment
  // as a folder, so /static/a/b/c loads the same folder as /static/a/b/c/
  p = p.replace(/(^|\/)index\.html?$/i, '$1');
  if (p !== '' && !p.endsWith('/')) p += '/';

  return '/' + p.replace(/^\/+/, '');
};

// Converts a container directory path into the URL pathname shown in the browser.
// Example: ('/foo bar/', '/static/') -> '/static/foo%20bar/'
export const toLocationPath = (path: string, basePath: string): string => {
  const encoded = path.substring(1).split('/').map(encodeURIComponent).join('/');
  return basePath + encoded;
};
