require('dotenv').config();

class MockSheetsService {
  constructor() {
    this.members = [
      { flatNo: '101', name: 'John Doe', contact: '+91-9876543210', email: 'john@example.com' },
      { flatNo: '102', name: 'Jane Smith', contact: '+91-9876543211', email: 'jane@example.com' },
      { flatNo: '103', name: 'Bob Johnson', contact: '+91-9876543212', email: 'bob@example.com' }
    ];
    
    this.expenses = [
      {
        expenseId: 'EXP001',
        date: '2024-01-15',
        title: 'Cleaning Service',
        amount: 3000,
        paidBy: '101',
        splitAmong: ['101', '102', '103'],
        category: 'Maintenance'
      }
    ];

    this.payments = [
      {
        paymentId: 'PAY001',
        expenseId: 'EXP001',
        fromFlat: '102',
        toFlat: '101',
        amount: 1000,
        status: 'pending'
      },
      {
        paymentId: 'PAY002',
        expenseId: 'EXP001',
        fromFlat: '103',
        toFlat: '101',
        amount: 1000,
        status: 'paid'
      }
    ];
  }

  async initialize() {
    console.log('Mock Sheets Service initialized (Demo Mode)');
  }

  async getMembers() {
    return [...this.members];
  }

  async addMember(member) {
    this.members.push(member);
    return member;
  }

  async getExpenses() {
    return [...this.expenses];
  }

  async addExpense(expense) {
    const expenseId = 'EXP' + Date.now();
    const newExpense = { expenseId, ...expense };
    this.expenses.push(newExpense);

    await this.generatePayments(expenseId, expense);
    return expenseId;
  }

  async generatePayments(expenseId, expense) {
    const splitAmount = expense.amount / expense.splitAmong.length;
    
    for (const flatNo of expense.splitAmong) {
      if (flatNo !== expense.paidBy) {
        this.payments.push({
          paymentId: 'PAY' + Date.now() + '_' + flatNo,
          expenseId: expenseId,
          fromFlat: flatNo,
          toFlat: expense.paidBy,
          amount: parseFloat(splitAmount.toFixed(2)),
          status: 'pending'
        });
      }
    }
  }

  async getPayments() {
    return [...this.payments];
  }

  async markPayment(paymentId, status) {
    const payment = this.payments.find(p => p.paymentId === paymentId);
    if (payment) {
      payment.status = status;
    }
  }

  async getBalance() {
    const balance = {};

    this.payments.forEach(payment => {
      if (payment.status === 'pending') {
        if (!balance[payment.fromFlat]) balance[payment.fromFlat] = {};
        if (!balance[payment.fromFlat][payment.toFlat]) balance[payment.fromFlat][payment.toFlat] = 0;
        
        balance[payment.fromFlat][payment.toFlat] += payment.amount;
      }
    });

    return balance;
  }
}

module.exports = new MockSheetsService();