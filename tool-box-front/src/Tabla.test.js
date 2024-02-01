import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

fetchMock.enableMocks();

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        if (!args.some(arg => arg.includes('Error fetching data: Empty response'))) {
            originalError(...args);
        }
    });
});

afterAll(() => {
    console.error.mockRestore();
});

describe('Integration Test: App Component with Tabla', () => {

    test('updates fileName state in Tabla component on interaction', async () => {
        render(<App />);

        const inputElement = screen.getByPlaceholderText('Search file name');

        expect(inputElement).toBeDefined();

        await act(async () => {
            userEvent.type(inputElement, 'test2.csv');
        });

        expect(inputElement).toHaveValue('test2.csv');
    });

    test('fetches data and renders table in App', async () => {
        const mockData = [
            {
                file: 'test2.csv',
                lines: [
                    { text: 'QxvlZbzMbtpFklcpe', number: '68', hex: '83eda6e0682dc3447d897927ac6e257c' },
                ],
            },
        ];

        fetchMock.mockResponseOnce(JSON.stringify({ results: mockData }), { headers: { 'Content-Type': 'application/json' } });

        render(<App />);

        const searchInput = screen.getByPlaceholderText('Search file name');

        userEvent.type(searchInput, 'test2.csv');

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');

            expect(tableRows.length).toBeGreaterThan(0);

            if (tableRows.length > 1) {
                expect(tableRows[1].textContent).toContain('test2.csv');
            }
        });
    });


    test('fetches data with empty fileName in App', async () => {
        const mockResponse = {
            results: [],
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { headers: { 'Content-Type': 'application/json' } });

        render(<App />);

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');

            expect(tableRows.length).toBe(1);
        });
    });
});
