import React from 'react';
import { useState, useEffect } from 'react';

import { IDirectoryProvider, INavigator, ContentItem } from './Types';
import { DirectoryBreadcrumbs } from './DirectoryBreadcrumbs';
import { DirectoryItems } from './DirectoryItems';

type DirectoryBrowserProps = {
  provider: IDirectoryProvider;
  initialPath: string;
}

export const DirectoryBrowser = ({ provider, initialPath }: DirectoryBrowserProps) => {
  const [path, setPath] = useState(initialPath);
  const [contents, setContents] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    window.document.title = 'Index of ' + path;
    window.history.pushState(null, '', path);
  }, [path]);

  useEffect(() => {
    const listener = () => setPath(document.location.pathname);
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, [path]);

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
