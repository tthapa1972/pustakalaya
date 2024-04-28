import { Redirect } from "react-router-dom";
import { useOktaAuth} from "@okta/okta-react";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = ({ config }) => {
    const {oktaAuth, authState} = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onErr = (err) => {
        console.log("Sign in err", err);
    }

    if(!authState){
        return(
            <SpinnerLoading/>
        );
    }

    return authState.isAuthenticated ? 
     <Redirect to = {{ pathname: '/' }}/>
     :
     <OktaSignInWidget config={config} onSucess={onSuccess} onErr={onErr}/>
}

export default LoginWidget;