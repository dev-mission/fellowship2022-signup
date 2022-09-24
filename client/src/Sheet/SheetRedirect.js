import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function SheetRedirect() {
  const [cookies] = useCookies();
  if (cookies['sheet-id']) {
    return <Navigate to={cookies['sheet-id']} />;
  } else {
    return <Navigate to="/" />;
  }
}
export default SheetRedirect;
