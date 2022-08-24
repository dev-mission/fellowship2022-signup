import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from './AuthContext';

function Home() {
  const { user } = useAuthContext();
  const [program, setProgram] = useState([]);

  useEffect(function () {
    fetch('/api/program')
      .then((response) => response.json())
      .then((data) => setProgram(data));
  }, []);

  return (
    <main className="container">
      <h1>Home</h1>
      {user?.isAdmin && (
        <div class="text-center">
          <p>
            <Link to="/dashboard/programs/new" className="btn btn-primary">
              New Program
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}

export default Home;
