<script lang="ts">
  import { goto } from "$app/navigation";
  import { lock } from "$lib/lockStore";
  import { page } from "$app/stores";
    let referrer = $page.url.searchParams.get('from')
    let magicWord:string
    let handleMagicWord = () => {
        if(magicWord === 'opensesame'){
            window.sessionStorage.setItem('token', 'goofergoober')
            lock.set(false)
            if(referrer){
                goto(referrer)
            }
            else{
                goto('/')
            }
            
        }
        else{
            errorMessage = "That's not the magic word!"
        }
    }

    let errorMessage:string|undefined
</script>

<main>
    <h1>Whats the magic word?</h1>
    {#if errorMessage}
        <h4 style="color: red;">{errorMessage}</h4>
    {/if}
    <form on:submit|preventDefault={() => handleMagicWord()}>
        <input type="text" bind:value={magicWord} on:change={() => {errorMessage = undefined}}>
        <button type="submit">Submit</button>
    </form>
</main>

<style>
    main{
        display: grid;
        place-content: center;
        height: 30vw;
    }

    form{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0rem;
        align-items: center;
    }

    input{
        padding: 0.25rem 0.5rem;
        color: black;
        font-size: 1rem;
        text-align: center;
        width: 100%;
        border-radius: 0.5rem;

    }

    button{
        background-color: var(--accent);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        width: max-content;
    }
</style>