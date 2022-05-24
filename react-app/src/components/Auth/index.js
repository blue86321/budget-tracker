import { Navigate } from "react-router-dom";
import { getLocalToken } from "utils";

function Auth({ children }) {
    
    const token = getLocalToken()

    if (token) {
        // token exists, show children component
        return <>{children}</>
    } else {
        // not exist, go to login page
        return <Navigate to='/login' replace></Navigate>
    }
}

export { Auth }