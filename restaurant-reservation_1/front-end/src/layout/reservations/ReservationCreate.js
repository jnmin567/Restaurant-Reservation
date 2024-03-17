import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../ErrorAlert";

function ReservationCreate({ date }) {

  const history = useHistory();
  const [error, setError] = useState(null);

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date,
    reservation_time: "",
    people: "1",
  })

  //Change Handler
  const handleChange = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.value,
    });
  }

  //Submit Handler
  function handleSubmit(event) {
    event.preventDefault();
    createReservation({
      ...reservation,
      people: Number(reservation.people),
    })
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
  }

  return (
    <>
      <ErrorAlert error={error} />
      <ReservationForm 
        submitHandler={handleSubmit} 
        handleChange={handleChange} 
        reservation={reservation} 
        error={error}
      />
    </>
  );
}

export default ReservationCreate;