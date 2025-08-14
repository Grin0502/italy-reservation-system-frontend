import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <Wrapper>
            <Container>
                <LogoContainer>
                    <Logo>Tavly</Logo>
                </LogoContainer>
                <Navbar>
                    <NavItem to="/">Home</NavItem>
                    <NavItem to="/about">About</NavItem>
                    <NavItem to="/services">Services</NavItem>
                    <NavItem to="/contact">Contact</NavItem>
                </Navbar>
            </Container>
        </Wrapper>      
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.9);
    height: 64px;
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
    backdrop-filter: blur(10px);
`;
const LogoContainer = styled.div`
`;
const Logo = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: transparent;
    background-clip: text;
    background-image: linear-gradient(to right, #22d3ee , #3b82f6);
`;
const Navbar = styled.div`
    display: flex;
    gap: 16px;
`;
const NavItem = styled(Link)`
    color: rgb(209 213 219);
    transition: color 0.3s;

    &:hover {
        color: rgb(255 255 255);
    }
`;
export default Header;