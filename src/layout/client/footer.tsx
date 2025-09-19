import styled from "styled-components";

const Footer = () => {
    return (
        <Wrapper>
            <Container>
                <CopyrightText>© 2024 Restaurant Management System. All rights reserved.</CopyrightText>
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    background-color: white;
    border-top: 1px solid #e2e8f0;
`;
const Container = styled.div`
    width: 100%;
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;
const CopyrightText = styled.div`
    font-size: 0.875rem;
    color: #64748b;
    text-align: center;
    
    @media (max-width: 480px) {
        font-size: 0.8rem;
    }
`;
export default Footer;