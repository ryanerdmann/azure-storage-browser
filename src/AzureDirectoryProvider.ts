import { ContainerClient, BlobItem, BlobPrefix } from '@azure/storage-blob';

import { IDirectoryProvider, Directory, File, ContentItem } from './Types';
import { getFileName } from './Utils'

export class AzureDirectoryProvider implements IDirectoryProvider {
  private webEndpointUri: string;
  private container: ContainerClient;

  constructor(webEndpointUri: string, containerUri: string) {
    this.webEndpointUri = webEndpointUri;
    this.container = new ContainerClient(containerUri);
  }

  async get(path: string): Promise<ContentItem[]> {
    const prefix = path.substring(1);
    const blobs = this.container.listBlobsByHierarchy('/', { prefix: prefix });

    let contents: ContentItem[] = [];
    for await (const blob of blobs) {
      const item = blob.kind === 'prefix'
        ? this.fromBlobPrefix(path, blob)
        : this.fromBlobItem(path, blob);
      contents.push(item);
    }
    return contents;
  }

  fromBlobPrefix(path: string, prefix: BlobPrefix): ContentItem {
    return {
      isFile: false,
      name: getFileName(prefix.name),
      path: '/' + prefix.name,
    };
  }

  fromBlobItem(path: string, blob: BlobItem): ContentItem {
    return {
      isFile: true,
      name: getFileName(blob.name),
      uri: this.webEndpointUri + '/' + blob.name,
      modified: blob.properties.lastModified,
      size: blob.properties.contentLength ?? 0,
    }
  }
}