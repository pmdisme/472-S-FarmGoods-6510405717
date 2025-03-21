import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import CalculateChange from '@/app/components/CalculateChange';

// Mock the alert function
global.alert = jest.fn();

describe('CalculateChange Acceptance Criteria Tests', () => {
    const mockOnClose = jest.fn();
    const mockHandleOpenReceipt = jest.fn();

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    // Acceptance Criteria 1: The system must calculate the correct change based on the amount given by the customer.
    describe('Criteria 1: Correct change calculation', () => {
        test('calculates exact change for whole numbers', () => {
            const orderTotal = 100.00;
            const { getByText, getByLabelText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            fireEvent.change(amountPaidInput, { target: { value: '150' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // Find the change section first
            const changeSection = getByText('Change').closest('.MuiBox-root');
            // Then find the change amount within that section
            const changeAmount = within(changeSection).getByText(/50\.00฿/);

            expect(changeAmount).toBeTruthy();
        });

        test('calculates exact change with decimal values', () => {
            const orderTotal = 75.50;
            const { getByText, getByLabelText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            fireEvent.change(amountPaidInput, { target: { value: '100.25' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // Find the change section first
            const changeSection = getByText('Change').closest('.MuiBox-root');
            // Then find the change amount within that section
            const changeAmount = within(changeSection).getByText(/24\.75฿/);

            expect(changeAmount).toBeTruthy();
        });

        test('rejects insufficient payment amount', () => {
            const orderTotal = 200.00;
            const { getByText, getByLabelText, queryByText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            fireEvent.change(amountPaidInput, { target: { value: '199.99' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            expect(global.alert).toHaveBeenCalledWith('Amount paid is less than the order total');
            expect(queryByText('Change')).toBeFalsy();
        });
    });

    // Acceptance Criteria 2: The system must display the calculated change clearly on the screen.
    describe('Criteria 2: Clear display of calculated change', () => {
        test('displays change section after calculation', () => {
            const orderTotal = 50.00;
            const { getByText, getByLabelText, queryByText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            // Check that change section doesn't exist before calculation
            expect(queryByText('Change')).toBeFalsy();

            const amountPaidInput = getByLabelText('Amount Paid');
            fireEvent.change(amountPaidInput, { target: { value: '100' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // After calculation, the change section should exist
            expect(getByText('Change')).toBeTruthy();

            // Find the change section
            const changeSection = getByText('Change').closest('.MuiBox-root');

            // Verify the change amount is displayed in the section
            expect(within(changeSection).getByText(/50\.00฿/)).toBeTruthy();
        });

        test('formatted change is displayed with currency symbol', () => {
            const orderTotal = 45.75;
            const { getByText, getByLabelText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            fireEvent.change(amountPaidInput, { target: { value: '50' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // Find the change section
            const changeSection = getByText('Change').closest('.MuiBox-root');

            // Check for proper formatting with currency symbol using regex
            const changeText = within(changeSection).getByText(/4\.25฿/);
            expect(changeText).toBeTruthy();
            expect(changeText.textContent).toMatch(/^\s*4\.25\s*฿\s*$/);
        });
    });

    // Acceptance Criteria 3: The system must handle rounding rules according to the store's policy.
    describe('Criteria 3: Proper rounding rules', () => {
        test('rounds to 2 decimal places', () => {
            const orderTotal = 100.00;
            const { getByText, getByLabelText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            // This would result in 33.333333... without rounding
            fireEvent.change(amountPaidInput, { target: { value: '133.333333' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // Find the change section
            const changeSection = getByText('Change').closest('.MuiBox-root');

            // Should be rounded to 2 decimal places
            const changeText = within(changeSection).getByText(/33\.33฿/);
            expect(changeText).toBeTruthy();
            expect(changeText.textContent).toMatch(/^\s*33\.33\s*฿\s*$/);
        });

        test('handles floating point precision issues correctly', () => {
            const orderTotal = 10.10;
            const { getByText, getByLabelText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            // 0.1 + 0.2 = 0.30000000000000004 in JavaScript
            fireEvent.change(amountPaidInput, { target: { value: '10.40' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // Find the change section
            const changeSection = getByText('Change').closest('.MuiBox-root');

            // Should handle floating point properly
            const changeText = within(changeSection).getByText(/0\.30฿/);
            expect(changeText).toBeTruthy();
        });

        test('rounds correctly for fractional cents', () => {
            const orderTotal = 50.505;  // Note: This would normally be displayed as 50.51
            const { getByText, getByLabelText } = render(
                <CalculateChange
                    open={true}
                    onClose={mockOnClose}
                    orderTotal={orderTotal}
                    handleOpenReceipt={mockHandleOpenReceipt}
                />
            );

            const amountPaidInput = getByLabelText('Amount Paid');
            fireEvent.change(amountPaidInput, { target: { value: '100.255' } });

            const calculateButton = getByText('Calculate');
            fireEvent.click(calculateButton);

            // Find the change section
            const changeSection = getByText('Change').closest('.MuiBox-root');

            // The difference is 49.75 (with JavaScript rounding)
            const changeText = within(changeSection).getByText(/49\.75฿/);
            expect(changeText).toBeTruthy();
        });
    });
});