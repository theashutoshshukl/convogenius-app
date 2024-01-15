import { useState } from "react";
import "../assets/styles/navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Open Nav
    const openNav = () => {
        setIsMenuOpen(true);
    }

    // Close Nav
    const closeNav = () => {
        setIsMenuOpen(false);
    }

    return (
        <>
            {/* Desktop Navbar */}
            <div className="nav-home">
                {/* Navbar */}
                <h1 className="logo"><Link to="/">ConvoGenius</Link></h1>
                <nav className="navbar">
                    <ul>
                        <Link to="/">
                            <li>Home</li>
                        </Link>
                        <Link to="/about">
                            <li>About Us</li>
                        </Link>
                        <Link to="/contact">
                            <li>Contact Us</li>
                        </Link>
                    </ul>
                </nav>
                <div className="socials">
                    {/* Github */}
                    <Link to="https://github.com/theashutoshshukl" target="_blank">
                        <i className="fa-brands fa-xl fa-github"></i>
                    </Link>
                    {/* Linkedin */}
                    <Link to="https://www.linkedin.com/in/ashutoshshukl01/" target="_blank">
                        <i className="fa-brands fa-xl fa-linkedin"></i>
                    </Link>
                    {/* Web */}
                    <Link to="https://ashutoshshukl.com/" target="_blank">
                        <i className="fa-solid fa-xl fa-globe"></i>
                    </Link>
                </div>
                {/* Open Nav */}
                <div className={`hamburger d-${isMenuOpen ? 'none' : 'block'}`}>
                    <i onClick={() => openNav()} className="fa-solid fa-2xl fa-bars"></i>
                </div>
                {/* Close Nav */}
                <div className={`humberger ham-close d-${isMenuOpen ? 'block' : 'none'}`}>
                    <i onClick={() => closeNav()} className="fa-solid fa-2xl fa-close"></i>
                </div>
            </div>

            {/* Mobile, Tablet Navbar */}
            <section className={`mobile-navbar d-${isMenuOpen ? 'block' : 'none'}`}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                </ul>

                {/* Mobile Socials */}
                <div className="mobile-socials">
                    {/* Github */}
                    <Link to="https://github.com/theashutoshshukl" target="_blank">
                        <i className="fa-brands fa-xl fa-github"></i>
                    </Link>
                    {/* Linkedin */}
                    <Link to="https://www.linkedin.com/in/ashutoshshukl01/" target="_blank">
                        <i className="fa-brands fa-xl fa-linkedin"></i>
                    </Link>
                    {/* Web */}
                    <Link to="https://ashutoshshukl.com/" target="_blank">
                        <i className="fa-solid fa-xl fa-globe"></i>
                    </Link>
                </div>
            </section >
            <hr />
        </>
    );
}

export default Navbar;