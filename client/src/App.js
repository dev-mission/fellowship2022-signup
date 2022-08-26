// import LocationForm from './LocationForm';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthContextProvider, AuthProtected } from './AuthContext';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import LocationForm from './LocationForm';
import LocationSheet from './LocationSheet';
import PasswordRoutes from './Passwords/PasswordRoutes';
import ProgramForm from './ProgramForm';
import ProgramSheet from './ProgramSheet';
import Register from './Register';
import Sheet from './Sheet';
import SignIn from './SignIn';
import UserRoutes from './Users/UserRoutes';
import Sheet from './Sheet';
import SignIn from './SignIn';

import './App.scss';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard/locations/new"
            element={
              <AuthProtected isAdminRequired={true}>
                <LocationForm />
              </AuthProtected>
            }
          />
          <Route
            path="/dashboard/programs/new"
            element={
              <AuthProtected isAdminRequired={true}>
                <ProgramForm />
              </AuthProtected>
            }
          />
          <Route
            path="/dashboard/locations"
            element={
              <AuthProtected isAdminRequired={true}>
                <LocationSheet />
              </AuthProtected>
            }
          />
          <Route
            path="/dashboard/locations/:id/edit"
            element={
              <AuthProtected isAdminRequired={true}>
                <LocationForm />
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
          {/* Kimon & Fatimah */}
          <Route path="/sheet" element={<Sheet />} />

          <Route path="/sheet/sign-in" element={<SignIn />} />

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
