import React, { useState, useEffect } from "react";

const Chatbot = ({ places }) => {
  const [summary, setSummary] = useState("");
  const APIKEY = import.meta.env.VITE_OPENAIKEY;
  console.log(APIKEY);

  useEffect(() => {
    summarizePlaces(places).then(setSummary).catch(console.error);
  }, [places]);

  const summarizePlaces = async (places) => {
    if (!places || places.length === 0) return "No places found.";

    // Generate a description of the places to send to the AI
    const placesDescription = places
      .map(
        (place) =>
          `Place: ${place.name}, Rating: ${place.rating}, Distance: ${
            place.distance
          } meters, Status: ${place.isOpen ? "Open" : "Closed"}`
      )
      .join(". ");

    const prompt = `Summarize these places: ${placesDescription}. Highlight the best overall option based on rating and proximity, the closest place, and the best rated place.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIKEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        prompt: prompt,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
  };

  return (
    <div>
      <h1>Summary of Places</h1>
      <p>{summary}</p>
    </div>
  );
};

export default Chatbot;
