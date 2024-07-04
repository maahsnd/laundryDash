import styles from "./chatbot.module.css";
import React, { useState, useEffect } from "react";

const Chatbot = ({ places }) => {
  const [summary, setSummary] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const APIKEY = import.meta.env.VITE_OPENAIKEY;

  useEffect(() => {
    summarizePlaces(places).then(setSummary).catch(console.error);
  }, [places]);

  const summarizePlaces = async (places) => {
    if (!places || places.length === 0) return ["No places found."];

    const placesDescription = places
      .map((place) => {
        const distance = Number.parseFloat(place.distanceFromUser).toFixed(1);
        return `Place: ${place.displayName.text}, Rating: ${place.rating}, Distance: ${distance} miles away, Open now: ${place.currentOpeningHours.openNow}, Weekly hours: ${place.currentOpeningHours.weekdayDescriptions}`;
      })
      .join(". ");

    const overallBestSubPrompt =
      "sorting based on proximity, sorting based on rating, combining the two sorts by averaging those ratings, then returning the highest average";

    const placesJSON = JSON.stringify(places);

    const prompt = `Select: 1. the best overall option by ${overallBestSubPrompt}
    2. the closest option, and 3. the highest rated option. The best overall option must be open now. Answer in this format:
    'The best overall option is ... which is ... miles away, has a rating of..., and is open...  hours .
    || The closest option is ... which is ... miles away, has a rating of..., and is open...  hours .
    || The best rated option is ...which is ... miles away, has a rating of..., and is open...  hours.'
    Use this for your intial selections: ${placesDescription}. `;

    console.log(prompt);

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
    return data.choices[0].message.content.split("||");
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    fetchResponse(userInput, newMessages);
    setUserInput("");
  };

  const fetchResponse = async (userInput, context) => {
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
            content: `You are a virtual assistant specialized in providing information about laundry services based on the previously summarized places. Please limit your responses to the information provided about these places, unless explicitly necessary to go beyond it. Summarized places are: ${summary.join(
              ", "
            )}. If you are asked for specific information you do not have, politely direct them to use Laundry Dash's map and list features below`,
          },
          ...context.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: userInput },
        ],
      }),
    });

    const data = await response.json();
    setMessages([
      ...context,
      { role: "system", content: data.choices[0].message.content },
    ]);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleToggleVisibility} className={styles.toggleButton}>
        AI Summary
      </button>
      {isVisible && (
        <div className={styles.internalWrap}>
          {summary.length > 0 && (
            <ul>
              {summary.map((statement, index) => (
                <li key={index} className={styles.summaryItem}>
                  {statement}
                </li>
              ))}
            </ul>
          )}
          <div>
            {messages.length > 0 && (
              <div className={styles.chatBox}>
                {messages.map((msg, index) => (
                  <p
                    key={index}
                    className={
                      msg.role === "user" ? styles.userMsg : styles.aiMsg
                    }
                  >
                    {msg.content}
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={handleMessageSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Questions? Ask me!"
                className={styles.inputField}
              />
              <button type="submit" className={styles.sendButton}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
