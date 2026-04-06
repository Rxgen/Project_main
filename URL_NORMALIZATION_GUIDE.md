# URL Normalization Guide - Apply Throughout Website

## Overview
This guide explains how to apply the `normalizeUploadUrl` function throughout your website to handle the `/uploads/` rewrite rule consistently.

## What It Does
The `normalizeUploadUrl` function converts full Azure blob storage URLs to relative paths that use Next.js rewrite rules:
- **Input**: `https://cmsuatlupin.blob.core.windows.net/public/uploads/file.pdf`
- **Output**: `/uploads/file.pdf`
- **Benefit**: Cleaner URLs, centralized management, better caching

---

## Step 1: Utility Function Location ✅ (Already Done)

**File**: `src/lib/strapi-utils.js`

The function `normalizeUploadUrl(url)` is already created and exported. You can import it anywhere:

```javascript
import { normalizeUploadUrl } from '@/lib/strapi-utils';
```

---

## Step 2: Components That Need Updates

Based on codebase analysis, here are the components/files that need the normalization function:

### **High Priority** (Direct PDF/Upload URLs):

1. **`src/components/global/BigCard.js`**
   - Uses: `centerLink`, `pdfUrl`
   - Lines: 58, 65, 80

2. **`src/components/global/SmallCard.js`**
   - Uses: `pdfUrl`
   - Lines: ~52, ~58, ~72

3. **`src/components/global/ExtraSmallCard.js`**
   - Uses: `pdfUrl`
   - Lines: 52, 58, 72

4. **`src/components/global/PdfDownload.js`**
   - Uses: `pdfUrl`
   - Lines: 38-40

5. **`src/components/Presentations.js`**
   - Uses: PDF/document URLs
   - Check for `pdfUrl`, `link`, `document.url` patterns

6. **`src/components/VotingResults.js`**
   - Uses: Document URLs
   - Check for PDF/document links

7. **`src/components/EGM.js`**
   - Uses: Document URLs
   - Check for PDF/document links

8. **`src/components/DeclarationOfResultsEvoting.js`**
   - Uses: Document URLs
   - Check for PDF/document links

9. **`src/components/ShareholderInformation.js`**
   - Uses: Document URLs
   - Check for PDF/document links

10. **`src/components/SEBIRegulations.js`**
    - Uses: `doc.url`
    - Line: 105

### **Medium Priority** (Strapi Data Processing):

11. **`src/lib/strapi.js`**
    - Uses: `getStrapiMedia()` for PDFs
    - Lines: ~1298, ~1354
    - **Note**: Apply normalization after `getStrapiMedia()` call

12. **`src/lib/strapi-reports.js`**
    - Uses: `pdfUrl` in `mapPdfCard()` function
    - Lines: ~56-78, ~88
    - **Note**: Apply normalization in `mapPdfCard()` function

13. **`src/app/media/media-kit/page.js`**
    - Uses: `pdfUrl` from Strapi
    - Lines: 29-35, 59, 67

14. **`src/app/investors/page.js`**
    - Uses: PDF links
    - Lines: ~165

15. **`src/app/investors/other-statutory-information/page.js`**
    - Uses: `pdfUrl` in cards
    - Lines: ~107, ~176, ~199

16. **`src/app/investors/financials/page.js`**
    - Uses: `pdfUrl` in cards
    - Lines: ~89, ~108

17. **`src/app/about-us/leadership/[slug]/page.js`**
    - Uses: `leaderData.otherDirectorships.pdf.url`, `leaderData.pdf.url`
    - Lines: ~252, ~271, ~288

### **Low Priority** (Static/Hardcoded URLs):

18. **`src/app/annual-general-meeting-and-postal-ballot/page.js`**
    - Uses: Hardcoded PDF URLs (mix of `www.lupin.com` and blob storage)
    - Lines: 53-237
    - **Note**: Only normalize blob storage URLs, leave `www.lupin.com` URLs as-is

