// ==================== EXPENSE TRACKER - MAIN JAVASCRIPT ====================

// ==================== CALCULATOR FUNCTIONALITY ====================
class Calculator {
    constructor() {
        this.screen = document.getElementById('calc-screen');
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.init();
    }

    init() {
        const buttons = document.querySelectorAll('.calc-keys button');
        buttons.forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button));
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleButtonClick(button) {
        const value = button.textContent.trim();

        if (button.classList.contains('btn-red') && value === 'DEL') {
            this.clear();
        } else if (button.classList.contains('btn-red') && button.querySelector('i')) {
            this.backspace();
        } else if (button.classList.contains('btn-green')) {
            this.calculate();
        } else if (button.classList.contains('btn-op')) {
            this.setOperation(value);
        } else if (value === '.') {
            this.appendDecimal();
        } else {
            this.appendNumber(value);
        }

        this.updateScreen();
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        } else if (e.key === '.') {
            this.appendDecimal();
        } else if (e.key === 'Backspace') {
            this.backspace();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            const opMap = { '+': '+', '-': '-', '*': '×', '/': '÷' };
            this.setOperation(opMap[e.key]);
        }
        this.updateScreen();
    }

    appendNumber(num) {
        if (this.shouldResetScreen) {
            this.currentValue = num;
            this.shouldResetScreen = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentValue = '0.';
            this.shouldResetScreen = false;
            return;
        }
        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
    }

    setOperation(op) {
        if (this.operation !== null) {
            this.calculate();
        }
        this.operation = op;
        this.previousValue = this.currentValue;
        this.shouldResetScreen = true;
    }

    calculate() {
        if (this.operation === null || this.shouldResetScreen) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) return;

        let result;
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = current === 0 ? 'Error' : prev / current;
                break;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.shouldResetScreen = true;
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetScreen = false;
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
    }

    updateScreen() {
        // Limit display length
        const displayValue = this.currentValue.length > 12 
            ? parseFloat(this.currentValue).toExponential(6) 
            : this.currentValue;
        this.screen.value = displayValue;
    }
}

// ==================== CALCULATOR TOGGLE ====================
class CalculatorToggle {
    constructor() {
        this.calcBox = document.querySelector('.calculator-box');
        this.toggleBtn = document.querySelector('.display button');
        this.isVisible = true; // Start visible
        this.init();
    }

    init() {
        // Hide calculator on page load
        this.calcBox.style.display = 'none';
        this.isVisible = false;

        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.calcBox.style.display = 'block';
            this.calcBox.style.animation = 'slideIn 0.3s ease-out';
        } else {
            this.calcBox.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                this.calcBox.style.display = 'none';
            }, 300);
        }

        // Update button appearance
        this.toggleBtn.style.transform = this.isVisible ? 'scale(1.1)' : 'scale(1)';
    }
}

// ==================== EXPENSE MANAGEMENT ====================
class ExpenseManager {
    constructor() {
        this.expenses = this.loadExpenses();
        this.budget = 3000; // Default budget
        this.form = document.querySelector('.mini-form form');
        this.categorySelect = document.querySelector('select.small-input');
        this.customCategoryInput = document.querySelector('.input-iconn input');
        this.init();
    }

