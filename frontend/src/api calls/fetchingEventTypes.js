import axios from 'axios'

const getEventTypes = (event_type) => {
    let queryStr = "https://events-platform-project-z29t.onrender.com/api/events"

    if(event_type){queryStr += `?event_type=${event_type}`}

    return axios.get(queryStr).then((response) => {return response.data.events}).catch((err) => {console.log("error from getEventTypes")})
}

export {getEventTypes}