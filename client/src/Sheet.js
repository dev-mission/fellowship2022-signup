import { useState, useEffect } from 'react';
import Visit from './Components/Visit';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import Api from './Api';

function Sheet() {
  const [items, setItems] = useState([]);

  useEffect(function () {
    const request = fetch(`/api/visit`);
    request.then((response) => response.json()).then((data) => setItems(data));
  }, []);

  async function onSignOut(item) {
    console.log('hello from onSignOut');
    if (window.confirm(`Are you sure you wish to sign out ${item.FirstName}?`)) {
      await Api.visits.signout(item.id);
      item.TimeOut = new Date();
      const newItems = [...items];
      setItems(newItems);
    }
  }

  return (
    <main className="container">
      <h1>
        <img src={logo} style={{ padding: '5' + 'px' }} />
        SignMe in for:
      </h1>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">
            Community Tech Support
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            Pre-apprenticeship Bootcamp
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            Staff
          </a>
        </li>
      </ul>
      <div className="row">
        <table class="table table-striped">
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
            {items
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
            <Visit key="1" id="1" FirstName="First" LastName="Last" PhoneNumber="123456789" Temperature="96.7" TimeIn="5:06 PM" />
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Link to="/sheet/sign-in">
          <button
            type="button"
            class="btn btn-primary btn-lg home-button"
            style={{ border: '1px solid black', padding: '10px  20px', textAlign: 'center' }}>
            Sign in
          </button>
        </Link>
      </div>
    </main>
  );
}

export default Sheet;
