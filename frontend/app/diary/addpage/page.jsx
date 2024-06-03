// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import ChatModal from "@/components/chatModal";
// import axios from "axios";
// import Emotion from "@/components/Emotion";

// // Custom Scrollable Text Area Component
// const ScrollableTextArea = ({ text }) => {
//   return (
//     <div className="left-0">
//       <div className="scrollable-text-area">
//         <p>{text}</p>
//       </div>
//     </div>
//   );
// };

// export default function BasicDemo() {
//   const [text, setText] = useState(() => {
//     const savedText = localStorage.getItem("savedText") || "";
//     return savedText.split("\n");
//   });
//   const [recognizing, setRecognizing] = useState(false);
//   const [infoMessage, setInfoMessage] = useState("Click and start speaking.");
//   const [emotion, setEmotion] = useState(null);
//   const interimText = useRef("");
//   const recognition = useRef(null);
//   const [isComponentMounted, setIsComponentMounted] = useState(false);

//   function exportText() {
//     const savedText = localStorage.getItem("savedText");

//     const data = {
//       title: "some title",
//       description: "some desc with new text",
//       text: savedText,
//       user: "Ashutosh",
//     };

//     axios
//       .post("https://voivevibeai.co/store_data", data)
//       .then((res) => {
//         console.log("Server response:", res.data);
//       })
//       .catch((error) => {
//         console.error("There was an error storing the data!", error);
//       });

//     // Make another API call after 2 seconds
//     setTimeout(() => {
//       axios
//         .post("https://voivevibeai.co/predict_sentiment", {
//           user: "Ashutosh",
//           title: "some title",
//         })
//         .then((response) => {
//           const emotion = response.data.emotion;
//           setEmotion(emotion);
//         })
//         .catch((error) => {
//           console.error("There was an error predicting the sentiment!", error);
//         });
//     }, 2000);
//   }

//   useEffect(() => {
//     setIsComponentMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window)) {
//       setInfoMessage(
//         "Web Speech API is not supported by this browser. Upgrade to Chrome version 25 or later."
//       );
//     } else {
//       recognition.current = new window.webkitSpeechRecognition();
//       recognition.current.continuous = true;
//       recognition.current.interimResults = true;

//       recognition.current.onstart = () => {
//         setRecognizing(true);
//         setInfoMessage("Speak now.");
//         interimText.current = ""; // Clear interim text on start
//       };

//       recognition.current.onerror = (event) => {
//         if (event.error === "no-speech") {
//           setInfoMessage(
//             "No speech was detected. You may need to adjust your microphone settings."
//           );
//         } else if (event.error === "audio-capture") {
//           setInfoMessage(
//             "No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly."
//           );
//         } else if (event.error === "not-allowed") {
//           setInfoMessage("Permission to use microphone was denied.");
//         }
//       };

//       recognition.current.onend = () => {
//         setRecognizing(false);
//         setInfoMessage("Click Start to start speaking."); // Update info message
//       };

//       recognition.current.onresult = (event) => {
//         let finalText = "";
//         const newLines = []; // Store final text lines

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalText += event.results[i][0].transcript;
//             newLines.push(finalText); // Add final text as a new line
//             finalText = ""; // Reset for next final result
//           } else {
//             interimText.current += event.results[i][0].transcript;
//           }
//         }

//         // Conditionally update interim text here (prevents server-side rendering errors)
//         if (isComponentMounted) {
//           const interimTextElement = document.getElementById("interim-text");
//           if (interimTextElement) {
//             interimTextElement.textContent = interimText.current;
//           }
//         }

//         // Update text state and local storage with final lines
//         setText((prevText) => [...prevText, ...newLines]);
//         localStorage.setItem("savedText", text.join("\n"));
//       };
//     }
//   }, [text]); // Update effect on text changes (for potential edge cases)

//   const startRecognition = () => {
//     if (recognizing) {
//       recognition.current.stop();
//       return;
//     }
//     recognition.current.lang = "en-US"; // You can set the language dynamically as needed
//     recognition.current.start();
//     setInfoMessage('Click the "Allow" button above to enable your microphone.');
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
//       <section className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-3xl">
//         <h2 className="text-2xl font-bold text-center dark:text-white">
//           Title Here
//         </h2>

//         <div className="flex justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             onClick={startRecognition}
//           >
//             {recognizing ? " Stop Recording" : "️ Start Recording"}
//           </button>
//           <div className="text-center mt-4 text-gray-600 dark:text-gray-300">
//             {infoMessage}
//           </div>
//           <ChatModal title={"‍Ask AI!"} />
//         </div>

//         <div className="mb-2">
//           <div className="w-full overflow-x-auto whitespace-nowrap">
//             <div className="h-8 flex items-center">
//               <span className="text-base dark:text-white">
//                 {isComponentMounted && (
//                   <ScrollableTextArea
//                     id="interim-text"
//                     text={interimText.current}
//                   />
//                 )}
//               </span>
//             </div>
//           </div>

