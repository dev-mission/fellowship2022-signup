import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';

import './Header.scss';
import brand from './images/brand.png';
import Api from './Api';
import { useAuthContext } from './AuthContext';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  const [isOpen, setOpen] = useState(false);

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
    <nav className="header navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex" to="/">
          <img src={brand} alt="" width="30" height="30" className="me-1" />
          SignMe
        </Link>
        <button onClick={() => setOpen(!isOpen)} className="navbar-toggler" type="button" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={classNames('collapse navbar-collapse', { show: isOpen })}>
          <ul className="navbar-nav flex-grow-1 mb-2 mb-md-0">
            <li className="nav-item active">
              <Link onClick={() => setOpen(false)} className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item active">
                  <Link onClick={() => setOpen(false)} className="nav-link" aria-current="page" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link onClick={() => setOpen(false)} className="nav-link" aria-current="page" to="/dashboard/locations">
                    Locations
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link onClick={() => setOpen(false)} className="nav-link" aria-current="page" to="/dashboard/programs">
                    Programs
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link onClick={() => setOpen(false)} className="nav-link" aria-current="page" to="#">
                    Reports
                  </Link>
                </li>
              </>
            )}
            <div className="flex-grow-1 d-flex justify-content-end">
              {user && (
                <>
                  <li className="nav-item me-3">
                    <span className="nav-link d-inline-block">
                      Hello,{' '}
                      <Link onClick={() => setOpen(false)} to="/account">
                        {user.firstName}!
                      </Link>
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
                  <Link onClick={() => setOpen(false)} className="nav-link" to="/login">
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
