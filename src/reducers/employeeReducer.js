import {
    SAVE_AUTHORIZATION_DATA,
    CHANGE_FIRST_LOGIN_STATUS,
    LOGOUT,
    UPDATE_ACTIVITY_STATUS

} from '../types';

const initialState = {
    employee: {},
    accessToken: ''
}

const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_AUTHORIZATION_DATA: return {
            ...state,
            employee: action.payload.employee,
            accessToken: action.payload.token,

        }
        case CHANGE_FIRST_LOGIN_STATUS: return {
            ...state,
            employee: {
                ...state.employee,
                firstLogin: false,
                pincode: action.payload
            }
        }
        case UPDATE_ACTIVITY_STATUS: return {
            ...state,
            employee: {
                ...state.employee,
                status: action.payload
            }
        }
        case LOGOUT: return {
            ...state,
            accessToken: '',
            employee: {}
        }

        default: return state
    }
}

export default employeeReducer;