---

## Step 3: Implementation Pattern

### Pattern A: Component with Direct URL Props

**Before:**
```javascript
export default function MyComponent({ pdfUrl }) {
  return (
    <a href={pdfUrl} target="_blank">Download</a>
  );
}
```

**After:**
```javascript
import { normalizeUploadUrl } from '@/lib/strapi-utils';

export default function MyComponent({ pdfUrl }) {
  const normalizedUrl = normalizeUploadUrl(pdfUrl);
  return (
    <a href={normalizedUrl} target="_blank">Download</a>
  );
}
```

### Pattern B: Component with Multiple URLs

**Before:**
```javascript
export default function MyComponent({ pdfUrl, link }) {
  return (
    <>
      <Link href={link}>View</Link>
      <a href={pdfUrl}>Download</a>
    </>
  );
}
```

**After:**
```javascript
import { normalizeUploadUrl } from '@/lib/strapi-utils';

export default function MyComponent({ pdfUrl, link }) {
  return (
    <>
      <Link href={normalizeUploadUrl(link)}>View</Link>
      <a href={normalizeUploadUrl(pdfUrl)}>Download</a>
    </>
  );
}
```

### Pattern C: Data Mapping Function (Strapi)

**Before:**
```javascript
function mapPdfCard(card) {
  const pdf = card.pdf?.data?.attributes || card.pdf;
  const pdfUrl = pdf ? getStrapiMedia(pdf) : null;
  
  return {
    title: card.title,
    pdfUrl: pdfUrl || '#',
  };
}
```

**After:**
```javascript
import { normalizeUploadUrl } from '@/lib/strapi-utils';

function mapPdfCard(card) {
  const pdf = card.pdf?.data?.attributes || card.pdf;
  const pdfUrl = pdf ? getStrapiMedia(pdf) : null;
  
  return {
    title: card.title,
    pdfUrl: normalizeUploadUrl(pdfUrl) || '#',
  };
}
```

### Pattern D: Array of Documents

**Before:**
```javascript
{notice.documents.map((doc, index) => (
  <Link href={doc.url} key={index}>
    {doc.title}
  </Link>
))}
```

**After:**
```javascript
import { normalizeUploadUrl } from '@/lib/strapi-utils';

{notice.documents.map((doc, index) => (
  <Link href={normalizeUploadUrl(doc.url)} key={index}>
    {doc.title}
  </Link>
))}
```

---

## Step 4: Testing Checklist

After implementing, test each component:

- [ ] PDF links open correctly
- [ ] Download functionality works
- [ ] URLs are normalized (check browser Network tab)
- [ ] No console errors
- [ ] Works with both blob storage URLs and relative paths
- [ ] External URLs (non-blob storage) remain unchanged

---

## Step 5: Quick Reference - Import Statement

Add this import to any component that needs URL normalization:

```javascript
import { normalizeUploadUrl } from '@/lib/strapi-utils';
```

---

## Step 6: Files Already Updated ✅

1. ✅ `src/lib/strapi-utils.js` - Utility function created
2. ✅ `src/components/Notice.js` - Already using the function

---

## Notes

1. **Only normalize blob storage URLs**: The function only converts URLs from `cmsuatlupin.blob.core.windows.net/public/uploads/`. Other URLs remain unchanged.

2. **Apply after Strapi media processing**: If using `getStrapiMedia()`, apply normalization after that call:
   ```javascript
   const pdfUrl = pdf ? normalizeUploadUrl(getStrapiMedia(pdf)) : null;
   ```

3. **Handle null/undefined**: The function handles `null`, `undefined`, and `'#'` safely.

4. **Server vs Client Components**: The function works in both server and client components.

---

## Need Help?

If you encounter issues:
1. Check that the import path is correct: `@/lib/strapi-utils`
2. Verify the URL format matches the blob storage pattern
3. Check browser console for errors
4. Verify the rewrite rule is active in `next.config.mjs`










