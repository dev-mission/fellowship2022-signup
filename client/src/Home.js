import bg from './images/bgnew.jpg';

function Home() {
  return (
    <main className="container">
      <div className="row">
        <img src={bg} alt="SignMe Hero Banner" className="img-fluid mb-3" />
      </div>
      <div className="row">
        <div className="col-sm-6 col-lg-3">
          <div className="card home-card">
            <div className="card-body">
              <p className="card-text">SignMe is your tool to digitize the sign-in process.</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card home-card">
            <div className="card-body">
              <p className="card-text">Say goodbye to missing sign-in sheets and overflowing files.</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card home-card">
            <div className="card-body">
              <p className="card-text">Working accross 5+ sites for Dev/Mission!</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card home-card">
            <div className="card-body">
              <p className="card-text">Contact us to bring SignMe to your location!</p>
              <p className="text-center">
                <a href="mailto:info@devmission.org" className="btn btn-primary">
                  Contact Us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
