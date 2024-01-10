import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Drawer, Typography } from "@mui/material";
import React, { useEffect } from "react";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { interceptorProps } from "../../common/types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Monitor = () => {

    const [resizing, setResizing] = React.useState(false);
    const [drawerWidth, setDrawerWidth] = React.useState(40);
    const [open, setOpen] = React.useState(false);
    const { getInterceptor, clear, deleteInterceptor, getOpenInterceptor, setOpenInterceptor } = useAxiosInterceptor();

    useEffect(() => {
        const isOpen : boolean = getOpenInterceptor();
        setOpen(isOpen);
    });

    const syntaxHighlight = (json: any) => (
        <pre>{JSON.stringify(json, null, 2)}</pre>
    );

    const handleMouseDown = () => {
        setResizing(true);
    };

    const handleMouseUp = () => {
        setResizing(false);
    };

    const handleMouseMove = (event: any) => {
        if (resizing) {
            const newWidth = Math.max(20, Math.min(event.clientX / window.innerWidth * 100, 100));
            setDrawerWidth(newWidth);
        }
    };

    return (<>
        <Box sx={{
            display: 'flex',
            position: 'relative',
            cursor: resizing ? 'col-resize' : 'default',
        }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            {open && <Drawer variant="persistent" open={open} sx={{
                width: `${drawerWidth}vw`,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: `${drawerWidth}vw`, boxSizing: 'border-box', padding: "15px", },
            }}>
                <Typography variant="h4">Requests Monitor</Typography>
                <Button variant="contained" onClick={clear}>Clear</Button>
                <Divider style={{ margin: "20px 10px" }} />
                {getInterceptor().map((event: interceptorProps, index: number) => (
                    <Accordion key={index} style={{ margin: "10px 0px", background: "#ECEBC4", padding: "10px", borderRadius: "10px", width: "auto", display: "relative" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography style={{ fontWeight: "bold" }}>{`${event.URL.split('/').slice(3, event.URL.split('/').length).join('/')} (${event.method} - ${event.code})`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6">headers: </Typography>
                                <Button variant="text" onClick={() => deleteInterceptor(event.key)}>Delete</Button>
                            </Box>
                            <Box>
                                <Typography variant="body1">{syntaxHighlight(event.headers)}</Typography>
                            </Box>
                            <Typography variant="h6">body: </Typography>
                            <Box>
                                <Typography variant="body1">{syntaxHighlight(event.bodyRequest)}</Typography>
                            </Box>
                            <Typography variant="h6">response ({event.code}): </Typography>
                            <Box>
                                <Typography variant="body1">{syntaxHighlight(event.bodyResponse)}</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Drawer>}
            <Button variant="contained" onClick={() => setOpenInterceptor(!open)}>Logs</Button>
            <div
                style={{
                    width: '5px',
                    height: '100%',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    cursor: 'col-resize',
                    backgroundColor: resizing ? 'lightgray' : 'transparent',
                }}
                onMouseDown={handleMouseDown}
            />
        </Box>

    </>);
}

export default Monitor;