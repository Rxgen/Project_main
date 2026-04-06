 # Strapi Structure for Investors Section

This document provides a complete Strapi CMS structure for the Investors section and all inner pages.

---

## 📋 Table of Contents

1. [Main Investors Page](#main-investors-page)
2. [Investor FAQs](#investor-faqs)
                   

### Content Type: **Single Type** - `investors-page`

**API ID:** `investors-page`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `intro` | Component (single) | No | `investors.intro` |
| `whatsNew` | Component (single) | No | `investors.whats-new` |
| `reportsAndFilings` | Component (single) | No | `investors.reports-filings` |
| `corporateGovernance` | Component (single) | No | `investors.corporate-governance` |
| `shareholderInformation` | Component (single) | No | `investors.shareholder-information` |
| `banner` | Component (single) | No | `shared.inner-banner` |
| `seo` | Component (single) | No | `shared.seo` |

---

### Component: `investors.intro`

**Category:** `investors`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `paragraphs` | Text (Long text) | No | Multi-line text, split by newlines |
| `content` | Text (Long text) | No | Alternative to paragraphs |
| `text` | Text (Long text) | No | Single text field |

---

### Component: `investors.whats-new`

**Category:** `investors`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | No | Default: "What's New" |
| `items` | Component (repeatable) | No | `investors.whats-new-item` |

#### Component: `investors.whats-new-item`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `id` | Number | Yes | Unique identifier |
| `date` | Date | Yes | Format: "September 17, 2025" |
| `headline` | Text (Long text) | Yes | Can be array or newline-separated |
| `category` | Text | Yes | e.g., "Press Releases" |
| `href` | Text | Yes | Link URL |

---

### Component: `investors.reports-filings`

**Category:** `investors`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | No | Default: "Reports and Filings" |
| `leftCard` | Component (single) | No | `investors.report-card-left` |
| `middleCard` | Component (single) | No | `investors.report-card-middle` |
| `rightCard` | Component (single) | No | `investors.report-card-right` |

#### Component: `investors.report-card-left`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `badge` | Text | Yes | e.g., "Q2 FY26" |
| `items` | Text (Long text) | Yes | Newline-separated list |
| `buttons` | Component (repeatable) | No | `shared.button-link` |

#### Component: `investors.report-card-middle`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text (Long text) | Yes | Can be array or newline-separated |
| `image` | Media (Single) | Yes | Circle image |
| `buttons` | Component (repeatable) | No | `shared.button-link` |

#### Component: `investors.report-card-right`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `badge` | Text | Yes | e.g., "Exchange filings (BSE/NSE)" |
| `links` | Component (repeatable) | No | `shared.link` |
| `button` | Component (single) | No | `shared.button-link` |

---

### Component: `investors.corporate-governance`

**Category:** `investors`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | No | Default: "Corporate Governance" |
| `backgroundImage` | Media (Single) | No | Background image |
| `buttons` | Component (repeatable) | No | `investors.governance-button` |

#### Component: `investors.governance-button`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `id` | Number | Yes | Unique identifier |
| `label` | Text | Yes | Button text |
| `href` | Text | Yes | Link URL |
| `isActive` | Boolean | No | Default: false |

---

### Component: `investors.shareholder-information`

**Category:** `investors`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | No | Default: "Shareholder Information" |
| `centerImage` | Media (Single) | No | Center image |
| `leftColumn` | Component (repeatable) | No | `shared.link` |
| `rightColumn` | Component (repeatable) | No | `shared.link` |

---

## ❓ Investor FAQs

### Content Type: **Collection Type** - `investor-faq`

**API ID:** `investor-faqs`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `question` | Text | Yes | FAQ question |
| `answer` | Text (Long text) | Yes | FAQ answer (supports newlines) |
| `order` | Number | No | Sort order |
| `publishedAt` | DateTime | No | Auto-managed |

**Settings:**
- Enable Draft & Publish: Yes
- Enable Internationalization: Optional

---

## 📊 Shareholding Pattern

### Content Type: **Single Type** - `shareholding-pattern`

**API ID:** `shareholding-pattern`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `iframeUrl` | Text | Yes | Full iframe URL |
| `iframeTitle` | Text | No | Default: "Shareholding Pattern" |
| `banner` | Component (single) | No | `shared.inner-banner` |
| `seo` | Component (single) | No | `shared.seo` |

---

## 👥 Analyst Coverage

### Content Type: **Collection Type** - `analyst`

**API ID:** `analysts`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `institution` | Text | Yes | e.g., "Ambit Capital" |
| `analyst` | Text | Yes | Analyst name |
| `email` | Email | Yes | Analyst email |
| `isActive` | Boolean | No | Default: false |
| `order` | Number | No | Display order |

**Settings:**
- Enable Draft & Publish: Yes

---

## 📢 Notice

### Content Type: **Collection Type** - `notice`

**API ID:** `notices`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | No | Auto-generated from period |
| `period` | Text | Yes | e.g., "Q1 FY 2026" |
| `englishLink` | Text | Yes | English PDF URL |
| `marathiLink` | Text | No | Marathi PDF URL |
| `pdfUrl` | Text | Yes | Main PDF URL (fallback) |
| `isActive` | Boolean | No | Default: false |
| `publishedDate` | Date | Yes | Publication date |
| `order` | Number | No | Display order |

**Settings:**
- Enable Draft & Publish: Yes

---

## 📜 Policies

### Content Type: **Collection Type** - `policy`

**API ID:** `policies`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | Yes | Policy title |
| `pdfUrl` | Text | Yes | PDF document URL |
| `isActive` | Boolean | No | Default: false |
| `category` | Enumeration | No | Options: "Committees of the Board", "Code of Conduct", "Policies" |
| `publishedDate` | Date | Yes | Publication date |
| `order` | Number | No | Display order |

**Settings:**
- Enable Draft & Publish: Yes

---

## 💡 Tips for Shareholders

### Content Type: **Single Type** - `tips-for-shareholders`

**API ID:** `tips-for-shareholders`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `sections` | Component (repeatable) | Yes | `investors.tip-section` |
| `banner` | Component (single) | No | `shared.inner-banner` |
| `seo` | Component (single) | No | `shared.seo` |

#### Component: `investors.tip-section`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `id` | Text (UID) | Yes | Unique ID (e.g., "nomination", "ecs") |
| `title` | Text | Yes | Section title |
| `content` | Component (repeatable) | Yes | `investors.tip-content-item` |

#### Component: `investors.tip-content-item`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `type` | Enumeration | Yes | Options: "text", "text-with-link" |
| `text` | Text (Long text) | Yes | Content text |
| `link` | Component (single) | No | `shared.link` (if type is "text-with-link") |

---

## 💰 Unclaimed Dividend

### Content Type: **Single Type** - `unclaimed-dividend`

**API ID:** `unclaimed-dividend`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | No | Page title |
| `form` | Component (single) | Yes | `investors.unclaimed-form` |
| `instructions` | Component (repeatable) | No | `shared.text-item` |
| `nodalOfficer` | Component (single) | No | `investors.nodal-officer` |
| `decorativeImage` | Media (Single) | No | Decorative image |
| `notice` | Component (single) | No | `investors.unclaimed-notice` |
| `banner` | Component (single) | No | `shared.inner-banner` |
| `seo` | Component (single) | No | `shared.seo` |

#### Component: `investors.unclaimed-form`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `memberIdPlaceholder` | Text | No | Placeholder text |
| `formTypePlaceholder` | Text | No | Placeholder text |
| `formTypeOptions` | Text (Long text) | No | Newline-separated options |
| `submitText` | Text | No | Submit button text |

#### Component: `investors.nodal-officer`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `name` | Text | Yes | Officer name |
| `email` | Email | Yes | Officer email |

#### Component: `investors.unclaimed-notice`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | Yes | Notice title |
| `registrarAppointment` | Text (Long text) | Yes | Registrar information |
| `address` | Component (single) | Yes | `shared.address` |
| `emails` | Component (single) | No | `shared.email-list` |
| `phones` | Component (repeatable) | No | `shared.phone-item` |
| `importantNotice` | Text (Long text) | No | Important notice text |
| `iepfLink` | Component (single) | No | `shared.link` |
| `unclaimedDividend` | Component (single) | No | `investors.unclaimed-link-section` |

#### Component: `investors.unclaimed-link-section`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `label` | Text | Yes | Section label |
| `text` | Text (Long text) | Yes | Description text |
| `linkText` | Text | Yes | Link text |
| `linkUrl` | Text | Yes | Link URL |

---

## 📄 Transfer Physical Shares

### Content Type: **Single Type** - `transfer-physical-shares`

**API ID:** `transfer-physical-shares`

#### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `content` | Rich Text | Yes | Main content |
| `sections` | Component (repeatable) | No | `investors.transfer-section` |
| `banner` | Component (single) | No | `shared.inner-banner` |
| `seo` | Component (single) | No | `shared.seo` |

#### Component: `investors.transfer-section`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text | Yes | Section title |
| `content` | Rich Text | Yes | Section content |
| `order` | Number | No | Display order |

---

## 🔗 Shared Components

### Component: `shared.inner-banner`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Component (single) | Yes | `shared.banner-title` |
| `images` | Component (single) | No | `shared.banner-images` |

#### Component: `shared.banner-title`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `line1` | Text | Yes | First line |
| `line2` | Text | No | Second line |

#### Component: `shared.banner-images`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `banner` | Media (Single) | No | Banner image |
| `petal` | Media (Single) | No | Decorative petal |

---

### Component: `shared.link`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `text` | Text | Yes | Link text |
| `url` | Text | Yes | Link URL |
| `href` | Text | No | Alternative to url |

---

### Component: `shared.button-link`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `label` | Text | Yes | Button text |
| `href` | Text | Yes | Link URL |
| `variant` | Enumeration | No | Options: "outline", "filled", "outline-white", "filled-white" |

---

### Component: `shared.address`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `company` | Text | Yes | Company name |
| `unit` | Text | No | Unit/Floor |
| `building` | Text | Yes | Building name |
| `street` | Text | Yes | Street address |
| `city` | Text | Yes | City |
| `state` | Text | No | State |
| `zipCode` | Text | No | ZIP/Postal code |
| `country` | Text | No | Country |

---

### Component: `shared.email-list`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `label` | Text | Yes | Label text |
| `list` | Text (Long text) | Yes | Newline-separated emails |

---

### Component: `shared.phone-item`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `label` | Text | No | Phone label |
| `number` | Text | Yes | Phone number |

---

### Component: `shared.text-item`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `text` | Text (Long text) | Yes | Text content |

---

### Component: `shared.seo`

**Category:** `shared`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `metaTitle` | Text | Yes | Max 60 characters |
| `metaDescription` | Text | Yes | 150-160 characters |
| `keywords` | Text | No | Comma-separated |
| `canonicalURL` | Text | No | Full URL |
| `metaImage` | Media (Single) | No | 1200x630px recommended |
| `preventIndexing` | Boolean | No | Default: false |

---

## 📝 Implementation Steps

### Step 1: Create Components

1. Go to **Content-Type Builder** > **Components**
2. Create all components listed above in the order:
   - Shared components first
   - Investor-specific components second

### Step 2: Create Content Types

1. Go to **Content-Type Builder** > **Create new collection type** (or single type)
2. Create each content type as specified
3. Add the fields and components
4. Configure settings (Draft & Publish, etc.)

### Step 3: Configure API Permissions

1. Go to **Settings** > **Users & Permissions Plugin** > **Roles** > **Public**
2. Enable `find` and `findOne` for all content types
3. For authenticated access, configure **Authenticated** role

### Step 4: Populate Data

1. Go to **Content Manager**
2. Create entries for each content type
3. Fill in the data according to the structure
4. Publish the entries

---

## 🔍 API Endpoints

After setup, your API endpoints will be:

```
GET /api/investors-page?populate=deep
GET /api/investor-faqs?pagination[start]=0&pagination[limit]=5&sort=id:asc
GET /api/shareholding-pattern?populate=deep
GET /api/analysts?populate=*
GET /api/notices?populate=*
GET /api/policies?populate=*
GET /api/tips-for-shareholders?populate=deep
GET /api/unclaimed-dividend?populate=deep
GET /api/transfer-physical-shares?populate=deep
```

---

## 📊 Data Structure Examples

### Example: Investor FAQs

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "question": "When was Lupin formed and when did it go public?",
        "answer": "1. Lupin Chemicals Pvt Ltd came into existence on March 1, 1983...",
        "order": 1,
        "publishedAt": "2025-01-15T10:00:00.000Z"
      }
    }
  ]
}
```

### Example: Analyst Coverage

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "institution": "Ambit Capital",
        "analyst": "Prashant Nair",
        "email": "prashant.nair@ambit.co",
        "isActive": false,
        "order": 1
      }
    }
  ]
}
```

