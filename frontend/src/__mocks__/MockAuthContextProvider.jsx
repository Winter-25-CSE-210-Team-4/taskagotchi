import { AuthContext } from '../../auth/AuthContextProvider';
import { vi } from 'vitest';

const mockAuthContextValue = {
  auth: {},
  setAuth: vi.fn(),
  user: 'John Doe',
  setUser: vi.fn(),
  loggedIn: true,
  setLoggedIn: vi.fn(),
};

const MockAuthContextProvider = ({ children }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
);

export default MockAuthContextProvider;
