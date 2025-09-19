import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <HeaderLeft>
          <MenuButton onClick={onMenuClick}>
            <AiOutlineMenu />
          </MenuButton>
          <HeaderTitle>Restaurant Manager</HeaderTitle>
        </HeaderLeft>
        
        <HeaderRight>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserRole>{user?.role}</UserRole>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </HeaderRight>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1e293b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f1f5f9;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  text-align: right;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
`;

const UserRole = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: capitalize;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #dc2626;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
`;

export default Header;