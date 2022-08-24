// import LocationForm from './LocationForm';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthContextProvider, AuthProtected } from './AuthContext';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import PasswordRoutes from './Passwords/PasswordRoutes';
import ProgramForm from './ProgramForm';
import ProgramSheet from './ProgramSheet';
import Register from './Register';
import UserRoutes from './Users/UserRoutes';

import './App.scss';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard/programs/new"
            element={
              <AuthProtected isAdminRequired={true}>
                <ProgramForm />
              </AuthProtected>
            }
          />
          <Route
            path="/dashboard/programs"
            element={
              <AuthProtected isAdminRequired={true}>
                <ProgramSheet />
              </AuthProtected>
            }
          />
          <Route
            path="/dashboard/programs/:id/edit"
            element={
              <AuthProtected isAdminRequired={true}>
                <ProgramForm />
              </AuthProtected>
            }
          />
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
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
