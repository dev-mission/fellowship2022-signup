import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Api from './Api';

function ProgramForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    Name: '',
  });

  useEffect(() => {
    if (id) {
      Api.program.get(id).then((response) => setData(response.data));
    }
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      let response;
      if (id) {
        response = await Api.program.update(id, data);
      } else {
        response = await Api.program.create(data);
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
