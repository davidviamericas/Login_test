
'use client';

import { Box, Button, FormControl, FormGroup, Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import useLoader from "../../common/Loader/hook";
import userInfo from "../../common/stores/user_info";
import { userInfoProps } from "../../common/types";
import AxiosMonitor from "../../components/axios_monitor";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { useTransactionContext } from "./context";
import NumberInput from "../../components/NumberInput";

const AdditionalFields = (props: any) => {
    const { envValue } = props;
    const {
        countryId,
        payer,
        additionalFields,
        setAdditionalFields
    } = useTransactionContext();

    const [fields, setFields] = useState<any[] | null>(null);

    useEffect(() => {
        if (fields && fields.length > 0) {
            buildAdditionalFields();
        }
    }, [fields]);

    const { setLoader } = useLoader();
    const { getUserInfo } = userInfo();
    const { setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    const getPayerRules = async () => {
        setLoader(true);
        try {
            const data: userInfoProps = getUserInfo();
            const url = `https://${envValue || 'uat'}-vianex.viamericas.io/v2/catalogs/${data.chainId}/countries/${countryId}/deliver-methods/${payer.deliveryMode}/payers-rules`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            };
            const response: any = await AxiosMonitor({
                urlApi: url,
                method: "GET",
                bodyRequest: null,
                headers: headers,
            }, setInterceptor, updateInterceptor, getOpenInterceptor, setOpenInterceptor);
            setFields(response.data);
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

    const handleAdditionalField = (entity: string, fieldName: string, fieldLabel: string, value: any) => {
        if (additionalFields.find((field: any) => field.field === fieldName)) {
            const index = additionalFields.findIndex((field: any) => field.field === fieldName);
            const newAdditionalFields = [...additionalFields];
            newAdditionalFields[index].value = value;
            setAdditionalFields(newAdditionalFields);
        }
    }

    const buildAdditionalFields = () => {
        const newAdditionalFields: any = fields?.map((field: any) => {
            return {
                entity: field.entity,
                field: field.fieldName,
                fieldLabel: field.fieldLabel,
                value: null
            }
        });
        setAdditionalFields(newAdditionalFields);
    }

    return (
        <Box>
            <Box style={{ width: "100%", margin: "20px auto", display: "flex", justifyContent: "space-between" }}>
                <Button id={"getPayerRules"} variant="contained" onClick={async () => await getPayerRules()}>7. Additional Fields</Button>
            </Box>
            {fields?.length === 0 && <Typography variant="h6">No hay campos adicionales</Typography>}
            <form autoComplete='false'>
                <FormGroup row={true}>
                    {fields?.map((rule: any, index: number) => {
                        return (
                            <FormControl variant="standard" style={{ margin: "10px 1%", width: "48%" }}>
                                {
                                    rule.fieldType === "number" ? (<NumberInput
                                        id={rule.fieldName}
                                        aria-label={rule.fieldName}
                                        placeholder={rule.fieldName}
                                        onChange={(event, val) => handleAdditionalField(rule.entity, rule.fieldName, rule.fieldLabel, val)}
                                    />) : (<TextField
                                        id={rule.fieldName}
                                        type={rule.fieldType}
                                        variant="standard"
                                        label={rule.fieldName}
                                        InputProps={{
                                            onChange: (event: any) => {
                                                handleAdditionalField(rule.entity, rule.fieldName, rule.fieldLabel, event.target.value)
                                            }
                                        }}
                                    />)
                                }
                            </FormControl>
                        )
                    })}
                </FormGroup>
            </form>
        </Box>
    )
}

export default AdditionalFields;