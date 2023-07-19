import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store'
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { goto } from '$app/navigation';

async function getSession(): Promise<Session | null> {
    const session = (await supabase.auth.getSession())?.data?.session;
    if (session) {
        return session;
    }
    return null;
}

// initialize the store with null
export const user: Writable<Session | null> = writable(null);

// then update it once the session data is loaded
getSession().then(session => {
    user.set(session);
});

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        user.set(null);
        goto('/')
    } else if (session) {
        user.set(session);
    }
});
