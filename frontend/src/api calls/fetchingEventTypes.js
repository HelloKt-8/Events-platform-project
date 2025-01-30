import axios from 'axios'

const getEventTypes = (event_type, event_id) => {
    let queryStr = "https://events-platform-project-z29t.onrender.com/api/events"

    if(event_type){queryStr += `?event_type=${event_type}`}
    if(event_id){queryStr += `?event_id=${event_id}`}

    return axios.get(queryStr).then((response) => {return response.data.events}).catch((err) => {console.log("error from getEventTypes")})
}

export {getEventTypes}