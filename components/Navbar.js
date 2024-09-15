import React from 'react'
import styled from 'styled-components'

function Navbar(){

    return(
        <NavbarSection>

            <NavbarSlideSmart>
                <a href="/">SlideSmart</a>
            </NavbarSlideSmart>

            <NavbarAboutLinks>
                <a href="/" >Saved Projects</a>
                <a href="/" >How it Works</a>
                <a href="/" >Support</a>
                <a href="/" >Why SlideSmart</a>
            </NavbarAboutLinks>
            

            <NavbarLoginLinks>
                    <NavbarLoginStyle><a href="/">Login</a></NavbarLoginStyle>
                    <NavbarRegisterStyle><a href="/">Register</a></NavbarRegisterStyle>
            </NavbarLoginLinks>

        </NavbarSection>
    )
}

const NavbarAboutLinks = styled.div`
    margin-left: 50px;
    display: flex;
    justify-content: space-between;
    gap: 30px;
    

    a {
        text-decoration: none;
        color: inherit;
        transition: color 0.3s;
        font-size: 20px;
        font-weight: bold;
    }

    a:hover {
        color: #F03A47;
    }
`

const NavbarLoginStyle = styled.div`
    margin-left: 16px;
    padding: 6px;

    a {
        text-decoration: none;
        color: inherit;
        transition: color 0.3s;
        font-size: 25px;
        font-weight: bold;
    }

    a:hover {
        color: #F03A47;
    }

`

const NavbarRegisterStyle = styled.div`
    margin-left: 16px;
    padding: 6px;

    a {
        text-decoration: none;
        color: white;
        transition: color 0.3s;
        font-size: 25px;
        font-weight: bold;
        border-radius: 8px;
        background-color: #F03A47;
        padding: 6px;
        border: 2px solid #F03A47;

    }

    a:hover {
        color: black;
    }

`

const NavbarLoginLinks = styled.div`
    float: right;
    margin-left: auto;
    padding: 6px;
    display: flex;
    font-size: 25px;
    color: #000000;
    font-weight: bold;
    
`

const NavbarSlideSmart = styled.div`
    float: left;
    padding: 12px;

    a {
        text-decoration: none;
        font-size: 40px;
        color: #000000;
        font-weight: bold;

    }
`

const NavbarSection = styled.div`
    display: flex;
    align-items: center;
    margin: auto;
    padding 20px;
    background-color: #f6f4f3;
    padding: 20px;

`

export default Navbar