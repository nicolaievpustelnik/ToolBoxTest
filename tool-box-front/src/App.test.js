import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.useFakeTimers();

describe('App Component', () => {
    test('renders App component', () => {
        render(<App />);
        const appElement = screen.getByTestId('app-component');
        expect(appElement).toBeInTheDocument();
    });
});

jest.runAllTimers();