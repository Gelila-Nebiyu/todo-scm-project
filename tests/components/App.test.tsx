import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers (e.g., toBeInTheDocument)
import App from '../src/App';

// Optional: If using Vitest
// import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('App Component', () => {
  // Clear localStorage before each test to ensure consistent starting state
  beforeEach(() => {
    localStorage.clear();
    cleanup(); // Clean up DOM after each test
  });

  test('renders Login component when not authenticated (default state)', () => {
    render(<App />);

    // Verify key Login elements
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. admin')).toBeInTheDocument();
    expect(screen.getByText('© 2025 TaskFlow Management')).toBeInTheDocument();

    // Ensure Dashboard elements are absent
    expect(screen.queryByText(/Initiate New Objective/i)).not.toBeInTheDocument();
  });

  test('renders Dashboard component when authenticated', () => {
    // Simulate authenticated state - adjust key if different (e.g., 'isLoggedIn', 'authToken')
    localStorage.setItem('isAuthenticated', 'true'); // Or JSON.stringify({ loggedIn: true })

    render(<App />);

    // Verify key Dashboard elements
    expect(screen.getByText(/Initiate New Objective/i)).toBeInTheDocument();
    expect(screen.getByText(/Objectives/i)).toBeInTheDocument(); // From filteredTodos.length display

    // Optional: Check empty state if no tasks
    // expect(screen.getByText(/All clear! No current tasks meet your criteria./i)).toBeInTheDocument();

    // Ensure Login elements are absent
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });

  // Additional smoke test: App renders without crashing
  test('App renders without errors', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
