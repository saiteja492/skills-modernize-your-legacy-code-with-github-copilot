# Test Plan - Account Management System

## Overview

This test plan covers all business logic and functionality of the Account Management System migrating from COBOL to Node.js. The test cases validate account operations including balance inquiry, credit transactions, debit transactions, and system constraints.

**System Under Test:** Account Management System  
**Version:** Legacy COBOL Application (Pre-Migration)  
**Target Platform:** Node.js (Post-Migration)  
**Test Date:** February 9, 2026  
**Prepared By:** GitHub Copilot

---

## Test Scope

- Initial account setup and default balance
- Balance inquiry operations
- Credit (deposit) transactions
- Debit (withdrawal) transactions with validation
- Insufficient funds handling
- Menu navigation and input validation
- Data persistence across operations
- Decimal precision and formatting
- Maximum balance constraints
- Edge cases and boundary conditions

---

## Test Cases

### 1. Account Initialization and Balance Inquiry

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-001 | Verify default account balance on system start | System not yet started | 1. Start the application<br/>2. Select option 1 (View Balance) | System displays "Current balance: 1000.00" | | | Initial balance should be $1,000.00 as per business rules |
| TC-002 | Verify balance inquiry does not modify balance | Account balance is $1,000.00 | 1. Select option 1 (View Balance)<br/>2. Note the balance<br/>3. Select option 1 again | Same balance displayed both times (1000.00) | | | Read-only operation |
| TC-003 | Multiple consecutive balance checks | Account balance is $1,000.00 | 1. Select option 1 five times consecutively | Each inquiry shows same balance: 1000.00 | | | Validates no side effects from balance checks |

### 2. Credit (Deposit) Operations

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-004 | Credit account with valid amount | Account balance is $1,000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter amount: 500.00<br/>3. Select option 1 to verify | Display: "Amount credited. New balance: 1500.00"<br/>Balance inquiry shows 1500.00 | | | Standard credit operation |
| TC-005 | Credit account with minimum amount (0.01) | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: 0.01<br/>3. Verify balance | New balance: 1000.01 | | | Boundary test - minimum credit |
| TC-006 | Credit account with large amount | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: 50000.00<br/>3. Verify balance | New balance: 51000.00 | | | Large transaction handling |
| TC-007 | Multiple consecutive credits | Account balance is $1,000.00 | 1. Credit 100.00<br/>2. Credit 200.00<br/>3. Credit 300.00<br/>4. Verify balance | Final balance: 1600.00<br/>Each transaction shows cumulative balance | | | Tests transaction sequencing |
| TC-008 | Credit with two decimal places | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: 123.45<br/>3. Verify balance | New balance: 1123.45 | | | Decimal precision validation |
| TC-009 | Credit approaching maximum balance | Account balance is $900,000.00 | 1. Select option 2<br/>2. Enter amount: 99000.00<br/>3. Verify balance | New balance: 999000.00 | | | Near-maximum balance test |
| TC-010 | Credit reaching maximum balance | Account balance is $999,999.98 | 1. Select option 2<br/>2. Enter amount: 0.01<br/>3. Verify balance | New balance: 999999.99 | | | Maximum balance boundary |

### 3. Debit (Withdrawal) Operations - Successful

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-011 | Debit account with valid amount (sufficient funds) | Account balance is $1,000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter amount: 300.00<br/>3. Verify balance | Display: "Amount debited. New balance: 700.00"<br/>Balance shows 700.00 | | | Standard debit operation |
| TC-012 | Debit entire account balance | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1000.00<br/>3. Verify balance | New balance: 0.00 | | | Boundary test - zero balance |
| TC-013 | Debit minimum amount (0.01) | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: 0.01<br/>3. Verify balance | New balance: 999.99 | | | Minimum debit amount |
| TC-014 | Multiple consecutive debits | Account balance is $1,000.00 | 1. Debit 100.00<br/>2. Debit 200.00<br/>3. Debit 300.00<br/>4. Verify balance | Final balance: 400.00<br/>Each transaction shows updated balance | | | Sequential debit operations |
| TC-015 | Debit with two decimal places | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: 456.78<br/>3. Verify balance | New balance: 543.22 | | | Decimal precision for debits |
| TC-016 | Debit leaving minimum balance (0.01) | Account balance is $100.00 | 1. Select option 3<br/>2. Enter amount: 99.99<br/>3. Verify balance | New balance: 0.01 | | | Near-zero balance test |

