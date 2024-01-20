"use client";
import {useUserAuth} from "app/util/security/auth-context";

export default function Page() {
    const {user, signInWithEmailAndPassword signOut} = useUserAuth();

    function handleSignIn() {
        
    }

    function handleSignOut() {
        signOut();
    }

    return(
        <div>
            {!user && <button onClick={handleSignIn}>Sign In</button>}
            {user && (
                <div>
                    <p>
                        Welcome, {user.displayName ? user.displayName : user.email} 
                    </p>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <div>{user.email}</div>
                </div>
            )}
        </div>
    )
}