import styled from 'styled-components';
import TableManagement from '../../../components/TableManagement';

const FloorPlanPage = () => {
  return (
    <FloorPlanContainer>
      <PageHeader>
        <h1>Table Management</h1>
        <p>Manage restaurant tables, zones, and floor plan layout</p>
      </PageHeader>
      <TableManagement />
    </FloorPlanContainer>
  );
};

const FloorPlanContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #64748b;
    font-size: 1.1rem;
  }
`;

export default FloorPlanPage;
