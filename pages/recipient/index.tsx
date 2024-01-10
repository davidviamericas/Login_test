import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Layout from '../../components/layout';
import { Box, Button, Divider, SliderValueLabel, Typography } from '@mui/material';
import CreateForm from './createForm';

import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import useLoader from '../../common/Loader/hook';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function List() {

    const searchParams = useSearchParams();
    const { getEnv, getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();
    const { setLoader } = useLoader();
    const router = useRouter();

    const [recipients, setRecipients] = React.useState<any[]>([]);

    const envValue = getEnv();

    const getRecipients = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/recipients`;
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
            setRecipients(response.data);
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
        <Layout>
            <Box style={{ width: "90%", margin: "auto" }}>
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">Recipients</Typography>
                </Box>

                <Box>
                    <Button variant="outlined" onClick={getRecipients} style={{ margin: "20px 0px" }}>Get Recipient</Button>
                    <Button variant="contained" onClick={() => router.push("/recipient/createForm")} style={{ margin: "20px 0px" }}>Create Recipient</Button>
                </Box>

                <Divider style={{ margin: "20px" }} />

                <TableContainer component={Paper} sx={{ overflow: "scroll" }}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {Object.keys(recipients[0] || {}).map((name, index) => {
                                    return (
                                        <TableCell key={index} component="th" scope="row">
                                            {name}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recipients.map((row) => (
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