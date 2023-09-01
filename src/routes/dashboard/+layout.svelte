<script lang="ts">

    import type { PostgrestSingleResponse } from '@supabase/supabase-js';
    import type { LayoutData } from './$types';
    import Loader from '../../components/Loader.svelte';
    
    // export let data: LayoutData;
    import { user } from '$lib/authStore';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { scan } from '$lib/scan';
    import saveToDB from "$lib/saveToDB"
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { lock } from '$lib/lockStore';
    let currentUser: PostgrestSingleResponse<{ FirstName: any; LastName: any; }[]>

    let scanning:boolean = false

    
    onMount(() => {
        if(!sessionStorage.getItem('token')){
            goto(`/unlock?from=${$page.route.id}`)
        }
        // else if(!$user){
        //     goto('/login')
        // }
        
        const output = supabase
            .from('Users')
            .select(`FirstName, LastName`)
            .eq('auth_uuid', $user?.user.id)
            .then((res) => currentUser = res)

    })
    const handleScan = async () => {
        
        if($user && $user.user.email){
            scanning = true
            const output = await scan($user.user.email)
            console.log($user.user.id)
            saveToDB(output, $user.user.id).then((res) => scanning = false)
        }

    }

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
            <div>
                {#if $page.route.id === '/dashboard'}
                    <button on:click={() => goto('/dashboard/company')}>
                        Company Dashboard
                    </button>
                {:else}
                    <button on:click={() => goto('/dashboard')}>
                        My Dashboard
                    </button>
                {/if}
                {#if !scanning}
                    {#if $page.route.id !== '/dashboard/company'}
                        <button
                        on:click={() => handleScan()}
                        >Scan</button>
                    {/if}
                {:else}
                    <Loader />
                {/if}
                
            </div>
        </div>
        <p>Here are the saved leaks from your account</p>
        

    </header>
    
    <slot />
    
</main>

<style>
    div{
        display: flex;
        align-items: center;
    }


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