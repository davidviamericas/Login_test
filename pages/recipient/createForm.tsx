import { Autocomplete, Box, Button, Checkbox, IconButton, Divider, FormControl, FormControlLabel, FormGroup, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { use, useEffect, useState } from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import useLoader from "../../common/Loader/hook";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/layout";
import { useRouter } from "next/router";

const CreateForm = (props: any) => {

    const router = useRouter();

    const searchParams = useSearchParams();
    const [name, setName] = useState<any>("");
    const [familyNames, setFamilyNames] = useState<any>("");
    const [phone, setPhone] = useState<any>("");
    const [countryCode, setCountryCode] = useState<any>("+57");
    const [addressLine1, setAddressLine1] = useState<any>("");
    const [addressLine2, setAddressLine2] = useState<any>("");
    const [countryId, setCountryId] = useState<any>("");
    const [stateId, setStateId] = useState<any>("");
    const [cityName, setCityName] = useState<any>("");
    const [nickName, setNickName] = useState<any>("");
    const [relationship, setRelationship] = useState<any>("");
    const [intendedUseFounds, setIntendedUseFounds] = useState<any>("E");

    const [countries, setCountries] = useState<any>([]);
    const [location, setLocation] = useState<any>([]);
    const [locationStatus, setLocationStatus] = useState<any>(false);
    const [locationValue, setLocationValue] = useState<any>("");
    const [relationships, setRelationships] = useState<any>([]);
    const [purposeFunds, setPurposeFunds] = useState<any>([]);

    const { setLoader } = useLoader();

    const { getEnv, getUserInfo } = userInfo();

    const envValue = getEnv();

    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const buildRecipient = () => {
        const data = {
            name: name,
            familyNames: familyNames,
            phone: phone,
            countryCode: countryCode,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            countryId: countryId,
            stateId: stateId,
            cityName: cityName,
            nickName: nickName,
            relationship: relationship,
            intendedUseFounds: intendedUseFounds
        };
        return data;
    }

    const saveRecipient = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const recipient: any = buildRecipient();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/recipients`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
                //'X-Client-Headers': `{"Cookie":"${Cookie}","Remote Address":"
            };
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "POST",
                bodyRequest: recipient,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            router.push(`/recipient`);
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

    const getCountries = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries`;
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
            setCountries(response.data.filter((x: any) => x.idCountry !== "USA"));
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

    const getRelationships = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/recipients/relationships`;
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
            setRelationships(response.data);
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

    const getPurposeFunds = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/wire-purpose`;
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
            setPurposeFunds(response.data);
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

    const getLocation = async () => {
        if (!locationValue) {
            return
        }
        if (!locationStatus) setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/master/location?countryId=${countryId}&filterValue=${locationValue}`;
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
            setLocation(response.data);
        }
        catch (e : any) {
            console.log(e);
            if (e.response?.data) {
                alert(typeof e.response?.data === "object" ? JSON.stringify(e.response?.data) : e.response?.data)
            }
            else alert("An error has occurred, check the logs");
        }
        if (!locationStatus) setLoader(false);
    }

    return (
        <Layout>
            <Box style={{ width: "90%", margin: "25px auto" }}>
                <Box style={{ textAlign: "center", display: "flex" }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => router.push("/recipient")}
                    >
                        <ArrowBackIcon />
                    </IconButton> <Typography variant="h3">New Recipient</Typography>
                </Box>

                <Box style={{ width: "90%", margin: "15px auto", display: "flex", justifyContent: "space-between" }}>
                    <Button id={"getCountries"} variant="contained" onClick={async () => await getCountries()}>1. Get Countries</Button>
                    <Button id={"getRelationships"} variant="contained" onClick={async () => await getRelationships()}>2. Get Relationships</Button>
                    <Button id={"getPurposeFunds"} variant="contained" onClick={async () => await getPurposeFunds()}>2. Get Purpose of funds</Button>
                    <Button id={"getLocation"} variant="contained" onClick={async () => await getLocation()}>3. Location</Button>
                </Box>

                <Divider style={{ margin: "20px" }} />

                <Box style={{ width: "100%", margin: "0px auto" }}>
                    <Box style={{ width: "100%", margin: "auto" }}>
                        <form autoComplete='false'>
                            <FormGroup row={true}>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="name">Given Names</InputLabel>
                                    <Input
                                        id="name"
                                        value={name}
                                        autoComplete="off"
                                        onChange={(e: any) => setName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="familyNames">Family Names</InputLabel>
                                    <Input
                                        id="familyNames"
                                        value={familyNames}
                                        autoComplete="nope"
                                        onChange={(e: any) => setFamilyNames(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="phone">Phone</InputLabel>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        autoComplete="nope"
                                        onChange={(e: any) => setPhone(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="countryCode">Country Code</InputLabel>
                                    <Input
                                        id="countryCode"
                                        autoComplete="nope"
                                        value={countryCode}
                                        onChange={(e: any) => setCountryCode(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="addressLine1">Address 1</InputLabel>
                                    <Input
                                        id="addressLine1"
                                        autoComplete="nope"
                                        value={addressLine1}
                                        onChange={(e: any) => setAddressLine1(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="addressLine2">Address 2</InputLabel>
                                    <Input
                                        id="addressLine2"
                                        value={addressLine2}
                                        autoComplete="nope"
                                        onChange={(e: any) => setAddressLine2(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="countryId">Country ID</InputLabel>
                                    <Select
                                        labelId="formLabel"
                                        variant="standard"
                                        id="formLabel"
                                        onChange={(e) => setCountryId(e.target.value)}
                                        label={"Country ID"}
                                        value={countryId}
                                        fullWidth
                                    >
                                        {countries.map((c: any) => <MenuItem value={c.idCountry}>{`${c.nameCountry}`}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <Box style={{ display: "flex" }}>
                                        <FormControlLabel
                                            value="Auto"
                                            control={<Checkbox onClick={(e: any) => setLocationStatus(e.target.checked)} checked={locationStatus} />}
                                            label="Auto"
                                            labelPlacement="bottom"
                                        />
                                        <Autocomplete

                                            autoHighlight
                                            style={{ border: "1px solid #FFF" }}
                                            onChange={(event, newValue) => {
                                                if (newValue) {
                                                    setLocationValue("");
                                                    setCityName(newValue.cityName);
                                                    setStateId(newValue.stateId);
                                                    setCountryId(newValue.countryId);
                                                }
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                                if (event.type === "change") {
                                                    setLocationValue(newInputValue);
                                                }
                                                if (locationStatus) getLocation();
                                            }}
                                            id="combo-box-demo"
                                            options={location}
                                            getOptionLabel={(option: any) => `${option.cityName} - ${option.stateName}`}
                                            sx={{ width: 350 }}
                                            renderOption={(props, option) => (
                                                <Typography variant="body1" {...props}>
                                                    {`${option.cityName} - ${option.stateName} - ${option.countryName}`}
                                                </Typography>
                                            )}
                                            filterOptions={(options) => options}
                                            renderInput={(params) => <form autoComplete='false'>
                                                <TextField variant="standard" autoComplete="nope" {...params} label={locationValue || "City - State"} />
                                            </form>}
                                        />
                                    </Box>
                                </FormControl>
                                <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="nickName">Nick Name</InputLabel>
                                    <Input
                                        id="nickName"
                                        value={nickName}
                                        autoComplete="nope"
                                        onChange={(e: any) => setNickName(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="relationship">Relationship</InputLabel>
                                    <Select
                                        labelId="relationship"
                                        variant="standard"
                                        id="relationship"
                                        onChange={(e) => setRelationship(e.target.value)}
                                        label={"relationship"}
                                        value={relationship}
                                        fullWidth
                                    >
                                        {relationships.map((r: any) => <MenuItem value={r.relationshipId}>{`${r.translations.en}`}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                                    <InputLabel htmlFor="intendedUseFounds">Intended Use Founds</InputLabel>
                                    <Select
                                        labelId="intendedUseFounds"
                                        variant="standard"
                                        id="intendedUseFounds"
                                        onChange={(e) => setIntendedUseFounds(e.target.value)}
                                        label={"intendedUseFounds"}
                                        value={intendedUseFounds}
                                        fullWidth
                                    >
                                        {purposeFunds.map((r: any) => <MenuItem value={r.kycPurposeType}>{`${r.kycPurposeDescription}`}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </FormGroup>
                            <Button variant="contained" onClick={saveRecipient}>Create recipient</Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}

export default CreateForm;