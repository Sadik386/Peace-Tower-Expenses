const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

class SheetsService {
  constructor() {
    this.doc = null;
  }

  async initialize() {
    try {
      this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
      
      await this.doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });

      await this.doc.loadInfo();
      console.log('Google Sheets connected:', this.doc.title);
    } catch (error) {
      console.error('Error connecting to Google Sheets:', error);
      throw error;
    }
  }

  async getMembers() {
    const sheet = this.doc.sheetsByTitle['Members'];
    const rows = await sheet.getRows();
    return rows.map(row => ({
      flatNo: row.FlatNo,
      name: row.Name,
      contact: row.Contact,
      email: row.Email
    }));
  }

  async addMember(member) {
    const sheet = this.doc.sheetsByTitle['Members'];
    await sheet.addRow({
      FlatNo: member.flatNo,
      Name: member.name,
      Contact: member.contact,
      Email: member.email
    });
  }

  async getExpenses() {
    const sheet = this.doc.sheetsByTitle['Expenses'];
    const rows = await sheet.getRows();
    return rows.map(row => ({
      expenseId: row.ExpenseID,
      date: row.Date,
      title: row.Title,
      amount: parseFloat(row.Amount),
      paidBy: row.PaidBy,
      splitAmong: row.SplitAmong.split(','),
      category: row.Category
    }));
  }

  async addExpense(expense) {
    const sheet = this.doc.sheetsByTitle['Expenses'];
    const expenseId = 'EXP' + Date.now();
    
    await sheet.addRow({
      ExpenseID: expenseId,
      Date: expense.date,
      Title: expense.title,
      Amount: expense.amount,
      PaidBy: expense.paidBy,
      SplitAmong: expense.splitAmong.join(','),
      Category: expense.category
    });

    // Auto-generate payment records
    await this.generatePayments(expenseId, expense);
    
    return expenseId;
  }

  async generatePayments(expenseId, expense) {
    const sheet = this.doc.sheetsByTitle['Payments'];
    const splitAmount = expense.amount / expense.splitAmong.length;
    
    for (const flatNo of expense.splitAmong) {
      if (flatNo !== expense.paidBy) {
        await sheet.addRow({
          PaymentID: 'PAY' + Date.now() + '_' + flatNo,
          ExpenseID: expenseId,
          FromFlat: flatNo,
          ToFlat: expense.paidBy,
          Amount: splitAmount.toFixed(2),
          Status: 'pending'
        });
      }
    }
  }

  async getPayments() {
    const sheet = this.doc.sheetsByTitle['Payments'];
    const rows = await sheet.getRows();
    return rows.map(row => ({
      paymentId: row.PaymentID,
      expenseId: row.ExpenseID,
      fromFlat: row.FromFlat,
      toFlat: row.ToFlat,
      amount: parseFloat(row.Amount),
      status: row.Status
    }));
  }

  async markPayment(paymentId, status) {
    const sheet = this.doc.sheetsByTitle['Payments'];
    const rows = await sheet.getRows();
    const paymentRow = rows.find(row => row.PaymentID === paymentId);
    
    if (paymentRow) {
      paymentRow.Status = status;
      await paymentRow.save();
    }
  }

  async getBalance() {
    const payments = await this.getPayments();
    const balance = {};

    payments.forEach(payment => {
      if (payment.status === 'pending') {
        if (!balance[payment.fromFlat]) balance[payment.fromFlat] = {};
        if (!balance[payment.fromFlat][payment.toFlat]) balance[payment.fromFlat][payment.toFlat] = 0;
        
        balance[payment.fromFlat][payment.toFlat] += payment.amount;
      }
    });

    return balance;
  }
}

module.exports = new SheetsService();