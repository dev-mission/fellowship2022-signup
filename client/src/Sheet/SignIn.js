import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
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
  const [isDisabled, setDisabled] = useState(false);
  const [isValid, setValid] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (id) {
      Api.locations.get(id).then((response) => setLocation(response.data));
    }
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    setDisabled(true);
    try {
      await Api.visits.create(data);
      navigate(`/sheet/${id}?programId=${data.ProgramId}`, { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  }

  function onCancel() {
    navigate(-1);
  }

  function onKeyDown(event, nextIndex) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      if (nextIndex !== undefined) {
        setTimeout(() => inputRefs.current[nextIndex].focus(), 0);
      } else {
        event.target.blur();
      }
    }
  }

  function onChange(event) {
    const newData = { ...data };
    if (event.target.rawValue) {
      newData[event.target.name] = event.target.rawValue;
    } else {
      newData[event.target.name] = event.target.value;
    }
    setData(newData);
    setValid(isPhoneNumberValid(newData) && isTemperatureValid(newData) && isFirstNameValid(newData) && isLastNameValid(newData));
  }

  function isPhoneNumberValid(data) {
    return data.PhoneNumber.match(/^\d{10}$/);
  }

  function isTemperatureValid(data) {
    return data.Temperature.match(/^\d+(\.\d+)?$/);
  }

  function isFirstNameValid(data) {
    return data.FirstName !== '';
  }

  function isLastNameValid(data) {
    return data.LastName !== '';
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Sign In</h2>
              <form onSubmit={onSubmit} disabled={isDisabled} noValidate={true}>
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
                        className={classNames('form-control', { 'is-invalid': showValidation && !isPhoneNumberValid(data) })}
                        id="PhoneNumber"
                        name="PhoneNumber"
                        onChange={onChange}
                        onKeyDown={(event) => onKeyDown(event, 0)}
                        enterKeyHint="next"
                        value={data.PhoneNumber}
                      />
                      <div className="invalid-feedback">This is required!</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="Temperature">
                        Temperature
                      </label>
                      <input
                        ref={(el) => (inputRefs.current[0] = el)}
                        type="text"
                        inputMode="decimal"
                        className={classNames('form-control', { 'is-invalid': showValidation && !isTemperatureValid(data) })}
                        id="Temperature"
                        name="Temperature"
                        onChange={onChange}
                        onKeyDown={(event) => onKeyDown(event, 1)}
                        enterKeyHint="next"
                        value={data.Temperature}
                      />
                      <div className="invalid-feedback">This is required!</div>
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
                        ref={(el) => (inputRefs.current[1] = el)}
                        type="text"
                        autoCapitalize="words"
                        className={classNames('form-control', { 'is-invalid': showValidation && !isFirstNameValid(data) })}
                        id="FirstName"
                        name="FirstName"
                        onChange={onChange}
                        onKeyDown={(event) => onKeyDown(event, 2)}
                        enterKeyHint="next"
                        value={data.FirstName}
                      />
                      <div className="invalid-feedback">This is required!</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="LastName">
                        Last Name
                      </label>
                      <input
                        ref={(el) => (inputRefs.current[2] = el)}
                        type="text"
                        autoCapitalize="words"
                        className={classNames('form-control', { 'is-invalid': showValidation && !isLastNameValid(data) })}
                        id="LastName"
                        name="LastName"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        enterKeyHint="done"
                        value={data.LastName}
                      />
                      <div className="invalid-feedback">This is required!</div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">I'm here for:</label>
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
