import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

// Create the store and initialize it with the current user.
async function getSession(){
    const session = (await supabase.auth.getSession())?.data?.session
    if(session){
        return session
    }
    return null
}

export const user = writable(await getSession());

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        user.set(null);
        
    } else if (session) {
        user.set(session);
    }
});
