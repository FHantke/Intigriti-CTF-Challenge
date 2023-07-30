import React, { useState, useContext, createContext } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';
import Alert from "../components/Alert";

const UPGRADE = gql`
mutation upgrade {
    upgrade {
        success
        errors
        flag
    }
}
`;


function SettingsPremium() {
    const [ mutateUpgrade, upgradeLoading ] = useMutation(UPGRADE);

    const [errorMessage, setErrorMessage] = useState('');
    const [flag, setFlag] = useState('');

    const handleUpgrade = (event) => {
        mutateUpgrade({ onCompleted: (data) => {
            console.log(data);
            if (data.upgrade.success === true) {
                setFlag(data.upgrade.flag)
            } else {
              console.log(data.upgrade.errors[0])
              setErrorMessage(data.upgrade.errors[0])
            }
          }})
    };

    if (flag === '') {
        return (
            <>
            <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">    
                <div>
                    <p className="text-3xl text-gray-700 font-bold mb-5">
                        Premium Flag Feature
                    </p>
                    <p className="text-gray-700 mb-5">
                        Experience exclusivity like never before with our Premium Flag Feature.
                        For just 10,000 bugs, unlock prestigious benefits and stand out in the BugBank community.
                        Embrace the emblem of distinction, because you're not just trading bugs, you're making a statement!
                    </p>
                    <button onClick={handleUpgrade}  className="btn btn-primary btn-block ">Upgrade</button>
                    <div className="mt-5">
                        <Alert message={errorMessage}></Alert>          
                    </div>
                </div>
            </div>
            </>
        );
    } else {
        return (
            <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">              
                <div>
                    <p className="text-3xl text-gray-700 font-bold mb-5">
                        Premium Flag Feature
                    </p>
                    <p className="text-gray-700 mb-5">
                        Thank you for joining the premium club!
                    </p>
                              
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{flag}</span>
                        </div>
                    </div>  
                </div>
            </div>
        )
    }    
}

export default SettingsPremium;