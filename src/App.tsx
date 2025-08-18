import './App.css';
import ClientView from './view/client';
import { UserProvider } from './contexts/UserContext';
import { TableZoneProvider } from './contexts/TableZoneContext';
import { RestaurantProvider } from './contexts/RestaurantContext';

function App() {
  return (
    <UserProvider>
      <TableZoneProvider>
        <RestaurantProvider>
          <ClientView />
        </RestaurantProvider>
      </TableZoneProvider>
    </UserProvider>
  );
}

export default App;