    init() {
        // Hide custom category input initially
        this.customCategoryInput.closest('.input-iconn').style.display = 'none';

        // Show/hide custom category input
        this.categorySelect.addEventListener('change', (e) => {
            const customInput = this.customCategoryInput.closest('.input-iconn');
            customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Update display
        this.updateDisplay();
    }

    addExpense() {
        const nameInput = this.form.querySelector('input[type="text"]');
        const amountInput = this.form.querySelector('input[type="number"]');
        
        let category = this.categorySelect.value;
        if (category === 'custom') {
            category = this.customCategoryInput.value.trim() || 'Other';
        }

        const expense = {
            id: Date.now(),
            name: nameInput.value.trim(),
            amount: parseFloat(amountInput.value),
            category: category,
            date: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveExpenses();
        this.updateDisplay();
        this.showNotification('Expense added successfully!', 'success');
        this.form.reset();
        this.customCategoryInput.closest('.input-iconn').style.display = 'none';
    }

    updateDisplay() {
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const availableBudget = this.budget - totalExpenses;

        // Update stats cards
        const budgetCard = document.querySelector('.card p');
        const expenseCard = document.querySelectorAll('.card p')[1];
        
        if (budgetCard) budgetCard.textContent = `${availableBudget.toFixed(0)} EGP`;
        if (expenseCard) expenseCard.textContent = `${totalExpenses.toFixed(0)} EGP`;

        // Update progress bars
        const budgetPercentage = (availableBudget / this.budget) * 100;
        const expensePercentage = (totalExpenses / this.budget) * 100;
        
        const greenBar = document.querySelector('.line-green span');
        const redBar = document.querySelector('.line-red span');
        
        if (greenBar) greenBar.style.width = `${Math.min(budgetPercentage, 100)}%`;
        if (redBar) redBar.style.width = `${Math.min(expensePercentage, 100)}%`;

        // Update transactions list
        this.updateTransactionsList();

        // Update pie chart (visual representation)
        this.updatePieChart();
    }

    updateTransactionsList() {
        const recent = document.querySelector('.recent');
        const existingHeaders = recent.querySelectorAll('.category, .amount, .status');
        
        // Keep headers, remove old transactions
        const transactions = recent.querySelectorAll('.transaction-row');
        transactions.forEach(t => t.remove());

        // Add last 3 expenses
        const lastThree = this.expenses.slice(-3).reverse();
        
        lastThree.forEach(expense => {
            const row = document.createElement('div');
            row.className = 'transaction-row';
            row.style.display = 'contents';
            row.innerHTML = `
                <div style="color: #333; font-size: 13px; padding: 5px 0;">${expense.category}</div>
                <div style="color: #f44336; font-weight: bold; font-size: 13px; padding: 5px 0;">${expense.amount} EGP</div>
                <div style="color: #26a65b; font-size: 13px; padding: 5px 0;">✓ Paid</div>
            `;
            recent.appendChild(row);
        });
    }

    updatePieChart() {
        const categoryTotals = {};
        this.expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
        if (total === 0) return;

        // Calculate degrees for each category
        let currentDeg = 0;
        const gradientParts = [];

        Object.entries(categoryTotals).forEach(([category, amount], index) => {
            const percentage = (amount / total) * 360;
            const colors = ['#f44336', '#2196f3', '#8bc34a', '#b3b3b3'];
            const color = colors[index % colors.length];
            
            gradientParts.push(`${color} ${currentDeg}deg ${currentDeg + percentage}deg`);
            currentDeg += percentage;
        });

        const pieChart = document.querySelector('.pie-chart');
        if (pieChart) {
            pieChart.style.background = `conic-gradient(${gradientParts.join(', ')})`;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#26a65b' : '#f44336'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    loadExpenses() {
        const stored = localStorage.getItem('expenses');
        return stored ? JSON.parse(stored) : [];
    }
}

// ==================== DATE & TIME ====================
class DateTimeDisplay {
    constructor() {
        this.init();
    }

    init() {
        this.createDateBadge();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000); // Update every minute
    }

    createDateBadge() {
        const topHeader = document.querySelector('.top-header');
        const dateBadge = document.createElement('div');
        dateBadge.className = 'date-badge';
        topHeader.appendChild(dateBadge);
    }

    updateDateTime() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const dateStr = now.toLocaleDateString('en-US', options);
        
        const dateBadge = document.querySelector('.date-badge');
        if (dateBadge) {
            dateBadge.textContent = dateStr;
        }
    }
}

// ==================== ACTIVE LINK HIGHLIGHTING ====================
class NavigationHighlight {
    constructor() {
        this.init();
    }

    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.links-nav');
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.style.backgroundColor = 'var(--dark-purple)';
                link.style.color = 'white';
                link.querySelector('i').style.color = 'white';
            }
        });
    }
}

// ==================== ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .card {
        animation: fadeInUp 0.5s ease-out backwards;
    }

    .card:nth-child(1) { animation-delay: 0.1s; }
    .card:nth-child(2) { animation-delay: 0.2s; }
    .card:nth-child(3) { animation-delay: 0.3s; }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ==================== INITIALIZE ALL FEATURES ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    const calculator = new Calculator();
    
    // Initialize calculator toggle
    const calcToggle = new CalculatorToggle();
    
    // Initialize expense manager
    const expenseManager = new ExpenseManager();
    
    // Initialize date/time display
    const dateTime = new DateTimeDisplay();
    
    // Initialize navigation highlighting
    const navHighlight = new NavigationHighlight();
    
    console.log('✅ Expense Tracker initialized successfully!');
});
