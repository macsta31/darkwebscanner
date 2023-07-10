<script lang="ts">
    import type { LayoutData } from './$types';
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import { navigating } from '$app/stores';
 
    inject({ mode: dev ? 'development' : 'production' });
    
    import '../global.css'
  import Loader from '../components/Loader.svelte';
    
    // export let data: LayoutData;
</script>


<main>
    
    {#if $navigating}
     <Loader />
    {:else}
        <header>
            <h1>ISAIX</h1>
            <nav>
                <a href="/blog">Blog</a>
                <a href="/news">News</a>
                <button>Contact Us</button>
            </nav>
        </header>
        <slot />
    {/if}

    
</main>

<style>

nav{
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
}
a{
    text-decoration: none;
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
    justify-content: space-between;
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