import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthContextProvider, AuthProtected } from './AuthContext';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import DashboardRoutes from './Dashboard/DashboardRoutes';
import PasswordRoutes from './Passwords/PasswordRoutes';
import Register from './Register';
import SheetRoutes from './Sheet/SheetRoutes';
import UserRoutes from './Users/UserRoutes';

import './App.scss';

function App() {
  return (
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
                  <Route path="/passwords/*" element={<PasswordRoutes />} />
                  {process.env.REACT_APP_FEATURE_REGISTRATION === 'true' && <Route path="/register" element={<Register />} />}
                  <Route
                    path="/account/*"
                    element={
                      <AuthProtected>
                        <UserRoutes />
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
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
