
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/signup');
    };

    return (
        <div>
            <img
                alt="logo"
                className="logo"
                src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/54/25/76/542576c2-8b53-b72a-4aeb-764ad762704f/AppIcon-fk-0-0-1x_U007emarketing-0-10-0-85-220.png/1200x600wa.png"
            />
            {auth ? (
                <ul className="nav-ul">
                    <li><Link to="/">Products</Link></li>
                    <li><Link to="/add">Add Products</Link></li>
                    <li><Link to="/update">Update Products</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li>
                        <Link onClick={logout} to="/signup">
                            Logout ({JSON.parse(auth)?.name || "User"})
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul className="nav-ul nav-right">
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            )}
        </div>
    );
};

export default Nav;
