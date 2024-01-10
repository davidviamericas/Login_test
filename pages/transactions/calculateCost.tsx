'use client';

import { Box, Button, Typography } from "@mui/material";
import { useTransactionContext } from "./context";
import { userInfoProps } from "../../common/types";
import userInfo from "../../common/stores/user_info";
import useLoader from "../../common/Loader/hook";
import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { useState } from "react";

const CalculateCost = (props: any) => {
    const { envValue } = props;
    const {
        countryId,
        payer,
        amount,
        payment,
        setCosts
    } = useTransactionContext();

    const { getUserInfo } = userInfo();
    const { setLoader } = useLoader();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const [calculateCosts, setCalculateCosts] = useState<any | null>(null);

    const getCalculateCost = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/commercial/${data.chainId}/countries/${countryId}/deliver-methods/${payer.deliveryMode}/payouts/${payer.id}/calculate-costs?amount=${amount}&currencyMode=${payer.currencyMode}&uuid=${data.UUID}&idPayment=${payment.idPayment}`;
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
            setCalculateCosts(response.data);
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

    return (
        <Box>
            <Box style={{ width: "100%", margin: "20px auto", display: "flex", justifyContent: "space-between" }}>
                <Button id={"getCalculateCost"} variant="contained" onClick={async () => await getCalculateCost()}>8. Calculate Costs</Button>
            </Box>
            {calculateCosts && <Typography variant="h6">Response:</Typography>}
            <Box style={{ width: "100%", margin: "auto", display: "flex", flexDirection: "column", overflow: "auto" }}>
                {Object.keys(calculateCosts || {}).map((key: any) => {
                    let value = calculateCosts[key];
                    if (typeof value === "object") {
                        value = JSON.stringify(value);
                    }
                    return (
                        <Box key={key} style={{ width: "100%", margin: "auto", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <Typography variant="h6">{key}: </Typography>
                            <Typography variant="body1">{value}</Typography>
                        </Box>
                    );

                })}
            </Box>
        </Box>
    );
}

export default CalculateCost;