"use client";
import React from "react";

const Inputs = () => {
    return(
        <div className="inputs">
            <input type="text" placeholder="Type a message"/>
            <div className="mSend">
                <input type="file" style={{display: "none"}} id="file" className="mfile"/>
                <label htmlFor="file">
                    <img src="" alt=""/>
                </label>
                <button className="mbuttonSend">Send</button>
            </div>
        </div>
    )
}

export default Inputs;