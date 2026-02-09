/**
 * Account Management System
 * Modernized Node.js implementation of legacy COBOL application
 * 
 * Original COBOL modules:
 * - main.cob: Main program and user interface
 * - operations.cob: Business logic operations
 * - data.cob: Data persistence layer
 */

const readline = require('readline');

/**
 * DataProgram - Data Persistence Layer
 * Equivalent to data.cob
 * Manages the persistent storage of account balance
 */
class DataProgram {
    constructor() {
        // STORAGE-BALANCE PIC 9(6)V99 VALUE 1000.00
        this.storageBalance = 1000.00;
    }

    /**
     * Execute data operation (READ or WRITE)
     * @param {string} operationType - 'READ' or 'WRITE'
     * @param {number|null} balance - Balance to write (for WRITE operations)
     * @returns {number} Current balance (for READ operations)
     */
    execute(operationType, balance = null) {
        if (operationType === 'READ') {
            // MOVE STORAGE-BALANCE TO BALANCE
            return this.storageBalance;
        } else if (operationType === 'WRITE') {
            // MOVE BALANCE TO STORAGE-BALANCE
            this.storageBalance = balance;
            return this.storageBalance;
        }
    }

    /**
     * Get current balance
     * @returns {number} Current balance
     */
    getBalance() {
        return this.storageBalance;
    }

    /**
     * Set balance
     * @param {number} balance - New balance
     */
    setBalance(balance) {
        this.storageBalance = balance;
    }
}

/**
 * Operations - Business Logic Layer
 * Equivalent to operations.cob
 * Implements core business logic for account operations
 */
class Operations {
    constructor(dataProgram) {
        this.dataProgram = dataProgram;
        // FINAL-BALANCE PIC 9(6)V99 VALUE 1000.00
        this.finalBalance = 1000.00;
    }

    /**
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted amount with 2 decimal places
     */
    formatCurrency(amount) {
        return amount.toFixed(2);
    }

    /**
     * Parse amount input and validate
     * @param {string} input - User input amount
     * @returns {number|null} Parsed amount or null if invalid
     */
    parseAmount(input) {
        const amount = parseFloat(input);
        if (isNaN(amount) || amount < 0) {
            return null;
        }
        // Enforce maximum value: 999999.99 (PIC 9(6)V99)
        if (amount > 999999.99) {
            return null;
        }
        // Round to 2 decimal places
        return Math.round(amount * 100) / 100;
    }

    /**
     * View current balance (TOTAL operation)
     * @returns {Promise<string>} Message to display
     */
    async viewBalance() {
        // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        this.finalBalance = this.dataProgram.execute('READ');
        // DISPLAY "Current balance: " FINAL-BALANCE
        return `Current balance: ${this.formatCurrency(this.finalBalance)}`;
    }

    /**
     * Credit account (deposit)
     * @param {string} amountStr - Amount to credit
     * @returns {Promise<string>} Result message
     */
    async creditAccount(amountStr) {
        const amount = this.parseAmount(amountStr);
        
        if (amount === null) {
            return 'Invalid amount. Please enter a valid positive number.';
        }

        if (amount === 0) {
            return 'Amount must be greater than zero.';
        }

        // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        this.finalBalance = this.dataProgram.execute('READ');
        
        // Check if credit would exceed maximum balance
        const newBalance = this.finalBalance + amount;
        if (newBalance > 999999.99) {
            return 'Credit would exceed maximum balance of 999999.99';
        }

        // ADD AMOUNT TO FINAL-BALANCE
        this.finalBalance = newBalance;
        
        // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
        this.dataProgram.execute('WRITE', this.finalBalance);
        
        // DISPLAY "Amount credited. New balance: " FINAL-BALANCE
        return `Amount credited. New balance: ${this.formatCurrency(this.finalBalance)}`;
    }