### Example: Notice

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "period": "Q1 FY 2026",
        "englishLink": "/assets/notices/q1-fy2026-english.pdf",
        "marathiLink": "/assets/notices/q1-fy2026-marathi.pdf",
        "pdfUrl": "/assets/notices/q1-fy2026.pdf",
        "isActive": false,
        "publishedDate": "2025-01-15",
        "order": 1
      }
    }
  ]
}
```

---

## ✅ Checklist

- [ ] Create all shared components
- [ ] Create all investor-specific components
- [ ] Create all content types (single and collection)
- [ ] Configure API permissions
- [ ] Add sample data
- [ ] Test API endpoints
- [ ] Verify data structure matches frontend expectations
- [ ] Set up SEO components for all pages
- [ ] Configure banner components
- [ ] Test populate queries

---

## 🎯 Notes

1. **Populate Strategy**: Use `populate=deep` for nested components, or specify exact paths for better performance
2. **Media URLs**: Strapi returns relative URLs. Use `getStrapiMedia()` helper in frontend
3. **Date Formats**: Store dates in ISO format, format in frontend as needed
4. **Ordering**: Use `order` field with `sort=order:asc` for consistent ordering
5. **Draft & Publish**: Enable for content types that need editorial workflow
6. **Internationalization**: Consider enabling if multi-language support is needed

---

## 📚 Related Files

- `src/lib/strapi.js` - Strapi API helper functions
- `src/app/investors/page.js` - Main investors page
- `src/components/` - All investor components

---

**Last Updated:** 2025-01-15


