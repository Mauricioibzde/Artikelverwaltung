# Artikelverwaltung - AI Coding Assistant Instructions

## Project Overview
**Artikelverwaltung** is a full-stack article/inventory management application with a Node.js/Express backend using MongoDB Atlas and a vanilla JavaScript frontend. The app is designed for Render deployment and follows a modular architecture.

## Architecture

### Backend (`back-end/`)
- **Entry Point**: `api.js` - Express server serving both REST API and static frontend files
- **Database**: MongoDB Atlas (Mongoose ORM) - cloud-hosted, credentials in `api.js`
- **Key Pattern**: Express serves frontend as static files via `express.static(path.join(__dirname, '../front-end'))`
- **Port**: Dynamic `process.env.PORT || 3001` for Render compatibility

### API Routes (in `api.js`)
```
POST   /api/products                     - Create article
GET    /api/products                     - Get all articles
GET    /api/products/category/:category  - Filter by category
PUT    /api/products/:name               - Update by name
DELETE /api/products/:name               - Delete by name
GET    /api/products/aggregate/totalByCategory - Aggregated stats
```

### Frontend (`front-end/`)
- **No Build System**: Pure HTML/CSS/JavaScript with ES6 modules
- **Module Pattern**: Each feature in `script/modules/` exports functions used in `main.js`
- **Key Modules**:
  - `formData.js` - Form submission, POST to `/api/products`
  - `loadArticles.js` - Fetch and render article list with edit/delete
  - `customSelect.js` - Custom dropdown for category selection
  - `maskCurrencyInput.js` / `maskTextInput.js` - Input formatting
  - `tutorial.js` - First-time user onboarding modal

### Data Model (Product Schema)
```javascript
{
  name: String,        // Primary identifier for updates/deletes
  price: Number,       // Decimal
  quantity: Number,    // Integer
  category: String,    // From predefined list in customSelect.js
  date: Date           // Auto-generated timestamp
}
```

## Critical Conventions

### 1. Backend Serves Frontend
- Backend does NOT need CORS for same-origin requests in production
- CORS is included for local development convenience
- Frontend uses **relative paths** (`/api/products`) not `http://localhost:3001/api/products`

### 2. Name as Primary Key
- Articles are uniquely identified by `name` field (not `_id`)
- PUT/DELETE routes use `:name` parameter: `/api/products/:name`
- **Important**: If renaming an article, the old name goes in URL, new name in body

### 3. Security Modal Pattern
- Edit/Delete operations require password via `checkPermission()` in `loadArticles.js`
- Hardcoded password: `admin123` (line 25 of `loadArticles.js`)
- Modal does NOT persist login state - password required per action

### 4. German/Portuguese Mixed Naming
- UI labels are German ("Artikelverwaltung", "Elektronik", "Haushalt")
- Code comments and variable names mix German/Portuguese/English
- Categories list in `customSelect.js` lines 8-18

### 5. CSS Organization
- **No CSS preprocessor** - plain CSS with imports via `@import` in `index.css`
- `var.css` - Design tokens (colors, spacing)
- `global.css` - Resets and body styles
- Feature-specific files: `form.css`, `liste.css`, `modal.css`, `custom-select.css`
- Responsive: `mobile.css` for breakpoints

## Development Workflow

### Local Setup
```bash
npm install                    # Install deps (express, mongoose, cors)
npm start                      # Starts api.js on port 3001
# Open front-end/index.html in browser or Live Server
```

### Alternative (json-server for testing)
```bash
npm run server  # Uses server.json as mock DB on port 3000
```

### Deployment (Render)
- Build Command: `npm install`
- Start Command: `npm start`
- **Critical**: MongoDB Atlas Network Access must allow `0.0.0.0/0` (see `DEPLOY.md`)
- Environment variable `PORT` auto-provided by Render

## Common Tasks

### Add New Category
Edit `front-end/script/modules/customSelect.js` lines 8-18, add string to `categories` array.

### Change Admin Password
Edit `front-end/script/modules/loadArticles.js` line 25: `if (input.value === 'admin123')`

### Add New Article Field
1. Update schema in `back-end/api.js` (line 17-24)
2. Update POST/PUT routes to handle new field
3. Add input in `front-end/index.html`
4. Update `formData.js` fetch body
5. Update rendering in `loadArticles.js` line ~70

### Debugging Database Issues
- Connection string in `api.js` line 17 (hardcoded credentials)
- Test MongoDB connection separately with `back-end/mongo.js` (example/test file)
- Check Atlas Network Access if deployed

## File Dependencies
- `main.js` imports all modules - entry point after DOM loaded
- `formData.js` depends on mask modules (`maskCurrencyInput`, `maskTextInput`, `formatQuantity`)
- `loadArticles.js` is self-contained with modal logic
- `index.html` loads `index.css` which imports all other stylesheets

## Important Notes
- **No transpilation/bundling** - ES6 modules must use relative paths with `.js` extension
- **No TypeScript** - plain JavaScript
- **No test suite** - manual testing via UI
- Frontend assumes backend is running on same origin or handles CORS
- MongoDB credentials are **hardcoded** (not environment variables) - see line 17 in `api.js`
