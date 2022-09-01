import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from './Api';

function ProgramSheet() {
  const [programs, setPrograms] = useState([]);

  useEffect(function () {
    Api.programs.index().then((response) => {
      setPrograms(response.data);
    });
  }, []);

  return (
    <main className="container">
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
    </main>
  );
}
export default ProgramSheet;
