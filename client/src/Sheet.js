import { useState, useEffect } from 'react';
import Visit from './Components/Visit';

function Sheet() {
  const [items, setItems] = useState([]);

  useEffect(function () {
    const request = fetch(`/api/visit`);
    request.then((response) => response.json()).then((data) => setItems(data));
  }, []);

  return (
    <main className="container">
      <h1>Sheet</h1>
      <div className="row">
        <table class="table">
          <tbody>
            {items.map((item) => (
              <Visit
                key={item.id}
                id={item.id}
                FirstName={item.FirstName}
                LastName={item.LastName}
                PhoneNumber={item.PhoneNumber}
                Temperature={item.Temperature}
                TimeIn={item.TimeIn}
              />
            ))}
            <Visit key="1" id="1" FirstName="First" LastName="Last" PhoneNumber="123456789" Temperature="96.7" TimeIn="5:06 PM" />
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Sheet;
