import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {slug: params.email}

    throw error(404, 'Not found');
}