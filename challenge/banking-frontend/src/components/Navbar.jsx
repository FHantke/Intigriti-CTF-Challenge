import React, { useState, useContext, createContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "..";

function Navbar() {

    const context = useContext(UserContext)
    const { isLoggedIn } = context.userService
    const { username, setUsername } = context.userService

    const onSubmitLogout = (event) => {
        context.userService.logoutUser()
        context.setUserLoggedIn(false)
    };

    let menu = (
        <ul className="menu menu-horizontal px-1">
            <li>
                <Link to="/auth">Signup</Link>
            </li>
        </ul>
    );

    if (context.userLoggedIn) {
        menu = (
            <ul className="menu menu-horizontal px-1">
                <li>
                    <button onClick={onSubmitLogout}>Logout</button>
                </li>
            </ul>
        );
    }

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
            <a href="/home" className="btn btn-ghost normal-case text-xl">BugBank</a>
            </div>
            <div className="flex-none">
                {menu}
            </div>
        </div>
    )
}

export default Navbar;