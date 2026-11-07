import React from 'react';
import { useState, useEffect } from 'react';

import { IDirectoryProvider, INavigator, ContentItem } from './Types';
import { DirectoryBreadcrumbs } from './DirectoryBreadcrumbs';
import { DirectoryItems } from './DirectoryItems';
import { toContainerPath, toLocationPath } from './Utils';

type DirectoryBrowserProps = {
  provider: IDirectoryProvider;
  basePath: string;
}

export const DirectoryBrowser = ({ provider, basePath }: DirectoryBrowserProps) => {
  const [path, setPath] = useState(() => toContainerPath(document.location.pathname, basePath));
  const [contents, setContents] = useState<ContentItem[] | null>(null);

  // Keep the address bar in sync: basePath + container path
  useEffect(() => {
    const locationPath = toLocationPath(path, basePath);
    window.document.title = 'Index of ' + basePath + path.substring(1);
    if (document.location.pathname !== locationPath) {
      window.history.pushState(null, '', locationPath);
    }
  }, [path, basePath]);

  useEffect(() => {
    // Canonicalize the initial URL (e.g. /static or /static/index.html -> /static/) without adding a history entry
    window.history.replaceState(null, '', toLocationPath(path, basePath));

    const listener = () => setPath(toContainerPath(document.location.pathname, basePath));
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, [basePath]);

  useEffect(() => {
    let cancelled = false;

    async function fetchContents() {
      const contents = await provider.get(path);
      if (!cancelled) setContents(contents);
    }

    setContents(null);
    fetchContents();

    return () => { cancelled = true; }
  }, [path]);

  const navigator: INavigator = p => setPath(p);

  return (
    <>
      <DirectoryBreadcrumbs path={path} navigator={navigator} />
      <DirectoryItems contents={contents} navigator={navigator}/>
    </>
  );
};
