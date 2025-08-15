import styled from "styled-components";

const Header = () => {
    return (
        <Wrapper>
            <Container>
                <HeaderTitle>Restaurant Management System</HeaderTitle>
                <UserSection>
                    <UserInfo>
                        <UserName>Admin User</UserName>
                        <UserRole>Manager</UserRole>
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
    max-width: 1536px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
`;
const HeaderTitle = styled.h1`
    font-size: 1.25rem;
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
`;
export default Header;