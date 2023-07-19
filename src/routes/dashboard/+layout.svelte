<script lang="ts">

    import type { PostgrestSingleResponse } from '@supabase/supabase-js';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;
    import { user } from '$lib/authStore';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    let currentUser: PostgrestSingleResponse<{ FirstName: any; LastName: any; }[]>
    onMount(() => {
        const output = supabase
            .from('Users')
            .select('FirstName, LastName')
            .eq('auth_uuid', $user?.user.id)
            .then((res) => currentUser = res)
        }
    )
    $: console.log(currentUser)
</script>

<main>
    <header>
        <h1>
            
            Welcome Back 
            {#if currentUser?.data}
                {currentUser.data[0].FirstName} {currentUser.data[0].LastName}
            {/if}
        </h1>

        <slot />
    </header>
</main>

<style>
    main{
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 3rem;
    }

    header{
        width: 100%;
        padding-bottom: 2rem;
    }
</style>