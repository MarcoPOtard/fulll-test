import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResultPage from "./SearchResultPage";

test('Renders Search Result Page', () => {
    render(<SearchResultPage />);
    const page = screen.getByText(/Rechercher un utilisateur sur Github/i);
    expect(page).toBeInTheDocument();
});