//           <ReactQuill
//             className="pt-2"
//             value={text.join("\n")} // Join text array into string with newlines
//             onChange={(value) => {
//               setText(value.split("\n"));
//               localStorage.setItem("savedText", value);
//               exportText();
//             }}
//             style={{ height: "250px" }}
//             defaultValue={"Start speaking..."}
//           />
//         </div>
//         <br />
//         <div>{emotion && <Emotion emotions={[emotion]} />}</div>
//       </section>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ChatModal from "@/components/chatModal";
import axios from "axios";
import Emotion from "@/components/Emotion";
import { useSearchParams } from "next/navigation";

import { user } from "@nextui-org/react";

// Custom Scrollable Text Area Component
const ScrollableTextArea = ({ text }) => {
  return (
    <div className="left-0">
      <div className="scrollable-text-area">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default function BasicDemo() {
  const searchParams = useSearchParams();
  // extract the username and title from the query
  const username = searchParams.get("username");
  const title = searchParams.get("title");

  console.log("Username:", username);
  console.log("Title:", title);

  const [text, setText] = useState(() => {
    const savedText = localStorage.getItem(username) || "";
    return savedText.split("\n");
  });

  const [recognizing, setRecognizing] = useState(false);
  const [infoMessage, setInfoMessage] = useState("Click and start speaking.");
  const [emotion, setEmotion] = useState(null);
  const interimText = useRef("");
  const recognition = useRef(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  // console.log("Username:", username);
  // console.log("Title:", title);

  function exportText() {
    const savedText = localStorage.getItem(username);

    const data = {
      title: title,
      description: "some desc with new text",
      text: savedText,
      user: username,
    };
    console.log("Data:", data);

    axios
      .post("https://voivevibeai.co/store_data", data)
      .then((res) => {
        console.log("Server response:", res.data);
      })
      .catch((error) => {
        console.error("There was an error storing the data!", error);
      });

    // Make another API call after 2 seconds
    setTimeout(() => {
      axios
        .post("https://voivevibeai.co/predict_sentiment", {
          user: username,
          title: title,
        })
        .then((response) => {
          const emotion = response.data.emotion;
          setEmotion(emotion);
        })
        .catch((error) => {
          console.error("There was an error predicting the sentiment!", error);
        });
    }, 2000);
  }

  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setInfoMessage(
        "Web Speech API is not supported by this browser. Upgrade to Chrome version 25 or later."
      );
    } else {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onstart = () => {
        setRecognizing(true);
        setInfoMessage("Speak now.");
        interimText.current = ""; // Clear interim text on start
      };

      recognition.current.onerror = (event) => {
        if (event.error === "no-speech") {
          setInfoMessage(
            "No speech was detected. You may need to adjust your microphone settings."
          );
        } else if (event.error === "audio-capture") {
          setInfoMessage(
            "No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly."
          );
        } else if (event.error === "not-allowed") {
          setInfoMessage("Permission to use microphone was denied.");
        }
      };

      recognition.current.onend = () => {
        setRecognizing(false);
        setInfoMessage("Click Start to start speaking."); // Update info message
      };

      recognition.current.onresult = (event) => {
        let finalText = "";
        const newLines = []; // Store final text lines

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
            newLines.push(finalText); // Add final text as a new line
            finalText = ""; // Reset for next final result
          } else {
            interimText.current += event.results[i][0].transcript;
          }
        }

        // Update interim text for real-time display (conditional rendering)
        if (document.getElementById("interim-text")) {
          document.getElementById("interim-text").textContent =
            interimText.current;
          // Clear interim text after rendering
          interimText.current = "";
        }

        // Update text state and local storage with final lines
        setText((prevText) => [...prevText, ...newLines]);
        localStorage.setItem(username, text.join("\n"));
      };
    }
  }, [text, username]); // Update effect on text changes (for potential edge cases)

  const startRecognition = () => {
    if (recognizing) {
      recognition.current.stop();
      return;
    }
    recognition.current.lang = "en-US"; // You can set the language dynamically as needed
    recognition.current.start();
    setInfoMessage('Click the "Allow" button above to enable your microphone.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <section className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center dark:text-white">
          {title}
        </h2>

        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={startRecognition}
          >
            {recognizing ? "🛑 Stop Recording" : "🎙️ Start Recording"}
          </button>
          <div className="text-center mt-4 text-gray-600 dark:text-gray-300">
            {infoMessage}
          </div>
          <ChatModal title={title} user={username} />
        </div>

        <div className="mb-2">
          <div className="w-full overflow-x-auto whitespace-nowrap">
            <div className="h-8 flex items-center">
              <span className="text-base dark:text-white">
                {isComponentMounted && (
                  <ScrollableTextArea
                    id="interim-text"
                    text={interimText.current}
                  />
                )}{" "}
              </span>
            </div>
          </div>

          <ReactQuill
            className="pt-2"
            value={text.join("\n")} // Join text array into string with newlines
            onChange={(value) => {
              setText(value.split("\n"));
              localStorage.setItem(username, value);
              exportText();
            }}
            style={{ height: "250px" }}
            defaultValue={"Start speaking..."}
          />
        </div>
        <br />
        <div>{emotion && <Emotion emotions={[emotion]} />}</div>
      </section>
    </div>
  );  
}
