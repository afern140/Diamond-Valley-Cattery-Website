"use client";
import React from "react";
import Chat from "./Chat";
import { useUserAuth } from "../_utils/auth-context";

const style = {
    appContainer: `max-w-[728px] mx-auto text-center`,
    sectionContainer: `flex flex-col h-[90vh] bg-gray-100 mt-10 shadow-xl border relative`,
  };
function App() {
    const {user} = useUserAuth();
  //  console.log(user)
  return (
    <div className={style.appContainer}>
      <section className='{style.sectionContainer}'>
        {user ? <Chat /> : null}
      </section>
    </div>
  );
}

export default App;