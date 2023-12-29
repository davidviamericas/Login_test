import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Select } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { Input } from ".";
import { Inter } from "@next/font/google";
import { useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

const MFA = (props: any) => {
    const { open, setOpen, EventID, UUID, chainId, loginEvent, setCookie, setEventID } = props;
    const [TokenMFA, setTokenMFA] = useState<any>("");
    const [TypeMFA, setTypeMFA] = useState<any>("phone");



    const handleClose = () => {
        setOpen(false);
    }

    // authentication/verify-token-mfa
    const verifyMFA = async () => {
        if (TokenMFA === "") {
            alert("Token MFA es requerido");
            return;
        }
        try {   
            const url = `https://qa-vianex.viamericas.io/v2/risk/${chainId}/authentication/verify-token-mfa`;
            const response = await axios.post(url, {
                EventID: EventID,
                Token: TokenMFA
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Headers': `{"Latitude": 19.0699797, "Remote Address": "103.66.96.230", "User-Agent": "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0", "Altitude": null, "AltitudeAccuracy": null, "Heading": null, "Longitude": 72.8397202, "Speed": null}`
                }
            });
            console.log("response");
            console.log(JSON.stringify(response));
            loginEvent();
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    }

    // authentication/send-token-mfa
    const sendMFA = async () => {
        try {   
            const url = `https://qa-vianex.viamericas.io/v2/risk/${chainId}/authentication/send-token-mfa`;
            const response = await axios.post(url, {
                CustomerID: UUID,
                Type: TypeMFA
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Headers': `{"Latitude": 19.0699797, "Remote Address": "103.66.96.230", "User-Agent": "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0", "Altitude": null, "AltitudeAccuracy": null, "Heading": null, "Longitude": 72.8397202, "Speed": null}`
                }
            });
            console.log("response");
            console.log(JSON.stringify(response));
            setCookie(response.data['Set-Cookie']);
            setEventID(response.data.EventID);
            alert("Token Enviado");
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    }

    return (
        <Dialog open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                MFA
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <div style={{ margin: "15px 0px" }}>
                    <h3 className={inter.className}>Token MFA</h3>
                    <Input
                        onChange={(value) => setTokenMFA(value.target.value)}
                        defaultValue={TokenMFA}
                    ></Input>
                </div>
                <Button variant="contained" onClick={verifyMFA}>Verify MFA</Button>
                <Divider style={{ margin: "20px" }} />
                <div style={{ margin: "15px 0px" }}>
                    <h3 className={inter.className}>Type Token MFA</h3>
                    <Select fullWidth={true} onChange={(value) => setTypeMFA(value.target.value)} value={TypeMFA}>
                        <MenuItem value={"phone"}>Phone</MenuItem>
                        <MenuItem value={"email"}>Email</MenuItem>
                    </Select>
                </div>
                <Button variant="contained" onClick={sendMFA}>Send MFA</Button>
            </DialogContent>
        </Dialog>
    )
}

export default MFA;