    /**
     * Debit account (withdrawal)
     * @param {string} amountStr - Amount to debit
     * @returns {Promise<string>} Result message
     */
    async debitAccount(amountStr) {
        const amount = this.parseAmount(amountStr);
        
        if (amount === null) {
            return 'Invalid amount. Please enter a valid positive number.';
        }

        if (amount === 0) {
            return 'Amount must be greater than zero.';
        }

        // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
        this.finalBalance = this.dataProgram.execute('READ');
        
        // IF FINAL-BALANCE >= AMOUNT
        if (this.finalBalance >= amount) {
            // SUBTRACT AMOUNT FROM FINAL-BALANCE
            this.finalBalance = this.finalBalance - amount;
            // Round to avoid floating point precision issues
            this.finalBalance = Math.round(this.finalBalance * 100) / 100;
            
            // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
            this.dataProgram.execute('WRITE', this.finalBalance);
            
            // DISPLAY "Amount debited. New balance: " FINAL-BALANCE
            return `Amount debited. New balance: ${this.formatCurrency(this.finalBalance)}`;
        } else {
            // DISPLAY "Insufficient funds for this debit."
            return 'Insufficient funds for this debit.';
        }
    }

    /**
     * Execute operation based on type
     * @param {string} operationType - 'TOTAL', 'CREDIT', or 'DEBIT'
     * @param {string|null} amount - Amount for credit/debit operations
     * @returns {Promise<string>} Result message
     */
    async execute(operationType, amount = null) {
        switch (operationType) {
            case 'TOTAL':
                return await this.viewBalance();
            case 'CREDIT':
                return await this.creditAccount(amount);
            case 'DEBIT':
                return await this.debitAccount(amount);
            default:
                return 'Invalid operation type.';
        }
    }
}

/**
 * MainProgram - User Interface Layer
 * Equivalent to main.cob
 * Manages user interaction and menu display
 */
class MainProgram {
    constructor() {
        this.dataProgram = new DataProgram();
        this.operations = new Operations(this.dataProgram);
        this.continueFlag = true;
        
        // Setup readline interface for user input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Display menu options
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Prompt user for input
     * @param {string} question - Question to ask
     * @returns {Promise<string>} User's input
     */
    prompt(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    /**
     * Process user menu choice
     * @param {string} choice - User's menu choice
     * @returns {Promise<void>}
     */
    async processChoice(choice) {
        const userChoice = parseInt(choice);

        switch (userChoice) {
            case 1:
                // CALL 'Operations' USING 'TOTAL'
                const balanceMsg = await this.operations.execute('TOTAL');
                console.log(balanceMsg);
                break;

            case 2:
                // CALL 'Operations' USING 'CREDIT'
                const creditAmount = await this.prompt('Enter credit amount: ');
                const creditMsg = await this.operations.execute('CREDIT', creditAmount);
                console.log(creditMsg);
                break;

            case 3:
                // CALL 'Operations' USING 'DEBIT'
                const debitAmount = await this.prompt('Enter debit amount: ');
                const debitMsg = await this.operations.execute('DEBIT', debitAmount);
                console.log(debitMsg);
                break;

            case 4:
                // MOVE 'NO' TO CONTINUE-FLAG
                this.continueFlag = false;
                break;

            default:
                // DISPLAY "Invalid choice, please select 1-4."
                console.log('Invalid choice, please select 1-4.');
                break;
        }
    }

    /**
     * Main program loop
     * PERFORM UNTIL CONTINUE-FLAG = 'NO'
     */
    async run() {
        console.log('\nStarting Account Management System...\n');

        // Main loop - equivalent to PERFORM UNTIL CONTINUE-FLAG = 'NO'
        while (this.continueFlag) {
            this.displayMenu();
            const choice = await this.prompt('Enter your choice (1-4): ');
            await this.processChoice(choice);
            console.log(); // Empty line for readability
        }

        // DISPLAY "Exiting the program. Goodbye!"
        console.log('Exiting the program. Goodbye!');
        
        // Close readline interface
        this.rl.close();
        
        // STOP RUN
        process.exit(0);
    }

    /**
     * Handle program errors
     * @param {Error} error - Error object
     */
    handleError(error) {
        console.error('An error occurred:', error.message);
        this.rl.close();
        process.exit(1);
    }
}

/**
 * Application entry point
 */
function main() {
    const app = new MainProgram();
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
        app.handleError(error);
    });
    
    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
        console.log('\n\nProgram interrupted. Exiting...');
        app.rl.close();
        process.exit(0);
    });
    
    // Start the application
    app.run().catch((error) => {
        app.handleError(error);
    });
}

// Start the application if this file is run directly
if (require.main === module) {
    main();
}

// Export classes for testing
module.exports = {
    DataProgram,
    Operations,
    MainProgram
};
