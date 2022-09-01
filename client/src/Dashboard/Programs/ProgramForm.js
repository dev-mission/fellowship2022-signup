import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Api from '../../Api';

function ProgramForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({
    Name: '',
    LocationIds: [],
  });

  useEffect(() => {
    Api.locations.index().then((response) => setLocations(response.data));
    if (id) {
      Api.programs.get(id).then((response) => {
        const newData = { ...response.data };
        newData.LocationIds = newData.Locations.map((loc) => loc.id);
        setData(newData);
      });
    }
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (id) {
        await Api.programs.update(id, data);
      } else {
        await Api.programs.create(data);
      }
      navigate(`/dashboard/programs`);
    } catch (error) {
      console.log(error);
    }
  }

  function onChange(event) {
    const newData = { ...data };
    newData[event.target.name] = event.target.value;
    setData(newData);
  }

  function updateAssociation(event) {
    const newData = { ...data };
    if (event.target.checked) {
      newData[event.target.name].push(parseInt(event.target.value));
    } else {
      const index = newData[event.target.name].indexOf(parseInt(event.target.value));
      if (index >= 0) {
        newData[event.target.name].splice(index, 1);
      }
    }
    setData(newData);
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <h1>New program</h1>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="Name">
                Name
              </label>
              <input type="text" className="form-control" id="Name" name="Name" onChange={onChange} value={data.Name} />
            </div>
            <div className="mb-3">
              <label className="form-label">Locations</label>
              <div>
                {locations?.map((loc) => (
                  <div key={`loc-${loc.id}`} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`loc-${loc.id}`}
                      name="LocationIds"
                      value={loc.id}
                      onChange={updateAssociation}
                      checked={data.LocationIds.includes(loc.id)}
                    />
                    <div className="form-check-label" htmlFor={`loc-${loc.id}`}>
                      {loc.Name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
export default ProgramForm;
