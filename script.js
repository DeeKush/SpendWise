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
const emergencyFundStatusElement = document.querySelectorAll('.card .status')[0]; // Emergency Fund
const financialHealthElement = document.querySelectorAll('.card .status')[1]; // Financial Health
const insightsContainer = document.querySelector('.insight-container');

// Allowance and allocation model
let monthlyAllowance = 10000; // fixed for now
let allocationPercentages = {
    emergency: 15,
    investment: 10,
    food: 25,
    transport: 10,
    education: 15,
    entertainment: 10,
    buffer: 5
};

// Helper: Calculate totals and percentages for each category
function calculateCategoryTotals(expenses, allowance) {
    let totals = {
        emergency: 0,
        investment: 0,
        food: 0,
        transport: 0,
        education: 0,
        entertainment: 0,
        buffer: 0,
        essentials: 0,
        discretionary: 0,
        total: 0
    };
    // Loop through expenses and sum by category
    for (let i = 0; i < expenses.length; i++) {
        let cat = expenses[i].category;
        let amt = expenses[i].amount;
        totals.total += amt;
        if (cat === 'Food') { totals.food += amt; totals.essentials += amt; }
        else if (cat === 'Transport') { totals.transport += amt; totals.essentials += amt; }
        else if (cat === 'Education') { totals.education += amt; totals.essentials += amt; }
        else if (cat === 'Entertainment') { totals.entertainment += amt; totals.discretionary += amt; }
        else if (cat === 'Investment') { totals.investment += amt; totals.discretionary += amt; }
        else if (cat === 'Emergency') { totals.emergency += amt; }
        else { totals.buffer += amt; totals.discretionary += amt; }
    }
    // Calculate percentages
    let percents = {};
    for (let key in totals) {
        if (key !== 'total' && allowance > 0) {
            percents[key] = (totals[key] / allowance) * 100;
        }
    }
    return { totals, percents };
}

// Helper: Emergency fund calculation
function calculateEmergencyFund(allowance, allocationPercentages) {
    let min = Math.round(allowance * 0.10);
    let recommended = Math.round(allowance * (allocationPercentages.emergency / 100));
    let target = recommended; // For now, user cannot set custom
    return {
        min: min,
        recommended: recommended,
        target: target
    };
}

// Helper: Evaluate financial health
function evaluateFinancialHealth(categoryPercents, emergencyData, investmentAllowed, totalSpent) {
    // Priority: Risky > Needs Attention > Stable > On Track
    // Risky if: emergency fund allocation is 0, entertainment > 20%, or total spent >= allowance
    if (categoryPercents.emergency === undefined || categoryPercents.emergency === 0) {
        return 'Risky';
    }
    if (categoryPercents.entertainment !== undefined && categoryPercents.entertainment > 20) {
        return 'Risky';
    }
    if (totalSpent >= monthlyAllowance) {
        return 'Risky';
    }
    // Needs Attention if: emergency < 10%, entertainment > 15%, or investment enabled but emergency < min
    if (categoryPercents.emergency !== undefined && categoryPercents.emergency < 10) {
        return 'Needs Attention';
    }
    if (categoryPercents.entertainment !== undefined && categoryPercents.entertainment > 15) {
        return 'Needs Attention';
    }
    if (!investmentAllowed) {
        return 'Needs Attention';
    }
    // Stable if: emergency >= min, entertainment <= 15%
    if (categoryPercents.emergency !== undefined && categoryPercents.emergency >= 10 && categoryPercents.entertainment !== undefined && categoryPercents.entertainment <= 15) {
        return 'Stable';
    }
    // On Track if: emergency >= recommended, entertainment <= 10%, essentials <= 65%
    if (categoryPercents.emergency !== undefined && categoryPercents.emergency >= emergencyData.recommended / monthlyAllowance * 100 && categoryPercents.entertainment !== undefined && categoryPercents.entertainment <= 10 && categoryPercents.essentials !== undefined && categoryPercents.essentials <= 65) {
        return 'On Track';
    }
    return 'Stable'; // Default
}

// Helper: Generate insights
function generateInsights(categoryPercents, emergencyData, investmentAllowed) {
    let insights = [];
    if (categoryPercents.entertainment !== undefined && categoryPercents.entertainment > 20) {
        insights.push('Entertainment spending is above 20% of your allowance. Try to limit it.');
    }
    if (categoryPercents.food !== undefined && categoryPercents.food > 30) {
        insights.push('Food expenses are a large part of your budget.');
    }
    if (categoryPercents.essentials !== undefined && categoryPercents.essentials > 65) {
        insights.push('Essentials are taking up most of your spending.');
    }
    if (!investmentAllowed) {
        insights.push('Investments are not allowed until your emergency fund minimum is met.');
    }
    if (insights.length === 0) {
        insights.push('Your spending is balanced. Keep it up!');
    }
    return insights;
}

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
    updateDashboard();
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
        expenseCategory.style.color = '#888'; // Subtle style
        
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
// Emergency Fund Calculation & Update
// ==========================================

