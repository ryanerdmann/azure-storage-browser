import React from 'react';

import { mergeStyleSets } from '@fluentui/react';
import { IColumn, SelectionMode, Link, Icon } from '@fluentui/react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { FileIconType, getFileTypeIconProps, IFileTypeIconOptions } from '@fluentui/react-file-type-icons';

import filesize from 'filesize';

import { ContentItem, INavigator } from './Types';
import { getFileExtension } from './Utils';

//
// Styles
//

const classNames = mergeStyleSets({
  fileIconImg: {
    verticalAlign: 'middle'
  }
});

const formatDate = (date: Date): string => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}


//
// View Models
//

type DetailsListItem = {
  value: ContentItem;
  onClick: (ev: React.MouseEvent<HTMLElement>) => void;
};

const FileType = (item: DetailsListItem) => {
  const icon: IFileTypeIconOptions = {
    size: 16,
    imageFileType: 'svg',
  };

  if (item.value.isFile) {
    icon.extension =  getFileExtension(item.value.name);
  } else {
    icon.type = FileIconType.folder;
  }

  return <Icon {...getFileTypeIconProps(icon)} className={classNames.fileIconImg} />
}

const FileName = (item: DetailsListItem) => {
  if (item.value.isFile) {
    return <Link href={item.value.uri} target="_blank">{item.value.name}</Link>
  } else {
    return <Link id={item.value.path} onClick={item.onClick}>{item.value.name}</Link>
  }
}

const ModifiedTime = (item: DetailsListItem) => {
  if (item.value.isFile) {
    return <span>{formatDate(item.value.modified)}</span>;
  } else {
    return <span />;
  }
}

const FileSize = (item: DetailsListItem) => {
  if (item.value.isFile) {
    return <span>{filesize(item.value.size)}</span>
  } else {
    return <span />;
  }
}

const columns: IColumn[] = [
  {
    key: 'col0',
    name: 'File Type',
    iconName: 'Page',
    isIconOnly: true,
    minWidth: 16,
    maxWidth: 16,
    onRender: (item: DetailsListItem) => <FileType {...item} />,
  },
  {
    key: 'col1',
    name: 'File Name',
    minWidth: 300,
    maxWidth: 400,
    isRowHeader: true,
    isResizable: true,
    isSortedDescending: false,
    isPadded: true,
    onRender: (item: DetailsListItem) => <FileName {...item} />
  },
  {
    key: 'col2',
    name: 'Date Modified',
    minWidth: 140,
    maxWidth: 160,
    isResizable: true,
    isPadded: true,
    onRender: (item: DetailsListItem) => <ModifiedTime {...item} />,
  },
  {
    key: 'col3',
    name: 'File Size',
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    isCollapsible: true,
    onRender: (item: DetailsListItem) => <FileSize {...item} />
  },
];

const toItems = (contents: ContentItem[] | null, navigator: INavigator): DetailsListItem[] | null => {
  if (contents === null) return null;

  const onClick = (ev: React.MouseEvent<HTMLElement>): void => {
    navigator(ev.currentTarget.id);
  }

  return contents.map(function(value: ContentItem): DetailsListItem {
    return { value, onClick };
  });
}


//
// Component
//

type DirectoryItemProps = {
  contents: ContentItem[] | null;
  navigator: INavigator;
}

export const DirectoryItems = ({ contents, navigator }: DirectoryItemProps) => {
  let items = toItems(contents, navigator);
  return (
    <ShimmeredDetailsList
      setKey="items"
      items={items || []}
      columns={columns}
      selectionMode={SelectionMode.none}
      enableShimmer={!items}
    />
  );
}
