'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContextProps {
    countryId: any;
    setCountryId: React.Dispatch<React.SetStateAction<string>>;
    payer: any;
    setPayer: React.Dispatch<React.SetStateAction<string>>;
    amount: any;
    setAmount: React.Dispatch<React.SetStateAction<number | null>>;
    totalAmount: any;
    setTotalAmount: React.Dispatch<React.SetStateAction<number | null>>;
    payment: any;
    setPayment: React.Dispatch<React.SetStateAction<any>>;
    recipientId: any,
    setRecipientId: React.Dispatch<React.SetStateAction<string>>;
    additionalFields: Array<any>,
    setAdditionalFields: React.Dispatch<React.SetStateAction<Array<any>>>;
    costs: any,
    setCosts: React.Dispatch<React.SetStateAction<any>>;
    transactionValidate: any | null,
    setTransactionValidate: React.Dispatch<React.SetStateAction<any | null>>;
}

const Context = createContext<ContextProps | undefined>(undefined);

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [countryId, setCountryId] = useState<string>("");
    const [payer, setPayer] = useState<any>({});
    const [amount, setAmount] = useState<number | null>(null);
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [payment, setPayment] = useState<any>({});
    const [recipientId, setRecipientId] = useState<string>("");
    const [additionalFields, setAdditionalFields] = useState<Array<any>>([]);
    const [costs, setCosts] = useState<any | null>(null);
    const [transactionValidate, setTransactionValidate] = useState<any | null>(null);

    const contextValue: ContextProps = {
        countryId,
        setCountryId,
        payer,
        setPayer,
        amount,
        setAmount,
        totalAmount,
        setTotalAmount,
        payment,
        setPayment,
        recipientId,
        setRecipientId,
        additionalFields,
        setAdditionalFields,
        costs,
        setCosts,
        transactionValidate,
        setTransactionValidate
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useTransactionContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useTransactionContext debe usarse dentro de un Provider');
    }
    return context;
};

export default Context;