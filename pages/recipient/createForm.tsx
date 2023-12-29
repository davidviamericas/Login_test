import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormGroup, IconButton, Input, InputLabel, Typography } from "@mui/material"
import axios from "axios";
import { use, useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';

const CreateForm = (props: any) => {
    const { updateEvent, open, setOpen } = props;
    const [name, setName] = useState<any>("");
    const [familyNames, setFamilyNames] = useState<any>("");
    const [phone, setPhone] = useState<any>("");
    const [countryCode, setCountryCode] = useState<any>("+57");
    const [addressLine1, setAddressLine1] = useState<any>("");
    const [addressLine2, setAddressLine2] = useState<any>("");
    const [countryId, setCountryId] = useState<any>("COL");
    const [stateId, setStateId] = useState<any>("ANT");
    const [cityName, setCityName] = useState<any>("MEDELLIN");
    const [nickName, setNickName] = useState<any>("");
    const [relationship, setRelationship] = useState<any>("Brother");
    const [intendedUseFounds, setIntendedUseFounds] = useState<any>("E");

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
        try {
            const data: any = JSON.parse(localStorage.getItem("data") || "{}");
            const recipient: any = buildRecipient();
            const url = `https://qa-vianex.viamericas.io/${data.chainId}/senders/${data.UUID}/recipients`;
            const response = await axios.post(url, recipient, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`,
                    //'X-Client-Headers': `{"Cookie":"${Cookie}","Remote Address":"
                }
            });
            console.log("response");
            console.log(JSON.stringify(response));
            if (response.data.status === "success") {
                updateEvent(response.data.uid);
                setOpen(false);
            }
        }
        catch (e) {
            console.log(e);
            alert("ha ocurrido un error, revisa la consola");
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                New Recipient
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

            <DialogContent dividers>
                <Box style={{ width: "100%", margin: "0px auto" }}>
                    <Box style={{ width: "90%", margin: "auto" }}>
                        <FormGroup row={true}>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="name">Given Names</InputLabel>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e: any) => setName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="familyNames">Family Names</InputLabel>
                                <Input
                                    id="familyNames"
                                    value={familyNames}
                                    onChange={(e: any) => setFamilyNames(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="phone">Phone</InputLabel>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e: any) => setPhone(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="countryCode">Country Code</InputLabel>
                                <Input
                                    id="countryCode"
                                    value={countryCode}
                                    onChange={(e: any) => setCountryCode(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="addressLine1">Address 1</InputLabel>
                                <Input
                                    id="addressLine1"
                                    value={addressLine1}
                                    onChange={(e: any) => setAddressLine1(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="addressLine2">Address 2</InputLabel>
                                <Input
                                    id="addressLine2"
                                    value={addressLine2}
                                    onChange={(e: any) => setAddressLine2(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="countryId">Country ID</InputLabel>
                                <Input
                                    id="countryId"
                                    value={countryId}
                                    onChange={(e: any) => setCountryId(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="stateId">State ID</InputLabel>
                                <Input
                                    id="stateId"
                                    value={stateId}
                                    onChange={(e: any) => setStateId(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="cityName">City Name</InputLabel>
                                <Input
                                    id="cityName"
                                    value={cityName}
                                    onChange={(e: any) => setCityName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="nickName">Nick Name</InputLabel>
                                <Input
                                    id="nickName"
                                    value={nickName}
                                    onChange={(e: any) => setNickName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="relationship">Relationship</InputLabel>
                                <Input
                                    id="relationship"
                                    value={relationship}
                                    onChange={(e: any) => setRelationship(e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                <InputLabel htmlFor="intendedUseFounds">Intended Use Founds</InputLabel>
                                <Input
                                    id="intendedUseFounds"
                                    value={intendedUseFounds}
                                    onChange={(e: any) => setIntendedUseFounds(e.target.value)}
                                />
                            </FormControl>
                        </FormGroup>
                        <Button variant="contained" onClick={saveRecipient}>Create recipient</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CreateForm;