import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardComponent from '../../components/Dashboard.jsx';

describe('DashboardComponent', () => {
    console.error = () => {};
    test('renders the component', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardComponent />
        </MemoryRouter>
      )
    window.matchMedia = jest.fn().mockImplementation(() => {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    })
    const dashboardComponent = screen.getByText('Add New Game', { selector: 'span' });
    expect(dashboardComponent).toBeInTheDocument();
    const newgameButton = screen.getByTestId('addNewGameButton');
    fireEvent.click(newgameButton);
    const AddButton=await screen.findByText('Add')  
    expect(AddButton).toBeInTheDocument();
  });
});
