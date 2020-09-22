import React, { useState, useEffect, useRef } from "react";
import Datetime from "react-datetime";
import moment from "moment";

const filterNonWorkdays = (reportedData, holidayDays) => {
  return reportedData.filter((r) => {
    const eventDate = new Date(r.event_date);
    if (eventDate.getUTCDay() >= 6) {
      // Is weekend
      return false;
    }

    if (holidayDays.includes(r.event_date)) {
      // Is public holiday
      return false;
    }

    return true;
  });
};

const loadData = async (backendUrl, date, setUsers) => {
  if (!date) return;
  const startDate = `${date}-01`;
  const endDate = `${date}-31`;
  const [names, locks, workdays] = await Promise.all([
    fetch(`${backendUrl}/users`).then((r) => r.json()),
    fetch(`${backendUrl}/locks/dates/${date}`).then((r) => r.json()),
    fetch(`https://api2.codelabs.se/${date}.json`).then((r) => r.json()),
  ]);

  const holidayDays = workdays.helgdagar.map((h) => h.datum);

  for (let id in names) {
    setTimeout(async () => {
      const reportedData = await fetch(
        `${backendUrl}/users/${id}/events?from=${encodeURIComponent(
          startDate
        )}&to=${encodeURIComponent(endDate)}`
      ).then((r) => r.json());

      const reports = filterNonWorkdays(reportedData, holidayDays);
      const isLocked = locks.some((l) => l.user_id === id);

      setUsers((prevState) => {
        return prevState.concat([
          { name: names[id], id: id, isLocked, reports },
        ]);
      });
    }, 0);
  }
};

export function Summary({ backendUrl }) {
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM"));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUsers([]);
    loadData(backendUrl, date, setUsers);
  }, [date]);

  const summaryRef = useRef();

  const handleDateChange = (p) => {
    const selectedMonth = moment.unix(p / 1000).format("YYYY-MM");
    setDate(selectedMonth);
  };

  const onCopy = (e) => {
    navigator.clipboard
      .writeText(summaryRef.current.innerText)
      .then(() => {
        setCopied(() => true);
        setTimeout(() => setCopied(() => false), 1000);
      })
      .catch(() => alert("Failed to copy!"));
  };

  return (
    <div className="summary-container">
      <Datetime
        dateFormat="YYYY-MM"
        utc={true}
        closeOnSelect={true}
        timeFormat={false}
        value={date}
        onChange={handleDateChange}
      />

      <button className="summary-copy" onClick={onCopy}>
        Copy
      </button>
      {copied ? <span style={{ color: "red" }}>Copied.</span> : null}

      <div ref={summaryRef} className="summary-users">
        {users.map((u) => User(u))}
      </div>
    </div>
  );
}

function User({ id, name, isLocked, reports }) {
  return (
    <div key={id} className="summary-user">
      {name}
      {isLocked ? "" : " - NOT LOCKED"}
      {reports.map((r) => Report(r))}
    </div>
  );
}

function Report({ event_date, reason }) {
  return (
    <div key={event_date}>
      {event_date} - {reason}
    </div>
  );
}
