import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from './Api';

function SignIn() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Temperature: '',
    TimeIn: '',
  });

  useEffect(() => {
    if (id) {
      Api.visits.get(id).then((response) => setData(response.data));
    }
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      let response;
      if (id) {
        response = await Api.visits.update(id, data);
      } else {
        console.log(Api);
        response = await Api.visits.create(data);
      }
      navigate('/sheet');
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
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4" style={{ border: '1px solid black', padding: '15px', margin: '100px' }}>
          <h1>Sign In</h1>
          <br></br>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="FirstName">
                First Name
              </label>
              <input type="text" className="form-control" id="FirstName" name="FirstName" onChange={onChange} value={data.FirstName} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="LastName">
                Last Name
              </label>
              <input type="text" className="form-control" id="LastName" name="LastName" onChange={onChange} value={data.LastName} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="PhoneNumber">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="PhoneNumber"
                name="PhoneNumber"
                onChange={onChange}
                value={data.PhoneNumber}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="Temperature">
                Temperature
              </label>
              <input
                type="text"
                className="form-control"
                id="Temperature"
                name="Temperature"
                onChange={onChange}
                value={data.Temperature}
              />
            </div>
            <div>
              <input type="radio" id="community" name="fav_language" value="HTML" style={{ marginRight: '5px' }} />
              <label for="html"> Community Tech Support</label>
              <br />
              <input type="radio" id="css" name="fav_language" value="CSS" style={{ marginRight: '5px' }} />
              <label for="css">Pre-apprenticeship Bootcamp</label>
              <br />
              <input type="radio" id="css" name="fav_language" value="CSS" style={{ marginRight: '5px' }} />
              <label for="css">Staff</label>
            </div>
            <br></br>
            <button type="submit" className="btn btn-primary" style={{ width: '80%', marginLeft: '25px' }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
export default SignIn;
