import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';

import Api from './Api';
import Visit from './Components/Visit';
import logo from './images/logo.png';

function Sheet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  let selectedProgramId = searchParams.get('programId');
  if (selectedProgramId) {
    selectedProgramId = parseInt(selectedProgramId);
  }

  const [visits, setVisits] = useState([]);
  const [location, setLocation] = useState();

  useEffect(() => {
    if (id && !location) {
      Api.locations.get(id).then((response) => {
        setLocation(response.data);
        if (!selectedProgramId && response.data.Programs?.length) {
          navigate(`?programId=${response.data.Programs[0].id}`, { replace: true });
        }
      });
    }
  }, [id, location, selectedProgramId, navigate]);

  useEffect(() => {
    if (id && selectedProgramId) {
      Api.visits.index({ locationId: id, programId: selectedProgramId }).then((response) => setVisits(response.data));
    }
  }, [id, selectedProgramId]);

  async function onSignOut(item) {
    if (window.confirm(`Are you sure you wish to sign out ${item.FirstName}?`)) {
      await Api.visits.signout(item.id);
      item.TimeOut = new Date();
      const newVisits = [...visits];
      setVisits(newVisits);
    }
  }

  return (
    <main className="container">
      <h1>
        <img src={logo} style={{ padding: '5px' }} alt="SignMe Logo" />
        SignMe in for:
      </h1>
      <ul className="nav nav-tabs">
        {location?.Programs.map((program) => (
          <li key={`program-${program.id}`} className="nav-item">
            <Link to={`?programId=${program.id}`} className={classNames('nav-link', { active: selectedProgramId === program.id })}>
              {program.Name}
            </Link>
          </li>
        ))}
      </ul>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Phone number</th>
            <th scope="col">Temperature</th>
            <th scope="col">Time in</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {visits
            .filter((item) => !item.TimeOut)
            .map((item) => (
              <Visit
                key={item.id}
                id={item.id}
                FirstName={item.FirstName}
                LastName={item.LastName}
                PhoneNumber={item.PhoneNumber}
                Temperature={item.Temperature}
                TimeIn={item.TimeIn}
                onClick={() => onSignOut(item)}
              />
            ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'center' }}>
        <Link to={`/sheet/${id}/sign-in?programId=${selectedProgramId}`}>
          <button
            type="button"
            className="btn btn-primary btn-lg home-button"
            style={{ border: '1px solid black', padding: '10px  20px', textAlign: 'center' }}>
            Sign in
          </button>
        </Link>
      </div>
    </main>
  );
}

export default Sheet;
