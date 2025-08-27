# Google Sheets Database Structure

## Sheet 1: Members
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| FlatNo   | Name     | Contact  | Email    |
| 101      | John Doe | +91xxxxx | john@email.com |
| 102      | Jane Smith | +91xxxxx | jane@email.com |

## Sheet 2: Expenses  
| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| ExpenseID | Date | Title | Amount | PaidBy | SplitAmong | Category |
| EXP001 | 2024-01-15 | Cleaning Service | 2000 | 101 | 101,102,103 | Maintenance |
| EXP002 | 2024-01-20 | Security Guard | 5000 | 102 | 101,102,103,104 | Security |

## Sheet 3: Payments
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| PaymentID | ExpenseID | FromFlat | ToFlat | Amount | Status |
| PAY001 | EXP001 | 102 | 101 | 666.67 | pending |
| PAY002 | EXP001 | 103 | 101 | 666.67 | paid |

## Sheet 4: Categories (Optional)
| Column A | Column B |
|----------|----------|
| Category | Description |
| Maintenance | General maintenance |
| Security | Security services |
| Utilities | Electricity, Water |