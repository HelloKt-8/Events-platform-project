import React from "react";
import Header from "../Components/Header";
import LondonBanner from "../Components/LondonBanner";
import Categories from "../Components/Categories";
import EventType from "../Components/eventType";

function HomePage(){
    return(
        <div>
            <Header />
            <LondonBanner />
            <Categories />
            <EventType />

            
        </div>
    )
}

export default HomePage;
