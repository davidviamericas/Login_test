import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Layout from '../../components/layout';
import axios from 'axios';
import { Box, Button, Divider, SliderValueLabel, Typography } from '@mui/material';
import { Create } from '@mui/icons-material';
import CreateForm from './createForm';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function List() {

    const [recipients, setRecipients] = React.useState<any[]>([]);
    const [update, setUpdate] = React.useState<any>("");
    const [open, setOpen] = React.useState<any>(false);

    React.useEffect(() => {
        getRecipients();
    }, [update]);


    const getRecipients = async () => {
        try {
            const data: any = JSON.parse(localStorage.getItem("data") || "{}");
            const url = `https://qa-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/recipients`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`,
                    //'X-Client-Headers': `{"Cookie":"${Cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
                }
            });
            console.log("response");
            console.log(JSON.stringify(response));
            setRecipients(response.data);
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    }


    return (
        <Layout>
            <Box style={{ width: "90%", margin: "auto" }}>
                <CreateForm open={open} setOpen={setOpen} updateEvent={setUpdate} />
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">Recipients</Typography>
                </Box>

                <Button variant="contained" onClick={() => setOpen(true)} style={{ margin: "20px 0px" }}>Create Recipient</Button>

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