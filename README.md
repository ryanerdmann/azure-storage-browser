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

### Hosting the browser outside the storage account (sub-folder)

The browser can also be served from another web server, under a sub-folder,
while listing a blob container. Configure it with `data-*` attributes on the
root element:

| Attribute            | Description                                                         | Default                                |
|----------------------|---------------------------------------------------------------------|----------------------------------------|
| `data-container-uri` | Container to list                                                   | `$web` container of the hosting account |
| `data-web-uri`       | Base URI that file links point to                                   | The current page's origin              |
| `data-base-path`     | URL path that maps to the container root (kept in the address bar)  | `/`                                    |

Example: `https://example.com/static/` browses the root of the `media` container,
and `https://example.com/static/images/` browses `media/images/`:

```
<div id="root"
  data-base-path="/static/"
  data-container-uri="https://myaccount.blob.core.windows.net/media"
  data-web-uri="https://myaccount.blob.core.windows.net/media">
</div>
<script src="/static/azure-directory-browser.js"></script>
```

Reference the script with an absolute path (starting with `/`) or a full URL.
A relative path would be resolved against the current sub-folder (e.g.
`/static/images/azure-directory-browser.js`) and fail to load on deep links.

Requirements:

- The container's public access level must be **Container** (anonymous list access).
- CORS on the storage account's Blob service must allow `GET` from your site's origin.
- To support deep links and page refreshes on sub-folders, route every path under
  the base path to the page. For Apache with `mod_rewrite`, put this in
  `/static/.htaccess`:

  ```
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^ index.html [L]
  ```

  Existing files (such as the script) are served as they are; every other path
  is handled by the page. Alternatively, if your host allows it (`AllowOverride
  Indexes`), a single `FallbackResource /static/index.html` line does the same.

## Contributing

This software is currently in preview.

To develop locally, use `npm start`.
