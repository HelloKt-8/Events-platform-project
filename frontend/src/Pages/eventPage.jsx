import React from "react";
import Header from "../Components/Header";

function EventPage() {
  return (
    <div>
      <Header />
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FLondon&showPrint=0&src=a2F0aWVsdWM4QGdtYWlsLmNvbQ&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=Y2IwaWhkcm1kZ2ZydXVlcWE1am00YjVpMnNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=YjBiMGVjY2Q0NTY5YTM1MGQ1NmM2NzE2MDRmODJmN2YxMDY5ZWZmM2EyYTU0MWQ0YWE0NGQyMzZhMWMxMjU0NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23F6BF26&color=%2333B679&color=%23E67C73&color=%239E69AF&color=%230B8043"
        className="calender"
      ></iframe>
    </div>
  );
}

export default EventPage;
