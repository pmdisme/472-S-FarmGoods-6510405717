import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CalculateChange from '@/app/components/CalculateChange';

// Mock the alert function
global.alert = jest.fn();

describe('CalculateChange Component', () => {
    const mockOnClose = jest.fn();
    const mockHandleOpenReceipt = jest.fn();
    const orderTotal = 100.50;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('renders correctly with order total', () => {
        const { getByText, getByLabelText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        expect(getByText('Calculate Change')).toBeTruthy();
        expect(getByText('Order Total')).toBeTruthy();
        expect(getByText('100.50฿')).toBeTruthy();
        expect(getByLabelText('Amount Paid')).toBeTruthy();
        expect(getByText('Calculate')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Confirm')).toBeTruthy();
    });

    test('calculates change correctly when valid amount is entered', () => {
        const { getByText, getByLabelText, queryByText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: '200' } });

        const calculateButton = getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(getByText('Change')).toBeTruthy();
        expect(getByText('99.50฿')).toBeTruthy();
    });

    test('shows alert when amount paid is not a valid number', () => {
        const { getByText, getByLabelText, queryByText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: 'abc' } });

        const calculateButton = getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(global.alert).toHaveBeenCalledWith('Please enter a valid number');
        expect(queryByText('Change')).toBeFalsy();
    });

    test('shows alert when amount paid is less than order total', () => {
        const { getByText, getByLabelText, queryByText } = render(
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

        expect(global.alert).toHaveBeenCalledWith('Amount paid is less than the order total');
        expect(queryByText('Change')).toBeFalsy();
    });

    test('resets state and calls onClose when cancel button is clicked', () => {
        const { getByText, getByLabelText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: '200' } });

        const calculateButton = getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(getByText('Change')).toBeTruthy();

        const cancelButton = getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls handleOpenReceipt with "cash" parameter when confirm button is clicked with valid amount', () => {
        const { getByText, getByLabelText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: '200' } });

        const confirmButton = getByText('Confirm');
        fireEvent.click(confirmButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockHandleOpenReceipt).toHaveBeenCalledWith('cash');
    });

    test('shows alert when confirm button is clicked with invalid amount', () => {
        const { getByText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        // Leave amount paid empty
        const confirmButton = getByText('Confirm');
        fireEvent.click(confirmButton);

        expect(global.alert).toHaveBeenCalledWith('Please enter a valid amount paid');
        expect(mockOnClose).not.toHaveBeenCalled();
        expect(mockHandleOpenReceipt).not.toHaveBeenCalled();
    });

    test('calculates change when Enter key is pressed', () => {
        const { getByText, getByLabelText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: '200' } });
        fireEvent.keyDown(amountPaidInput, { key: 'Enter', code: 'Enter' });

        expect(getByText('Change')).toBeTruthy();
        expect(getByText('99.50฿')).toBeTruthy();
    });

    test('recalculates change when amount paid changes', () => {
        const { getByText, getByLabelText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        // First calculation
        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: '200' } });

        const calculateButton = getByText('Calculate');
        fireEvent.click(calculateButton);

        expect(getByText('99.50฿')).toBeTruthy();

        // Change amount and calculate again
        fireEvent.change(amountPaidInput, { target: { value: '150' } });
        fireEvent.click(calculateButton);

        expect(getByText('49.50฿')).toBeTruthy();
    });

    test('automatically calculates change if not calculated before confirmation', () => {
        const { getByText, getByLabelText } = render(
            <CalculateChange
                open={true}
                onClose={mockOnClose}
                orderTotal={orderTotal}
                handleOpenReceipt={mockHandleOpenReceipt}
            />
        );

        // Enter amount but don't press calculate
        const amountPaidInput = getByLabelText('Amount Paid');
        fireEvent.change(amountPaidInput, { target: { value: '200' } });

        // Directly confirm
        const confirmButton = getByText('Confirm');
        fireEvent.click(confirmButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockHandleOpenReceipt).toHaveBeenCalledWith('cash');
    });
});