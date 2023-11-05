import React, { useState, useContext, createContext } from "react";
import { useQuery, useMutation, gql } from '@apollo/client';
import {useNavigate} from 'react-router-dom';
import { UserContext } from "..";

const SEND_TRANSACTION = gql`
mutation send_transaction($recipientId: UUID!, $amount: Int!, $description: String! ) {
    createTransaction(recipientId:$recipientId, amount:$amount, description:$description) {
        success
        errors
    }
}
`;

function TransactionModal() {
    const context = useContext(UserContext);
    const navigate = useNavigate();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const [ mutateSendTransaction, sendTransactionLoading ] = useMutation(SEND_TRANSACTION);


    const handleSave = (event) => {
        mutateSendTransaction({ variables: {recipientId: recipient, amount: parseInt(amount), description:description}, onCompleted: (d) => {
          console.log(d);
          if (d.createTransaction.success === true) {
            window.location.reload(false);
          } else {
            setError(d.createTransaction.errors[0])
          }
        }})

        if (mutateSendTransaction.error) setError(mutateSendTransaction.error.message);
    };


    return (
        <>
            <input type="checkbox" id="my-modal-4" className="modal-toggle" />
            <label htmlFor="my-modal-4" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <h3 className="text-lg font-bold">Transfer money</h3>
                    <p className="text-error">{error}</p>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="text-gray-500 text-md">Recipient</span>
                        </label>
                        <input type="text" name="recipient" id="recipient" placeholder="AccountID" className="input input-bordered w-full"
                        onInput={e => setRecipient(e.target.value)} value={recipient}/>

                        <label className="label">
                            <span className="text-gray-500 text-md">Amount</span>
                        </label>
                        <input type="text" name="amount" id="amount" placeholder="Enter Amount (0)" className="input input-bordered w-full"
                        onInput={e => setAmount(e.target.value)} value={amount}/>

                        <label className="label">
                            <span className="text-gray-500 text-md">Description</span>
                        </label>
                        <input type="text" name="description" id="description" placeholder="Description" className="input input-bordered w-full"
                        onInput={e => setDescription(e.target.value)} value={description}/>
                    </div>
                    <div className="modal-action">
                        <button onClick={handleSave} htmlFor="my-modal-4" className="btn w-1/2" id="transfer-button">Transfer!</button>
                        <label htmlFor="my-modal-4" className="btn w-1/2">Close?</label>
                    </div>
                </label>
            </label>
        </>
    );
}

export default TransactionModal;