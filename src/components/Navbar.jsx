import React, { useContext } from "react";
import styled from "styled-components";
import { StoreContext } from "../utils/Store";
import { logoutHandler } from "../utils/user";
import { useNavigate } from "react-router-dom";

const HomeNavbar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items:center;
    margin-top: 3rem;
    padding: 0 2rem;
`;

const PageHeader = styled.div`
    font-weight: bold;
    color: #dbdbdb;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const NavbarActions = styled.div`
    display: flex;
    align-items:center;
`;

const AccountAddress = styled.div`
    font-weight: bold;
    color: #dbdbdb;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const LogoutBtn = styled.button`
    margin-left: 1rem;
    background-color: #e4e4e4;
    border: none;
    outline: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    /* margin-top: 2rem; */
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease;
`;


const Navbar = ({title}) => {
    const { state, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();

    return (
        <HomeNavbar>
            <PageHeader>{title}</PageHeader>
            <NavbarActions>
                <AccountAddress>{state.user.emailId}</AccountAddress>
                <LogoutBtn onClick={() => {
                    logoutHandler(dispatch);
                    navigate("/signup");
                }}>LOGOUT</LogoutBtn>
            </NavbarActions>
        </HomeNavbar>
    );
};

export default Navbar;