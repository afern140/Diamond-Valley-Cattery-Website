"use client";
import React from "react";
import Chat from "./Chat";
import { useUserAuth } from "../_utils/auth-context";

const style = {
    appContainer: `max-w-[728px] mx-auto text-center rounded-xl`,
    sectionContainer: `flex flex-col w-full max-w-[728px] justify-center mx-auto mt-10 relative rounded-xl`,
};

function Page({query}) {
    const { user } = useUserAuth();
    //  console.log(user)
    return (
        <div className={"w-full h-full text-black bg-white flex flex-col"}>
            <h1 className="justify-center flex pt-12 text-3xl">{query && query.cat.name ? query.cat.name : "{cat.name}"} <span className=""> Request</span></h1>
            <section className={style.sectionContainer}>
                {user && <Chat user={user} />}
            </section>
        </div>
    );
}

export default Page;
