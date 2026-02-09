/**
 * Unit Tests for Account Management System
 * Based on Test Plan documented in docs/TESTPLAN.md
 * 
 * Mirrors the 50 test cases from the COBOL legacy application
 */

const { DataProgram, Operations, MainProgram } = require('./index');

describe('Account Management System - Unit Tests', () => {
    
    // ========================================
    // 1. Account Initialization and Balance Inquiry (TC-001 to TC-003)
    // ========================================
    
    describe('1. Account Initialization and Balance Inquiry', () => {
        
        test('TC-001: Verify default account balance on system start', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.viewBalance();
            
            expect(result).toBe('Current balance: 1000.00');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-002: Verify balance inquiry does not modify balance', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result1 = await operations.viewBalance();
            const result2 = await operations.viewBalance();
            
            expect(result1).toBe('Current balance: 1000.00');
            expect(result2).toBe('Current balance: 1000.00');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-003: Multiple consecutive balance checks', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            for (let i = 0; i < 5; i++) {
                const result = await operations.viewBalance();
                expect(result).toBe('Current balance: 1000.00');
            }
            
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
    });
    
    // ========================================
    // 2. Credit (Deposit) Operations (TC-004 to TC-010)
    // ========================================
    
    describe('2. Credit (Deposit) Operations', () => {
        
        test('TC-004: Credit account with valid amount', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const creditResult = await operations.creditAccount('500.00');
            expect(creditResult).toBe('Amount credited. New balance: 1500.00');
            
            const balanceResult = await operations.viewBalance();
            expect(balanceResult).toBe('Current balance: 1500.00');
        });
        
        test('TC-005: Credit account with minimum amount (0.01)', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('0.01');
            expect(result).toBe('Amount credited. New balance: 1000.01');
            expect(dataProgram.getBalance()).toBe(1000.01);
        });
        
        test('TC-006: Credit account with large amount', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('50000.00');
            expect(result).toBe('Amount credited. New balance: 51000.00');
            expect(dataProgram.getBalance()).toBe(51000.00);
        });
        
        test('TC-007: Multiple consecutive credits', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('100.00');
            await operations.creditAccount('200.00');
            const result = await operations.creditAccount('300.00');
            
            expect(result).toBe('Amount credited. New balance: 1600.00');
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1600.00');
        });
        
        test('TC-008: Credit with two decimal places', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('123.45');
            expect(result).toBe('Amount credited. New balance: 1123.45');
            expect(dataProgram.getBalance()).toBe(1123.45);
        });
        
        test('TC-009: Credit approaching maximum balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(900000.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('99000.00');
            expect(result).toBe('Amount credited. New balance: 999000.00');
            expect(dataProgram.getBalance()).toBe(999000.00);
        });
        
        test('TC-010: Credit reaching maximum balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(999999.98);
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('0.01');
            expect(result).toBe('Amount credited. New balance: 999999.99');
            expect(dataProgram.getBalance()).toBe(999999.99);
        });
    });
    
    // ========================================
    // 3. Debit (Withdrawal) Operations - Successful (TC-011 to TC-016)
    // ========================================
    
    describe('3. Debit (Withdrawal) Operations - Successful', () => {
        
        test('TC-011: Debit account with valid amount (sufficient funds)', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('300.00');
            expect(result).toBe('Amount debited. New balance: 700.00');
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 700.00');
        });
        
        test('TC-012: Debit entire account balance', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('1000.00');
            expect(result).toBe('Amount debited. New balance: 0.00');
            expect(dataProgram.getBalance()).toBe(0.00);
        });
        
        test('TC-013: Debit minimum amount (0.01)', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('0.01');
            expect(result).toBe('Amount debited. New balance: 999.99');
            expect(dataProgram.getBalance()).toBe(999.99);
        });
        
        test('TC-014: Multiple consecutive debits', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.debitAccount('100.00');
            await operations.debitAccount('200.00');
            const result = await operations.debitAccount('300.00');
            
            expect(result).toBe('Amount debited. New balance: 400.00');
            expect(dataProgram.getBalance()).toBe(400.00);
        });
        
        test('TC-015: Debit with two decimal places', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('456.78');
            expect(result).toBe('Amount debited. New balance: 543.22');
            expect(dataProgram.getBalance()).toBe(543.22);
        });
        
        test('TC-016: Debit leaving minimum balance (0.01)', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(100.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('99.99');
            expect(result).toBe('Amount debited. New balance: 0.01');
            expect(dataProgram.getBalance()).toBe(0.01);
        });
    });
    
    // ========================================
    // 4. Debit Operations - Insufficient Funds (TC-017 to TC-021)
    // ========================================
    
    describe('4. Debit Operations - Insufficient Funds', () => {
        
        test('TC-017: Debit exceeding available balance', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('1500.00');
            expect(result).toBe('Insufficient funds for this debit.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-018: Debit exceeding balance by $0.01', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('1000.01');
            expect(result).toBe('Insufficient funds for this debit.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-019: Debit from zero balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(0.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('0.01');
            expect(result).toBe('Insufficient funds for this debit.');
            expect(dataProgram.getBalance()).toBe(0.00);
        });
        
        test('TC-020: Large debit exceeding balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(100.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('999999.99');
            expect(result).toBe('Insufficient funds for this debit.');
            expect(dataProgram.getBalance()).toBe(100.00);
        });
        
        test('TC-021: Verify no partial debit on insufficient funds', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(100.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('150.00');
            expect(result).toBe('Insufficient funds for this debit.');
            expect(dataProgram.getBalance()).toBe(100.00);
        });
    });
    
    // ========================================
    // 5. Mixed Operations (TC-022 to TC-026)
    // ========================================
    
    describe('5. Mixed Operations', () => {
        
        test('TC-022: Credit followed by successful debit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('500.00');
            await operations.debitAccount('300.00');
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1200.00');
        });
        
        test('TC-023: Credit followed by failed debit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('100.00');
            const debitResult = await operations.debitAccount('2000.00');
            
            expect(debitResult).toBe('Insufficient funds for this debit.');
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1100.00');
        });
        
        test('TC-024: Debit followed by credit restoring balance', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.debitAccount('400.00');
            await operations.creditAccount('400.00');
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1000.00');
        });
        
        test('TC-025: Multiple operations bringing balance to zero', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.debitAccount('250.00');
            await operations.debitAccount('250.00');
            await operations.debitAccount('250.00');
            await operations.debitAccount('250.00');
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 0.00');
        });
        
        test('TC-026: View balance between each transaction', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            let balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1000.00');
            
            await operations.creditAccount('100.00');
            balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1100.00');
            
            await operations.debitAccount('50.00');
            balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1050.00');
        });
    });
    
    // ========================================
    // 6. Data Persistence and Consistency (TC-034 to TC-036)
    // ========================================
    
    describe('7. Data Persistence and Consistency', () => {
        
        test('TC-034: Balance persists across operations', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('200.00');
            let balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1200.00');
            
            await operations.debitAccount('50.00');
            balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1150.00');
        });
        
        test('TC-035: Failed debit does not affect balance', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            let balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1000.00');
            
            const debitResult = await operations.debitAccount('2000.00');
            expect(debitResult).toBe('Insufficient funds for this debit.');
            
            balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1000.00');
            
            await operations.creditAccount('100.00');
            balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1100.00');
        });
        
        test('TC-036: Balance accuracy after 10 operations', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            // 5 credits: 100 + 200 + 300 + 400 + 500 = 1500
            await operations.creditAccount('100.00');
            await operations.creditAccount('200.00');
            await operations.creditAccount('300.00');
            await operations.creditAccount('400.00');
            await operations.creditAccount('500.00');
            
            // 5 debits: 50 + 100 + 150 + 200 + 250 = 750
            await operations.debitAccount('50.00');
            await operations.debitAccount('100.00');
            await operations.debitAccount('150.00');
            await operations.debitAccount('200.00');
            await operations.debitAccount('250.00');
            
            // Expected: 1000 + 1500 - 750 = 1750
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1750.00');
        });
    });
    
    // ========================================
    // 8. Boundary and Edge Cases (TC-037 to TC-044)
    // ========================================
    
    describe('8. Boundary and Edge Cases', () => {
        
        test('TC-037: Maximum allowed balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(0.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('999999.99');
            expect(result).toBe('Amount credited. New balance: 999999.99');
            expect(dataProgram.getBalance()).toBe(999999.99);
        });
        
        test('TC-038: Credit exceeding maximum balance limit', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(999990.00);
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('20.00');
            expect(result).toBe('Credit would exceed maximum balance of 999999.99');
            expect(dataProgram.getBalance()).toBe(999990.00);
        });
        
        test('TC-039: Zero amount credit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('0.00');
            expect(result).toBe('Amount must be greater than zero.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-040: Zero amount debit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('0.00');
            expect(result).toBe('Amount must be greater than zero.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-041: Negative amount credit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('-100.00');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-042: Negative amount debit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('-100.00');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('TC-043: Amount with more than 2 decimal places', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('100.999');
            // System should round to 2 decimal places: 101.00
            expect(result).toBe('Amount credited. New balance: 1101.00');
            expect(dataProgram.getBalance()).toBe(1101.00);
        });
        
        test('TC-044: Very large amount input exceeding maximum', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('9999999.99');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
    });
    
    // ========================================
    // 9. Decimal Precision and Formatting (TC-045 to TC-050)
    // ========================================
    
    describe('9. Decimal Precision and Formatting', () => {
        
        test('TC-045: Balance display shows 2 decimal places', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const balance = await operations.viewBalance();
            expect(balance).toMatch(/\d+\.\d{2}$/);
            expect(balance).toBe('Current balance: 1000.00');
        });
        
        test('TC-046: Credit of whole dollar amount', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('500');
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1500.00');
        });
        
        test('TC-047: Debit of whole dollar amount', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.debitAccount('250');
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 750.00');
        });
        
        test('TC-048: Operations resulting in .00 cents', async () => {
            const dataProgram = new DataProgram();
            dataProgram.setBalance(1000.50);
            const operations = new Operations(dataProgram);
            
            await operations.debitAccount('0.50');
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1000.00');
        });
        
        test('TC-049: Operations resulting in .99 cents', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('0.99');
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1000.99');
        });
        
        test('TC-050: Balance after multiple operations with decimals', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            await operations.creditAccount('123.45');      // 1123.45
            await operations.debitAccount('67.89');        // 1055.56
            await operations.creditAccount('0.11');        // 1055.67
            
            const balance = await operations.viewBalance();
            expect(balance).toBe('Current balance: 1055.67');
        });
    });
    
    // ========================================
    // Additional Tests for DataProgram class
    // ========================================
    
    describe('DataProgram - Data Persistence Layer', () => {
        
        test('DataProgram initializes with 1000.00 balance', () => {
            const dataProgram = new DataProgram();
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('DataProgram READ operation returns current balance', () => {
            const dataProgram = new DataProgram();
            const balance = dataProgram.execute('READ');
            expect(balance).toBe(1000.00);
        });
        
        test('DataProgram WRITE operation updates balance', () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 1500.00);
            expect(dataProgram.getBalance()).toBe(1500.00);
        });
        
        test('DataProgram maintains state across READ/WRITE operations', () => {
            const dataProgram = new DataProgram();
            
            dataProgram.execute('WRITE', 2000.00);
            const balance1 = dataProgram.execute('READ');
            expect(balance1).toBe(2000.00);
            
            dataProgram.execute('WRITE', 3000.00);
            const balance2 = dataProgram.execute('READ');
            expect(balance2).toBe(3000.00);
        });
    });
    
    // ========================================
    // Integration Tests
    // ========================================
    
    describe('Integration Tests - Full Transaction Flows', () => {
        
        test('Complete user session: check, credit, debit, check', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            // Initial balance check
            let result = await operations.viewBalance();
            expect(result).toBe('Current balance: 1000.00');
            
            // Credit account
            result = await operations.creditAccount('500.00');
            expect(result).toBe('Amount credited. New balance: 1500.00');
            
            // Debit account
            result = await operations.debitAccount('300.00');
            expect(result).toBe('Amount debited. New balance: 1200.00');
            
            // Final balance check
            result = await operations.viewBalance();
            expect(result).toBe('Current balance: 1200.00');
        });
        
        test('Attempted overdraft scenario', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            // Try to debit more than available
            let result = await operations.debitAccount('1500.00');
            expect(result).toBe('Insufficient funds for this debit.');
            
            // Verify balance unchanged
            result = await operations.viewBalance();
            expect(result).toBe('Current balance: 1000.00');
            
            // Now add funds
            result = await operations.creditAccount('1000.00');
            expect(result).toBe('Amount credited. New balance: 2000.00');
            
            // Now the debit should work
            result = await operations.debitAccount('1500.00');
            expect(result).toBe('Amount debited. New balance: 500.00');
        });
        
        test('Complex transaction sequence matching COBOL behavior', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            // Scenario from test plan examples
            await operations.creditAccount('500.00');     // 1500.00
            await operations.debitAccount('2000.00');     // Failed, still 1500.00
            const result = await operations.debitAccount('500.00');  // 1000.00
            
            expect(result).toBe('Amount debited. New balance: 1000.00');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
    });
    
    // ========================================
    // Input Validation Tests
    // ========================================
    
    describe('Input Validation', () => {
        
        test('Non-numeric input for credit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('abc');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('Non-numeric input for debit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('xyz');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('Empty string input for credit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.creditAccount('');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
        
        test('Empty string input for debit', async () => {
            const dataProgram = new DataProgram();
            const operations = new Operations(dataProgram);
            
            const result = await operations.debitAccount('');
            expect(result).toBe('Invalid amount. Please enter a valid positive number.');
            expect(dataProgram.getBalance()).toBe(1000.00);
        });
    });
});
