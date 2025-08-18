import React from 'react';
import styled from 'styled-components';
import BookingDemo from '../../../components/BookingDemo';
import RoleSwitcher from '../../../components/RoleSwitcher';

const BookingDemoPage = () => {
  return (
    <BookingDemoContainer>
      <PageHeader>
        <h1>Booking Demo</h1>
        <p>Test and understand how booking time margins work in practice</p>
      </PageHeader>

      {/* Development Role Switcher */}
      <RoleSwitcher />

      <BookingDemo />
    </BookingDemoContainer>
  );
};

const BookingDemoContainer = styled.div`
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

export default BookingDemoPage;
