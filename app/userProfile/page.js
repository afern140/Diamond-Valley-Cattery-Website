"use client";

import { useUserAuth } from "../_utils/auth-context";

export default function Page() {
    const {user} = useUserAuth();
    console.log(user);

    return(
        <div className="bg-white min-h-screen flex items-center justify-center">
        {!user && <div>You're not supposed to be in here.</div>}
        {user && <div>Hi {user.uid} {user.email}</div>}
        </div>
    );

}