### 4. Debit Operations - Insufficient Funds

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-017 | Debit exceeding available balance | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1500.00<br/>3. Verify balance | Display: "Insufficient funds for this debit."<br/>Balance remains: 1000.00 | | | Core business rule validation |
| TC-018 | Debit exceeding balance by $0.01 | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1000.01<br/>3. Verify balance | Error message displayed<br/>Balance remains: 1000.00 | | | Boundary test - just over limit |
| TC-019 | Debit from zero balance | Account balance is $0.00 | 1. Select option 3<br/>2. Enter amount: 0.01<br/>3. Verify balance | Error message displayed<br/>Balance remains: 0.00 | | | No overdraft allowed |
| TC-020 | Large debit exceeding balance | Account balance is $100.00 | 1. Select option 3<br/>2. Enter amount: 999999.99<br/>3. Verify balance | Error message displayed<br/>Balance remains: 100.00 | | | Large overdraft attempt |
| TC-021 | Verify no partial debit on insufficient funds | Account balance is $100.00 | 1. Select option 3<br/>2. Enter amount: 150.00<br/>3. Check balance immediately | Balance unchanged: 100.00<br/>No partial deduction | | | Transaction atomicity |

### 5. Mixed Operations

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-022 | Credit followed by successful debit | Account balance is $1,000.00 | 1. Credit 500.00<br/>2. Debit 300.00<br/>3. Verify balance | Final balance: 1200.00 | | | Transaction sequence validation |
| TC-023 | Credit followed by failed debit | Account balance is $1,000.00 | 1. Credit 100.00<br/>2. Attempt debit 2000.00<br/>3. Verify balance | Balance: 1100.00<br/>Debit rejected | | | Partial transaction rollback |
| TC-024 | Debit followed by credit restoring balance | Account balance is $1,000.00 | 1. Debit 400.00<br/>2. Credit 400.00<br/>3. Verify balance | Final balance: 1000.00 | | | Balance restoration |
| TC-025 | Multiple operations bringing balance to zero | Account balance is $1,000.00 | 1. Debit 250.00<br/>2. Debit 250.00<br/>3. Debit 250.00<br/>4. Debit 250.00<br/>5. Verify balance | Final balance: 0.00 | | | Zero balance through multiple operations |
| TC-026 | View balance between each transaction | Account balance is $1,000.00 | 1. View balance<br/>2. Credit 100.00<br/>3. View balance<br/>4. Debit 50.00<br/>5. View balance | Balances shown: 1000.00, 1100.00, 1050.00 | | | Balance consistency check |

### 6. Menu Navigation and Input Validation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-027 | Select each valid menu option | System running | 1. Select option 1<br/>2. Select option 2, enter amount<br/>3. Select option 3, enter amount<br/>4. Verify all work | All operations execute successfully | | | Menu functionality validation |
| TC-028 | Invalid menu choice (0) | System running | 1. Enter choice: 0 | Display: "Invalid choice, please select 1-4." | | | Lower boundary validation |
| TC-029 | Invalid menu choice (5) | System running | 1. Enter choice: 5 | Display: "Invalid choice, please select 1-4." | | | Upper boundary validation |
| TC-030 | Invalid menu choice (negative number) | System running | 1. Enter choice: -1 | Display: "Invalid choice, please select 1-4." | | | Negative input validation |
| TC-031 | Invalid menu choice (non-numeric) | System running | 1. Enter choice: 'abc' | System handles gracefully with error message | | | Non-numeric input handling |
| TC-032 | Exit application (option 4) | System running, balance is $1,000.00 | 1. Select option 4 | Display: "Exiting the program. Goodbye!"<br/>Program terminates | | | Clean exit functionality |
| TC-033 | Return to menu after each operation | System running | 1. Perform any operation<br/>2. Verify menu redisplays | Menu appears after each operation until exit | | | Menu loop validation |

