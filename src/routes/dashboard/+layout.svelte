<script lang="ts">

    import type { PostgrestSingleResponse } from '@supabase/supabase-js';
    import type { LayoutData } from './$types';
    import Loader from '../../components/Loader.svelte';
    
    export let data: LayoutData;
    import { user } from '$lib/authStore';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    let currentUser: PostgrestSingleResponse<{ FirstName: any; LastName: any; }[]>
    
    onMount(() => {
        const output = supabase
            .from('Users')
            .select(`FirstName, LastName`)
            .eq('auth_uuid', $user?.user.id)
            .then((res) => currentUser = res)

            const User_Breaches = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'User_Breaches' },
                (payload) => {
                    console.log('Change received!', payload)
                }
            )
            .subscribe()
    })
</script>

<main>
    <header>
        <div style="display: flex; justify-content: space-between; align-items: center">
            <h1>
                
                Welcome Back 
                {#if currentUser?.data}
                    {currentUser.data[0].FirstName} {currentUser.data[0].LastName}
                {/if}
            </h1>
            <button
            >Scan</button>
        </div>
        <p>Here are the saved leaks from your account</p>
        

    </header>
    
    <slot />
    
</main>

<style>



    button{
        background-color: var(--accent);
        padding: 0.5rem 1.5rem;
        font-size: 1rem;
        margin-right: 1rem;
        border-radius: 1rem;
        transition:all 1s ease;

    }

    button:hover{
        cursor: pointer;
        transform: scale(1.05)
    }
    main{
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
    }

    header{
        width: 100%;
        margin-bottom: 2rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgb(170, 170, 170);
    }

    p{
        color: rgb(170, 170, 170);
    }

    @media only screen and (min-width: 800px){
        main{
            padding: 3rem;
        }
    }



    
</style>