import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import "moment/dist/locale/ar";
moment.locale("ar");

export default function MainContent() {
  // States

  const [timings, setTimings] = useState({
    Fajr: "04:55",
    Dhuhr: "12:57",
    Asr: "16:33",
    Sunset: "19:27",
    Isha: "20:49",
  });

  const [selectedCtiy, setSelectedCity] = useState({
    displayName: "القاهره",
    apiName: "Cairo",
  });

  const [today, setToday] = useState("");




  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

  const [remainingTime , setReamainingTime] = useState('')

  // End States
  const aviableCities = [
    {
      displayName: "القاهره",
      apiName: "Cairo",
    },
    { displayName: "القليوبيه", apiName: "Qalyubia" },
    { displayName: "الاسكندريه", apiName: "Alexandria" },
  ];



    const prayersArray = [
      { key: "Fajr", displayName: "الفجر" },
      { key: "Dhuhr", displayName: "الظهر" },
      { key: "Asr", displayName: "العصر" },
      { key: "Sunset", displayName: "المغرب" },
      { key: "Isha", displayName: "العشاء" },
    ];

  const getTimings = async () => {
    console.log("calling the api");
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${selectedCtiy.apiName}&country=Egypt`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [selectedCtiy]);

  useEffect(() => {
    let interval = setInterval(() => {
      
      setUpCountDownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]); // [] mean that u gona call it one time

  const setUpCountDownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      // nextPrayer = 'Dhuhr';
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);

    //  now after knowing what the next prayer is , we can setup the countdown timer by getting ther prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidNightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidNightDiff;
      remainingTime = totalDiffernce;
    }

    

    const durationRemainingTime = moment.duration(remainingTime);

    setReamainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()} `
    );

    // const Isha = timings["Isha"];
    // const IshaMoment = moment(Isha, "hh:mm"); // translate Isha to object
  };

  const handleCityChange = (event) => {
    const cityObject = aviableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log(event.target.value);
    setSelectedCity(cityObject);
  };

  return (
    <>
      {/* top Row */}
      <Grid container style={{}}>
        <Grid xs={6}>
          <div>
            <h2> {today}</h2>
            <h1>{selectedCtiy.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2> متبقي علي صلاه {prayersArray[nextPrayerIndex].displayName}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/* == Top Row === */}
      <Divider style={{ borderColor: "white", opacity: ".1" }} />
      {/* PRAYERS CARDS  */}
      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name="الفجر"
          time={timings.Fajr}
          image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
        />
        <Prayer
          name="ألظهر"
          time={timings.Dhuhr}
          image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
        />
        <Prayer
          name="العصر"
          time={timings.Asr}
          image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
        />
        <Prayer
          name="المغرب"
          time={timings.Sunset}
          image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
        />
        <Prayer
          name="العشاء"
          time={timings.Isha}
          image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
        />
      </Stack>
      {/* select city */}
      <Stack
        direction="row"
        justifyContent="center"
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
          >
            {aviableCities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {/* select city */}
    </>
  );
}
