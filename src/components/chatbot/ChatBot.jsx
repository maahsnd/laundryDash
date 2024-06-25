import React, { useState, useEffect } from "react";

const Chatbot = ({ places }) => {
  const [summary, setSummary] = useState("");
  const APIKEY = import.meta.env.VITE_OPENAIKEY;

  useEffect(() => {
    summarizePlaces(places).then(setSummary).catch(console.error);
  }, [places]);

  console.log(places);

  const summarizePlaces = async (places) => {
    if (!places || places.length === 0) return "No places found.";

    // Generate a description of the places to send to the AI
    const placesDescription = places
      .map(
        (place) =>
          `Place: ${place.displayName.text}, Rating: ${
            place.rating
          }, Distance: ${Number.parseFloat(place.distanceFromUser).toFixed(
            1
          )} miles away, Open now: ${
            place.currentOpeningHours.openNow
          }, Weekly hours: ${place.currentOpeningHours.weekdayDescriptions}`
      )
      .join(". ");

    const prompt = `Summarize these places by selecting three: 1. the best overall option based on rating and proximity,
    2. the closest option, and 3. the best rated option.  The best overall option must be open now. Answer in this format:
    '
    1. The best overall option (based on rating, proximity, and hours) is ... which is ... miles away, has a rating of..., and is open...  hours .
    2. The closest option is ... which is ... miles away, has a rating of..., and is open...  hours .
    3. The best rated option is ...which is ... miles away, has a rating of..., and is open...  hours  '
     ${placesDescription}.`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIKEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "system",
            content:
              "You are a personal assistant, helping the user find the best laundry service near them.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("data:  ", data.choices[0].message.content);
    return data.choices[0].message.content;
  };

  return (
    <div>
      <p>{summary}</p>
    </div>
  );
};

export default Chatbot;
