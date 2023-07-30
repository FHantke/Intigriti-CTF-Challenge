import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "..";

const Base = () => {
    const context = useContext(UserContext);    

    return (
        <>
            <Navbar />
            <Outlet />
            <div hidden id="lng">{context.userService.lng}</div>
        </>
    )
}

export default Base;