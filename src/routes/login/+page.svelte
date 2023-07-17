<script>
    import {supabase} from '$lib/supabaseClient'

    let signUpSwitch = true;
    /**
     * @type {any}
    */
    let name
    /**
     * @type {any}
    */
    let email
    /**
     * @type {any}
    */
    let password
    /**
     * @type {any}
    */
    let confirm

    $: if (signUpSwitch && password !== confirm){
        
    }
</script>

<main>
    <div class="login">
        <h1>Login</h1>
        <form action="">
            {#if signUpSwitch}
                <label for="name">
                    Name:
                    <input type="text" required bind:value={name}>
                </label>
            {/if}
            <label for="email">
                Email:
                <input type="text" required bind:value={email}>
            </label>
            <label for="password">
                Password:
                <input type="text" required bind:value={password}>
            </label>
            {#if signUpSwitch}
                <label for="confirm">
                    Confirm Password:
                    <input type="text" required bind:value={confirm}>
                </label>
            {/if}
            <button type="submit">Log In</button>
        </form>
    </div>
</main>

<style>
    main{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .login{
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        border-radius: 1rem;;
        
    }

    h1{
        text-align: center;
    }

    form{
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 2rem;

    }
    label{
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }
    input{
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: none;
    }
    button{
        background-color: var(--accent);
        width:max-content;
        align-self: center;
        padding: 0.5rem 1rem;
        font-size: 1.5rem;
    }
</style>