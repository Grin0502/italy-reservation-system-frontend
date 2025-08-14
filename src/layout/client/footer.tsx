import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";

import Logo from "../../components/public/Logo";

const Footer = () => {
    return (
        <Wrapper>
            <Container>
                <LogoContainer>
                    <Logo LogoSize="32px"/>
                    <Caption>The future of bookings</Caption>
                </LogoContainer>
                <ContactWrapper>
                    <Link to="#">
                    <ContactContainer>
                        <ContactIcon><CiMail /></ContactIcon>
                        <ContactCaption>Info@tavly.ai</ContactCaption>
                    </ContactContainer>
                    </Link>
                    <ContactContainer>
                        <ContactIcon><FaLinkedin /></ContactIcon>
                        <ContactCaption>LinkedIn</ContactCaption>
                    </ContactContainer>
                </ContactWrapper>
                <ContactWrapper>
                    <Link to="#"><Caption>Privacy Policy</Caption></Link>
                    <Link to="#"><Caption>Who We Are</Caption></Link>
                </ContactWrapper>
                {/* <CustomButton>Proprietary technology in advanced stages of development</CustomButton> */}
            </Container>
            <CopyrightContainer>
                <CopyrightText>© 2023 Tavly. All rights reserved.</CopyrightText>
            </CopyrightContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(0, 0, 0);
`;
const Container = styled.div`
    width: 100%;
    padding: 48px 0px 16px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    border-top: 1px solid #555;
`;
const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;
const Caption = styled.div`
    font-size: 14px;
    color: rgb(156 163 175);
`;
const ContactWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 25px;
`;
const ContactContainer = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
`;
const ContactIcon = styled.div`
    height: 16px;
    color: rgb(156 163 175);
`;
const ContactCaption = styled.div`
    font-size: 17px;
    color: rgb(156 163 175);
`;
const CopyrightContainer = styled.div`
    max-width: 1280px;
    width: 100%;
    padding: 16px 0px 32px 0px;
    border-top: 1px solid #555;
`;
const CopyrightText = styled.div`
    font-size: 12px;
    color: rgb(156 163 175);
`;
export default Footer;