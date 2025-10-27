import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Register from '../pages/Register';
import { authAPI } from '../services/api';
import * as router from 'react-router-dom';

// 1. Mock the authAPI
const mockRegister = vi.spyOn(authAPI, 'register');

// 2. Mock the navigation hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof router>(); // <- Variable should be 'actual'
  return {
    ...actual, // <- Spread the 'actual' variable
    useNavigate: () => mockNavigate,
  };
});
// Helper function to render the component with Router context
const renderComponent = () =>
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

describe('Register Component', () => {
    // Clean up mocks after each test
    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });
    it('S-1, S-4: should successfully register, store data, and redirect to /home', async () => {
        // Setup successful API response
        mockRegister.mockResolvedValueOnce({
            token: 'mock-jwt-token',
            user: { id: 1, username: 'testuser', email: 'test@example.com' },
        });

        renderComponent();

        // 1. Fill the form with valid data
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'TestUser' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i, { selector: '#password' }), { target: { value: 'secure123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'secure123' } });

        const registerButton = screen.getByRole('button', { name: /Create Account/i });

        // 2. Submit the form
        fireEvent.click(registerButton);

        // 3. Wait for the API call to complete
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledTimes(1);
            expect(mockRegister).toHaveBeenCalledWith(
                'TestUser',
                'test@example.com',
                'secure123'
            );
        });

        // 4. Verify Local Storage update
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        expect(localStorage.getItem('user')).toBe(
            JSON.stringify({ id: 1, username: 'testuser', email: 'test@example.com' })
        );

        // 5. Verify redirection
        expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });
    it('V-5: should show an error if passwords do not match', async () => {
        renderComponent();

        // 1. Fill the form with mismatching passwords (but valid in all other ways)
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'ValidUser' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'valid@email.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i, { selector: '#password' }), { target: { value: 'secure123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different456' } });

        const registerButton = screen.getByRole('button', { name: /Create Account/i });
        fireEvent.click(registerButton);

        // 2. Verify error message appears
        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });

        // 3. Verify API was NOT called
        expect(mockRegister).not.toHaveBeenCalled();
    })
    it('F-2: should display specific API error message on registration failure', async () => {
        // Setup API to reject with a specific error message
        const apiError = 'Email address is already in use.';
        mockRegister.mockRejectedValueOnce({
            response: {
                data: {
                    message: apiError,
                },
            },
        });

        renderComponent();

        // 1. Fill in valid data
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'TestUser' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existing@email.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i, { selector: '#password' }), { target: { value: 'secure123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'secure123' } });

        const registerButton = screen.getByRole('button', { name: /Create Account/i });

        // 2. Submit the form
        fireEvent.click(registerButton);

        // 3. Wait for the error message to appear
        await waitFor(() => {
            expect(screen.getByText(apiError)).toBeInTheDocument();
        });

        // 4. Verify loading state is reset (F-3)
        expect(registerButton).not.toBeDisabled();
        expect(registerButton).toHaveTextContent('Create Account');
        
        // 5. Verify no navigation happened
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});;