### 7. Data Persistence and Consistency

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-034 | Balance persists across operations | Account balance is $1,000.00 | 1. Credit 200.00<br/>2. View balance<br/>3. Debit 50.00<br/>4. View balance | Each view shows correct cumulative balance: 1200.00, then 1150.00 | | | Data consistency validation |
| TC-035 | Failed debit does not affect balance | Account balance is $1,000.00 | 1. Note balance<br/>2. Attempt debit 2000.00 (fails)<br/>3. Check balance<br/>4. Perform successful credit 100.00<br/>5. Check balance | Balance after failed debit: 1000.00<br/>Balance after credit: 1100.00 | | | Failed transaction isolation |
| TC-036 | Balance accuracy after 10 operations | Account balance is $1,000.00 | 1. Perform 10 mixed operations (5 credits, 5 debits)<br/>2. Manually calculate expected balance<br/>3. View balance | Displayed balance matches calculated balance | | | Cumulative calculation accuracy |

### 8. Boundary and Edge Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-037 | Maximum allowed balance | Account balance is $0.00 | 1. Credit 999999.99<br/>2. Verify balance | Balance: 999999.99 | | | Maximum system limit |
| TC-038 | Credit exceeding maximum balance limit | Account balance is $999,990.00 | 1. Attempt credit 20.00 | System behavior: May accept or reject based on implementation | | | Overflow handling - needs clarification |
| TC-039 | Zero amount credit (if accepted) | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: 0.00<br/>3. Verify balance | System behavior based on validation rules | | | Zero amount handling |
| TC-040 | Zero amount debit (if accepted) | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: 0.00<br/>3. Verify balance | System behavior based on validation rules | | | Zero amount handling |
| TC-041 | Negative amount credit (if accepted) | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: -100.00 | System should reject or handle gracefully | | | Negative input validation |
| TC-042 | Negative amount debit (if accepted) | Account balance is $1,000.00 | 1. Select option 3<br/>2. Enter amount: -100.00 | System should reject or handle gracefully | | | Negative input validation |
| TC-043 | Amount with more than 2 decimal places | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: 100.999 | System rounds or truncates to 100.99 or 101.00 | | | Decimal precision handling |
| TC-044 | Very large amount input | Account balance is $1,000.00 | 1. Select option 2<br/>2. Enter amount: 9999999.99 | System handles based on PIC 9(6)V99 limit | | | Input overflow handling |

### 9. Decimal Precision and Formatting

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-045 | Balance display shows 2 decimal places | Account balance is $1,000.00 | 1. View balance | Display shows: "1000.00" (not "1000" or "1000.0") | | | Formatting consistency |
| TC-046 | Credit of whole dollar amount | Account balance is $1,000.00 | 1. Credit 500<br/>2. View balance | Display shows: "1500.00" | | | Whole number formatting |
| TC-047 | Debit of whole dollar amount | Account balance is $1,000.00 | 1. Debit 250<br/>2. View balance | Display shows: "750.00" | | | Whole number formatting |
| TC-048 | Operations resulting in .00 cents | Account balance is $1,000.50 | 1. Debit 0.50<br/>2. View balance | Display shows: "1000.00" | | | Zero cents formatting |
| TC-049 | Operations resulting in .99 cents | Account balance is $1,000.00 | 1. Credit 0.99<br/>2. View balance | Display shows: "1000.99" | | | Maximum cents formatting |
| TC-050 | Balance after multiple operations with decimals | Account balance is $1,000.00 | 1. Credit 123.45<br/>2. Debit 67.89<br/>3. Credit 0.11<br/>4. View balance | Display shows: "1055.67" (exact calculation) | | | Decimal arithmetic precision |

---

## Test Execution Summary

