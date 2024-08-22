import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamepageComponent from '../../components/playerName.jsx';
import { act } from 'react-dom/test-utils';

describe('playerNameComponent', () => {
    test('renders the component', () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={['/playerName']}>
          <GamepageComponent />
        </MemoryRouter>
      );
    });
    act(() => {
      const dashboardComponent = screen.getByText('Input player name and Join the Game', { selector: 'h1' });
      expect(dashboardComponent).toBeInTheDocument();
      const newgameComponent = screen.getByText('Submit', { selector: 'span' });
      expect(newgameComponent).toBeInTheDocument();
    });
  });
});
