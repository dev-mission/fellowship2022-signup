import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './Header.scss';
import Api from './Api';
import { useAuthContext } from './AuthContext';

import logo from './images/logo_header.png';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();

  useEffect(
    function () {
      Api.users.me().then((response) => {
        if (response.status === 204) {
          setUser(null);
        } else {
          setUser(response.data);
        }
      });
    },
    [setUser]
  );

  async function onLogout(event) {
    event.preventDefault();
    await Api.auth.logout();
    setUser(null);
    navigate('/');
  }

  return (
    <nav className="header navbar navbar-expand-md navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} style={{ padding: '5' + 'px' }} />
          SignMe
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExampleDefault"
          aria-controls="navbarsExampleDefault"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav flex-grow-1 mb-2 mb-md-0">
            <li className="nav-item active">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" aria-current="page" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" aria-current="page" to="/dashboard/locations">
                Locations
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" aria-current="page" to="/dashboard/programs">
                Programs
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" aria-current="page" to="#">
                Reports
              </Link>
            </li>
            <div className="flex-grow-1 d-flex justify-content-end">
              {user && (
                <>
                  <li className="nav-item me-3">
                    <span className="nav-link d-inline-block">
                      Hello, <Link to="/account">{user.firstName}!</Link>
                    </span>
                    {user.pictureUrl && <div className="header__picture" style={{ backgroundImage: `url(${user.pictureUrl})` }}></div>}
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/logout" onClick={onLogout}>
                      Log out
                    </a>
                  </li>
                </>
              )}
              {!user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Log in
                  </Link>
                </li>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
