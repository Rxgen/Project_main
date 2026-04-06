# Strapi Investors Section - Quick Reference

## 🚀 Quick Setup Checklist

### 1. Components to Create (Order Matters!)

#### Shared Components (Create First)
```
shared/
├── inner-banner
│   ├── banner-title (line1, line2)
│   └── banner-images (banner, petal)
├── link (text, url/href)
├── button-link (label, href, variant)
├── address (company, building, street, city, ...)
├── email-list (label, list)
├── phone-item (label, number)
├── text-item (text)
└── seo (metaTitle, metaDescription, keywords, ...)
```

#### Investor Components (Create Second)
```
investors/
├── intro (paragraphs/content/text)
├── whats-new (title, items[])
│   └── whats-new-item (id, date, headline, category, href)
├── reports-filings (title, leftCard, middleCard, rightCard)
│   ├── report-card-left (badge, items, buttons[])
│   ├── report-card-middle (title, image, buttons[])
│   └── report-card-right (badge, links[], button)
├── corporate-governance (title, backgroundImage, buttons[])
│   └── governance-button (id, label, href, isActive)
├── shareholder-information (title, centerImage, leftColumn[], rightColumn[])
├── tip-section (id, title, content[])
│   └── tip-content-item (type, text, link)
├── unclaimed-form (memberIdPlaceholder, formTypePlaceholder, ...)
├── nodal-officer (name, email)
├── unclaimed-notice (title, registrarAppointment, address, ...)
│   └── unclaimed-link-section (label, text, linkText, linkUrl)
└── transfer-section (title, content, order)
```

---

### 2. Content Types to Create

#### Single Types
1. **investors-page** - Main investors landing page
2. **shareholding-pattern** - Shareholding pattern page
3. **tips-for-shareholders** - Tips page
4. **unclaimed-dividend** - Unclaimed dividend page
5. **transfer-physical-shares** - Transfer shares page

#### Collection Types
1. **investor-faq** (API: `investor-faqs`) - FAQ items
2. **analyst** (API: `analysts`) - Analyst coverage
3. **notice** (API: `notices`) - Corporate notices
4. **policy** (API: `policies`) - Policy documents

---

## 📋 Field Types Quick Guide

| Strapi Type | Use For | Example |
|-------------|---------|---------|
| **Text** | Short text | Title, label, name |
| **Text (Long text)** | Multi-line text | Paragraphs, descriptions |
| **Number** | Numeric values | ID, order, quantity |
| **Boolean** | True/False | isActive, published |
| **Date** | Date values | publishedDate |
| **Email** | Email addresses | analyst email |
| **Media (Single)** | One image/file | Banner, PDF |
| **Media (Multiple)** | Multiple files | Image gallery |
| **Component (single)** | One component | Banner, SEO |
| **Component (repeatable)** | Multiple components | Items array, links |
| **Enumeration** | Dropdown options | Category, variant |
| **Rich Text** | Formatted text | Content with formatting |
| **UID** | Unique identifier | Slug, ID |

---

## 🔗 API Endpoints Reference

### Main Investors Page
```javascript
GET /api/investors-page?populate=deep
```

### Investor FAQs
```javascript
// First 5 FAQs
GET /api/investor-faqs?pagination[start]=0&pagination[limit]=5&sort=id:asc

// Load more (pagination)
GET /api/investor-faqs?pagination[start]=5&pagination[limit]=4&sort=id:asc
```

### Shareholding Pattern
```javascript
GET /api/shareholding-pattern?populate=deep
```

### Analyst Coverage
```javascript
GET /api/analysts?populate=*&sort=order:asc
```

### Notices
```javascript
GET /api/notices?populate=*&sort=order:asc
```

### Policies
```javascript
GET /api/policies?populate=*&sort=order:asc&filters[category][$eq]=Policies
```

### Tips for Shareholders
```javascript
GET /api/tips-for-shareholders?populate=deep
```

### Unclaimed Dividend
```javascript
GET /api/unclaimed-dividend?populate=deep
```

### Transfer Physical Shares
```javascript
GET /api/transfer-physical-shares?populate=deep
```

---

## 🎯 Common Populate Patterns

### Deep Populate (All Nested Data)
```javascript
?populate=deep
```

### Specific Populate (Better Performance)
```javascript
?populate[whatsNew][populate][items][populate]=*
?populate[reportsAndFilings][populate][leftCard][populate]=*
?populate[banner][populate]=*
```

