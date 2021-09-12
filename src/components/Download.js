import React, { useState, useEffect, useRef } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const dataSet1 = [
  {
      namn: "Johson",
      löneartsnamn: "semester",
      från: '2021-08-01',
      till: '2021-08-02',
      antal: "16"
  },
  {
      namn: "Monika",
      löneartsnamn: "vab",
      från: '2021-08-02',
      till: '2021-08-03',
      antal: "16"
  }
];

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

export function Download({ backendUrl }) {
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
      <ExcelFile>
                <ExcelSheet data={dataSet1} name="Employees">
                    <ExcelColumn label="Namn" value="namn"/>
                    <ExcelColumn label="Löneartsnamn" value="löneartsnamn"/>
                    <ExcelColumn label="Från datum" value="från"/>
                    <ExcelColumn label="Till datum" value="till"/>
                    <ExcelColumn label="Antal" value="antal"/>
                </ExcelSheet>
            </ExcelFile>
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
