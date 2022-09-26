import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import Modal from 'react-bootstrap/Modal';

import Api from '../Api';
import brand from '../images/brand.png';

import './Sheet.scss';

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
  const [signOutVisit, setSignOutVisit] = useState();

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

  function confirmSignOut(visit) {
    setSignOutVisit(visit);
  }

  async function onSignOut() {
    if (signOutVisit) {
      await Api.visits.signout(signOutVisit.id);
      signOutVisit.TimeOut = new Date();
      const newVisits = [...visits];
      setVisits(newVisits);
      setSignOutVisit();
    }
  }

  function cancelSignOut() {
    setSignOutVisit();
  }

  return (
    <main className="container-fluid sheet">
      <div className="d-flex align-items-bottom mb-5 sheet__header">
        <h2 className="d-flex align-items-center pe-3 sheet__brand">
          <img src={brand} alt="SignMe Logo" width="48" height="48" className="me-2" />
          SignMe in for:
        </h2>
        <ul className="nav nav-tabs sheet__tabs">
          {location?.Programs.map((program) => (
            <li key={`program-${program.id}`} className="nav-item">
              <Link to={`?programId=${program.id}`} className={classNames('nav-link', { active: selectedProgramId === program.id })}>
                <h4>{program.Name}</h4>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <Link to={`/sheet/${id}/sign-in?programId=${selectedProgramId}`} className="btn btn-primary btn-lg sheet__button">
          Sign in
        </Link>
      </div>
      <table className="table table-striped sheet__table">
        <thead>
          <tr>
            <th scope="col">Name</th>
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
              <tr key={item.id}>
                <td>
                  {item.FirstName} {item.LastName?.substring(0, 1)}.
                </td>
                <td>xxx-xxx-{item.PhoneNumber?.slice(-4)}</td>
                <td>{item.Temperature}</td>
                <td>{DateTime.fromISO(item.TimeIn).toLocaleString(DateTime.TIME_SIMPLE)}</td>
                <td>
                  <button onClick={() => confirmSignOut(item)} type="button" className="btn btn-outline-primary">
                    Sign Out
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal centered show={signOutVisit} onHide={cancelSignOut}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you wish to sign out{' '}
          <b>
            {signOutVisit?.FirstName} {signOutVisit?.LastName?.substring(0, 1)}.
          </b>
          ?
        </Modal.Body>
        <Modal.Footer>
          <button onClick={cancelSignOut} type="button" className="btn btn-outline-secondary">
            Cancel
          </button>
          <button onClick={onSignOut} type="button" className="btn btn-primary">
            Sign Out
          </button>
        </Modal.Footer>
      </Modal>
      <div className="sheet__footer">
        <b>{location?.Name}</b>, {location?.Address}
      </div>
    </main>
  );
}

export default Sheet;
