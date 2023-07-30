import React, { useState, useContext, createContext } from "react";
import { UserContext } from "..";
import { Link } from "react-router-dom";
import AccountInfo from "../components/AccountInfo";
import TransactionList from "../components/TransactionList";

function Home() {
    return (
        <>
        <AccountInfo />
        <TransactionList />
        </>
    );
}

export default Home;