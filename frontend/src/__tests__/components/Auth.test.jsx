import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import Login from '../../components/auth/Login';
import Register from '../../components/auth/Register';

// Mock API
jest.mock('../../services/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

const MockAuthProvider = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Authentication Components', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Login Component', () => {
    test('renders login form correctly', () => {
      render(
        <MockAuthProvider>
          <Login />
        </MockAuthProvider>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();
      
      render(
        <MockAuthProvider>
          <Login />
        </MockAuthProvider>
      );

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      await user.click(submitButton);

      // Check if validation messages appear
      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i) || screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      const user = userEvent.setup();
      
      render(
        <MockAuthProvider>
          <Login />
        </MockAuthProvider>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/formato de email inválido/i) || screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockLogin = require('../../services/api').login;
      
      mockLogin.mockResolvedValueOnce({
        data: {
          token: 'fake-token',
          user: { name: 'Test User', email: 'test@example.com' }
        }
      });

      render(
        <MockAuthProvider>
          <Login />
        </MockAuthProvider>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  describe('Register Component', () => {
    test('renders registration form correctly', () => {
      render(
        <MockAuthProvider>
          <Register />
        </MockAuthProvider>
      );

      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
    });

    test('validates password confirmation', async () => {
      const user = userEvent.setup();
      
      render(
        <MockAuthProvider>
          <Register />
        </MockAuthProvider>
      );

      const passwordInput = screen.getByLabelText(/^senha$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different-password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/senhas não coincidem/i) || screen.getByText(/passwords.*match/i)).toBeInTheDocument();
      });
    });

    test('validates terms acceptance', async () => {
      const user = userEvent.setup();
      
      render(
        <MockAuthProvider>
          <Register />
        </MockAuthProvider>
      );

      const nameInput = screen.getByLabelText(/nome completo/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^senha$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/aceitar.*termos/i) || screen.getByText(/terms/i)).toBeInTheDocument();
      });
    });

    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockRegister = require('../../services/api').register;
      
      mockRegister.mockResolvedValueOnce({
        data: {
          message: 'User registered successfully'
        }
      });

      render(
        <MockAuthProvider>
          <Register />
        </MockAuthProvider>
      );

      const nameInput = screen.getByLabelText(/nome completo/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^senha$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });
});