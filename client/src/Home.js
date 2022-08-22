import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from './AuthContext';

function Home() {
  const { user } = useAuthContext();
  const [locations, setLocations] = useState([]);

  useEffect(function () {
    fetch('/api/locations')
      .then((response) => response.json())
      .then((data) => setLocations(data));
  }, []);

  return (
    <main className="container">
      <h1>Home</h1>
      {user?.isAdmin && (
        <div class="text-center">
          <p>
            <Link to="/detail/new" className="btn btn-primary">
              New Location
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}

export default Home;
