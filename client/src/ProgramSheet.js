import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Api from './Api';
import { useAuthContext } from './AuthContext';

function ProgramSheet() {
  const { user } = useAuthContext();
  const [programs, setPrograms] = useState([]); //item is what you put in []

  useEffect(function () {
    const request = fetch('/api/program');
    request
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPrograms(data);
      });
  }, []);

  return (
    <main className="container">
      {/* <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4"> */}
      <h1>Programs</h1>
      <Link to="/dashboard/programs/new" className="btn btn-primary">
        Add New Program
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr>
              <td>{program.Name}</td>{' '}
              <td>
                <Link to={`/dashboard/programs/${program.id}/edit`} className="btn btn-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* </div>
      </div> */}
    </main>
  );
}
export default ProgramSheet;
