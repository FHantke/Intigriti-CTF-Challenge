import React, { useState, useContext, createContext } from "react";
import { UserContext } from "..";
import { Link } from "react-router-dom";
import { useQuery, useMutation, gql } from '@apollo/client';
import TransactionModal from "./TransactionModal";
import { registerServiceWorker } from '../serviceWorker';

const GET_USER = gql`
query user {
    me {
        success
        errors
        user { id name money language }
    }
}
`;

function AccountInfo() {

    const context = useContext(UserContext);    

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { userId: context.userService.apiKey },
    });

    if (loading) return 'Loading';
    if (error) return `Error! ${error}`;
    if (data.me.success == false) return `Error! ${data.me.errors}`;

    context.userService.setLng(data.me.user.language);

    // setTimeout(registerServiceWorker, 5000);

    return (
        <>
        <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-3xl text-gray-700 font-bold mb-5">
                        Welcome {data.me.user.name}!
                    </p>

                    <p className="text-xl text-gray-700 mb-5">
                        AccountID: {data.me.user.id}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-3xl">
                        {data.me.user.money} Bugs
                    </p>
                </div>

                <div>
                    <label htmlFor="my-modal-4" id="transfer-modal" className="btn btn-block btn-primary">Transfer Bugs</label>
                </div>

                <div>
                    <Link className="btn btn-block btn-primary" to="/settings">Settings</Link>
                </div>
            </div>
        </div>

        <TransactionModal></TransactionModal>
        </>
    );
}

export default AccountInfo;