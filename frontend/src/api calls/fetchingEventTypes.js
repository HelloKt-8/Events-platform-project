import axios from 'axios';

const getEventTypes = (event_type, event_id) => {
    let queryStr = "https://events-platform-project-z29t.onrender.com/api/events";
    
    const params = [];
    
    if (event_type) {
        params.push(`event_type=${event_type}`);
    }
    if (event_id) {
        params.push(`event_id=${event_id}`);
    }
    
    if (params.length > 0) {
        queryStr += "?" + params.join("&");
    }

    return axios.get(queryStr)
        .then((response) => { return response.data.events })
        .catch((err) => { console.log("error from getEventTypes", err) });
};

export { getEventTypes };
