import React, { useState } from "react";

const Chatbot = ({ places }) => {
  const [userQuery, setUserQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const summary = await summarizePlaces(places);
      const response = await fetch(
        "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAIKEY}`,
          },
          body: JSON.stringify({
            prompt: `${summary}\n\nUser: ${userQuery}\nAI:`,
            max_tokens: 150,
          }),
        }
      );
      const data = await response.json();
      console.log(data);

      setResponses((oldResponses) => [
        ...oldResponses,
        { query: userQuery, response: data.choices[0].text.trim() },
      ]);
      setUserQuery("");
    } catch (error) {
      console.error("Error handling the chat:", error);
    }
    setLoading(false);
  };

  const summarizePlaces = async (places) => {
    if (!places || places.length === 0) return "No places found.";

    // Generate a description of the places to send to the AI
    const placesDescription = places
      .map(
        (place) =>
          `Place: ${place.displayName.text}, Rating: ${
            place.rating
          }, Distance: ${place.distanceFromUser} meters, Status: ${
            place.isOpen ? "Open" : "Closed"
          }`
      )
      .join(". ");

    const prompt = `Summarize these places: ${placesDescription}. Highlight the best overall option based on rating and proximity, the closest place, and the best rated place.`;

    const response = await fetch(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAIKEY}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 200,
        }),
      }
    );
    const data = await response.json();

    return data.choices[0].text.trim();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userQuery}
          onChange={handleInputChange}
          placeholder="Ask me something..."
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
      <div>
        {responses.map((resp, index) => (
          <div key={index}>
            <strong>User:</strong> {resp.query}
            <br />
            <strong>AI:</strong> {resp.response}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
