import { AuthContext } from '../../auth/AuthContextProvider';
import { vi } from 'vitest';
import PropTypes from 'prop-types';

const mockAuthContextValue = {
  auth: {},
  setAuth: vi.fn(),
  user: {name: "John Doe", email:"johndoe@email.com"},
  setUser: vi.fn(),
  loggedIn: true,
  setLoggedIn: vi.fn(),
};

const MockAuthContextProvider = ({ children }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
);
MockAuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default MockAuthContextProvider;
