<script>
    import { fly } from 'svelte/transition'
    import { onMount } from 'svelte'
    import { enhance } from '$app/forms';

    let showSvg = false
    
    onMount(() => {
        showSvg = true
    })

    export let data;
</script>

<main>
    <section>
        <h1>Has Your Information Been Leaked Online?</h1>
        <h3>Enter Your Email Below To Find Out</h3>

        <form method="POST" use:enhance>
            
            <input name="searchParam" type="text">
            <button type="submit">Search</button>
        </form>
    </section>
    {#if showSvg}
        <div id="divider">
            <svg id="svg1"width="1440" height="325" viewBox="0 0 1440 238" fill="none" xmlns="http://www.w3.org/2000/svg" transition:fly={{ y:200, duration: 1000, delay: 0}}>
                <path d="M0 56.8476L48 54.3431C96 51.8387 192 46.8298 288 70.3718C384 93.4129 480 145.506 576 124.468C672 103.431 768 10.2645 864 0.747479C960 -8.2686 1056 66.8655 1152 86.9012C1248 106.937 1344 71.8744 1392 54.3431L1440 36.8119V703H1392C1344 703 1248 703 1152 703C1056 703 960 703 864 703C768 703 672 703 576 703C480 703 384 703 288 703C192 703 96 703 48 703H0V56.8476Z" fill="#475DE2"/>
            </svg>
            <svg id="svg2"width="1440" height="250" viewBox="0 0 1440 155" fill="none" xmlns="http://www.w3.org/2000/svg" transition:fly={{ y:200, duration: 1000, delay: 200}}>
                <path d="M0 80.2924L48 92.4357C96 105.254 192 129.541 288 99.1821C384 68.8235 480 -16.1803 576 2.70944C672 21.5992 768 145.732 864 169.344C960 192.956 1056 116.048 1152 90.4119C1248 64.7758 1344 89.0627 1392 101.881L1440 114.024V620H1392C1344 620 1248 620 1152 620C1056 620 960 620 864 620C768 620 672 620 576 620C480 620 384 620 288 620C192 620 96 620 48 620H0V80.2924Z" fill="#3648D5"/>
            </svg>
            <svg id="svg3"width="1440" height="200" viewBox="0 0 1440 199" fill="none" xmlns="http://www.w3.org/2000/svg" transition:fly={{ y:200, duration: 1000, delay: 300}}>
                <path d="M0 48.3341L48 84.7063C96 120.095 192 192.839 288 176.128C384 159.416 480 55.2152 576 16.8771C672 -20.478 768 9.01296 864 58.1644C960 107.316 1056 176.128 1152 183.009C1248 188.907 1344 133.858 1392 105.35L1440 77.825V589H1392C1344 589 1248 589 1152 589C1056 589 960 589 864 589C768 589 672 589 576 589C480 589 384 589 288 589C192 589 96 589 48 589H0V48.3341Z" fill="#2433C7"/>
            </svg>
            <svg id="svg4"width="1440" height="320" viewBox="0 0 1440 318" fill="none" xmlns="http://www.w3.org/2000/svg" transition:fly={{ y:200, duration: 1000, delay: 100}}>
                <path d="M0 135.178L48 117.505C96 99.4996 192 64.1547 288 83.4944C384 102.834 480 177.525 576 165.855C672 154.184 768 56.1521 864 19.4734C960 -17.2052 1056 7.46956 1152 16.8059C1248 26.1423 1344 20.8072 1392 17.8062L1440 15.1387V612H1392C1344 612 1248 612 1152 612C1056 612 960 612 864 612C768 612 672 612 576 612C480 612 384 612 288 612C192 612 96 612 48 612H0V135.178Z" fill="#5871EE"/>
            </svg>
        </div>
    {/if}
</main>

<style>

    main{
        position: absolute;
        display: flex;
        height: 100%;
        flex: 1 auto;
        width:100%;
        justify-content: center;
        padding-top: 6rem;
        overflow: hidden;
    }
    section{
        width:max-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 6rem;
        gap: 0.75rem;
    }

    h1{
        font-size:2rem;
    }

    form{
        margin-top: 1rem;
        width:100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    input{
        border:none;
        flex: 10;
        padding: 0.25rem 1.5rem;
        text-align: center;
        border-radius: 10px;
        color: black;
        font-size: 1rem;

        &:focus{
            outline: none;
        }
    }

    button{
        background-color: var(--accent);
        padding: 0.5rem 1.5rem;
        border-radius: 10px;
        font-size: 1rem;
    }

    #divider {
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left:0;

    }

    svg{
        width:100%;
        z-index: 999;
        
    }

    #svg1{
        position: absolute;
        bottom:0;
        left:0;
        z-index: 2;
    }
    #svg2{
        position: absolute;
        bottom:0;
        left:0;
        z-index: 9;
    }
    #svg3{
        position: absolute;
        bottom:0;
        left:0;
        z-index: 9;
    }
    


</style>
