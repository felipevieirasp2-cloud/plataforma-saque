// DOM Elements
const withdrawForm = document.getElementById('withdrawForm');
const modal = document.getElementById('modal');
const modalConfirm = document.getElementById('modalConfirm');
const closeBtn = document.querySelector('.close');
const notification = document.getElementById('notification');
const balanceElement = document.getElementById('balance');
const withdrawHistory = document.getElementById('withdrawHistory');

// Form data storage
let withdrawalData = {};
let balance = 5000.00;
let transactions = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    withdrawForm.addEventListener('submit', handleWithdrawSubmit);
    modalConfirm.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Handle Form Submission
function handleWithdrawSubmit(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const bankAccount = document.getElementById('bankAccount').value || 'Sem especificação';
    const pixKey = document.getElementById('pixKey').value || 'Não informado';
    
    // Validation - apenas verifica se tem valor
    if (!amount || amount <= 0) {
        showNotification('⚠️ Digite um valor válido!', 'error');
        return;
    }
    
    // Verifica se tem saldo
    if (amount > balance) {
        showNotification('❌ Saldo insuficiente!', 'error');
        return;
    }
    
    // Store data
    withdrawalData = {
        amount,
        bankAccount,
        pixKey,
        date: new Date().toLocaleString('pt-BR')
    };
    
    // Process withdrawal
    processWithdrawal();
}

// Process Withdrawal
function processWithdrawal() {
    showNotification('⏳ Processando seu saque...', 'error');
    
    setTimeout(() => {
        // Deduct from balance
        balance -= withdrawalData.amount;
        updateBalance();
        
        // Add to history
        addToHistory(withdrawalData);
        
        // Reset form
        withdrawForm.reset();
        
        // Show success modal
        showSuccessModal(withdrawalData);
    }, 1500);
}

// Show Success Modal
function showSuccessModal(data) {
    const bankNames = {
        'nubank': 'Nubank',
        'inter': 'Inter',
        'bradesco': 'Bradesco',
        'itau': 'Itaú',
        'santander': 'Santander',
        'pix': 'PIX'
    };
    
    const bankName = bankNames[data.bankAccount] || data.bankAccount;
    const modalMessage = document.getElementById('modalMessage');
    
    let message = `<strong>🎉 Saque Realizado com Sucesso!</strong><br><br>
        <strong>Valor:</strong> R$ ${formatCurrency(data.amount)}<br>
        <strong>Método:</strong> ${bankName}<br>
        <strong>Data/Hora:</strong> ${data.date}<br><br>
        <em style="color: #999; font-size: 0.9em;">O dinheiro chegará em breve na sua conta</em>`;
    
    modalMessage.innerHTML = message;
    modal.classList.add('show');
    
    showNotification(`✅ Saque de R$ ${formatCurrency(data.amount)} processado!`, 'success');
}

// Close Modal
function closeModal() {
    modal.classList.remove('show');
}

// Update Balance Display
function updateBalance() {
    balanceElement.textContent = formatCurrency(balance);
}

// Add to History
function addToHistory(data) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const bankNames = {
        'nubank': 'Nubank',
        'inter': 'Inter',
        'bradesco': 'Bradesco',
        'itau': 'Itaú',
        'santander': 'Santander',
        'pix': 'PIX'
    };
    
    const method = bankNames[data.bankAccount] || data.bankAccount;
    
    historyItem.innerHTML = `
        <div class="history-info">
            <p class="history-date">${data.date}</p>
            <p class="history-method">${method}</p>
        </div>
        <div class="history-amount">- R$ ${formatCurrency(data.amount)}</div>
    `;
    
    // Remove empty history message
    if (withdrawHistory.querySelector('.empty-history')) {
        withdrawHistory.innerHTML = '';
    }
    
    withdrawHistory.insertBefore(historyItem, withdrawHistory.firstChild);
    transactions.push(data);
}

// Show Notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Format Currency
function formatCurrency(value) {
    return parseFloat(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}