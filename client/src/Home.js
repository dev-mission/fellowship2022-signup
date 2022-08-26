import dm from './images/dm.jpeg';
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
  const [program, setProgram] = useState([]);

  useEffect(function () {
    fetch('/api/program')
      .then((response) => response.json())
      .then((data) => setProgram(data));
  }, []);

  return (
    <main className="container">
      <img src={dm} style={{ marginBottom: '20' + 'px' }} />
      <div class="row">
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <p class="card-text">SignMe is your tool to digitize the sign-in process.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <p class="card-text">Say goodbye to missing sign-in sheets and overflowing files.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <p class="card-text">Working accross 5+ sites for Dev/Mission!</p>
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <p class="card-text">Contact us to bring SignMe to your location!</p>
              <a href="#" class="btn btn-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
      <h1>Home</h1>
      {user?.isAdmin && (
        <div class="text-center">
          <p>
            <Link to="/dashboard/locations/new" className="btn btn-primary">
              New Location
            </Link>
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
