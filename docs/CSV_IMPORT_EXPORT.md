# CSV Import/Export Feature

## Overview
The CSV import/export feature allows users to bulk manage transactions by importing from and exporting to CSV files.

## Components

### API Routes
1. **`/api/transactions/export`** (GET)
   - Exports transactions to CSV format
   - Supports date range filtering via query params
   - Returns downloadable CSV file with proper headers
   - Includes category names in export

2. **`/api/transactions/import`** (POST)
   - Imports transactions from parsed CSV data
   - Auto-categorizes transactions if category not provided
   - Returns success/failure counts and error messages
   - Validates dates and amounts before import

### UI Components
- **`CSVActions`** - Main component with import/export buttons
  - Export button triggers CSV download
  - Import button opens file picker
  - Shows success/error messages
  - Includes CSV format documentation
  - Provides sample CSV template download

### Data Flow

#### Export
1. User clicks "Export CSV" button
2. CSVActions calls `/api/transactions/export` with date filters
3. Server fetches transactions with category info
4. Generates CSV using `generateCSV()` helper
5. Returns CSV file with proper Content-Disposition header
6. Browser downloads file automatically

#### Import
1. User selects CSV file
2. `parseCSV()` uses PapaParse to parse file
3. `normalizeCSVData()` cleans and validates data
4. Client sends parsed data to `/api/transactions/import`
5. Server validates each transaction
6. Auto-categorizes using existing rules
7. Creates transactions in database
8. Returns import results
9. Page refreshes to show new transactions

## CSV Format

### Required Columns
- `date` - ISO date format (YYYY-MM-DD)
- `amount` - Numeric value
- `description` - Transaction description

### Optional Columns
- `category` - Category name (auto-categorized if empty)
- `paymentMethod` - One of: CASH, DEBIT_CARD, CREDIT_CARD, E_WALLET, BANK_TRANSFER, AUTO_DEBIT, OTHER
- `tags` - Comma-separated tags

### Example
```csv
date,amount,description,category,paymentMethod,tags
2025-11-15,50000,Grocery shopping,Food & Dining,DEBIT_CARD,"groceries,weekly"
2025-11-14,15000,Coffee at Starbucks,Food & Dining,E_WALLET,coffee
```

## Features
- ✅ Export filtered transactions based on date range
- ✅ Import with validation and error reporting
- ✅ Auto-categorization during import
- ✅ Payment method mapping (aliases supported)
- ✅ Success/failure feedback with counts
- ✅ Sample CSV template for users
- ✅ Auto-refresh after successful import
- ✅ Proper CSV escaping for special characters

## Security
- Both endpoints require authentication via session
- Users can only import/export their own transactions
- Input validation for all fields
- Error handling with user-friendly messages
