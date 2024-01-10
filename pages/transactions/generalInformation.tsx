'use client';

import { Box, Button, FormControl, FormGroup, Input, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react";
import useLoader from "../../common/Loader/hook";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { useTransactionContext } from "./context";

const GeneralInformation = (props: any) => {
    const { envValue } = props;
    const {
        countryId,
        setCountryId,
        payer,
        setPayer,
        amount,
        setAmount,
        setPayment,
        recipientId,
        setRecipientId
    } = useTransactionContext();

    const { setLoader } = useLoader();
    const { getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const [countries, setCountries] = useState<any[]>([]);
    const [recipients, setRecipients] = useState<any[]>([]);
    const [deliveryMethods, setDeliveryMethods] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [fundingAccounts, setFundingAccounts] = useState<any[]>([]);

    const handleAmountChange = (event: any) => {
        let value = event.target.value;
        setAmount(value);
    };

    const getRecipients = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/recipients`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            };
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setRecipients(response.data);
        }
        catch (e: any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    const getCountries = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setCountries(response.data);
        }
        catch (e: any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    const getCurrencies = async () => {
        if (!countryId) {
            alert("Debes seleccionar un país");
            return;
        }
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries/${countryId}/currencies`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setCurrencies(response.data);
        }
        catch (e: any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    const getDeliveryMethods = async () => {
        if (!countryId) {
            alert("Debes seleccionar un país");
            return;
        }
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries/${countryId}/deliver-methods`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setDeliveryMethods(response.data);
        }
        catch (e: any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    const getPayoutRequest = async () => {
        if (!payer?.deliveryMode) {
            alert("Debes seleccionar un método de pago");
            return;
        }
        if (!countryId) {
            alert("Debes seleccionar un país");
            return;
        }
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries/${countryId}/deliver-methods/${payer.deliveryMode}/payouts/`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setPaymentMethods(response.data);
        }
        catch (e: any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    const getFundingAccounts = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/risk/${data.chainId}/senders/${data.UUID}/funding-accounts`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
                'X-Client-Headers': `{"Cookie":"${data.cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
            };
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            console.log(response);
            setFundingAccounts(response.data);
        }
        catch (e : any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    return (
        <Box>
            <Box style={{ width: "100%", margin: "20px auto", display: "flex", justifyContent: "space-between" }}>
                <Button id={"getRecipients"} variant="contained" onClick={async () => await getRecipients()}>1. Get Recipients</Button>
                <Button id={"getCountries"} variant="contained" onClick={async () => await getCountries()}>2. Countries</Button>
                <Button id={"getCurrencies"} variant="contained" onClick={async () => await getCurrencies()}>3. Currencies</Button>
                <Button id={"getDeliveryMethods"} variant="contained" onClick={async () => await getDeliveryMethods()}>4. Delivery methods</Button>
                <Button id={"getPayoutRequest"} variant="contained" onClick={async () => await getPayoutRequest()}>5. Payout Request</Button>
                <Button id={"getFundingAccounts"} variant="contained" onClick={async () => await getFundingAccounts()}>6. Funding Accounts</Button>
            </Box>
            <form autoComplete='false'>
                <FormGroup row={true}>
                    <FormControl variant="outlined" style={{ margin: "10px 1%", width: "48%" }}>
                        <InputLabel htmlFor="recipientId">Recipient</InputLabel>
                        <Select
                            labelId="formLabel"
                            variant="standard"
                            id="formLabel"
                            onChange={(e) => setRecipientId(e.target.value)}
                            label={"Country ID"}
                            value={recipientId}
                            fullWidth
                        >
                            {recipients.map((c: any) => <MenuItem value={c.recipientuuid}>{`${c.fullName}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ margin: "10px 1%", width: "48%" }}>
                        <InputLabel htmlFor="countryId">Country ID</InputLabel>
                        <Select
                            labelId="formLabel"
                            variant="standard"
                            id="formLabel"
                            onChange={(e) => setCountryId(e.target.value)}
                            label={"Country ID"}
                            value={countryId}
                            fullWidth
                        >
                            {countries.map((c: any) => <MenuItem value={c.idCountry}>{`${c.nameCountry}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ margin: "10px 1%", width: "48%" }}>
                        <InputLabel htmlFor="currency">Currency</InputLabel>
                        <Select
                            labelId="formLabel"
                            variant="standard"
                            id="formLabel"
                            onChange={(e) => {
                                const value: any = e.target.value;
                                const currency = typeof value === "object" ? value : JSON.parse(value);
                                setPayer({ ...payer, currencyMode: currency.id, currencyISO: value.iso })
                            }}
                            label={"currency"}
                            value={payer?.currency}
                            fullWidth
                        >
                            {currencies.map((c: any) => <MenuItem value={c}>{`${c.name}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ margin: "10px 1%", width: "48%" }}>
                        <InputLabel htmlFor="deliveryMethodId">Delivery Method</InputLabel>
                        <Select
                            labelId="formLabel"
                            variant="standard"
                            id="formLabel"
                            onChange={(e) => {
                                const value: any = e.target.value;
                                const deliveryMethod = typeof value === "object" ? value : JSON.parse(value);
                                setPayer({
                                    ...payer,
                                    deliveryMode: deliveryMethod.idDelivery,
                                    deliveryName: deliveryMethod.nameDelivery
                                })
                            }}
                            label={"deliveryMethod"}
                            fullWidth
                        >
                            {deliveryMethods.map((c: any) => <MenuItem value={c}>{`${c.nameDelivery}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ margin: "10px 1%", width: "48%" }}>
                        <InputLabel htmlFor="idPayer">Payer</InputLabel>
                        <Select
                            labelId="idPayer"
                            variant="standard"
                            id="idPayer"
                            onChange={(e) => {
                                const value: any = e.target.value;
                                const obj = typeof value === "object" ? value : JSON.parse(value);
                                setPayer({
                                    ...payer,
                                    id: obj.idPayer,
                                    paymentLocationCode: obj.idpayout
                                })
                            }}
                            label={"Payer"}
                            fullWidth
                        >
                            {paymentMethods.map((c: any) => <MenuItem value={c}>{`${c.namePayout}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ margin: "10px 1%", width: "48%" }}>
                        <InputLabel htmlFor="funding">Funding</InputLabel>
                        <Select
                            labelId="formLabel"
                            variant="standard"
                            id="formLabel"
                            onChange={(e) => {
                                const value: any = e.target.value;
                                const funding = typeof value === "object" ? value : JSON.parse(value);
                                setPayment({
                                    idPayment: funding.idPayment,
                                    name: funding.name,
                                    type: "A"
                                })
                            }}
                            label={"funding"}
                            fullWidth
                        >
                            {fundingAccounts.map((c: any) => <MenuItem value={c}>{`${c.name}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                        <TextField
                            id="Amount"
                            type="number"
                            variant="standard"
                            label="Amount"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                onChange: handleAmountChange
                            }}
                            value={amount}
                            onKeyDown={e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                        />
                    </FormControl>
                </FormGroup>
            </form>
        </Box>
    )
}

export default GeneralInformation;