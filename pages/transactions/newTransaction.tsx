'use client';

import { Box, Button, Divider, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, Typography } from "@mui/material"
import axios from "axios";
import { Fragment, use, useEffect, useState } from "react"
import Layout from "../../components/layout";

import { useSearchParams } from "next/navigation";
import { Provider } from './context';
import GeneralInformation from "./generalInformation";
import Actions from "./actions";
import AdditionalFields from "./additionalFields";
import CalculateCost from "./calculateCost";
import TransactionValidation from "./transactionValidation";
import userInfo from "../../common/stores/user_info";

const steps = ['General Information', 'Additional fields', 'Calculate cost', 'Transaction validation', 'Transaction Add'];

const NewTransaction = () => {
    const { getEnv } = userInfo();

    const [activeStep, setActiveStep] = useState(0);


    const searchParams = useSearchParams();
    const envValue = getEnv();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Layout>
            <Box style={{ width: "90%", margin: "25px auto" }}>
                <Box style={{ textAlign: "center" }}>
                    <Typography variant="h3">New Transaction</Typography>

                    <Divider style={{ margin: "20px" }} />
                </Box>

                <Box style={{ width: "100%", margin: "auto" }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={label} >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <Fragment>
                            <Typography style={{ margin: "20px" }}>
                                The transacction can be send it
                            </Typography>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Provider>
                                <>
                                    {activeStep === 0 && <GeneralInformation envValue={envValue} />}
                                    {activeStep === 1 && <AdditionalFields envValue={envValue} />}
                                    {activeStep === 2 && <CalculateCost envValue={envValue} />}
                                    {activeStep === 3 && <TransactionValidation envValue={envValue} />}
                                    {activeStep === 4 && <Typography>Now you can submit the transaction.</Typography>}
                                    <Actions activeStep={activeStep} steps={steps} handleBack={handleBack} handleNext={handleNext} envValue={envValue} />
                                </>
                            </Provider>
                        </Fragment>
                    )}
                </Box>
            </Box>
        </Layout>
    )
}

export default NewTransaction;