function updateEmergencyFund() {
    // Essential categories
    const essentialCategories = ['Food', 'Transport', 'Education'];
    let essentialTotal = 0;
    let essentialCount = 0;

    // Calculate total and count for essential expenses
    for (let i = 0; i < expenses.length; i++) {
        if (essentialCategories.indexOf(expenses[i].category) !== -1) {
            essentialTotal += expenses[i].amount;
            essentialCount++;
        }
    }

    // Calculate average essential spending
    let avgEssential = essentialCount > 0 ? (essentialTotal / essentialCount) : 0;
    // Emergency fund target = 3 × average essential spending
    let emergencyTarget = avgEssential * 3;

    // Status logic
    let status = 'Not set';
    if (essentialTotal === 0) {
        status = 'Not set';
    } else if (essentialTotal < emergencyTarget) {
        status = 'In progress';
    } else {
        status = 'On track';
    }

    // Update DOM
    if (emergencyFundStatusElement) {
        emergencyFundStatusElement.textContent = status + (emergencyTarget > 0 ? ` (Target: ₹${emergencyTarget.toFixed(2)})` : '');
    }
}

// ==========================================
// Financial Health Indicator
// ==========================================

function updateFinancialHealth() {
    let totalEssential = 0;
    let totalDiscretionary = 0;
    let totalEntertainment = 0;
    let totalSpent = 0;

    // Categorize spending
    for (let i = 0; i < expenses.length; i++) {
        const exp = expenses[i];
        totalSpent += exp.amount;
        if (exp.category === 'Food' || exp.category === 'Transport' || exp.category === 'Education') {
            totalEssential += exp.amount;
        } else if (exp.category === 'Entertainment') {
            totalEntertainment += exp.amount;
            totalDiscretionary += exp.amount;
        } else {
            totalDiscretionary += exp.amount;
        }
    }

    let health = 'Getting Started';
    if (expenses.length === 0) {
        health = 'Getting Started';
    } else if (totalEssential >= totalDiscretionary) {
        health = 'Stable';
    } else if (totalEntertainment > 0 && totalEntertainment > totalEssential) {
        health = 'Needs Attention';
    } else if (totalSpent > 10000) { // Example threshold
        health = 'Risky';
    }

    // Update DOM
    if (financialHealthElement) {
        financialHealthElement.textContent = health;
    }
}

// ==========================================
// Insights & Alerts
// ==========================================

function updateInsights() {
    let insights = [];
    let totalSpent = 0;
    let entertainmentSpent = 0;
    let foodSpent = 0;
    let essentialSpent = 0;
    let essentialCount = 0;

    for (let i = 0; i < expenses.length; i++) {
        totalSpent += expenses[i].amount;
        if (expenses[i].category === 'Entertainment') entertainmentSpent += expenses[i].amount;
        if (expenses[i].category === 'Food') foodSpent += expenses[i].amount;
        if (expenses[i].category === 'Food' || expenses[i].category === 'Transport' || expenses[i].category === 'Education') {
            essentialSpent += expenses[i].amount;
            essentialCount++;
        }
    }

    // Rule-based insights
    if (expenses.length === 0) {
        insights.push('Start adding your expenses to get insights!');
    } else {
        if (entertainmentSpent > 0.3 * totalSpent) {
            insights.push('High entertainment spending. Consider reducing for better savings.');
        }
        if (foodSpent > 0.4 * totalSpent) {
            insights.push('Food expenses are a major part of your spending.');
        }
        if (essentialSpent > 0 && essentialSpent / totalSpent > 0.7) {
            insights.push('Most of your spending is on essentials. Good job prioritizing needs!');
        }
        if (totalSpent > 10000) {
            insights.push('Total spending is high. Review your expenses for possible savings.');
        }
        if (insights.length === 0) {
            insights.push('Your spending is balanced. Keep it up!');
        }
    }

    // Update DOM
    if (insightsContainer) {
        insightsContainer.innerHTML = '';
        for (let i = 0; i < insights.length && i < 2; i++) {
            const p = document.createElement('p');
            p.textContent = insights[i];
            p.className = 'insight-placeholder';
            insightsContainer.appendChild(p);
        }
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
    return total;
}


// ==========================================
// Dashboard Update (Main)
// ==========================================

function updateDashboard() {
    // Calculate totals and percents
    let { totals, percents } = calculateCategoryTotals(expenses, monthlyAllowance);
    let emergencyData = calculateEmergencyFund(monthlyAllowance, allocationPercentages);

    // Emergency fund allocation (actual spent in 'Emergency' category)
    let emergencySpent = totals.emergency;
    let emergencyStatus = 'Not Set';
    if (emergencySpent === 0) {
        emergencyStatus = 'Not Set';
    } else if (emergencySpent < emergencyData.min) {
        emergencyStatus = 'In Progress';
    } else if (emergencySpent >= emergencyData.recommended) {
        emergencyStatus = 'On Track';
    } else {
        emergencyStatus = 'In Progress';
    }
    if (emergencyFundStatusElement) {
        emergencyFundStatusElement.textContent = emergencyStatus + ` (Min: ₹${emergencyData.min}, Rec: ₹${emergencyData.recommended})`;
    }

    // Investment allowed only if emergency fund >= min
    let investmentAllowed = (emergencySpent >= emergencyData.min);

    // Financial health
    let health = evaluateFinancialHealth(percents, emergencyData, investmentAllowed, totals.total);
    if (financialHealthElement) {
        financialHealthElement.textContent = health;
    }

    // Insights
    let insights = generateInsights(percents, emergencyData, investmentAllowed);
    if (insightsContainer) {
        insightsContainer.innerHTML = '';
        for (let i = 0; i < insights.length && i < 2; i++) {
            const p = document.createElement('p');
            p.textContent = insights[i];
            p.className = 'insight-placeholder';
            insightsContainer.appendChild(p);
        }
    }

    // Update total spent
    updateTotalSpent();
}

// Initial dashboard update
updateDashboard();

}); // End of DOMContentLoaded
