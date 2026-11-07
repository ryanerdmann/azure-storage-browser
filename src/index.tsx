import React from 'react';
import ReactDOM from 'react-dom';

import { initializeIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';

import { DirectoryBrowser } from './DirectoryBrowser';
import { AzureDirectoryProvider } from './AzureDirectoryProvider';

import { getDefaultWebUri, getDefaultContainerUri, normalizeBasePath } from './Utils';

initializeIcons();
initializeFileTypeIcons();

const root = document.getElementById('root');

let webUri = root?.dataset['webUri'];
let containerUri = root?.dataset['containerUri'];
const basePath = normalizeBasePath(root?.dataset['basePath']);

if (webUri === undefined) {
  webUri = getDefaultWebUri();
}

if (containerUri === undefined) {
  containerUri = getDefaultContainerUri();
}

const provider = new AzureDirectoryProvider(webUri, containerUri);

ReactDOM.render(<DirectoryBrowser provider={provider} basePath={basePath} />, root);
