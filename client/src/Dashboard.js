import { Link } from 'react-router-dom';

import { useAuthContext } from './AuthContext';

function Dashboard() {
  const { user } = useAuthContext();

  return (
    <main className="container">
      {user?.isAdmin && (
        <div className="row">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title-center">Locations</h5>
                <p className="card-text-center">Add and edit the Locations where you wish to track sign-ins.</p>
                <div className="d-grid gap-2">
                  <Link to="/dashboard/locations" className="btn btn-primary">
                    Manage Locations
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Programs</h5>
                <p className="card-text">Add and edit the Programs that are run in different Locations.</p>
                <div className="d-grid gap-2">
                  <Link to="/dashboard/programs" className="btn btn-primary">
                    Manage Programs
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Reports</h5>
                <p className="card-text">Run attendance reports on visits to your Locations and/or Programs.</p>
                <div className="d-grid gap-2">
                  <Link to="#" className="btn btn-primary">
                    Run Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
