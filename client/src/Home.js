import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from './AuthContext';

function Home() {
  const { user } = useAuthContext();
  const [programs, setPrograms] = useState([]);

  useEffect(function () {
    fetch('/api/programs')
      .then((response) => response.json())
      .then((data) => setPrograms (data));
  }, []);

  return (
    <main className="container">
      <h1>Home</h1>
      {user?.isAdmin && (
        <div class="text-center">
          <p>
            <Link to="/detail/new" className="btn btn-primary">
              New Program
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}

export default Home;
