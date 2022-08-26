import bg from './images/bgnew.jpg';
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
      <div class="row">
        <img src={bg} class="img-fluid" style={{ marginBottom: '20' + 'px', height: '250' + 'px' }} />
      </div>
      <div class="row">
        <div class="col-sm-3">
          <div class="card home-card">
            <div class="card-body">
              <p class="card-text">SignMe is your tool to digitize the sign-in process.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card home-card">
            <div class="card-body">
              <p class="card-text">Say goodbye to missing sign-in sheets and overflowing files.</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card home-card">
            <div class="card-body">
              <p class="card-text">Working accross 5+ sites for Dev/Mission!</p>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card home-card">
            <div class="card-body">
              <p class="card-text">Contact us to bring SignMe to your location!</p>
              <a href="#" class="btn btn-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
