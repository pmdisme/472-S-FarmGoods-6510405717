import {act, renderHook} from '@testing-library/react';
import {useProductForm} from '@/hooks/useProductForm';

// Mock global URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock global fetch
global.fetch = jest.fn();

describe('useProductForm', () => {
    let mockOnSuccess;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        mockOnSuccess = jest.fn();
    });

    test('initial state is correct', () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        expect(result.current.formData).toEqual({
            productName: '',
            productPrice: '',
            productImage: null
        });
        expect(result.current.errors).toEqual({
            productName: '',
            productPrice: '',
            productImage: '',
            general: ''
        });
        expect(result.current.isFormValid).toBe(false);
    });

    test('handleInputChange updates form data and clears errors', () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        const mockEvent = {
            target: {
                name: 'productName',
                value: 'Test Product'
            }
        };

        act(() => {
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.formData.productName).toBe('Test Product');
        expect(result.current.errors.productName).toBe('');
        expect(result.current.errors.general).toBe('');
    });

    test('handleImageChange with valid image', () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        // Create mock file
        const mockFile = new File(['test'], 'test.jpg', {type: 'image/jpeg'});
        const mockEvent = {
            target: {
                files: [mockFile],
                value: 'C:\\fakepath\\test.jpg'
            }
        };

        // Mock URL.createObjectURL
        URL.createObjectURL.mockReturnValue('mock-url');

        act(() => {
            result.current.handleImageChange(mockEvent);
        });

        expect(result.current.formData.productImage).toBe(mockFile);
        expect(result.current.selectedFileName).toBe('test.jpg');
        expect(result.current.previewUrl).toBe('mock-url');
        expect(result.current.errors.productImage).toBe('');
    });

    test('handleImageChange with invalid file type', () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        // Create mock file with invalid type
        const mockFile = new File(['test'], 'test.gif', {type: 'image/gif'});
        const mockEvent = {
            target: {
                files: [mockFile],
                value: ''
            }
        };

        act(() => {
            result.current.handleImageChange(mockEvent);
        });

        expect(result.current.formData.productImage).toBe(null);
        expect(result.current.errors.productImage).toBe(
            'Invalid file type. Please upload JPEG, JPG, PNG, WebP, or SVG files only.'
        );
    });

    test('handleSubmit with successful product creation', async () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        // Prepare form data
        const mockFile = new File(['test'], 'test.jpg', {type: 'image/jpeg'});

        act(() => {
            result.current.handleInputChange({
                target: {name: 'productName', value: 'New Product'}
            });
            result.current.handleInputChange({
                target: {name: 'productPrice', value: '19.99'}
            });
            result.current.formData.productImage = mockFile;
        });

        // Mock successful fetch response
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                success: true,
                data: {id: 1, productName: 'New Product'}
            })
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(mockOnSuccess).toHaveBeenCalledWith({
            id: 1,
            productName: 'New Product'
        });
        expect(result.current.errors.general).toBe('');
    });

    test('handleSubmit with product name error', async () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        // Prepare form data
        const mockFile = new File(['test'], 'test.jpg', {type: 'image/jpeg'});

        act(() => {
            result.current.handleInputChange({
                target: {name: 'productName', value: 'Existing Product'}
            });
            result.current.handleInputChange({
                target: {name: 'productPrice', value: '19.99'}
            });
            result.current.formData.productImage = mockFile;
        });

        // Mock error response
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                success: false,
                error: 'name already exists'
            })
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.errors.productName).toBe('Product name already exists.');
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    test('resetForm clears all form data', () => {
        const {result} = renderHook(() => useProductForm(mockOnSuccess));

        // Set some initial data
        act(() => {
            result.current.handleInputChange({
                target: {name: 'productName', value: 'Test Product'}
            });
            result.current.handleInputChange({
                target: {name: 'productPrice', value: '19.99'}
            });
        });

        act(() => {
            result.current.resetForm();
        });

        expect(result.current.formData).toEqual({
            productName: '',
            productPrice: '',
            productImage: null
        });
        expect(result.current.errors).toEqual({
            productName: '',
            productPrice: '',
            productImage: '',
            general: ''
        });
    });
});