# Money Lab 2

Compact, iPhone-first money tracker. All financial records stay on the device.

## Run
Node 22+: npm install --ignore-scripts, npm test, npm run build.
Serve dist over HTTPS. Local preview: python3 -m http.server 5173 --directory dist.
Vercel uses vercel.json. Framework: Other. Build: npm run build. Output: dist.
The connected Vercel account previously returned repo_no_access; repository access must be granted before Git deployment can be completed.

## Accounts and budgets
Cash, Bank, and custom accounts hold three budget buckets: Savings, Current, Next month.
New income defaults to 20% / 30% / 50%. Change the percentages in Settings; their sum must be 100.
Rounding remainder goes into Current so every paise is accounted for.
Account balances are the sum of their buckets. Buckets are allocations, not separate bank accounts.
Opening balances go into Current by default and are excluded from income reports.
Use Move budget to release Next month funds when you need them; there is no silent month rollover.
Account transfers preserve the selected bucket. Transfer and budget moves do not count as income or expense.
Overspending, invalid imports, and edits/deletions that make a running bucket negative are rejected.
Ledger order is entry order, while reports group the entered local date/time.

## Income and expenses
Income: Salary, Freelance, Dropshipping, Sponsorship, Other.
Expenses: Food, Fuel, Travel, Business, Home, Other.
Presets include meals, groceries, transport, Meta ads, domain, hosting, software, and sponsorship.
Add categories and subcategories in Settings or while entering a transaction.
Use the note for food items, client names, or details. Entries can be edited or deleted.

## Reports
Daily, weekly (Monday start), monthly, hourly; optional date filters.
Top 10 expense subcategories and all-period income/expense/net totals.
Latest 200 periods display on the phone; Excel includes all populated periods and every transaction.
Opening balances are not income. Existing v1 entries have unknown time rather than invented hourly data.

## Backups
Each successful save writes IndexedDB plus a localStorage mirror and previous-state recovery copy.
The next Excel workbook is prepared locally in a worker. Tap Save Excel or Share / Files to keep it outside browser storage.
The app cannot silently write iPhone Files or run backups while closed, and cannot reconstruct data after all browser storage is deleted.
A local recovery copy is NOT an off-device backup. Keep an Excel or JSON file in Files/iCloud/another safe location.
Clearing Safari data, switching domains, or changing browser profiles can remove or separate records.
Storage protection can be requested in Settings; granting it is browser-dependent.
Separate tabs use revision checks to prevent overwriting unseen updates.

### Excel format
Real .xlsx, generated locally with bundled ExcelJS 4.4.0. No CDN/network required after offline setup.
Sheets: Settings, Accounts, Categories, Transactions, Daily, Weekly, Monthly, Hourly, Read me.
Transactions is the authoritative complete ledger. Settings, Accounts (ID/name), and Categories restore metadata.
Calculated account balances and report sheets are recomputed on import.
Import replaces records after preview and explicit confirmation. It never silently merges duplicates.
Retain all sheets and headers. Use plain values (not formulas) and date/time text in YYYY-MM-DD / HH:mm format.
Amount columns are INR, with at most two decimals. ID values must be unique.
10 MB file limit, 40 MB expanded archive limit, 20,000 transactions; worker import timeout 30 seconds.
JSON backups remain available as a fallback. Legacy v1 JSON is migrated without changing balances or history.
Legacy income stays in Current; old save/withdraw transactions become budget moves. Old storage keys are retained.

## iPhone
Safari → Share → Add to Home Screen. Use the same app and domain for records.
The service worker caches application files and the Excel library for offline use.
Close all open app tabs and reopen to activate a waiting app update.
CI runs mobile WebKit tests at 375×667 for entries, Excel restoration, legacy migration, local recovery, and offline reload. Physical iPhone Home Screen / Files testing is still required.

## Validation
npm test runs legacy ledger checks, v2 accounts/allocation/report/migration tests, and real XLSX round-trip/rejection tests.
CI checks syntax, installs dependencies, runs unit and XLSX tests, builds, runs mobile WebKit tests, and uploads dist.
No financial data is uploaded. Anyone with access to this browser profile can open the records.
