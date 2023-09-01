<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import { navigating } from '$app/stores';
    import { user } from '$lib/authStore';
    import { lock } from '$lib/lockStore';
    import { page } from '$app/stores';
 
    inject({ mode: dev ? 'development' : 'production' });


    let token: string | null
    
    import '../global.css'
    import Loader from '../components/Loader.svelte';
    import { goto } from '$app/navigation';


    // $: document.title = getTitle($page.route.id);

    // function getTitle(route: string | null) {
    //     switch(route) {
    //         case '/': return 'ISAIX Dark Web Scanner | Ultimate Email & Company Security';
    //         case '/unlock': return 'Unlock ISAIX | Secure Access to Dark Web Monitoring';
    //         case '/news': return 'ISAIX News | Latest Updates on Dark Web Threats & Security';
    //         case '/login': return 'Login to ISAIX | Secure Your Company Emails Today';
    //         case '/dashboard': return 'ISAIX Dashboard | Monitor & Secure Your Email Real-time';
    //         case '/dashboard/company': return 'Company Security Dashboard | ISAIX Multi-Email Monitoring';
    //         default: return 'ISAIX Dark Web Scanner';  // Default title
    //     }
    // }

    const handleLogin = async () => {
        // const res = await supabase.auth.signInWithPassword({
        //     email: 'mackstathis@gmail.com',
        //     password: 'admin123'
        // })
        // // console.log(res)
        
        if($page.route.id !== '/login'){
            goto('/login')
        }
        
    }

    // console.log($user)

    const handleLogout = async () => {
        const res = await supabase.auth.signOut();
        if($page.route.id !== '/'){
            goto('/')
        }
    }

    let dashboardSwitch: string | undefined
    let profileSwitch: string | undefined
    $:
    if($user){
        dashboardSwitch = "dashboard"
        profileSwitch = 'profile'
    }
    else{
        dashboardSwitch = "login"
        profileSwitch = 'login'
    }
    onMount(() => {
        token = sessionStorage.getItem('token')
        if($page.route.id !== '/unlock'){
            if($lock && !token){
                goto(`/unlock?from=${$page.route.id}`)
            }
        } 
    })
</script>


<main>
    
    {#if $navigating}
     <Loader />
    {:else}
        <header>
            <a href="/"><h1>ISAIX</h1></a>
                <div>
                    <nav>
                        <a href="/" 
                        class={$page.route.id === '/' ? 'active' : ''} 
                        on:click={e => {if ($page.route.id === '/') e.preventDefault()}}
                        >Home</a>
                    
                        <a href="/{dashboardSwitch}" 
                        class={$page.route.id?.startsWith('/dashboard')  ? 'active' : ''} 
                        on:click={e => {if ($page.route.id === `/${dashboardSwitch}`) e.preventDefault()}}
                        >Dashboard</a>
                    
                        <a href="/news" 
                        class={$page.route.id === '/news' ? 'active' : ''} 
                        on:click={e => {if ($page.route.id === '/news') e.preventDefault()}}
                        >News</a>
                    </nav>
                    
                
                    <button>Contact Us</button>
                    {#if $user}
                        <button on:click={() => handleLogout()} >Log Out</button>
                    {:else}
                        <button on:click={() => handleLogin()}>Log In</button>
                    {/if}
                </div>
        </header>
        <slot />
    {/if}

    
</main>

<style>

    div{
        display: flex;
        gap:1rem;
    }

nav{
    display: flex;
    /* justify-self: center; */
    align-self: center;
    gap: 1rem;
    font-size: 1.2rem;
}
a {
    position: relative;
    text-decoration: none;
    overflow: hidden;
}

a::after {
    content: "";
    position: absolute;
    width: 0%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    transition: width 0.3s ease-in-out;
}

a.active::after {
    width: 100%;
}

button{
    background-color: var(--accent);
    border-radius: 10px;
    padding: 0.5rem 0.75rem;
    font-size: 1.1rem;
}

main {
    overflow-x: hidden;
    position: relative;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
}

header {
    position: sticky;
    top:0;
    left:0;
    width: 100%;
    background-color: var(--background);
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
}
@media only screen and (min-width: 600px){
    main{
        overflow-x: hidden;
        position: relative;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        /* width: 100%; */
    }

    header{
        position: sticky;
        top:0;
        left:0;
        width: 100%;
        background-color: var(--background);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 3rem;
        z-index: 1000
    }

    nav{
        display: flex;
        align-items: center;
        gap: 30px;
    }

    

    
}



</style>