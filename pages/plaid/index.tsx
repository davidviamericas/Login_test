import { Box, Button, Divider, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Layout from "../../components/layout";
import Paper from '@mui/material/Paper';

import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import useLoader from "../../common/Loader/hook";
import { useSearchParams } from 'next/navigation'

const Plaid = () => {
    const searchParams = useSearchParams();
    const { getEnv, getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const [urlPlaid, setUrlPlaid] = React.useState('');
    const [fundingAccounts, setFundingAccounts] = React.useState<any[]>([]);

    const { setLoader } = useLoader();
    const envValue = getEnv();

    const getPlaidLink = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/risk/${data.chainId}/senders/${data.UUID}/plaid/init`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
                'X-Client-Headers': `{"Cookie":"${data.cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
            }
            const body = {};
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "POST",
                bodyRequest: body,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setUrlPlaid(response.data.redirectUrl);
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
            if(e.response?.data){
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    }

    return (
        <Layout>
            <Box style={{ width: "80%", margin: "25px auto" }}>
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">Plaid</Typography>
                </Box>
                <Divider style={{ margin: "20px" }} />
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h5">Connect your bank account</Typography>
                    <Typography variant="body1">Via Digital uses Plaid to connect your bank account to our app. Plaid is a secure, trusted service that allows us to verify your identity and bank account information.</Typography>
                    <Grid container spacing={2} style={{ marginTop: "20px" }}>
                        <Grid item xs={12} sm={2}>
                            <Button variant="outlined" onClick={getFundingAccounts}>Actualizar</Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="outlined" onClick={getPlaidLink}>Generate Plaid Link</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Link href={urlPlaid} target="_blank" underline="hover" rel="noopener noreferrer">{urlPlaid}</Link>
                        </Grid>
                    </Grid>

                    <Divider style={{ margin: "20px" }} />

                    <TableContainer component={Paper} sx={{ overflow: "scroll" }}>
                        <Table sx={{ width: "100%" }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {Object.keys(fundingAccounts[0] || {}).map((name, index) => {
                                        return (
                                            <TableCell align="center" key={index} component="th" scope="row">
                                                {name}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fundingAccounts.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {Object.keys(row).map((name, index) => {
                                            let value = row[name];
                                            if (typeof value === "object") {
                                                value = JSON.stringify(value);
                                            }
                                            return <TableCell align="center">{value}</TableCell>
                                        })}

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Layout>
    );
}

export default Plaid;