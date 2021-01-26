export const fetchCall = async (url, options) => {

    let response = null;
    let error = null;
    let status = null;

    try {
        const res = await fetch(url, options);
        status = res.status
        const json = await res.json();


        if (json.errors) {
            error = json.errors
        } else {
            response = json
        }

    } catch (err) {
        error = err
    }

    return { response, error, status };
};

export const authenticateAccessToken = () => {

    if (sessionStorage.getItem("accessToken")) {
        return sessionStorage.getItem("accessToken");
    }
    return false;

};

export const format = (time) => {
    // Hours, minutes and seconds
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
    if (hrs > 0) {
        ret += `  ${hrs}hr   ${(mins < 10 ? "0" : "")} min`;
    }
    ret += ` ${mins} min `;
    ret += ` ${secs} sec`;
    return ret;
}

