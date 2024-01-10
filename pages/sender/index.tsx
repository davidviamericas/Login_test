import { Box, Button, Divider, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import axios from "axios";
import { use, useEffect, useState } from "react"
import Layout from "../../components/layout";

import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import useLoader from "../../common/Loader/hook";
import { useSearchParams } from "next/navigation";


const SenderUpdate = () => {
    const { getEnv, getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const [givenNames, setGivenNames] = useState<any>("");
    const [familyNames, setFamilyNames] = useState<any>("");
    const [phone, setPhone] = useState<any>("");
    const [phoneCountryCode, setPhoneCountryCode] = useState<any>("1");
    const [employerPhoneNumber, setEmployerPhoneNumber] = useState<any>("");
    const [employerPNCountryCode, setEmployerPNCountryCode] = useState<any>("1");
    const [birthDate, setBirthDate] = useState<any>("");
    const [addressLine1, setAddressLine1] = useState<any>("");
    const [stateId, setStateId] = useState<any>("");
    const [cityName, setCityName] = useState<any>("");
    const [countryId, setCountryId] = useState<any>("");
    const [zipCode, setZipCode] = useState<any>("");
    const [employer, setEmployer] = useState<any>("");
    const [industry, setIndustry] = useState<any>("");
    const [idIndustry, setIdIndustry] = useState<any>("");
    const [occupation, setOccupation] = useState<any>("");
    const [idJob, setIdJob] = useState<any>("");
    const [originFounds, setOriginFounds] = useState<any>("");
    const [ssnNumber, setSsnNumber] = useState<any>("");

    const [sender, setSender] = useState<any>();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [industries, setIndustries] = useState<any[]>([]);
    const [occupations, setOccupations] = useState<any[]>([]);
    const [fundsOrigin, setFundsOrigin] = useState<any[]>([]);

    const { setLoader } = useLoader();

    const searchParams = useSearchParams();
    const envValue = getEnv();

    useEffect(() => {
        if (sender) {
            buildSender();
        }
    }, [sender]);

    useEffect(() => {
        getOccupations(idIndustry);
    }, [idIndustry, industries]);

    const buildSender = async () => {
        setGivenNames(`${sender.firstName} ${sender.secondName}`);
        setFamilyNames(`${sender.lastName} ${sender.secondLastName}`);
        setPhone(sender.phone1);
        setPhoneCountryCode(sender.phone1CountryCode);
        setEmployerPhoneNumber(sender.employerPhoneNumber);
        setEmployerPNCountryCode(sender.employerPNCountryCode);
        setBirthDate(sender.dob);
        setAddressLine1(sender.address);
        setStateId(sender.stateId);
        setCityName(sender.cityName);
        setCountryId(sender.countryId);
        setZipCode(sender.zipCode);
        setEmployer(sender.employer);
        setIndustry(sender.industry);
        setIdIndustry(sender.idIndustry);
        setOccupation(sender.occupation);
        setIdJob(sender.idJob);
        setOriginFounds(sender.originFounds);
        setSsnNumber(sender.ssnNumber);
    }

    const getSender = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,

            }
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setSender(response.data);
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

    const updateSender = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/update-2`;
            const body = {
                givenNames: givenNames,
                familyNames: familyNames,
                phone: phone,
                phoneCountryCode: phoneCountryCode,
                employerPhoneNumber: employerPhoneNumber,
                employerPNCountryCode: employerPNCountryCode,
                birthDate: birthDate,
                addressLine1: addressLine1,
                stateId: stateId,
                cityName: cityName,
                countryId: countryId,
                zipCode: zipCode,
                employer: employer,
                industry: industry,
                idIndustry: idIndustry,
                occupation: occupation,
                idJob: idJob,
                originFounds: originFounds,
                ssnNumber: ssnNumber
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
            const response = await AxiosMonitor({
                urlApi: url,
                method: "PUT",
                bodyRequest: body,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);

            alert('Updated successfully');
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
            setCountries(response.data.filter((x: any) => x.idCountry === "USA"));
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
        if (!zipCode) {
            alert("zipCode is required");
            return;
        }
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/master/zipcodes/${zipCode}`;
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
            let dataLocation = response.data;
            let resultStates: any = [];
            let resultCities: any = [];

            for (let item of dataLocation) {
                if (!resultCities.some((city: any) => city.CityAliasName === item.CityAliasName)) {
                    resultCities.push({ CityAliasName: item.CityAliasName });
                }
                if (!resultStates.some((state: any) => state.State === item.State)) {
                    resultStates.push({ State: item.State, StateFullName: item.StateFullName });
                }
            }
            setStates(resultStates);
            setCities(resultCities);
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

    const getIndustries = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/industry`;
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
            setIndustries(response.data);
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

    const getOccupations = (industryId: string) => {
        const industry = industries.find((x: any) => x.id === industryId);
        if (industry) {
            setOccupations(industry.jobs);
        }
    }

    const getFundsOrigin = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/funds-origin`;
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
            setFundsOrigin(response.data);
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
            <Box style={{ width: "90%", margin: "25px auto" }}>
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">Sender Update</Typography>

                    <Divider style={{ margin: "20px" }} />

                    <Typography variant="h6">Zipcodes de ejemplos: 12345, 58079</Typography>
                    <Box style={{ width: "90%", margin: "auto", display: "flex", justifyContent: "space-between" }}>
                        <Button id={"getCountries"} variant="contained" onClick={async () => await getCountries()}>1. Get Countries</Button>
                        <Button id={"getIndustries"} variant="contained" onClick={async () => await getIndustries()}>2. Get Industries</Button>
                        <Button id={"getSender"} variant="contained" onClick={async () => await getSender()}>3. Get Sender</Button>
                        <Button id={"getLocation"} variant="contained" onClick={async () => await getLocation()}>4. Get Location</Button>
                        <Button id={"getFundsOrigin"} variant="contained" onClick={async () => await getFundsOrigin()}>5. Get Funds Origin</Button>
                    </Box>
                </Box>

                <Divider style={{ margin: "20px" }} />
                <Box style={{ width: "90%", margin: "auto" }}>
                    <FormGroup row={true}>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="givenNames">Given Names</InputLabel>
                            <Input
                                id="givenNames"
                                value={givenNames}
                                onChange={(e: any) => setGivenNames(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="familyNames">Family Names</InputLabel>
                            <Input
                                id="familyNames"
                                value={familyNames}
                                onChange={(e: any) => setFamilyNames(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="phone">Phone</InputLabel>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="phoneCountryCode">Phone Country Code</InputLabel>
                            <Input
                                id="phoneCountryCode"
                                value={phoneCountryCode}
                                onChange={(e: any) => setPhoneCountryCode(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="employerPhoneNumber">Employer Phone Number</InputLabel>
                            <Input
                                id="employerPhoneNumber"
                                value={employerPhoneNumber}
                                onChange={(e: any) => setEmployerPhoneNumber(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="employerPNCountryCode">Employer Phone Number Country Code</InputLabel>
                            <Input
                                id="employerPNCountryCode"
                                value={employerPNCountryCode}
                                onChange={(e: any) => setEmployerPNCountryCode(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="birthDate">Birth Date</InputLabel>
                            <Input
                                id="birthDate"
                                value={birthDate}
                                onChange={(e: any) => setBirthDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="addressLine1">Address Line 1</InputLabel>
                            <Input
                                id="addressLine1"
                                value={addressLine1}
                                onChange={(e: any) => setAddressLine1(e.target.value)}
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
                                {countries.map(f => <MenuItem value={f.idCountry}>{`${f.nameCountry}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="zipCode">Zip Code</InputLabel>
                            <Input
                                id="zipCode"
                                value={zipCode}
                                onChange={(e: any) => setZipCode(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="stateId">State</InputLabel>
                            <Select
                                labelId="stateId"
                                variant="standard"
                                id="stateId"
                                onChange={(e) => setStateId(e.target.value)}
                                label={"State"}
                                value={stateId}
                                fullWidth
                            >
                                {states.map(f => <MenuItem value={f.State}>{`${f.StateFullName}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="cityName">City Name</InputLabel>
                            <Select
                                labelId="cityName"
                                variant="standard"
                                id="cityName"
                                onChange={(e) => setCityName(e.target.value)}
                                label={"State"}
                                value={cityName}
                                fullWidth
                            >
                                {cities.map(f => <MenuItem value={f.CityAliasName}>{`${f.CityAliasName}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="employer">Employer</InputLabel>
                            <Input
                                id="employer"
                                value={employer}
                                onChange={(e: any) => setEmployer(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="industry">Industry</InputLabel>
                            <Select
                                labelId="industry"
                                variant="standard"
                                id="industry"
                                onChange={(e) => {
                                    const industry = industries.find((x: any) => x.id === e.target.value);
                                    setIndustry(industry.industryName);
                                    setIdIndustry(industry.id);
                                }}
                                label={"industry"}
                                value={idIndustry}
                                fullWidth
                            >
                                {industries.map(f => <MenuItem value={f.id}>{`${f.industryName}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="occupation">Occupation</InputLabel>
                            <Select
                                labelId="occupation"
                                variant="standard"
                                id="occupation"
                                onChange={(e) => {
                                    const occupation = occupations.find((x: any) => x.idjob === e.target.value);
                                    setOccupation(occupation.job);
                                    setIdJob(occupation.idjob);
                                }}
                                label={"occupation"}
                                value={idJob}
                                fullWidth
                            >
                                {occupations.map(f => <MenuItem value={f.idjob}>{`${f.job}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="originFounds">Origin Founds</InputLabel>
                            <Select
                                labelId="originFounds"
                                variant="standard"
                                id="originFounds"
                                onChange={(e) => setOriginFounds(e.target.value)}
                                label={"originFounds"}
                                value={originFounds}
                                fullWidth
                            >
                                {fundsOrigin.map(f => <MenuItem value={f.originDescription}>{`${f.originDescription}`}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "31%" }}>
                            <InputLabel htmlFor="ssnNumber">SSN Number</InputLabel>
                            <Input
                                id="ssnNumber"
                                value={ssnNumber}
                                onChange={(e: any) => setSsnNumber(e.target.value)}
                            />
                        </FormControl>
                    </FormGroup>
                    <Button variant="contained" onClick={updateSender}>Update Sender</Button>
                </Box>
            </Box>
        </Layout>
    )
}

export default SenderUpdate;