import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import { AuthContextProvider, AuthProtected } from './AuthContext';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import DashboardRoutes from './Dashboard/DashboardRoutes';
import SheetRoutes from './Sheet/SheetRoutes';
import AdminRoutes from './Admin/AdminRoutes';
import InvitesRoutes from './Invites/InvitesRoutes';
import PasswordsRoutes from './Passwords/PasswordsRoutes';
import Register from './Register';
import UsersRoutes from './Users/UsersRoutes';

import './App.scss';

function App() {
  return (
    <CookiesProvider>
      <AuthContextProvider>
        <Router>
          <Routes>
            <Route path="/sheet/*" element={<SheetRoutes />} />
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/passwords/*" element={<PasswordsRoutes />} />
                    <Route path="/invites/*" element={<InvitesRoutes />} />
                    {process.env.REACT_APP_FEATURE_REGISTRATION === 'true' && <Route path="/register" element={<Register />} />}
                    <Route
                      path="/account/*"
                      element={
                        <AuthProtected>
                          <UsersRoutes />
                        </AuthProtected>
                      }
                    />
                    <Route
                      path="/dashboard/*"
                      element={
                        <AuthProtected isAdminRequired={true}>
                          <DashboardRoutes />
                        </AuthProtected>
                      }
                    />
                    <Route
                      path="/admin/*"
                      element={
                        <AuthProtected isAdminRequired={true}>
                          <AdminRoutes />
                        </AuthProtected>
                      }
                    />
                  </Routes>
                </>
              }
            />
          </Routes>
        </Router>
      </AuthContextProvider>
    </CookiesProvider>
  );
}

export default App;
