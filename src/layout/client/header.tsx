import styled from "styled-components";
import { useUser } from "../../contexts/UserContext";

const Header = () => {
    const { user } = useUser();
    
    return (
        <Wrapper>
            <Container>
                <HeaderTitle>Restaurant Management System</HeaderTitle>
                <UserSection>
                    <UserInfo>
                        <UserName>{user?.name || 'User'}</UserName>
                        <UserRole>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Staff'}</UserRole>
                    </UserInfo>
                </UserSection>
            </Container>
        </Wrapper>      
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    background-color: white;
    height: 64px;
    border-bottom: 1px solid #e2e8f0;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 0 1rem;
`;

const HeaderTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserInfo = styled.div`
    text-align: right;
`;

const UserName = styled.div`
    font-weight: 500;
    color: #1e293b;
    font-size: 0.875rem;
`;

const UserRole = styled.div`
    color: #64748b;
    font-size: 0.75rem;
    text-transform: capitalize;
`;

export default Header;