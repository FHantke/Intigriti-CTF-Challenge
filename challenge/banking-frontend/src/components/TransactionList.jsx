import React, { useState, useContext, createContext } from "react";
import { UserContext } from "..";
import { Link } from "react-router-dom";
import TransactionInfo from "./TransactionInfo";
import { useQuery, useMutation, gql } from '@apollo/client';
import Alert from "./Alert";

const GET_TRANSACTIONS = gql`
query transactions {
  transactions {
    success
    errors
    transactions {
      id
      sender { name }
      recipient { name }
      amount
      description
      timestamp
    }
  }
}
`;

function TransactionList() {
    const context = useContext(UserContext);    
    const { loading, error, data } = useQuery(GET_TRANSACTIONS);
    let listItems = [];

    if (loading) return 'Loading...';

    if (error) {
      listItems.push(<Alert message={error.message}></Alert>);
    } else if (data.transactions.success === false) {
      listItems = data.transactions.errors.map(msg =>
        <Alert message={msg}></Alert>
      );
    } else {
      listItems = data.transactions.transactions.map(info =>
          <TransactionInfo key={info} info={info}/>
      );
    }

    return (
        <div className="grid grid-cols-1 gap-4 px-20">
            {listItems}
        </div>
    );
}

export default TransactionList;