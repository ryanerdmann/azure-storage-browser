export interface Directory
{
  name: string;
  path: string;
}

export interface File
{
  name: string;
  uri: string;
  modified: Date;
  size: number;
}

export type ContentItem =
  ({ isFile: true } & File) |
  ({ isFile: false } & Directory);

export interface IDirectoryProvider
{
  get(path: string): Promise<ContentItem[]>;
}

export interface INavigator
{
  (path: string): void;
}
