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
