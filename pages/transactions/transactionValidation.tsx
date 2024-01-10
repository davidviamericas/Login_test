'use client';

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useTransactionContext } from "./context";
import { userInfoProps } from "../../common/types";
import userInfo from "../../common/stores/user_info";
import useLoader from "../../common/Loader/hook";
import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { useState } from "react";

const TransactionValidation = (props: any) => {
    const { envValue } = props;
    const {
        countryId,
        payer,
        amount,
        payment,
        setCosts,
        transactionValidate,
        setTransactionValidate
    } = useTransactionContext();

    const { getUserInfo } = userInfo();
    const { setLoader } = useLoader();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const [states, setStates] = useState<any[]>([]);
    const [stateId, setStateId] = useState<any>();

    const getValidate = async () => {
        if (!stateId) {
            alert("Debes seleccionar un estado");
            return;
        }
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/transactions/validate`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
            const body = {
                idSenderGlobal: data.UUID,
                countryReceiver: countryId,
                amount: amount,
                payer: payer.id,
                state: stateId
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "POST",
                bodyRequest: body,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setTransactionValidate(response.data);
            setCosts({
                fixFee: response.data.fees,
                fundingMode: payment.type,
                fundingFee: "0",
                originalRate: response.data.exchangeRate,
                otherFees: "0",
                percentageFee: "0",
                viaTasa: "0",
                idDiscount: "0",
                discountValue: "0",
                taxes: response.data.taxes
            });
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

    const getStates = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries/USA/states`;
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
            setStates(response.data);
        }
        catch (e : any) {
            console.log(e);
            if(e.response?.data){
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    return (
        <Box>
            <Box style={{ width: "100%", margin: "20px auto", display: "flex", justifyContent: "space-between" }}>
                <Button id={"getStates"} variant="contained" onClick={async () => await getStates()}>8. Get States</Button>
                <Button id={"getValidate"} variant="contained" onClick={async () => await getValidate()}>9. Transaction Validate</Button>
            </Box>
            <Box style={{ width: "100%", margin: "30px auto", display: "flex", flexDirection: "column" }}>
                <FormControl variant="outlined" style={{ margin: "auto", width: "100%" }}>
                    <InputLabel htmlFor="state">State</InputLabel>
                    <Select
                        labelId="formLabel"
                        variant="standard"
                        id="formLabel"
                        onChange={(e) => setStateId(e.target.value)}
                        label={"funding"}
                        fullWidth
                    >
                        {states.map((c: any) => <MenuItem value={c.id}>{`${c.value}`}</MenuItem>)}
                    </Select>
                </FormControl>
                {transactionValidate && <Typography variant="h6">Response:</Typography>}
                {Object.keys(transactionValidate || {}).map((key: any) => {
                    let value = transactionValidate[key];
                    if (typeof value === "object") {
                        alert("dcde")
                        value = JSON.stringify(value);
                    }
                    return (
                        <Box key={key} style={{ width: "100%", margin: "10px auto", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <Typography variant="h6">{key}: </Typography>
                            <Typography variant="body1">{value ? "true" : "false"}</Typography>
                        </Box>
                    );

                })}
            </Box>
        </Box>
    );
}


export default TransactionValidation;