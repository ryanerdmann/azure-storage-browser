import React from 'react';

import { mergeStyleSets } from '@fluentui/react';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react';

import { Directory, INavigator } from './Types';
import { getPathSegments } from './Utils';

//
// Styles
//

const classNames = mergeStyleSets({
  breadcrumbs: {
    selectors: {
      'li:nth-of-type(1) i': {
        display: 'none'
      },
      'li i': {
        paddingTop: '4px'
      }
    }
  }
});


//
// View Models
//

const INDEX_OF_BREADCRUMB: IBreadcrumbItem[] = [{
  key: '$_INDEX_OF',
  text: 'Index of'
}];

const toBreadcrumbs = (path: string, navigator: INavigator): Array<IBreadcrumbItem> => {

  const onClick = (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem): void => {
    const path = item?.key;
    if (path) navigator(path);
  }

  const toBreadcrumb = (dir: Directory): IBreadcrumbItem => {
    return {
      key: dir.path,
      text: dir.name,
      onClick
    };
  }

  const segments = getPathSegments(path);
  const breadcrumbs = segments.map(toBreadcrumb);
  return INDEX_OF_BREADCRUMB.concat(breadcrumbs);
}


//
// Component
//

type DirectoryBreadcrumbsProps = {
  path: string;
  navigator: INavigator;
}

export const DirectoryBreadcrumbs = ({ path, navigator }: DirectoryBreadcrumbsProps) => {
  const items = toBreadcrumbs(path, navigator);
  return (
    <Breadcrumb
      items={items}
      maxDisplayedItems={10}
      className={classNames.breadcrumbs}
    />
  );
}
