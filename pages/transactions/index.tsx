import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Layout from '../../components/layout';
import { Box, Button, Divider, FormControl, InputAdornment, InputLabel, MenuItem, Select, SliderValueLabel, TextField, Typography } from '@mui/material';

import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import useLoader from '../../common/Loader/hook';
import { useRouter } from 'next/router';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Grid from '@mui/material/Unstable_Grid2';

export default function Index() {

    const { getEnv, getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();
    const { setLoader } = useLoader();
    const router = useRouter();

    const [transactions, setTransactions] = React.useState<any[]>([]);

    const [transactionUuid, setTransactionUuid] = React.useState<string | null>(null);
    const [stateId, setStateId] = React.useState<string | null>(null);
    const [states, setStates] = React.useState<any[]>();

    const envValue = getEnv();

    const buildQueryString = (): string => {
        let queryString: string = "";
        if (stateId || transactionUuid) {
            const paramState = stateId ? `stateOrigin=${stateId}` : '';
            const paramUuid = transactionUuid ? `transactionUUID=${transactionUuid}` : '';
            queryString = `?${paramState}${(paramState && paramUuid) ? `&${paramUuid}` : ''}`
        }
        return queryString;
    }

    const getTransactions = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const queryString = buildQueryString();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/activity${queryString}`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
                //'X-Client-Headers': `{"Cookie":"${Cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
            };
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setTransactions(response.data);
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
        <Layout>
            <Box style={{ width: "90%", margin: "auto" }}>
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">Transactions</Typography>
                </Box>

                <Box>
                    <Button variant="outlined" style={{ margin: "20px 10px" }} onClick={getStates} >Get States</Button>
                    <Button variant="outlined" style={{ margin: "20px 10px" }} onClick={getTransactions} >Get Transactions</Button>
                    <Button variant="contained" style={{ margin: "20px 10px" }} onClick={() => router.push(`/transactions/newTransaction?env=${envValue}`)} >New Transactions</Button>
                </Box>

                <Divider style={{ margin: "20px" }} />

                <Typography variant='subtitle1' >If you want to filter by a specific transaction or by state origin, you can type the UUID transaction or select a state</Typography>
                <Grid container>
                    <Grid xs={12} md={4} style={{ margin: "10px" }}>
                        <FormControl variant="outlined" style={{ width: "100%" }}>
                            <InputLabel htmlFor="state">State Origin</InputLabel>
                            <Select
                                labelId="formLabel"
                                variant="standard"
                                id="formLabel"
                                onChange={(e: any) => setStateId(e.target.value)}
                                label={"funding"}
                                fullWidth
                            >
                                {states?.map((c: any) => <MenuItem value={c.id}>{`${c.value}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} md={4} style={{ margin: "10px" }}>
                        <FormControl variant="outlined" style={{ width: "100%" }}>
                            <TextField
                                id="TransactionUUID"
                                type="text"
                                variant="standard"
                                label="TransactionUUID"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><ReceiptIcon /></InputAdornment>,
                                    onChange: (event: any) => setTransactionUuid(event.target.value)
                                }}
                                value={transactionUuid}
                                onKeyDown={e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ overflow: "scroll" }}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {Object.keys(transactions[0] || {}).map((name, index) => {
                                    return (
                                        <TableCell key={index} component="th" scope="row">
                                            {name}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((row) => (
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
        </Layout>
    );
}