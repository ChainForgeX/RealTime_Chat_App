import { useState, useEffect } from "react";

import API from "../services/api";

import socket from "../services/socket";

function Chat() {

    const [username, setUsername] =
    useState("");

    const [message, setMessage] =
    useState("");

    const [messages, setMessages] =
    useState([]);

    const loadMessages =
    async()=>{

        try{

            const response =
            await API.get(
                "/messages"
            );

            setMessages(
                response.data
            );

        }
        catch(error){

            console.log(error);

        }

    };

    const sendMessage =
    ()=>{

        if(
            !username ||
            !message
        ){
            return;
        }

        socket.emit(
            "sendMessage",
            {
                username,
                message
            }
        );

        setMessage("");

    };

    useEffect(()=>{

        loadMessages();

        socket.on(
            "receiveMessage",
            (data)=>{

                setMessages(
                    (prev)=>[
                        ...prev,
                        data
                    ]
                );

            }
        );

        return ()=>{

            socket.off(
                "receiveMessage"
            );

        };

    },[]);

    return(

        <div>

            <h1>
                Real Time Chat
            </h1>

            <hr/>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e)=>
                setUsername(
                    e.target.value
                )}
            />

            <br/>
            <br/>

            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e)=>
                setMessage(
                    e.target.value
                )}
            />

            <br/>
            <br/>

            <button
                onClick={
                    sendMessage
                }
            >
                Send
            </button>

            <hr/>

            {

                messages.map(
                    (msg,index)=>(

                        <div
                            key={index}
                        >

                            <strong>
                                {msg.username}
                            </strong>

                            {" : "}

                            {msg.message}

                        </div>

                    )
                )

            }

        </div>

    );

}

export default Chat;