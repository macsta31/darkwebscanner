<script lang="ts">
    import { fly } from 'svelte/transition'
    import { onMount } from 'svelte'
    import { scan } from '../scan'
    import Loader from '../components/Loader.svelte';
    import Results from '../components/Results.svelte';


    let selected = null;

    function selectLeak(leak: { Name: any; }) {
        selected = leak.Name;
        console.log(selected);
    }
    /**
     * @type {string}
     */
    let searchParam: any;

    /**
     * @type {Promise<void>}
     */
    let promise:Promise<any>|null = null;

    // $: console.log(emailNotification)


    let scanResult: any = null
    let searching = false
    let emailNotification = false;

    async function sendEmail(){
        const response = await fetch('/email', {
            method: 'POST',
            body: JSON.stringify({ searchParam, scanResult }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
    }

    async function handleSubmit() {
        searching = true
        console.log(emailNotification)
        if(searchParam){
            promise = scan(searchParam).then((result) => {
                scanResult = result;
                searching = false  // save the result in api_data
                if(emailNotification) {
                    sendEmail()
                }
                console.log(result)
                return result;  // make sure to return the result so it's passed to the 'then' block
            })
            .catch((err) => {
                searching = false;
                console.log(err)
            })
        }}
        

    let showSvg = false

    
    
    onMount(() => {
        showSvg = true
    })

    
</script>
<div id="wrapper">
        <section style="padding-bottom: 20rem;">
            <div class="formdiv">
                <h1>Has Your Information Been Leaked Online?</h1>
                <h3>Enter Your Email Below To Find Out</h3>
                {#if !searching}
                <form on:submit|preventDefault={handleSubmit} >
                    <div class="formsection">
                        <input name="searchParam" type="text" bind:value={searchParam}>
                        <button type="submit">
                                Search
                        </button>
                    </div>
                        <label for="email" class="emailcheck">
                            Receive results by email?
                            <input class="checkbox" type="checkbox" bind:checked={emailNotification} />
                        </label>
                </form>
                {:else}
                    <Loader />
                {/if}  
            </div>
            {#if showSvg}
                <div class="custom-shape-divider-bottom-1688128729">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill" transition:fly={{y: -200, duration: 1000, delay:0}}></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill" transition:fly={{y: -200, duration: 2000, delay:100}}></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill" transition:fly={{y: -200, duration: 1000, delay:400}}></path>
                    </svg>
                </div>
            {/if}
        </section>
        {#if promise}
            {#await promise then value}
                <section id="results" style="padding-top: 20rem;">
                    <div class="custom-shape-divider-top-1688128729" id="flipped">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 120" preserveAspectRatio="none">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill" ></path>
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 style="padding-bottom: 2rem; text-align: center; font-size: 2rem">Scan Results for  {searchParam}</h2>
                        <div class="scanresults">
                            
                            <Results leaks={value} />
                            
                        </div>
                    </div>
                    <footer>
                        <a href="https://haveibeenpwned.com">All data provided by Have I Been Pwned</a>
                    </footer>
                </section>
                {:catch error}
                    <div class="scanresults_error">
                        {error.message}
                    </div>
            {/await}
        {/if}
</div>


<style>
#wrapper{
    display: flex;
    flex-direction: column;
    flex: 1 auto;
}

section{
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    margin-top: 30%;
    
}

.formdiv{
    display: flex;
    flex-direction:column;
    align-items: center;
    gap: 1rem;
}
h1{
    font-size: 1.5rem;
    text-align: center;
}

h3 {
    font-size: 1rem;
    text-align:center;
}

form{
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
.formsection{
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}

.formsection > input {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    text-align: center;
    border: none;
    width: 100%;
}
.formsection > input:focus{
    outline: none;
    border: none;
}


.scanresults_error{
    width: 400px;
    background-color: red;
}

button{
    position: relative;
    background-color: var(--accent);
    padding: 0.5rem 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 1s ease;
    flex: 1;
    box-shadow: inset 5px 5px 15px rgb(47, 63, 198), inset -5px -5px 15px rgb(47, 63, 198);
    width: 50%;
    align-self: center;

}
button:hover{
    cursor: pointer;
    transform:scale(1.02);
}

button:active{
    transform: scale(0.98);
    box-shadow: inset 5px 5px 10px rgb(36, 47, 150), inset -5px -5px 10px rgb(36, 47, 150);
}

.custom-shape-divider-top-1688128729{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    overflow:hidden;
    transform: rotate(0deg);
    z-index: -999;
}
.custom-shape-divider-top-1688128729 svg {
    pointer-events: none;
    position: relative;
    display: block;
    height: 30rem;
}

.custom-shape-divider-top-1688128729 .shape-fill {
    fill: var(--accent);
}
.custom-shape-divider-bottom-1688128729 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);
    z-index: -999;
}

.custom-shape-divider-bottom-1688128729 svg {
    pointer-events: none;
    position: relative;
    display: block;
    height: 25rem;
}

.custom-shape-divider-bottom-1688128729 .shape-fill {
    fill: var(--accent);
}

#results{
    margin-top: 0 ;
    display: flex;
    flex-direction: column;
    
}

footer{
    width: 100%;
    display: grid;
    place-content: center;
    font-size: 0.3rem;
    padding-bottom: 1rem;
}
@media only screen and (min-width: 600px){


    
    
    

    h1{
        font-size: 3rem;
        text-align: center;
    }
    h3{
        font-size: 2rem;
        text-align: center;
    }
    

    .formsection{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 1rem;
    }

    .formsection > input{
        flex: 5;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        text-align: center;
        border: none;
    }

    
    .custom-shape-divider-top-1688128729{
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        overflow:hidden;
        transform: rotate(0deg);
    }
    .custom-shape-divider-top-1688128729 svg {
        pointer-events: none;
        position: relative;
        display: block;
        width: calc(138% + 1.3px);
        height: 20rem;
    }

    .custom-shape-divider-top-1688128729 .shape-fill {
        fill: var(--accent);
    }
    .custom-shape-divider-bottom-1688128729 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        transform: rotate(180deg);
        z-index: -999;
    }

    .custom-shape-divider-bottom-1688128729 svg {
        pointer-events: none;
        position: relative;
        display: block;
        width: calc(138% + 1.3px);
        height: 20rem;
    }

    .custom-shape-divider-bottom-1688128729 .shape-fill {
        fill: var(--accent);
    }



    

    
    

    

    .scanresults{
        width: 100%;
        display: flex;
        justify-content: center;
        padding-bottom: 10rem;
        gap: 5rem;
        height: min-content;
    }



    input{
        color: black;
    }
}




</style>
