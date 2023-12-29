import { Box, Button, Divider, FormControl, FormGroup, Input, InputLabel, Typography } from "@mui/material"
import axios from "axios";
import { use, useEffect, useState } from "react"
import Layout from "../../components/layout";


const SenderUpdate = () => {
    const [givenNames, setGivenNames] = useState<any>("");
    const [familyNames, setFamilyNames] = useState<any>("");
    const [phone, setPhone] = useState<any>("");
    const [phoneCountryCode, setPhoneCountryCode] = useState<any>("");
    const [employerPhoneNumber, setEmployerPhoneNumber] = useState<any>("");
    const [employerPNCountryCode, setEmployerPNCountryCode] = useState<any>("");
    const [birthDate, setBirthDate] = useState<any>("");
    const [addressLine1, setAddressLine1] = useState<any>("");
    const [stateId, setStateId] = useState<any>("AL");
    const [cityName, setCityName] = useState<any>("ABERNANT");
    const [countryId, setCountryId] = useState<any>("USA");
    const [zipCode, setZipCode] = useState<any>("12345");
    const [employer, setEmployer] = useState<any>("");
    const [industry, setIndustry] = useState<any>("SERVICIOS/OPERACIONES");
    const [idIndustry, setIdIndustry] = useState<any>("5");
    const [occupation, setOccupation] = useState<any>("AGENTE");
    const [idJob, setIdJob] = useState<any>("81");
    const [originFounds, setOriginFounds] = useState<any>("SAVINGS");
    const [ssnNumber, setSsnNumber] = useState<any>("");
    const [countryIssuerId, setCountryIssuerId] = useState<any>("USA");
    const [documentNumber, setDocumentNumber] = useState<any>("");
    const [documentType, setDocumentType] = useState<any>("DL");
    const [expirationDate, setExpirationDate] = useState<any>("2032-05-02T12:00:00.000");
    const [stateIssuerId, setStateIssuerId] = useState<any>("FL");

    const [sender, setSender] = useState<any>();
    const [oneTime, _] = useState<any>(true);

    useEffect(() => {
        if (sender) {
            buildSender();
        }
    }, [sender]);

    useEffect(() => {
        getSender();
    }, [oneTime]);

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
        setCountryIssuerId(sender.countryIssuerId);
        setDocumentNumber(sender.documentNumber);
        setDocumentType(sender.documentType);
        setExpirationDate(sender.expirationDate);
        setStateIssuerId(sender.stateIssuerId);
    }

    const getSender = async () => {
        try {
            const data: any = JSON.parse(localStorage.getItem("data") || "{}");
            const url = `https://qa-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`,
                    //'X-Client-Headers': `{"Cookie":"${Cookie}","Remote Address":"
                }
            });
            console.log("response");
            console.log(JSON.stringify(response));
            setSender(response.data);
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    }

    const updateSender = async () => {
        try {
            const data: any = JSON.parse(localStorage.getItem("data") || "{}");
            const url = `https://qa-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/update-2`;
            const response = await axios.put(url, {
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
                ssnNumber: ssnNumber,
                countryIssuerId: countryIssuerId,
                documentNumber: documentNumber,
                documentType: documentType,
                expirationDate: expirationDate,
                stateIssuerId: stateIssuerId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`,
                    //'X-Client-Headers': `{"Cookie":"${Cookie}","Remote Address":"190.27.142.70, 130.176.214.237","User-Agent":"PostmanRuntime/7.29.2"}`,
                    //withCredentials: true
                },
                //withCredentials: true
            });
            console.log("response");
            console.log(JSON.stringify(response));
            alert(`Response => ${JSON.stringify(response)}`);
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    }

    return (
        <Layout>
            <Box style={{ width: "90%", margin: "25px auto" }}>
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">Sender Update</Typography>

                    <Divider style={{ margin: "20px" }} />

                    <Typography variant="h4">Personal Information</Typography>
                </Box>

                <Divider style={{ margin: "20px" }} />
                <Box style={{ width: "90%", margin: "auto" }}>
                    <FormGroup row={true}>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="givenNames">Given Names</InputLabel>
                            <Input
                                id="givenNames"
                                value={givenNames}
                                onChange={(e: any) => setGivenNames(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="familyNames">Family Names</InputLabel>
                            <Input
                                id="familyNames"
                                value={familyNames}
                                onChange={(e: any) => setFamilyNames(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="phone">Phone</InputLabel>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="phoneCountryCode">Phone Country Code</InputLabel>
                            <Input
                                id="phoneCountryCode"
                                value={phoneCountryCode}
                                onChange={(e: any) => setPhoneCountryCode(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="employerPhoneNumber">Employer Phone Number</InputLabel>
                            <Input
                                id="employerPhoneNumber"
                                value={employerPhoneNumber}
                                onChange={(e: any) => setEmployerPhoneNumber(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="employerPNCountryCode">Employer Phone Number Country Code</InputLabel>
                            <Input
                                id="employerPNCountryCode"
                                value={employerPNCountryCode}
                                onChange={(e: any) => setEmployerPNCountryCode(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="birthDate">Birth Date</InputLabel>
                            <Input
                                id="birthDate"
                                value={birthDate}
                                onChange={(e: any) => setBirthDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="addressLine1">Address Line 1</InputLabel>
                            <Input
                                id="addressLine1"
                                value={addressLine1}
                                onChange={(e: any) => setAddressLine1(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="stateId">State ID</InputLabel>
                            <Input
                                id="stateId"
                                value={stateId}
                                onChange={(e: any) => setStateId(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="cityName">City Name</InputLabel>
                            <Input
                                id="cityName"
                                value={cityName}
                                onChange={(e: any) => setCityName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="countryId">Country ID</InputLabel>
                            <Input
                                id="countryId"
                                value={countryId}
                                onChange={(e: any) => setCountryId(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="zipCode">Zip Code</InputLabel>
                            <Input
                                id="zipCode"
                                value={zipCode}
                                onChange={(e: any) => setZipCode(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="employer">Employer</InputLabel>
                            <Input
                                id="employer"
                                value={employer}
                                onChange={(e: any) => setEmployer(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="industry">Industry</InputLabel>
                            <Input
                                id="industry"
                                value={industry}
                                onChange={(e: any) => setIndustry(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="idIndustry">ID Industry</InputLabel>
                            <Input
                                id="idIndustry"
                                value={idIndustry}
                                onChange={(e: any) => setIdIndustry(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="occupation">Occupation</InputLabel>
                            <Input
                                id="occupation"
                                value={occupation}
                                onChange={(e: any) => setOccupation(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="idJob">ID Job</InputLabel>
                            <Input
                                id="idJob"
                                value={idJob}
                                onChange={(e: any) => setIdJob(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="originFounds">Origin Founds</InputLabel>
                            <Input
                                id="originFounds"
                                value={originFounds}
                                onChange={(e: any) => setOriginFounds(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="ssnNumber">SSN Number</InputLabel>
                            <Input
                                id="ssnNumber"
                                value={ssnNumber}
                                onChange={(e: any) => setSsnNumber(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="countryIssuerId">Country Issuer ID</InputLabel>
                            <Input
                                id="countryIssuerId"
                                value={countryIssuerId}
                                onChange={(e: any) => setCountryIssuerId(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="documentNumber">Document Number</InputLabel>
                            <Input
                                id="documentNumber"
                                value={documentNumber}
                                onChange={(e: any) => setDocumentNumber(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="documentType">Document Type</InputLabel>
                            <Input
                                id="documentType"
                                value={documentType}
                                onChange={(e: any) => setDocumentType(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="expirationDate">Expiration Date</InputLabel>
                            <Input
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e: any) => setExpirationDate(e.target.value)}
                            />
                        </FormControl>
                        <FormControl variant="outlined" style={{ margin: "10px 1%", width: "18%" }}>
                            <InputLabel htmlFor="stateIssuerId">State Issuer ID</InputLabel>
                            <Input
                                id="stateIssuerId"
                                value={stateIssuerId}
                                onChange={(e: any) => setStateIssuerId(e.target.value)}
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