### Filter Examples
```javascript
// By category
?filters[category][$eq]=Policies

// By active status
?filters[isActive][$eq]=true

// Date range
?filters[publishedDate][$gte]=2025-01-01
```

---

## 📝 Content Type Field Summary

### investors-page (Single Type)
```
- intro (component)
- whatsNew (component)
- reportsAndFilings (component)
- corporateGovernance (component)
- shareholderInformation (component)
- banner (component)
- seo (component)
```

### investor-faq (Collection Type)
```
- question (text) ✓
- answer (long text) ✓
- order (number)
```

### analyst (Collection Type)
```
- institution (text) ✓
- analyst (text) ✓
- email (email) ✓
- isActive (boolean)
- order (number)
```

### notice (Collection Type)
```
- period (text) ✓
- englishLink (text) ✓
- marathiLink (text)
- pdfUrl (text) ✓
- isActive (boolean)
- publishedDate (date) ✓
- order (number)
```

### policy (Collection Type)
```
- title (text) ✓
- pdfUrl (text) ✓
- isActive (boolean)
- category (enumeration)
- publishedDate (date) ✓
- order (number)
```

### shareholding-pattern (Single Type)
```
- iframeUrl (text) ✓
- iframeTitle (text)
- banner (component)
- seo (component)
```

### tips-for-shareholders (Single Type)
```
- sections (repeatable component) ✓
- banner (component)
- seo (component)
```

### unclaimed-dividend (Single Type)
```
- title (text)
- form (component) ✓
- instructions (repeatable component)
- nodalOfficer (component)
- decorativeImage (media)
- notice (component)
- banner (component)
- seo (component)
```

### transfer-physical-shares (Single Type)
```
- content (rich text) ✓
- sections (repeatable component)
- banner (component)
- seo (component)
```

---

## ⚙️ Settings Configuration

### For Collection Types:
- ✅ Enable Draft & Publish
- ✅ Enable Internationalization (if needed)
- ✅ Enable Review Workflow (optional)

### For Single Types:
- ✅ Enable Draft & Publish
- ⚠️ Usually no Internationalization needed

---

## 🔐 API Permissions Setup

### Public Role (Settings > Users & Permissions > Roles > Public)
Enable for all content types:
- ✅ `find` - List all entries
- ✅ `findOne` - Get single entry

### Authenticated Role (if needed)
- ✅ `find`
- ✅ `findOne`
- ✅ `create` (if content editors need to create)
- ✅ `update` (if content editors need to edit)
- ✅ `delete` (if content editors need to delete)

---

## 📊 Data Flow

```
Strapi CMS
    ↓
API Endpoints
    ↓
Next.js Pages (fetchAPI)
    ↓
Component Mapping (map functions)
    ↓
React Components
    ↓
Rendered HTML
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property 'attributes' of undefined"
**Solution:** Check populate query - use `populate=deep` or specific paths

### Issue: Images not loading
**Solution:** Use `getStrapiMedia()` helper function to prepend Strapi URL

### Issue: Components not showing
**Solution:** Verify component is added to content type and data is published

### Issue: API returns 403 Forbidden
**Solution:** Check API token in `.env.local` and permissions in Strapi

### Issue: Data structure mismatch
**Solution:** Check field names match exactly (case-sensitive)

---

## 🎨 Component Hierarchy Visual

```
investors-page
├── banner (shared.inner-banner)
├── intro (investors.intro)
├── whatsNew (investors.whats-new)
│   └── items[] (investors.whats-new-item)
├── reportsAndFilings (investors.reports-filings)
│   ├── leftCard (investors.report-card-left)
│   ├── middleCard (investors.report-card-middle)
│   └── rightCard (investors.report-card-right)
├── corporateGovernance (investors.corporate-governance)
│   └── buttons[] (investors.governance-button)
├── shareholderInformation (investors.shareholder-information)
│   ├── leftColumn[] (shared.link)
│   └── rightColumn[] (shared.link)
└── seo (shared.seo)
```

---

## 📞 Support

For detailed field definitions and examples, see:
- `STRAPI_INVESTORS_STRUCTURE.md` - Complete structure documentation
- `src/lib/strapi.js` - API helper functions
- `src/app/investors/` - Page implementations

---

**Quick Start:** Create components first, then content types, then add data!






