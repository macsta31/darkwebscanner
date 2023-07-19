<script>

    import {supabase} from '$lib/supabaseClient'
    import { goto } from '$app/navigation';

    let signUpSwitch = false;
    /**
     * @type {any}
    */
    let firstName
    /**
     * @type {any}
    */
    let lastName
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

    // @ts-ignore
      $: if (signUpSwitch && password !== confirm){
        
    }

    const handleSubmit = async () => {
        try{
            if(signUpSwitch){
                if (password !== confirm){
                    // @ts-ignore
                    document.getElementById('confirm').style.border = "3px solid red"
                    return
                }
                // @ts-ignore
                const signUpOut = await supabase.auth.signUp({
                    email: email,
                    password: password,
                })
                if (!signUpOut.error){
                    // @ts-ignore
                    // console.log(data?.user.id)
                    const addUserEntry = await supabase
                    .from('Users')
                    .insert([
                        {
                            //@ts-ignore
                            auth_uuid: signUpOut.data.user.id,
                            FirstName: firstName,
                            LastName: lastName,
                        },
                    ])
                    console.log(addUserEntry)
                    if(addUserEntry.error){
                        throw Error(addUserEntry.error.message)
                    }

                    goto(`/dashboard`)
                }
                else{
                    throw Error(signUpOut.error.message)
                }
            }
            else{
                // @ts-ignore
                const {data, error} = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                })
                if (!error){
                    goto(`/dashboard`)
                }
                else{
                    // @ts-ignore
                    document.getElementById('password').style.border = "3px solid red"
                    throw Error(error.message)
                }
            }
        }
        catch (error){
            console.error(error)
        }
    }
        
</script>

<main>
    <div class="login">
        <h1>
            {#if signUpSwitch}
                Join Us!
            {:else}
                Welcome Back!
            {/if}
        </h1>
        <!-- <form action="" on:submit|preventDefault={() => handleSubmit()}> -->
        <form action="" on:submit|preventDefault={() => handleSubmit()}>
            <div class="nameSection">
                {#if signUpSwitch}
                    <label for="firstName">
                        First Name:
                        <input type="text" required bind:value={firstName}>
                    </label>
                    <label for="lastName">
                        Last Name:
                        <input type="text" required bind:value={lastName}>
                    </label>
                
                {/if}
            </div>
            <label for="email">
                Email:
                <input type="text" required bind:value={email}>
            </label>
            <label for="password">
                Password:
                <input type="password" required bind:value={password} id="password">
            </label>
            {#if signUpSwitch}
                <label for="confirm">
                    Confirm Password:
                    <input type="password" required bind:value={confirm} id="confirm">
                </label>
            {/if}
            <button type="submit">
                {#if signUpSwitch}
                    Sign Up
                {:else}
                    Login
                {/if}
            </button>
            <button class="small" on:click={() => {signUpSwitch = !signUpSwitch}}>
                {#if signUpSwitch}
                    Already have an account?
                {:else}
                    Don't have an account?
                {/if}
            </button>
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
        width: 80%;
        max-width: 500px;
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
    .nameSection{
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .nameSection > label{
        flex: 1
    }
    input{
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: none;
        color: black;
    }
    button{
        background-color: var(--accent);
        width:max-content;
        align-self: center;
        padding: 0.5rem 1.5rem;
        font-size: 1.5rem;
        border-radius: 1rem;
        transition: all 1s ease;
        box-shadow: 3px 3px 10px rgb(28, 28, 28);
    }

    .small{
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }

    button:hover{
        cursor: pointer;
        transform: scale(1.05)

    }

    input:focus{
        outline: none;
    }
</style>