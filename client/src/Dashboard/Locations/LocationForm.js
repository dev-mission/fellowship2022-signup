import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';

import Api from '../../Api';

function LocationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [programs, setPrograms] = useState([]);
  const [data, setData] = useState({
    Name: '',
    Address: '',
    ProgramIds: [],
  });

  useEffect(() => {
    Api.programs.index().then((response) => {
      const allPrograms = response.data;
      setPrograms(allPrograms);
      if (id) {
        Api.locations.get(id).then((response) => {
          const newData = { ...response.data };
          const newPrograms = response.data.Programs;
          newData.ProgramIds = newPrograms.map((pro) => pro.id);
          delete newData.Programs;
          setData(newData);
          if (newPrograms.length > 0) {
            // reorder the programs list
            for (const program of allPrograms) {
              if (!newPrograms.find((p) => p.id === program.id)) {
                newPrograms.push(program);
              }
            }
            setPrograms(newPrograms);
          }
        });
      }
    });
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (id) {
        await Api.locations.update(id, data);
      } else {
        await Api.locations.create(data);
      }
      navigate(`/dashboard/locations`);
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
    let newData = { ...data };
    if (event.target.checked) {
      newData[event.target.name].push(parseInt(event.target.value));
      newData = reorderProgramIds(newData, programs);
    } else {
      const index = newData[event.target.name].indexOf(parseInt(event.target.value));
      if (index >= 0) {
        newData[event.target.name].splice(index, 1);
      }
    }
    setData(newData);
  }

  function reorderPrograms(newPrograms) {
    setPrograms(newPrograms);
    setData(reorderProgramIds(data, newPrograms));
  }

  function reorderProgramIds(oldData, newPrograms) {
    const newData = { ...oldData };
    newData.ProgramIds = [];
    for (const program of newPrograms) {
      if (oldData.ProgramIds.includes(program.id)) {
        newData.ProgramIds.push(program.id);
      }
    }
    return newData;
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <h1>New Location</h1>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="Name">
                Name
              </label>
              <input type="text" className="form-control" id="Name" name="Name" onChange={onChange} value={data.Name} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="Text">
                Address
              </label>
              <input type="text" className="form-control" id="Address" name="Address" onChange={onChange} value={data.Address} />
            </div>
            <div className="mb-3">
              <label className="form-label">Programs</label>
              {programs && (
                <ReactSortable list={programs} setList={reorderPrograms}>
                  {programs.map((pro) => (
                    <div key={`loc-${pro.id}`} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`loc-${pro.id}`}
                        name="ProgramIds"
                        value={pro.id}
                        onChange={updateAssociation}
                        checked={data.ProgramIds.includes(pro.id)}
                      />
                      <div className="form-check-label" htmlFor={`loc-${pro.id}`}>
                        {pro.Name}
                      </div>
                    </div>
                  ))}
                </ReactSortable>
              )}
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
export default LocationForm;
