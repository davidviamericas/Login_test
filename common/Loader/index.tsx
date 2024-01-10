import { useState } from "react";
//import "./Loader.css"
import useLoader from "./hook";

const Loader = () => {
    const { getLoader } = useLoader();

    return (
        <>
            {getLoader().open && <div className="lds-ring loader" style={{backgroundColor: getLoader().background}}>
                <div></div>
                <div></div>
            </div>}
        </>
    );
}

export default Loader;
