import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Api from '../../Api';
import { useAuthContext } from '../../AuthContext';

function Programs() {
  const { user } = useAuthContext();
  const [programs, setPrograms] = useState([]);

  useEffect(function () {
    Api.programs.index().then((response) => {
      setPrograms(response.data);
    });
  }, []);

  return (
    <main className="container">
      <h1>Programs</h1>
      {user?.isAdmin && (
        <div className="mb-3">
          <Link to="/dashboard/programs/new" className="btn btn-primary">
            Add New Program
          </Link>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="text-nowrap">{program.Name}</td>
                <td className="text-nowrap">
                  {user?.isAdmin && (
                    <Link to={`/dashboard/programs/${program.id}/edit`} className="btn btn-primary">
                      Edit
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
export default Programs;
