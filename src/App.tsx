import './App.css';
import ClientView from './view/client';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { TableZoneProvider } from './contexts/TableZoneContext';
import { RestaurantProvider } from './contexts/RestaurantContext';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TableZoneProvider>
          <RestaurantProvider>
            <ClientView />
          </RestaurantProvider>
        </TableZoneProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;