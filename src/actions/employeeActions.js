import {
    SAVE_AUTHORIZATION_DATA,
    CHANGE_FIRST_LOGIN_STATUS,
    LOGOUT,
    UPDATE_ACTIVITY_STATUS

} from '../types';
import { updatePincode, empLogout, punchIn, punchOut } from '../apiCalls'


export const saveEmployeeData = (data) => {
    return {
        type: SAVE_AUTHORIZATION_DATA,
        payload: data
    }
}

export const changeFirstLoginStatus = (pin) => {
    return {
        type: CHANGE_FIRST_LOGIN_STATUS,
        payload: pin
    }
}
export const changeActivityStatus = (status) => {
    return {
        type: UPDATE_ACTIVITY_STATUS,
        payload: status
    }
}

export const updatePin = (pincode) => {
    return async (dispatch, getState) => {
        const state = await getState();
        const { accessToken } = state;
        const response = await updatePincode(pincode, accessToken);
        dispatch(changeFirstLoginStatus(pincode));

    }
}

export const employeeLogout = () => {
    return {
        type: LOGOUT
    }
}

export const removeAccessToken = () => {
    return async (dispatch, getState) => {
        const state = await getState();
        const { accessToken } = state;
        const response = await empLogout(accessToken);
        dispatch(employeeLogout);
    }
}



// export const employeePunchin=()=>{
//     return async(dispatch,getState)=>{
//         const state=await getState();
//         const {accessToken}=state;
//         await punchIn(accessToken);
//     }
// }



