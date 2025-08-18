import React from 'react';
import styled from 'styled-components';
import { useUser } from '../contexts/UserContext';

const RoleSwitcher: React.FC = () => {
  const { user, setUser } = useUser();

  const roles = [
    { id: 'admin', name: 'Admin', description: 'Full access to all features' },
    { id: 'manager', name: 'Manager', description: 'Can manage tables and zones' },
    { id: 'staff', name: 'Staff', description: 'View-only access' },
  ];

  const handleRoleChange = (roleId: string) => {
    if (user) {
      setUser({
        ...user,
        role: roleId as 'admin' | 'manager' | 'staff'
      });
    }
  };

  return (
    <Container>
      <Title>Role Switcher (Development)</Title>
      <Description>Switch between different user roles to test permissions</Description>
      
      <RoleGrid>
        {roles.map(role => (
          <RoleCard
            key={role.id}
            isActive={user?.role === role.id}
            onClick={() => handleRoleChange(role.id)}
          >
            <RoleName>{role.name}</RoleName>
            <RoleDescription>{role.description}</RoleDescription>
            {user?.role === role.id && <ActiveIndicator>✓ Active</ActiveIndicator>}
          </RoleCard>
        ))}
      </RoleGrid>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const RoleCard = styled.div<{ isActive: boolean }>`
  border: 2px solid ${props => props.isActive ? '#06b6d4' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1rem;
  background: ${props => props.isActive ? '#f0fdfa' : '#f9fafb'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: #06b6d4;
    background: #f0fdfa;
  }
`;

const RoleName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const RoleDescription = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #06b6d4;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 500;
`;

export default RoleSwitcher;
