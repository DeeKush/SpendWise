// SpendWise - Dashboard JavaScript

// Wait for DOM to fully load before running code
document.addEventListener('DOMContentLoaded', function() {

// ==========================================
// Data Storage
// ==========================================

// Array to store all expenses
let expenses = [];

// Category keyword mapping
const categoryKeywords = {
    'Food': ['food', 'dinner', 'lunch', 'breakfast', 'canteen', 'pizza', 'burger', 'restaurant', 'cafe', 'snack', 'coffee', 'tea'],
    'Transport': ['bus', 'auto', 'uber', 'ola', 'cab', 'metro', 'taxi', 'petrol', 'fuel', 'parking', 'toll'],
    'Entertainment': ['movie', 'netflix', 'game', 'concert', 'spotify', 'amazon prime', 'youtube', 'theatre', 'show'],
    'Education': ['book', 'course', 'fees', 'class', 'tuition', 'notebook', 'pen', 'pencil', 'study'],
    'Shopping': ['clothes', 'shirt', 'shoes', 'shopping', 'mall', 'amazon', 'flipkart', 'online'],
    'Health': ['medicine', 'doctor', 'hospital', 'pharmacy', 'gym', 'clinic', 'medical'],
    'Bills': ['electricity', 'water', 'rent', 'internet', 'phone', 'recharge', 'wifi']
};

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

// Debug: Check if elements are found
console.log('DOM Elements loaded:', {
    amountInput,
    descriptionInput,
    addExpenseBtn,
    errorMessage,
    expenseContainer,
    totalSpentElement
});

// Add expense when button is clicked
addExpenseBtn.addEventListener('click', function() {
    console.log('Button clicked!'); // Debug log
    
    // Get input values
    const amount = amountInput.value;
    const description = descriptionInput.value;
    
    console.log('Input values:', { amount, description }); // Debug log
    
    // Validate inputs
    if (!validateInputs(amount, description)) {
        console.log('Validation failed'); // Debug log
        return; // Stop if validation fails
    }
    
    console.log('Validation passed'); // Debug log
    
    // Categorize the expense based on description
    const category = categorizeExpense(description);
    
    console.log('Category:', category); // Debug log
    
    // Create expense object
    const expense = {
        amount: parseFloat(amount),
        description: description,
        category: category
    };
    
    // Add expense to array
    expenses.push(expense);
    
    console.log('Expense added. Total expenses:', expenses.length); // Debug log
    console.log('All expenses:', expenses); // Debug log
    
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
// Expense Categorization
// ==========================================

function categorizeExpense(description) {
    // Convert description to lowercase for matching
    const lowercaseDescription = description.toLowerCase();
    
    // Loop through each category
    for (let category in categoryKeywords) {
        const keywords = categoryKeywords[category];
        
        // Check each keyword in the category
        for (let i = 0; i < keywords.length; i++) {
            const keyword = keywords[i];
            
            // Check if description contains the keyword
            if (lowercaseDescription.includes(keyword)) {
                return category; // Return first match found
            }
        }
    }
    
    // If no match found, return "Other"
    return 'Other';
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
        expenseCategory.textContent = expense.category;
        
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

}); // End of DOMContentLoaded
