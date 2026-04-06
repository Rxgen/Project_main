# PDF URL Normalization with Environment Variables

## Overview

The `normalizeUploadUrl` function has been updated to use environment variables for configuring PDF URL rewrite patterns. This allows you to configure URL normalization without changing code.

## Environment Variables

You can configure PDF URL normalization in your `.env.local` or `.env` file:

### `NEXT_PUBLIC_PDF_REWRITE_SOURCE_PATTERN`

**Description**: Regular expression pattern to match source URLs that should be normalized.

**Default**: `https?://cmsuatlupin\\.blob\\.core\\.windows\\.net/public/uploads/(.+)`

**Example**:
```env
NEXT_PUBLIC_PDF_REWRITE_SOURCE_PATTERN=https?://cmsuatlupin\\.blob\\.core\\.windows\\.net/public/uploads/(.+)
```

**Note**: Escape special regex characters (e.g., `.` becomes `\\.`)

### `NEXT_PUBLIC_PDF_REWRITE_DESTINATION`

**Description**: Destination path prefix for normalized URLs.

**Default**: `/uploads/`

**Example**:
```env
NEXT_PUBLIC_PDF_REWRITE_DESTINATION=/uploads/
```

## Usage Example

### In `.env.local`:

```env
# Custom blob storage pattern
NEXT_PUBLIC_PDF_REWRITE_SOURCE_PATTERN=https?://cmsuatlupin\\.blob\\.core\\.windows\\.net/public/uploads/(.+)

# Custom destination path
NEXT_PUBLIC_PDF_REWRITE_DESTINATION=/uploads/
```

### How It Works:

1. **Input**: `https://cmsuatlupin.blob.core.windows.net/public/uploads/file.pdf`
2. **Pattern Match**: The regex captures `file.pdf` (group 1)
3. **Output**: `/uploads/file.pdf`

## Components Updated

The following components now use `normalizeUploadUrl` for all PDF URLs:

### Global Components:
- ✅ `BigCard.js`
- ✅ `SmallCard.js`
- ✅ `ExtraSmallCard.js`
- ✅ `PdfDownload.js`

### Page Components:
- ✅ `Presentations.js`
- ✅ `Policies.js`
- ✅ `VotingResults.js`
- ✅ `EGM.js`
- ✅ `EmployeeStockOptionSchemes.js`
- ✅ `DeclarationOfResultsEvoting.js`
- ✅ `SEBIRegulations.js`
- ✅ `Notice.js` (already updated)

### Strapi Mapping Functions:
- ✅ `strapi.js` - `mapPolicyData()` and `mapFinancialData()`
- ✅ `strapi-reports.js` - `mapPdfCard()`

### Pages:
- ✅ `media-kit/page.js`
- ✅ `about-us/leadership/[slug]/page.js`

## Benefits

1. **Centralized Configuration**: Change URL patterns via environment variables
2. **Environment-Specific**: Different patterns for dev/staging/production
3. **No Code Changes**: Update URLs without modifying source code
4. **Consistent Normalization**: All PDFs across the site use the same normalization logic

## Testing

To test with a custom pattern:

1. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_PDF_REWRITE_SOURCE_PATTERN=https?://example\\.com/documents/(.+)
   NEXT_PUBLIC_PDF_REWRITE_DESTINATION=/docs/
   ```

2. Restart your development server

3. URLs like `https://example.com/documents/file.pdf` will become `/docs/file.pdf`

## Fallback Behavior

If environment variables are not set or invalid:
- The function falls back to the default blob storage pattern
- Invalid regex patterns are caught and logged as warnings
- The function continues to work with default behavior

