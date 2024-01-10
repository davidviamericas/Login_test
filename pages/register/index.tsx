import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../../styles/Home.module.css";
import { useState } from "react";
import { decodingJWT } from "../../common";
import { Button, OutlinedInput, IconButton, InputAdornment, FormGroup, FormControlLabel, Checkbox, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from "@emotion/styled";
import MFA from "./mfa";
import Monitor from "../../components/axios_monitor/monitor";
import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import userInfo from "../../common/stores/user_info";
import loginInfo from "../../common/stores/login_info";
import { useRouter, useSearchParams } from 'next/navigation'
import Loader from "../../common/Loader";
import useLoader from "../../common/Loader/hook";
import EnvComponent from "../../components/env";

export const Input = styled(OutlinedInput)({
    width: "100%",
    fontSize: "20px",
    fontFamily: "monospace",
    margin: "10px 0px 0px 10px",
    backgroundColor: "white",
});

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
    const { getEnv, setUserInfo } = userInfo();
    const { setLoginInfo } = loginInfo();

    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();
    const router: any = useRouter();
    const searchParams = useSearchParams();
    const envValue = getEnv();
    const { setLoader } = useLoader();

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
            setUserInfo({
                chainId: ChainId,
                token: response.data.id_token,
                expiration: tokenDecoded.exp * 1000,
                UUID: tokenDecoded["custom:idSenderGlobal"],
                cookie: cookie,
            });
        }
    }

    const login = async () => {
        setLoader(true);
        //axios.defaults.xsrfCookieName = 'VA_RME_DEVICE_ID'
        //axios.defaults.xsrfHeaderName = "7252d67b-1fd0-4149-8b46-89d134878d90"
        //axios.defaults.withCredentials = true;
        try {
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/risk/${ChainId}/authentication/signin`;
            const body = {
                email: email,
                password: password,
                devicekey: "",
            };
            const headers = {
                'Content-Type': 'application/json',
                'X-Client-Headers': `{"Cookie":"${cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
                //withCredentials: true
            }
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "POST",
                bodyRequest: body,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            generateLocalStorageData(response);
            setLoginInfo(ChainId, email, password, cookie);
            router.push(`/sender${envValue ? '?env=' + envValue : ''}`);
        }
        catch (e: any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    };

    const signup = async () => {
        setLoader(true);
        try {
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/risk/${ChainId}/authentication/signup-originators`;
            const body = {
                "givenNames": givenNames,
                "familyNames": familyNames,
                "email": email,
                "password": password,
                "phone": phone,
                "devicekey": devicekey,
                "promotionalSMS": promotionalSMS,
                "transactionSMS": transactionSMS
            };
            const headers = {
                'Content-Type': 'application/json',
                'X-Client-Headers': `{"Remote Address": "192.1.1.1", "User-Agent":"POSTMAN" }`,
                //withCredentials: true
            }
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "POST",
                bodyRequest: body,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            if (response.data.status === "success") {
                setEventID(response.data.mfa.EventID);
                setUUID(response.data.uuid);
                setCookie(response.data.mfa['Set-Cookie']);
                setOpen(true);
            }
        }
        catch (e : any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        setLoader(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Monitor />
            <Loader />
            <EnvComponent />
            <MFA open={open} setOpen={setOpen} EventID={EventID} UUID={UUID} chainId={UUID} loginEvent={login} setCookie={setCookie} setEventID={setEventID} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
            </Box>
        </Box>
    );
}
