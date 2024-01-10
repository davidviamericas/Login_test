'use client';

import { Box, Button } from "@mui/material";
import { useTransactionContext } from "./context";
import useLoader from "../../common/Loader/hook";
import { userInfoProps } from "../../common/types";
import userInfo from "../../common/stores/user_info";
import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { useRouter } from "next/router";

const Actions = (props: any) => {
    const { activeStep, steps, handleBack, handleNext, envValue } = props;
    const { setLoader } = useLoader();
    const { getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();
    const router = useRouter();

    const {
        countryId,
        payer,
        amount,
        payment,
        recipientId,
        additionalFields,
        costs,
        transactionValidate
    } = useTransactionContext();

    const transactionAdd = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/transactions`;
            const totalAmount = parseFloat(amount) + parseFloat(costs.fixFee) + parseFloat(costs.taxes);
            const body = {
                appVersion: "1.0.0",
                idSenderGlobal: data.UUID,
                netAmount: amount,
                totalAmount: totalAmount,
                costs: costs,
                requiredDocumentInfo: {},
                recipient: {
                    recipientuuid: recipientId
                },
                additionalFields: additionalFields || [],
                funding: payment,
                kyc: {},
                payer: payer
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
                'X-Client-Headers': `{"Cookie":"${data.cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "PUT",
                bodyRequest: body,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);

            alert(JSON.stringify(response.data));
            router.push('/transactions');
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

    const necxtStep = async () => {
        switch (activeStep) {
            case 0:
                if (countryId && payer && amount && payment && recipientId) {
                    handleNext();
                }
                else {
                    alert("All fields are required");
                }
                break;
            case 1:
                if (additionalFields.filter((field: any) => field.value).length === additionalFields.length) {
                    handleNext();
                }
                else {
                    alert("All fields are required");
                }
                break;
            case 2:
                if (costs) {
                    handleNext();
                }
                else {
                    alert("Must first do calculate cost");
                }
                break;
            case 3:
                if (transactionValidate) {
                    handleNext();
                }
                else {
                    alert("Must first do the transaction validation");
                }
                break;
            case 4:
                await transactionAdd();
                break;
            default:
                return (false);
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
            >

            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={necxtStep}>
                {activeStep === (steps.length - 1) ? 'Submmit' : 'Next'}
            </Button>
        </Box>
    );
}

export default Actions;