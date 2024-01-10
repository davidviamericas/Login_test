export interface interceptorProps {
    key: string;
    URL: string;
    method: string;
    headers: any;
    bodyRequest: any;
    bodyResponse: any;
    code: number | null;
}

export interface userInfoProps {
    chainId: string;
    token: string;
    expiration: number;
    UUID: string;
    cookie: string;
}

export interface ContextProps {
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