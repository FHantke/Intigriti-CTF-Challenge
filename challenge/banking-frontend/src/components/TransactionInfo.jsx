import React, { useState, useContext, createContext } from "react";
import { UserContext } from "..";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";

function TransactionInfo(props) {

    const context = useContext(UserContext);
    const htmlText = DOMPurify.sanitize(props.info.description)
    console.log(props.info)
    
    return (
        <div className="card compact bordered">
            <div className="card-body">
                <h2 className="card-title">{props.info.timestamp}</h2> 
                <p>Sender: {props.info.sender.name} | Recipient: {props.info.recipient.name}</p>
                <p dangerouslySetInnerHTML={{__html: htmlText}}></p>
                <p>Value: {props.info.amount}</p>
            </div>
        </div>
    );
}

export default TransactionInfo;