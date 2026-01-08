# Article Metadata Management

## How It Works

The media articles section automatically fetches Open Graph metadata from article URLs at build time. You can manually override specific fields when needed.

### Default Behavior

By default, the system:
1. Fetches Open Graph data from each article URL
2. Extracts title, description, image, site name, and published date
3. Displays the articles in the carousel

### Manual Overrides

Use `article-metadata.json` to override specific fields for any article URL.

**Example:**

```json
{
  "manual": {
    "https://example.com/article": {
      "title": "Custom Title",
      "description": "Custom description"
    }
  }
}
```

### Available Override Fields

- `title` - Article title
- `description` - Article description
- `image` - Article image URL
- `siteName` - Publication name
- `publishedDate` - Publication date (format: "Jan 1, 2024")

**Note:** You only need to specify the fields you want to override. Empty strings or omitted fields will use the fetched Open Graph data.

### When to Use Manual Overrides

1. **Paywalled or 403 errors** - Sites that block automated scraping
2. **Missing or incorrect OG data** - When the site's Open Graph tags are incomplete
3. **Custom descriptions** - When you want a specific Frankencoin-focused description
4. **Translated content** - When you want to provide translations

### Adding New Articles

Simply add the URL to the `articles` array in `src/content/index.json`:

```json
{
  "in_the_media": {
    "articles": [
      "https://example.com/new-article",
      "https://example.com/another-article"
    ]
  }
}
```

The system will automatically fetch metadata at build time.
