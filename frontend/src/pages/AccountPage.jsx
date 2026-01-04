import Login from "../components/Login";
import Register from "../components/Register";
import { setToken as saveToken } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AccountPage({ setToken }) {
    const navigate = useNavigate();
    const [ registerMessage, setRegisterMessage ] = useState("");
    const [loginFailed, setLoginFaield] = useState("");
    

    function handleLogin(token) {
        if(token){
        saveToken(token);
        setToken(token);
        navigate("/tasks");}
        else{
            setLoginFaield("Invalid Credantials");
        }
    }


    function handleRegister(data) {

        setRegisterMessage(data.message)
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "50px",
                padding: "50px",
                flexWrap: "wrap",
            }}
        >
            <div style={{ flex: 1, minWidth: "300px", borderRight: "1px dashed" }}>

                <Login onLogin={handleLogin} />
                <p style={{color: "#ff0000ff"}}>{loginFailed}</p>
            </div>

            <div style={{ flex: 1, minWidth: "300px" }}>

                <Register onRegister={handleRegister} />
                <p>{registerMessage}</p>
            </div>
        </div>
    );
}

export default AccountPage;
