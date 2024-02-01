import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import Tabla from './components/Tabla.js';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';

describe('App Component', () => {

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('sets fileName state on Tabla component interaction', async () => {
        render(<App />);

        const inputElement = await waitFor(() => screen.getByPlaceholderText('Search file name'));

        expect(inputElement).toBeDefined();
        userEvent.type(inputElement, 'exampleFileName');
        expect(inputElement.value).toBe('exampleFileName');
    });

    test('fetches data and renders table', async () => {
        const mockResponse = {
            results: [
                {
                    "file": "test2.csv",
                    "lines": [
                        {
                            "text": "QxvlZbzMbtpFklcpe",
                            "number": "68",
                            "hex": "83eda6e0682dc3447d897927ac6e257c"
                        }
                    ]
                },
                {
                    "file": "test3.csv",
                    "lines": [
                        {
                            "text": "hmvVPDCxER",
                            "number": "55",
                            "hex": "c25fda907de91b2c34f21b05a8c8fbdb"
                        },
                        {
                            "text": "TROBtwviNLICpcwPfHY",
                            "number": "498685607",
                            "hex": "230784b7936a6b44315d178762ce8822"
                        },
                        {
                            "text": "lFCla",
                            "number": "15701927",
                            "hex": "b642966942eb1c5811d21805acb62963"
                        }
                    ]
                },
                {
                    "file": "test9.csv",
                    "lines": [
                        {
                            "text": "EjssRuheYWhGaxswOFQuinSuYwkI",
                            "number": "42",
                            "hex": "afd9e7c350dcb74e0dce9eaee20d54f3"
                        },
                        {
                            "text": "hTTMJqhl",
                            "number": "77193065223358182418764951789613",
                            "hex": "a91dea7f2e0a70b538b267cdf97570b7"
                        },
                        {
                            "text": "ADF",
                            "number": "2",
                            "hex": "5a4d926cd0953002f8c889733d8e0a95"
                        },
                        {
                            "text": "ktSuBvrl",
                            "number": "1554144474",
                            "hex": "50e4af459418d947e331d97f69811e95"
                        },
                        {
                            "text": "UJnDflwxCpJdeFLchxVfpie",
                            "number": "492664",
                            "hex": "6fe148bc5cb5c9cd77b2e1008b09c6c6"
                        },
                        {
                            "text": "OlWkdOPrh",
                            "number": "3876",
                            "hex": "9b1809effcd0a78a9629934a59f03e4e"
                        },
                        {
                            "text": "BBZKxaACQKOEw",
                            "number": "0336",
                            "hex": "32c0809b75a7790425def16fa31e4748"
                        },
                        {
                            "text": "vaRWLJtAhQMHJiDuAyaMegkDHlA",
                            "number": "44559",
                            "hex": "8e31c6c54f96040f484d4d32a189faaa"
                        },
                        {
                            "text": "pIeOFXsTJdvbAldoxiPxIT",
                            "number": "82123964",
                            "hex": "a128d9718abfb4cc4ae4a3940f6e3470"
                        },
                        {
                            "text": "cImhQmPJcLhsfQsRoYFEPKz",
                            "number": "4342575683",
                            "hex": "f2b18e25e13dc3390e99a54d3939c40d"
                        },
                        {
                            "text": "RRxHDuTJOe",
                            "number": "71971",
                            "hex": "f163ccfc077d693650430cd9ba10ff84"
                        },
                        {
                            "text": "DPDcWYbiERXmWyGM",
                            "number": "45912",
                            "hex": "b452a08d27378c950c8f966a18b205e8"
                        }
                    ]
                }
            ],
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { headers: { 'Content-Type': 'application/json' } });

        render(<App />);

        const searchInput = screen.getByPlaceholderText('Search file name');
        userEvent.type(searchInput, 'test2.csv');

        await waitFor(() => {

            const tableRows = screen.getAllByRole('row');

            expect(tableRows.length).toBe(17);
            expect(tableRows[1].textContent).toContain('test2.csvQxvlZbzMbtpFklcpe6883eda6e0682dc3447d897927ac6e257c');
        });
    });

    test('fetches data with empty fileName', async () => {
        const mockResponse = {
            results: [
                {
                    "file": "test2.csv",
                    "lines": [
                        {
                            "text": "QxvlZbzMbtpFklcpe",
                            "number": "68",
                            "hex": "83eda6e0682dc3447d897927ac6e257c"
                        }
                    ]
                },
            ],
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { headers: { 'Content-Type': 'application/json' } });

        render(<App />);

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');
            expect(tableRows.length).toBe(1);
        });
    });
});

