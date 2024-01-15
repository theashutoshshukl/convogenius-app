import { useState } from "react";
import { toast } from "react-toastify";
import "../assets/styles/chat.css";
import Allmessages from "../Components/Allmessages";

const Chat = () => {
    const [input, setInput] = useState("");
    let totalMessages = JSON.parse(localStorage.getItem("messages"))
    let [messages, setMessages] = useState(totalMessages);


    // Send Message Button
    const sendMessage = async (e) => {
        e.preventDefault();

        if (input == "") {
            return toast.warning("Please Type Your Message", {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }

        // Getting user token from localstorage
        const savedToken = localStorage.getItem("token");

        const url = "http://localhost:3000/api";
        const data = {
            text: input
        }
        const requestObject = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": savedToken },
            body: JSON.stringify(data)
        }

        // Sending fetch request
        try {
            const response = await fetch(url, requestObject);
            const responseData = await response.json();
            console.log(responseData.response, responseData.id);

            setMessages([...messages, {
                id: responseData.id,
                yourMessage: input,
                geniusMessage: responseData.response
            }]);

            // Setting messages to localstorage
            localStorage.setItem("messages", JSON.stringify(messages));

            setInput("");

        } catch (error) {
            toast.error(`${error.message}`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }

    return (
        <div className="chat">
            {messages && messages.length === 0 ? (
                <div className="chat">
                    <h1>ConvoGenius</h1>
                    <h2>How can i help you today?</h2>
                </div>)

                // Chat Container
                : <Allmessages messages={messages} />
            }

            {/* Input */}
            <form className="input-container">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} id="input-text" placeholder="Message ConvoGenius..." />
                <button type="submit" onClick={sendMessage} className="send-message">Send</button>
            </form>
        </div>
    );
}

export default Chat;