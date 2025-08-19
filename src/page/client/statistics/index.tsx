import styled from "styled-components";
import DynamicStatistics from "../../../components/DynamicStatistics";

const StatisticsPage = () => {
  return (
    <StatisticsContainer>
      <PageHeader>
        <h1>Statistics</h1>
        <p>View restaurant performance metrics and analytics</p>
      </PageHeader>
      
      <StatisticsContent>
        <DynamicStatistics />
      </StatisticsContent>
    </StatisticsContainer>
  );
};

const StatisticsContainer = styled.div`
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

const StatisticsContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default StatisticsPage;
