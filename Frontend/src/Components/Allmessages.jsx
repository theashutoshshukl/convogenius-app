import "../assets/styles/allmessages.css";

const Allmessages = (messages) => {
    return (
        <div className="chat-container">
            <h2>Your Messages</h2>
            <div className="chats">
                {messages.messages.map(e => {
                    return (
                        <div className="all-messages" key={e.id}>
                            <p id="user-message"><span>You: </span>{e.yourMessage}</p>
                            <p id="genius-message"><span>ConvoGenius: </span>{e.geniusMessage}</p>
                            <hr />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Allmessages;