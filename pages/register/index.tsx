import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../../styles/Home.module.css";
import { useState } from "react";
import axios from "axios";
import { decodingJWT } from "../../common";
import { Button, OutlinedInput, IconButton, InputAdornment, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from "@emotion/styled";
import MFA from "./mfa";

export const Input = styled(OutlinedInput)({
    width: "100%",
    fontSize: "20px",
    fontFamily: "monospace",
    margin: "10px 0px 0px 10px",
    backgroundColor: "white",
});

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
    const [ChainId, setChainId] = useState<string>("USA000006");
    const [givenNames, setGivenNames] = useState<string>("");
    const [familyNames, setFamilyNames] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [devicekey, setDevicekey] = useState<string>("");
    const [promotionalSMS, setPromotionalSMS] = useState<boolean>(true);
    const [transactionSMS, setTransactionSMS] = useState<boolean>(true);
    const [cookie, setCookie] = useState<string>("");
    const [EventID, setEventID] = useState<string>("");
    const [UUID, setUUID] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const generateLocalStorageData = (response: any) => {
        if (response?.data?.id_token) {
            const tokenDecoded = decodingJWT(response.data.id_token);
            const data = JSON.stringify({
                chainId: ChainId,
                token: response.data.id_token,
                expiration: tokenDecoded.exp * 1000,
                UUID: tokenDecoded["custom:idSenderGlobal"],
                cookie: cookie,
            });
            localStorage.setItem("data", data);
            window.location.href = "/";
        }
    }

    const login = async () => {
        //axios.defaults.xsrfCookieName = 'VA_RME_DEVICE_ID'
        //axios.defaults.xsrfHeaderName = "7252d67b-1fd0-4149-8b46-89d134878d90"
        //axios.defaults.withCredentials = true;
        try {
            const url =
                `https://qa-vianex.viamericas.io/v2/risk/${ChainId}/authentication/signin`;
            const response: any = await axios.post(url, {
                email: email,
                password: password,
                devicekey: "",
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Client-Headers': `{"Cookie":"${cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
                        //withCredentials: true
                    },
                    //withCredentials: true
                });
            console.log("response");
            console.log(JSON.stringify(response));
            generateLocalStorageData(response);
            window.location.href = '/sender';
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    };

    const signup = async () => {
        try {
            const url =
                `https://qa-vianex.viamericas.io/v2/risk/${ChainId}/authentication/signup-originators`;
            const response: any = await axios.post(url, {
                "givenNames": givenNames,
                "familyNames": familyNames,
                "email": email,
                "password": password,
                "phone": phone,
                "devicekey": devicekey,
                "promotionalSMS": promotionalSMS,
                "transactionSMS": transactionSMS
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Client-Headers': `{"Remote Address": "192.1.1.1", "User-Agent":"POSTMAN" }`,
                        //withCredentials: true
                    },
                    //withCredentials: true
                });
            console.log("response");
            console.log(JSON.stringify(response));
            if (response.data.status === "success") {
                setEventID(response.data.mfa.EventID);
                setUUID(response.data.uuid);
                setCookie(response.data.mfa['Set-Cookie']);
                setOpen(true);
            }
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    };

    return (
        <>
            <MFA open={open} setOpen={setOpen} EventID={EventID} UUID={UUID} chainId={UUID} loginEvent={login} setCookie={setCookie} setEventID={setEventID} />
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h2 className={inter.className}>Register</h2>
                <div style={{ width: "80%", margin: "auto" }}>
                    <div style={{ margin: "15px 0px" }}>
                        <h3 className={inter.className}>Chain Id</h3>
                        <Input
                            onChange={(value) => setChainId(value.target.value)}
                            defaultValue={ChainId}
                        ></Input>
                    </div>
                    <div style={{ margin: "15px 0px" }}>
                        <h3 className={inter.className}>Given Names</h3>
                        <Input
                            onChange={(value) => setGivenNames(value.target.value)}
                            defaultValue={givenNames}
                        ></Input>
                    </div>
                    <div>
                        <h3 className={inter.className}>Family Names</h3>
                        <Input
                            type="text"
                            onChange={(value) => setFamilyNames(value.target.value)}
                            defaultValue={familyNames}
                        ></Input>
                    </div>
                    <div>
                        <h3 className={inter.className}>Email</h3>
                        <Input
                            type="email"
                            onChange={(value) => setEmail(value.target.value)}
                            defaultValue={email}
                        ></Input>
                    </div>
                    <div>
                        <h3 className={inter.className}>Password</h3>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="showPassword" onClick={() => setShowPassword(!showPassword)} color="primary">
                                        <VisibilityIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            onChange={(value) => setPassword(value.target.value)}
                            defaultValue={password}
                        ></Input>
                    </div>
                    <div>
                        <h3 className={inter.className}>Phone</h3>
                        <Input
                            type="text"
                            onChange={(value) => setPhone(value.target.value)}
                            defaultValue={phone}
                        ></Input>
                    </div>
                    <div>
                        <h3 className={inter.className}>Device Key</h3>
                        <Input
                            type="text"
                            onChange={(value) => setDevicekey(value.target.value)}
                            defaultValue={devicekey}
                        ></Input>
                    </div>
                    <div>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={e => setPromotionalSMS(e.target.checked)} />} label="promotionalSMS" />
                            <FormControlLabel control={<Checkbox onChange={e => setTransactionSMS(e.target.checked)} />} label="transactionSMS" />
                        </FormGroup>
                    </div>
                    <div>
                        <button
                            style={{
                                padding: "10px 15px",
                                minWidth: "125px",
                                fontSize: "18px",
                                float: "right",
                                margin: "10px -10px",
                                cursor: "pointer",
                            }}
                            onClick={signup}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
