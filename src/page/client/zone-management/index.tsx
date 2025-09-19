import styled from 'styled-components';
import ZoneManagement from '../../../components/ZoneManagement';

const ZoneManagementPage = () => {
  return (
    <ZoneManagementContainer>
      <PageHeader>
        <h1>Zone Management</h1>
        <p>Organize restaurant areas and manage table zones</p>
      </PageHeader>
      <ZoneManagement />
    </ZoneManagementContainer>
  );
};

const ZoneManagementContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: #64748b;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export default ZoneManagementPage;
