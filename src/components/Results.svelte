<script lang="ts">
    /**
     * @type {any}
     */
    export let leaks:any

    let animate = false;
  
     $: animate = leaks.length === 0;
    /**
   * @type {HTMLElement}
   */
    let container: HTMLElement
    /**
   * @type {HTMLDivElement}
   */
    let scrollIndicator: HTMLDivElement;
    let html;
    import { fly } from 'svelte/transition';


    let threatColor = "green";

    $: if (selected.avgThreatLevel <= 3) {
        threatColor = "green";
    } else if (selected.avgThreatLevel <= 6) {
        threatColor = "orange";
    } else {
        threatColor = "red";
    }

    import { onMount, afterUpdate } from 'svelte';
    import downloadData from '../resultDownload';
    import * as d3 from 'd3';
    import Emoji from './Emoji.svelte';

    interface DataClass {
        'Data Class': string;
        'Threat Level': number;
    }

    let threatLevels: { [DataClass: string]: number } = {};

    const calculateThreatLevel = (leak: { DataClasses: any[]; }) => {
        let maxThreat = 0;
        let totalThreat = 0;
        const dataclasses = leak.DataClasses;

        for (const dataClass of dataclasses) {
            const threatLevel = threatLevels[dataClass];
            maxThreat = Math.max(maxThreat, threatLevel);
            totalThreat += threatLevel;
        }

        const weightedThreat = (maxThreat * 5 + totalThreat) / 2;
        const dataClassCountWeight = dataclasses.length * 5;

        let finalThreat = Math.max(weightedThreat + dataClassCountWeight, maxThreat * 5);

        if (
            (dataclasses.includes("Email addresses") || dataclasses.includes("Usernames")) &&
            dataclasses.includes("Passwords")
        ) {
            finalThreat = Math.max(finalThreat, 80);
        }

        return Math.min(finalThreat, 100)/10;
    };

    onMount(async () => {
        if (leaks.length > 0){
            const response = await fetch('/threatLevels.csv');
            const csvData = await response.text();
            // @ts-ignore
            const data: DataClass[] = d3.csvParse(csvData);
            data.forEach(row => {
                threatLevels[row['Data Class']] = +row['Threat Level'];
            });

            leaks = leaks.map((leak: {DataClasses: any[]; }) => {
                const avgThreatLevel = calculateThreatLevel(leak);
                // Add the average threat level to the leak object
                return {
                    ...leak,
                    avgThreatLevel,
                };
            });
        }
    });

    let data = [];


    let selected = {...leaks[0], avgThreatLevel: 0}; // Initially setting avgThreatLevel to 0

    $: {
        if (leaks.length > 0) {
            selected = leaks[0]; // Updating selected whenever leaks changes
        }
    }


    onMount(async () => {
        container.scrollIntoView({behavior: 'smooth'});
        checkScroll();
        container.addEventListener("scroll", checkScroll);


    });

    function checkScroll() {
        if(leaks.length > 0){
            // Check if the scroll position is less than the maximum scrollable height
            if (container.scrollTop < container.scrollHeight - container.clientHeight) {
                scrollIndicator.style.display = "flex"; // Show the scroll indicator
            } else {
                scrollIndicator.style.display = "none"; // Hide the scroll indicator
            }
        }
        
    }

    function scrollDown() {
        container.scrollBy({ top: container.clientHeight, behavior: 'smooth' });
    }

    afterUpdate(checkScroll);

  
  </script>
    <Emoji {animate} />
    {#if leaks.length > 0}
        <div class="scroll-container">
            <aside bind:this={container}>
                <ul class="timeline">
                    {#each leaks as breach (breach.Name)}
                    <button class={selected === breach ? 'timeline-item active' : 'timeline-item'} on:click={() => selected = breach}
                        aria-current={selected === breach}
                        >
                        <div class="item-header">
                        <img style="display: none;" class="logo" src={breach.LogoPath} alt="{breach.Name} logo" />
                        <h2>{breach.Name} <br> <p style="display: none;" class="breachdate">{breach.BreachDate}</p></h2>
                        </div>
                    </button>
                    {/each}
                </ul>
                
            </aside>
            
            <div id="scroll-indicator" bind:this={scrollIndicator} >
                <button class="scrollicon" on:click={scrollDown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="rotate(180 12 12)"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122L13.06 3.283Z"/></g></g></svg>
            </button>
            </div>
        </div>
    
        <main>
            <div class="titles">
                <h1>{selected.Name}</h1>
                <p>Leaked on: {selected.BreachDate}</p>
            </div>
            <div class="leakcategories">
                <h3>Leaked Information</h3>
                <ul>
                    {#each selected.DataClasses as category}
                        <li>
                            {category}
                        </li>
                    {/each}
                </ul>   
            </div>  
            <div class="riskFactor">
                <h3>Risk Factor</h3>
                <svg class="progress-ring" viewBox="0 0 120 120">
                    <circle class="progress-ring__circle" stroke="grey" stroke-width="4" fill="transparent" r="40%" cx="50%" cy="50%" />
                    <circle class="progress-ring__circle" stroke={threatColor} stroke-width="4" fill="transparent" r="40%" cx="50%" cy="50%"
                        stroke-dasharray="{selected.avgThreatLevel * 30}, 1000"
                    />
                    {#if selected.avgThreatLevel !== undefined && !isNaN(selected.avgThreatLevel)}
                        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20px" fill="white">
                            {selected.avgThreatLevel.toFixed(2)}
                        </text>
                    {/if}
                </svg>
            </div>
            <div class="downloadbutton" ><button on:click={() => downloadData(leaks)}>Download Data</button></div>
        </main>
    {:else}
        
        <section id="noResultsSection" bind:this={container} >
            <p>Good news! We found no evidence of your email address in any data leaks. Continue practicing safe online habits to keep your information secure.</p>
        </section>
    {/if}
  

<style>
    p{
        text-align: left;
    }
    #noResultsSection{
        width: 100%;
        /* height: 50vh; */
        padding-bottom: 5rem;
        display:flex;
        align-items: center;
        justify-content: center;
    }

    #noResultsSection > p {
        padding: 1rem;
    }

    .scroll-container{
        display: flex;
        
    }

    aside {
        display: flex;
        flex-wrap: nowrap
    }

    ul {
        display: flex;
        flex-wrap: wrap;
    }
    img {
        display: none;
    }

    aside > * > button{
        border: 2px solid var(--accent);
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 1s ease;
        margin: 0.5rem;
        
    }

    button:hover {
        cursor: pointer;
        background-color: var(--accent);
        transform:scale(1.05)
    }

    .scrollicon:hover{
        background-color: transparent;
        transition: all 1s ease;
        transform:scale(1.1);
        cursor: pointer;
    }

    button:active{
        transform: scale(0.8)
    }
    button[aria-current="true"]{
        background-color: var(--accent);
    }

    main {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .titles {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .leakcategories{
        display: flex;
        flex-direction: column;
        padding-top: 1rem;
    }

    .leakcategories > ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding-left: 1rem;
    }

    .leakcategories > h3 {
        font-size: 1.5rem;
    }

    .riskFactor{
        display: flex;

    }

    .progress-ring{
        width: 50%;
        max-height: 25rem;
    }

    .downloadbutton{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .downloadbutton > button {
        height: min-content;
        background-color: var(--accent);
        padding: 1rem 1.5rem;
        border-radius: 0.8rem;
        transition: all 1s ease;
    }

    .downloadbutton > button:hover{
        cursor:pointer;
        transform: scale(1.1)
    }

    .downloadbutton:active{
        transform: scale(0.9)
    }

@media only screen and (min-width: 600px){
    .scroll-container{
        max-width: 30%;
    }
}


@media only screen and (min-width: 1000px){


    .breachdate {
        display: block !important
    }

    #noResultsSection{
        width: 50%;
    }

    .titles{
        display: block;
        width: 320px;
        grid-column: 1 / span 1;
        grid-row: 1 / span 1;

    }
    .leakcategories{
        grid-column: 2 /span 1;
        grid-row: 1 / span 2
    }
    .riskFactor {
        grid-column: 1 / span 1;
        grid-row: 2 / span 2;
        display: flex;
        flex-direction: column;
    }
    .riskFactor > h3{
        width: 100%;
        margin-left: 10%;
    }

    .progress-ring{
        width: 75%;
        max-height: 25rem;
    }

    .downloadbutton{
        grid-column: 2 / span 1;
        grid-row: 3 / span 1;
        width: 100%;
    }
    .progress-ring__circle {
        transition: 0.35s stroke-dasharray;
        /* transform: rotate(-90deg); */
        transform-origin: 50% 50%;
    }

    .downloadbutton{
        width: 100%;
        transition: all 1s ease;
        display: flex;
        justify-content: flex-start;
        padding-left: 1rem;
    }

    

    img{
        display: block !important;
        object-fit: contain;
    }
    .timeline {
      list-style-type: none;
      position: relative;
    }
  
    aside::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      margin-left: 1.5rem;
      background: #526488;
      height: 100%;
      left: 50%;
    }
  
    .timeline-item {
      padding: 20px 40px;
      position: relative;
      background-color: var(--background);
      border-radius: 10px;
      margin-bottom: 20px;
    }
  
  
    .logo {
      width: 60px;
      height: 60px;
    }
  
    .item-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap:20px;
    }

    .scroll-container{
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 50%;
    }

    main {
        padding: 0rem 1rem;
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        max-width: max-content;
        max-height: max-content;
        justify-items: flex-start;
        max-width: max-content;
    }

    aside > * > button{
        border: 2px solid var(--accent);
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 1s ease;
        margin: 0;
        
    }


    ul{
        padding-left: 0rem;
        display: flex !important;
        flex-wrap: nowrap;
        /* margin-left: 1rem; */
        padding: 1rem;
        display: flex;
        flex-direction: column;
        /* flex-wrap: wrap; */
        height: 100%;
        list-style-type:square
    }

    li{
        font-size: 1.2rem;
    }

    h1{
        text-decoration: underline;
        font-size: 3rem;
    }
    h3{
        font-size: 2rem;
    }

    p{
        font-size: 1.5rem;
    }
    aside{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        margin-left: 2rem;
        max-height: 32rem;
        overflow-y: scroll;
    }

    #scroll-indicator {
        position: absolute;
        bottom: -50px;
        /* right: 20%; */
        width:100%;
        display: none; /* Hidden by default */
        margin-left:1.5rem;
        align-items:center;
        justify-content: center;
    }

   

    

}



    
</style>