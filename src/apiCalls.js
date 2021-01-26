import { fetchCall } from './utils';
import { config } from './config'

const baseUrl = config.baseUrl;

export const login = async (employeeid, pincode, userType) => {

    let url = `${baseUrl}/api/auth/emplogin`
    if (userType === "admin") {
        url = `${baseUrl}/api/auth/adminlogin`
    }
    const employeeData = await fetchCall(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            employeeid,
            pincode
        })
    })

    return employeeData
}

export const empLogout = async (accessToken) => {
    const data = await fetchCall(`${baseUrl}/api/auth/emplogout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },
    });
    return data.status
}

export const fetchEmployeeData = async (accessToken) => {

    const data = await fetchCall(`${baseUrl}/api/auth/empData`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },

    });

    return data;

}

export const updatePincode = async (pincode, accessToken) => {

    const status = await fetchCall(`${baseUrl}/api/emp/updatePincode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },
        body: JSON.stringify({
            pincode
        })

    });

    return status
}

export const punchIn = async (accessToken) => {

    const response = await fetchCall(`${baseUrl}/api/emp/employeePunchIn`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },

    });

    return response
}

export const punchOut = async (workingHours, accessToken) => {
    const response = await fetchCall(`${baseUrl}/api/emp/employeePunchOut`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },
        body: JSON.stringify({
            workingHours
        })

    });

    return response

}

export const getEmployeeDayRecord = async (accessToken) => {
    const response = await fetchCall(`${baseUrl}/api/emp/employeeDayRecord`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        }
    })

    return response
}

export const getEmployeeAllRecord = async (accessToken) => {
    const response = await fetchCall(`${baseUrl}/api/emp/employeeAllRecords`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        }
    })

    return response
}

export const updateActivityStatus = async (status, accessToken) => {
    const response = await fetchCall(`${baseUrl}/api/emp/activityStatus`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },
        body: JSON.stringify({
            status
        })
    })

    return response
}

export const onLeave = async (accessToken) => {
    const response = await fetchCall(`${baseUrl}/api/emp/onleave`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": accessToken
        },

    });
    return response;
}

export const allEmployeesData = async () => {
    const response = await fetchCall(`${baseUrl}/api/emp/allEmployees`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },

    });
    return response;
}

export const updateEmployeeInfo = async (employeeid, firstname, lastname, department, role, status) => {
    const response = await fetchCall(`${baseUrl}/api/emp/updateEmployeeData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeid,
            firstname,
            lastname,
            department,
            role,
            status
        })

    })
    return response;
}

export const deleteEmployeeInfo = async (employeeid) => {
    const response = await fetchCall(`${baseUrl}/api/emp/deleteEmplyeeData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeid,
        })

    })
    return response;
}


export const addEmployee = async (employeeid, firstname, lastname, role, department) => {
    const response = await fetchCall(`${baseUrl}/api/emp/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeid,
            firstname,
            lastname,
            role,
            department
        })

    })
    return response;
}

export const employeesHistory = async () => {
    const response = await fetchCall(`${baseUrl}/api/emp/allHistory`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },

    })
    return response;
}

export const singleEmployeeHistory = async (employeeid) => {
    const response = await fetchCall(`${baseUrl}/api/emp/employeeHistory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            employeeid,

        })

    })
    return response;
}
