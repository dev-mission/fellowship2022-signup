import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import Api from '../../Api';

function Reports() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    locationId: '',
    programId: '',
  });
  const [locations, setLocations] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    Api.visits.index().then((response) => {
      setVisits(response.data);
    });
    Api.locations.index().then((response) => {
      setLocations(response.data);
    });
    Api.programs.index().then((response) => {
      setPrograms(response.data);
    });
  }, []);

  function onChange(event) {
    const newFilters = { ...filters };
    newFilters[event.target.name] = event.target.value;
    setFilters(newFilters);
  }

  function formatPhoneNumber(phoneNumber) {
    return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
  }

  async function onRun() {
    const response = await Api.visits.index(filters);
    setVisits(response.data);
  }

  return (
    <main className="container">
      <h1 className="mb-3">Reports</h1>
      <div className="row g-3 mb-3">
        <div className="col-lg-2">
          <label htmlFor="from">From</label>
          <input type="date" id="from" name="from" className="form-control" value={filters.from} onChange={onChange} />
        </div>
        <div className="col-lg-2">
          <label htmlFor="from">To</label>
          <input type="date" id="to" name="to" className="form-control" value={filters.to} onChange={onChange} />
        </div>
        <div className="col-lg-3">
          <label htmlFor="locationId">Location</label>
          <select id="locationId" name="locationId" className="form-select" value={filters.locationId} onChange={onChange}>
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-3">
          <label htmlFor="programId">Program</label>
          <select id="programId" name="programId" className="form-select" value={filters.programId} onChange={onChange}>
            <option value="">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-1">
          <label className="d-none d-lg-inline">&nbsp;</label>
          <div className="d-grid">
            <button onClick={onRun} type="button" className="btn btn-primary">
              Run
            </button>
          </div>
        </div>
        <div className="col-lg-1">
          <label className="d-none d-lg-inline">&nbsp;</label>
          <div className="d-grid">
            <button type="button" className="btn btn-secondary">
              CSV
            </button>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped text-nowrap">
          <thead>
            <tr>
              <th className="col-lg-1">Date</th>
              <th className="">Location</th>
              <th className="col-lg-2">Program</th>
              <th className="col-lg-2">Name</th>
              <th className="col-lg-2">Phone number</th>
              <th className="col-lg-1">Temp.</th>
              <th className="col-lg-1">Time in</th>
              <th className="col-lg-1">Time out</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td>{DateTime.fromISO(v.TimeIn).toLocaleString(DateTime.DATE_SHORT)}</td>
                <td>{v.Location?.Name}</td>
                <td>{v.Program?.Name}</td>
                <td>
                  {v.FirstName} {v.LastName}
                </td>
                <td>{formatPhoneNumber(v.PhoneNumber)}</td>
                <td>{v.Temperature}</td>
                <td>{DateTime.fromISO(v.TimeIn).toLocaleString(DateTime.TIME_SIMPLE)}</td>
                <td>{DateTime.fromISO(v.TimeOut).toLocaleString(DateTime.TIME_SIMPLE)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
export default Reports;
