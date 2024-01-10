import { Box, MenuItem, Select, Typography } from "@mui/material";
import userInfo from "../../common/stores/user_info";


const EnvComponent = () => {
    const { setEnv, getEnv } = userInfo();

    return (
        <Box style={{top: "10px", right: "50px", position: "absolute", width: "100px", display: "flex", alignItems: "center"}}>
            <Typography variant="subtitle1" style={{marginRight: "10px"}}>Env: </Typography>
            <Select
                labelId="env"
                variant="outlined"
                id="env"
                onChange={(e) => setEnv(e.target.value)}
                label={"Env"}
                value={getEnv()}
                fullWidth
            >
                <MenuItem value="dev">DEV</MenuItem>
                <MenuItem value="qa">QA</MenuItem>
                <MenuItem value="uat">UAT</MenuItem>
                <MenuItem value="stg">STG</MenuItem>
            </Select>
        </Box>
    )
}

export default EnvComponent;