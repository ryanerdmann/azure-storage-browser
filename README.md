# Azure Storage Browser

Azure Storage Browser is a simple directory browsing application for content in
an Azure Storage Static Website.

It is similar to Directory Indexes (mod_autoindex) in Apache or Directory Browse
in IIS, but implemented as a single-page application for use on modern static
website hosting platforms like Azure Storage.

## Demo

**Example:** https://azdirbrowser.z5.web.core.windows.net/

<img width="742" alt="demo" src="https://user-images.githubusercontent.com/2218182/130366714-73eb5930-e621-4d99-9a0c-5812a8b00474.png">

## Usage

To use the Azure Storage Browser, [enable Static Website hosting](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-host) on your storage account, and upload the following file:

**index.html**

```
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Index of /</title>
</head>
<body>
  <div id="root"></div>
  <script crossorigin src="https://unpkg.com/azure-storage-browser/dist/azure-directory-browser.js"></script>
</body>
</html>
```

## Azure Storage Static Website Requirements

1. **Enable Static Website**  
   - Go to your Azure Storage account.
   - Under the `Static website` section, enable the static website feature.

2. **Upload `index.html`**  
   - Create an `index.html` file with the desired content.
   - Upload the `index.html` file to the `$web` container in your storage account.

3. **Configure Document Name**  
   - Set `index.html` as the default document name in the Static Website configuration.

4. **Define a CORS Rule**  
   - Add a CORS (Cross-Origin Resource Sharing) rule with the following settings:
     - **Allowed Origins:** Add URL of your origin. In this example case, it must be 'https://azdirbrowser.z5.web.core.windows.net'
     - **Allowed Methods:** `GET`, `HEAD`, `OPTIONS`
     - **Allowed Headers:** `*`
     - **Exposed Headers:** `x-ms-*`
     - **Max Age:** `200`

## Contributing

This software is currently in preview.

To develop locally, use `npm start`.
