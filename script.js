// SpendWise - Dashboard JavaScript

// ==========================================
// Data Storage
// ==========================================

// Array to store all expenses
let expenses = [];

// ==========================================
// Expense Input Handling
// ==========================================

// Get DOM elements
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const addExpenseBtn = document.getElementById('add-expense-btn');
const errorMessage = document.getElementById('error-message');
const expenseContainer = document.getElementById('expense-container');
const totalSpentElement = document.getElementById('total-spent');

// Add expense when button is clicked
addExpenseBtn.addEventListener('click', function() {
    // Get input values
    const amount = amountInput.value;
    const description = descriptionInput.value;
    
    // Validate inputs
    if (!validateInputs(amount, description)) {
        return; // Stop if validation fails
    }
    
    // Create expense object
    const expense = {
        amount: parseFloat(amount),
        description: description
    };
    
    // Add expense to array
    expenses.push(expense);
    
    // Clear inputs
    amountInput.value = '';
    descriptionInput.value = '';
    
    // Hide error message
    hideError();
    
    // Update the UI
    renderExpenses();
    updateTotalSpent();
});

// ==========================================
// Input Validation
// ==========================================

function validateInputs(amount, description) {
    // Check if amount is empty
    if (amount === '' || amount === null) {
        showError('Please enter an amount');
        return false;
    }
    
    // Check if amount is greater than 0
    if (parseFloat(amount) <= 0) {
        showError('Amount must be greater than 0');
        return false;
    }
    
    // Check if description is empty
    if (description.trim() === '') {
        showError('Please enter a description');
        return false;
    }
    
    return true;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Hide error message
function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// ==========================================
// Render Expense List
// ==========================================

function renderExpenses() {
    // Clear container
    expenseContainer.innerHTML = '';
    
    // Check if expenses array is empty
    if (expenses.length === 0) {
        expenseContainer.innerHTML = '<p class="empty-state">No expenses yet. Start tracking your spending!</p>';
        return;
    }
    
    // Loop through expenses and create DOM elements
    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        
        // Create expense row
        const expenseRow = document.createElement('div');
        expenseRow.classList.add('expense-row');
        
        // Create expense info section
        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');
        
        // Add description
        const expenseDescription = document.createElement('div');
        expenseDescription.classList.add('expense-description');
        expenseDescription.textContent = expense.description;
        
        // Add category placeholder
        const expenseCategory = document.createElement('div');
        expenseCategory.classList.add('expense-category');
        expenseCategory.textContent = 'Uncategorized';
        
        // Append to info section
        expenseInfo.appendChild(expenseDescription);
        expenseInfo.appendChild(expenseCategory);
        
        // Create amount section
        const expenseAmount = document.createElement('div');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.textContent = '₹' + expense.amount.toFixed(2);
        
        // Append all to row
        expenseRow.appendChild(expenseInfo);
        expenseRow.appendChild(expenseAmount);
        
        // Add row to container
        expenseContainer.appendChild(expenseRow);
    }
}

// ==========================================
// Update Dashboard
// ==========================================

function updateTotalSpent() {
    // Calculate total
    let total = 0;
    
    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }
    
    // Update the total spent element
    totalSpentElement.textContent = '₹' + total.toFixed(2);
}

// ==========================================
// Future Features (Placeholders)
// ==========================================

// TODO: auto categorize expense
// - Analyze description text
// - Assign category based on keywords
// - Update expense with category

// TODO: calculate emergency fund status
// - Determine savings goal
// - Calculate percentage saved
// - Update emergency fund card

// TODO: calculate financial health
// - Analyze spending patterns
// - Generate health score
// - Update health indicator

// TODO: generate insights
// - Analyze spending trends
// - Identify unusual expenses
// - Create alerts and recommendations

