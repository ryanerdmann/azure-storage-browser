import React from 'react';
import ReactDOM from 'react-dom';

import { initializeIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';

import { DirectoryBrowser } from './DirectoryBrowser';
import { AzureDirectoryProvider } from './AzureDirectoryProvider';

import { getDefaultWebUri, getDefaultContainerUri } from './Utils';

initializeIcons();
initializeFileTypeIcons();

const root = document.getElementById('root');

let webUri = root?.dataset['webUri'];
let containerUri = root?.dataset['containerUri'];

if (webUri === undefined) {
  webUri = getDefaultWebUri();
}

if (containerUri === undefined) {
  containerUri = getDefaultContainerUri();
}

const provider = new AzureDirectoryProvider(webUri, containerUri);
const path = document.location.pathname;

ReactDOM.render(<DirectoryBrowser provider={provider} initialPath={path} />, root);
