import React, { useState, useContext, createContext } from "react";
import { UserContext } from "..";
import {useNavigate} from 'react-router-dom';
import { Link } from "react-router-dom";
import SettingsInfo from "../components/SettingsInfo";
import SettingsPremium from "../components/SettingsPremium";

function Settings() {
    return (
        <>
            <SettingsInfo />
            <SettingsPremium />
        </>
    );
}

export default Settings;