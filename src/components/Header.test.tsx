import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ContentContext } from '../context/ContentContext';
import Header from './Header';
import { SubscriptionTier } from '../types';

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatarInitial: 'T',
  avatarUrl: 'https://example.com/avatar.png',
  tier: SubscriptionTier.FREE,
  points: 100,
};

const renderHeader = (user: any = null, showTottCatalog = false) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, login: jest.fn(), logout: jest.fn(), loading: false }}>
        <ContentContext.Provider value={{ showTottCatalog, setShowTottCatalog: jest.fn() }}>
          <Header />
        </ContentContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Header', () => {
  it('renders the header with the logo', () => {
    renderHeader();
    expect(screen.getByText('TeO Music Studio')).toBeInTheDocument();
  });

  it('shows sign in and sign up buttons when not logged in', () => {
    renderHeader();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows the user pill when logged in', () => {
    renderHeader(mockUser);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows the TOTT Catalog link when showTottCatalog is true', async () => {
    renderHeader(null, true);
    // The link is inside the "More" menu, so we need to open it first
    screen.getByTestId('more-menu-button').click();
    expect(await screen.findByText('TOTT Catalog')).toBeInTheDocument();
  });

  it('shows the VIP Lounge link for VIP users', async () => {
    const vipUser = { ...mockUser, tier: SubscriptionTier.VIP };
    renderHeader(vipUser);
    screen.getByTestId('more-menu-button').click();
    expect(await screen.findByText('VIP Lounge')).toBeInTheDocument();
  });

  it('does not show the VIP Lounge link for non-VIP users', () => {
    renderHeader(mockUser);
    screen.getByTestId('more-menu-button').click();
    expect(screen.queryByText('VIP Lounge')).not.toBeInTheDocument();
  });

  it('calls logout when the logout button is clicked', () => {
    const logout = jest.fn();
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: mockUser, login: jest.fn(), logout, loading: false }}>
          <ContentContext.Provider value={{ showTottCatalog: false, setShowTottCatalog: jest.fn() }}>
            <Header />
          </ContentContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    screen.getByText('Logout').click();
    expect(logout).toHaveBeenCalled();
  });

  it('shows the My Account link when logged in', async () => {
    renderHeader(mockUser);
    screen.getByTestId('more-menu-button').click();
    expect(await screen.findByText('My Account')).toBeInTheDocument();
  });

  it('shows the TeO Apps link for premium users', async () => {
    const premiumUser = { ...mockUser, tier: SubscriptionTier.PREMIUM };
    renderHeader(premiumUser);
    screen.getByTestId('more-menu-button').click();
    expect(await screen.findByText('TeO Apps')).toBeInTheDocument();
  });

  it('renders the user avatar when an avatarUrl is provided', () => {
    renderHeader(mockUser);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('renders all links in the more menu', async () => {
    renderHeader(mockUser, true);
    screen.getByTestId('more-menu-button').click();
    expect(await screen.findByText('My Projects')).toBeInTheDocument();
    expect(await screen.findByText('My Playlists')).toBeInTheDocument();
    expect(await screen.findByText('Creative Feed')).toBeInTheDocument();
    expect(await screen.findByText('Chat')).toBeInTheDocument();
    expect(await screen.findByText('Constellation')).toBeInTheDocument();
    expect(await screen.findByText('Subscriptions')).toBeInTheDocument();
    expect(await screen.findByText('Store')).toBeInTheDocument();
    expect(await screen.findByText('About')).toBeInTheDocument();
    expect(await screen.findByText('Support')).toBeInTheDocument();
    expect(await screen.findByText('Press')).toBeInTheDocument();
    });
});
