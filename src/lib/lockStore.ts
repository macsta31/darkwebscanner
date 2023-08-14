import { writable } from 'svelte/store';

import { goto } from '$app/navigation';


// initialize the store with null
export const lock = writable(true);