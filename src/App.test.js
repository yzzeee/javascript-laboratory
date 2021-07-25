import React from 'react';
import { render, screen } from '@testing-library/react';
import App from "./App";



describe('<App/>', () => {
    test('renders learn react App', () => {
        const { container } = render(<App/>);

        expect(container.getElementsByClassName('h2')).toHaveLength(1);

        const element = screen.getByText(/Hello Test/i);
        expect(element).toBeInTheDocument();
    })
})