| Category | Total Test Cases | Pass | Fail | Blocked | Not Executed |
|----------|-----------------|------|------|---------|--------------|
| Account Initialization | 3 | | | | 3 |
| Credit Operations | 7 | | | | 7 |
| Debit Operations (Successful) | 6 | | | | 6 |
| Debit Operations (Insufficient Funds) | 5 | | | | 5 |
| Mixed Operations | 5 | | | | 5 |
| Menu Navigation | 7 | | | | 7 |
| Data Persistence | 3 | | | | 3 |
| Boundary & Edge Cases | 8 | | | | 8 |
| Decimal Precision | 6 | | | | 6 |
| **TOTAL** | **50** | **0** | **0** | **0** | **50** |

---

## Test Environment

### Current COBOL Environment
- **Compiler:** GNU COBOL (cobc)
- **Platform:** Linux (Ubuntu 22.04.5 LTS)
- **Execution:** Command-line interface
- **Data Storage:** In-memory (WORKING-STORAGE)

### Target Node.js Environment
- **Runtime:** Node.js (version TBD)
- **Testing Framework:** Jest / Mocha / Jasmine (to be decided)
- **Test Types:** Unit tests, Integration tests
- **Database:** To be determined (for persistent storage)

---

## Testing Notes for Migration

### Critical Business Rules to Preserve
1. **Initial Balance:** $1,000.00 default balance
2. **No Overdrafts:** Debit transactions must validate sufficient funds
3. **Decimal Precision:** All amounts must maintain 2 decimal places
4. **Transaction Atomicity:** Failed transactions must not modify balance
5. **Maximum Balance:** $999,999.99 system limit

### Areas Requiring Clarification
1. **Overflow Behavior:** What happens when credit would exceed $999,999.99?
2. **Zero Amount Transactions:** Should the system accept $0.00 credits/debits?
3. **Negative Amount Input:** Current validation behavior needs documentation
4. **Input Format:** How should the system handle various input formats (e.g., "$100", "100.0", ".50")?
5. **Concurrent Access:** Node.js app will need to handle multiple simultaneous users

### Recommended Enhancements for Node.js
1. **Input Validation:** Comprehensive regex-based validation for amounts
2. **Transaction History:** Log all operations with timestamps
3. **User Authentication:** Add user accounts and authentication
4. **Persistent Storage:** Database integration for data persistence
5. **Error Logging:** Structured error logging and monitoring
6. **API Design:** RESTful API with proper HTTP status codes
7. **Rate Limiting:** Prevent abuse of operations
8. **Audit Trail:** Complete audit log for compliance

---

## Test Data Sets

### Standard Test Data
- **Initial Balance:** $1,000.00
- **Small Credit:** $0.01, $10.00, $100.00
- **Medium Credit:** $500.00, $1,000.00
- **Large Credit:** $10,000.00, $50,000.00
- **Small Debit:** $0.01, $10.00, $100.00
- **Medium Debit:** $500.00, $900.00
- **Large Debit:** Full balance amount

### Boundary Test Data
- **Minimum Amount:** $0.01
- **Maximum Amount:** $999,999.99
- **Zero Balance:** $0.00
- **Just Over Balance:** Current balance + $0.01
- **Maximum Transaction:** $999,999.99

### Edge Case Test Data
- Zero amount: $0.00
- Negative amounts: -$100.00
- Extra decimals: $100.999
- Large overflow: $9,999,999.99
- Non-numeric: "abc", "$100", "100.00.00"

---

## Defect Tracking Template

| Defect ID | Test Case ID | Description | Severity | Status | Assigned To | Resolution |
|-----------|--------------|-------------|----------|--------|-------------|------------|
| | | | | | | |

**Severity Levels:**
- **Critical:** System crash, data loss, security vulnerability
- **High:** Core functionality broken, major business rule violation
- **Medium:** Feature not working as expected, workaround available
- **Low:** Minor issue, cosmetic problem, enhancement request

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Stakeholder | | | |
| QA Lead | | | |
| Development Lead | | | |
| Project Manager | | | |

---

*Test Plan Version: 1.0*  
*Last Updated: February 9, 2026*  
*Next Review Date: TBD*
