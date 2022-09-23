import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';

import Api from '../Api';

function SignIn() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [location, setLocation] = useState();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Temperature: '',
    LocationId: id,
    ProgramId: searchParams.get('programId'),
  });

  useEffect(() => {
    if (id) {
      Api.locations.get(id).then((response) => setLocation(response.data));
    }
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      await Api.visits.create(data);
      navigate(`/sheet/${id}?programId=${data.ProgramId}`, { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  function onCancel() {
    navigate(-1);
  }

  function onChange(event) {
    const newData = { ...data };
    if (event.target.rawValue) {
      newData[event.target.name] = event.target.rawValue;
    } else {
      newData[event.target.name] = event.target.value;
    }
    setData(newData);
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Sign In</h2>
              <form onSubmit={onSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="PhoneNumber">
                        Phone Number
                      </label>
                      <Cleave
                        options={{ delimiter: '-', phone: true, phoneRegionCode: 'US' }}
                        autoFocus={true}
                        type="tel"
                        inputMode="tel"
                        className="form-control"
                        id="PhoneNumber"
                        name="PhoneNumber"
                        onChange={onChange}
                        value={data.PhoneNumber}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="Temperature">
                        Temperature
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="form-control"
                        id="Temperature"
                        name="Temperature"
                        onChange={onChange}
                        value={data.Temperature}
                      />
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="FirstName">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="FirstName"
                        name="FirstName"
                        onChange={onChange}
                        value={data.FirstName}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="LastName">
                        Last Name
                      </label>
                      <input type="text" className="form-control" id="LastName" name="LastName" onChange={onChange} value={data.LastName} />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="Temperature">
                    I'm here for:
                  </label>
                  {location?.Programs.map((program) => (
                    <div key={`program-${program.id}`} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`program-${program.id}`}
                        name="ProgramId"
                        value={program.id}
                        onChange={onChange}
                        checked={data.ProgramId === `${program.id}`}
                      />
                      <label className="form-check-label" htmlFor={`program-${program.id}`}>
                        {program.Name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mb-3 d-grid">
                  <button type="submit" className="btn btn-lg btn-primary">
                    Submit
                  </button>
                </div>
                <div className="d-grid">
                  <button type="button" className="btn btn-lg btn-outline-secondary" onClick={onCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default SignIn;
