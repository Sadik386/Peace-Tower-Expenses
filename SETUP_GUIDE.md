# Peace Tower Expense Tracker - Setup Guide

## Prerequisites
- Node.js (v16+)
- Google Account
- Google Sheets document

## 1. Google Sheets Setup

### Create the Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet named "Peace Tower Expenses"
3. Create 4 sheets with these names and headers:

#### Sheet 1: "Members"
| FlatNo | Name | Contact | Email |
|--------|------|---------|-------|

#### Sheet 2: "Expenses"  
| ExpenseID | Date | Title | Amount | PaidBy | SplitAmong | Category |
|-----------|------|-------|--------|--------|------------|----------|

#### Sheet 3: "Payments"
| PaymentID | ExpenseID | FromFlat | ToFlat | Amount | Status |
|-----------|-----------|----------|--------|--------|--------|

#### Sheet 4: "Categories" (Optional)
| Category | Description |
|----------|-------------|

### Get Google Sheets ID
- Copy the spreadsheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

## 2. Google Service Account Setup

### Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable Google Sheets API
4. Go to "IAM & Admin" → "Service Accounts"
5. Create service account with Sheets API access
6. Generate JSON key file
7. Share your Google Sheet with the service account email

### Extract Credentials
From the downloaded JSON file, you need:
- `client_email`
- `private_key`

## 3. Backend Setup

```bash
cd backend
npm install
```

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your credentials:
```
GOOGLE_SHEETS_ID=your_actual_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_ACTUAL_PRIVATE_KEY\\n-----END PRIVATE KEY-----"
PORT=5000
```

### Start Backend
```bash
npm start
```

## 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 5. Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use different service accounts for production
- Rotate keys regularly

### Google Sheets Permissions
- Only share with necessary service accounts
- Use least privilege principle
- Monitor access logs

### API Security
- Add rate limiting in production
- Implement proper authentication
- Validate all inputs
- Use HTTPS in production

## 6. Migration to Real Database

When ready to migrate from Google Sheets to PostgreSQL:

### Database Schema
```sql
CREATE TABLE members (
  flat_no VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  email VARCHAR(100)
);

CREATE TABLE expenses (
  expense_id VARCHAR(50) PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_by VARCHAR(10) REFERENCES members(flat_no),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expense_splits (
  expense_id VARCHAR(50) REFERENCES expenses(expense_id),
  flat_no VARCHAR(10) REFERENCES members(flat_no),
  PRIMARY KEY (expense_id, flat_no)
);

CREATE TABLE payments (
  payment_id VARCHAR(50) PRIMARY KEY,
  expense_id VARCHAR(50) REFERENCES expenses(expense_id),
  from_flat VARCHAR(10) REFERENCES members(flat_no),
  to_flat VARCHAR(10) REFERENCES members(flat_no),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Migration Steps
1. Export data from Google Sheets
2. Set up PostgreSQL database
3. Update `services/sheetsService.js` to `services/dbService.js`
4. Install `pg` or `prisma`
5. Test thoroughly before switching

## Troubleshooting

### Common Issues
1. **Google Sheets API Error**: Check service account permissions
2. **Private Key Format**: Ensure newlines are properly escaped
3. **CORS Error**: Verify frontend/backend URLs match
4. **Permission Denied**: Share sheet with service account email

### Testing API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get members
curl http://localhost:5000/api/members

# Add member
curl -X POST http://localhost:5000/api/members \\
  -H "Content-Type: application/json" \\
  -d '{"flatNo":"101","name":"John Doe","contact":"+91xxxxxxxxx"}'
```