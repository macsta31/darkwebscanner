<script lang="ts">
    import type { LayoutData } from './$types';
    import '../global.css'
    
    export let data: LayoutData;
</script>

<main>
    <header>
        <h1>ISAIX</h1>
        <nav>
            <a href="/">Nav</a>
            <a href="/">Nav</a>
            <a href="/">Nav</a>
            <a href="/">Nav</a>
            <button>Contact Us</button>
        </nav>
    </header>
    
    <slot />

    <!-- <footer>
        <a href="https://haveibeenpwned.com">All data provided by Have I Been Pwned</a>
    </footer> -->
</main>

<style>
    main{
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    header{
        position: sticky;
        top:0;
        left:0;
        min-width: 100%;
        background-color: var(--background);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 3rem;
    }

    nav{
        display: flex;
        align-items: center;
        gap: 30px;
    }

    button{
        background-color: var(--accent);
        border-radius: 10px;
        padding: 0.5rem 0.75rem;
        font-size: 1.1rem;
    }

    a{
        text-decoration: none;
    }

    footer{
        position: absolute;
        bottom: -300;
        left:0;
        display: grid;
        width: 100%;
        padding: 0.5rem;
        place-content: center;
    }
</style>