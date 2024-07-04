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

    const proximityList = [...places].sort(
      (a, b) => a.distanceFromUser - b.distanceFromUser
    );

    const ratingList = [...places].sort((a, b) => b.rating - a.rating);

    const rankedPlaces = places
      .map((place) => {
        const indexA = proximityList.indexOf(place);
        const indexB = ratingList.indexOf(place);
        const averageIndex = (indexA + indexB) / 2;
        return { place, averageIndex };
      })
      .filter((item) => item.place.currentOpeningHours.openNow)
      .sort((a, b) => a.averageIndex - b.averageIndex);

    const overallList = rankedPlaces.map((item) => item.place);

    const prepareSummary = (place) => {
      const distance = Number.parseFloat(place.distanceFromUser).toFixed(1);
      return `Place: ${place.displayName.text}, Rating: ${place.rating}, Distance: ${distance} miles away, Open now: ${place.currentOpeningHours.openNow}, 
    Weekly hours: ${place.currentOpeningHours.weekdayDescriptions};`;
    };

    const summariesProximity = proximityList.map(prepareSummary);
    const summariesRating = ratingList.map(prepareSummary);
    const summariesOverall = overallList.map(prepareSummary);

    if (!places || places.length === 0) return ["No places found."];

    const prompt = `
    Answer in the following format, and separate each service with ||:
    'The best overall option is ... which is ... miles away, has a rating of..., and (is or is not) open now.
    || The closest option is ... which is ... miles away, has a rating of..., and (is or is not) open now.
    || The best rated option is ... which is ... miles away, has a rating of..., and (is or is not) open now'
    Use these for your intial selections: closest places: ${summariesProximity}. Best rated places ${summariesRating}. Best overall: ${summariesOverall}. `;

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
      <div className={styles.gradientBorder} id={styles.gradientBorderBox}>
        <button
          onClick={handleToggleVisibility}
          className={styles.toggleButton}
        >
          Summarize Results with AI
        </button>
      </div>

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
