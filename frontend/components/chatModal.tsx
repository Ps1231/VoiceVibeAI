"use client";

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { ChatWindow } from "@/components/chat/ChatWindow";
// import Header from "@/components/chat/Header";
// import ChatInput from "@/components/chat/ChatInput";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   useDisclosure,
// } from "@nextui-org/react";

// type Role = "user" | "ai";
// interface ChatProps {
//   role: Role;
//   message: string;
//   id: string;
// }

// export default function Chat({ title }: { title: string }) {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState<ChatProps[]>([]);
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState<string>();
//   const [endpoint, setEndpoint] = useState<string>();
//   const [isEdit, setEdit] = useState(true);
//   const chatWindowRef = useRef<HTMLDivElement>(null);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(undefined);
//     addToAnswers("user", question);
//     setQuestion("");

//     try {
//       const { data } = await axios.post("/api/chatbot", { question, endpoint });
//       addToAnswers("ai", data);
//     } catch (error) {
//       setError("There was an error fetching the response.");
//       console.error("Error fetching from API:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToAnswers = (role: Role, message: string) => {
//     setAnswer((prevState) => [
//       ...prevState,
//       { role, message, id: prevState.length.toString() },
//     ]);
//   };

//   const onEditToggle = () => setEdit(!isEdit);
//   const onEndpointChange = (value: string) => {
//     setEndpoint(value);
//   };

//   useEffect(() => {
//     document.querySelector("input")?.focus();
//   }, []);

//   return (
//     <>
//       <button
//         onClick={onOpen}
//         className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//       >
//         👩‍🦰 Ask AI
//       </button>
//       <Modal
//         isOpen={isOpen}
//         onOpenChange={onOpenChange}
//         isDismissable={false}
//         isKeyboardDismissDisabled={true}
//         className="w-full h-full max-w-3xl bg-gradient-to-bl from-red-200 via-red-200 to-yellow-200" // Apply Tailwind classes for fixed width and height
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
//               <ModalBody className="flex flex-col mx-auto pt-[40px]">
//                 {/* <Header
//           endpoint={endpoint}
//           isEdit={isEdit}
//           onEndpointChange={onEndpointChange}
//           onEditToggle={onEditToggle}
//         /> */}
//                 <ChatWindow
//                   messages={answer}
//                   isLoading={isLoading}
//                   error={error}
//                   chatWindowRef={chatWindowRef}
//                 />
//                 <ChatInput
//                   question={question}
//                   isLoading={isLoading}
//                   onInputChange={(e) => setQuestion(e.target.value)}
//                   onSubmit={handleSubmit}
//                 />
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="danger" variant="light" onPress={onClose}>
//                   Close
//                 </Button>
//                 <Button color="primary" onPress={onClose}>
//                   Action
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const socket = io("https://voivevibeai.co");

export default function Chat({ title }: { title: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(
    JSON.parse(localStorage.getItem("chat") || "[]")
  );

  useEffect(() => {
    const handlePongEvent = (data: { data: any; }) => {
      console.log("received pong: ", data);
      setChat((prevChat: any) => [
        ...prevChat,
        { sender: "server", message: data.data },
      ]);
    };

    socket.on("pongEvent", handlePongEvent);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("pongEvent", handlePongEvent);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat));
  }, [chat]);

  const sendMessage = () => {
    socket.emit("pingEvent", { data: message });
    setChat((prevChat: any) => [...prevChat, { sender: "client", message }]);
    setMessage("");
  };

  return (
    <>
      <button
        onClick={onOpen}
        className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        👩‍🦰 Ask AI
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="w-full h-full max-w-3xl bg-gradient-to-bl from-red-200 via-red-200 to-yellow-200" // Apply Tailwind classes for fixed width and height
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="flex flex-col mx-auto pt-[40px] flex-grow">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {chat.map((msg: { sender: string; message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                      <p key={index}>
                        {msg.sender === "client" ? "You: " : "Server: "}
                        {msg.message}
                      </p>
                    ))}
                  </div>
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
