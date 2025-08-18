import './App.css';
import ClientView from './view/client';
import { UserProvider } from './contexts/UserContext';
import { TableZoneProvider } from './contexts/TableZoneContext';

function App() {
  return (
    <UserProvider>
      <TableZoneProvider>
        <ClientView />
      </TableZoneProvider>
    </UserProvider>
  );
}

export default App;