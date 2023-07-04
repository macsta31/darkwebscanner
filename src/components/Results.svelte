<script>
    /**
     * @type {any}
     */
    export let leaks
    /**
   * @type {HTMLElement}
   */
    let container
    /**
   * @type {HTMLDivElement}
   */
    let scrollIndicator;

    import { onMount, afterUpdate } from 'svelte';



    let selected = leaks[0];

    onMount(() => {
        container.scrollIntoView({behavior: 'smooth'});
        checkScroll();
        container.addEventListener("scroll", checkScroll);
    })

    function checkScroll() {
        // Check if the scroll position is less than the maximum scrollable height
        if (container.scrollTop < container.scrollHeight - container.clientHeight) {
            scrollIndicator.style.display = "flex"; // Show the scroll indicator
        } else {
            scrollIndicator.style.display = "none"; // Hide the scroll indicator
        }
    }

    function scrollDown() {
        container.scrollBy({ top: container.clientHeight, behavior: 'smooth' });
    }

    afterUpdate(checkScroll);

  
  </script>
    <div class="scroll-container">
        <aside bind:this={container}>
            <ul class="timeline">
                {#each leaks as breach (breach.Name)}
                  <button class={selected === breach ? 'timeline-item active' : 'timeline-item'} on:click={() => selected = breach}
                    aria-current={selected === breach}
                    >
                    <div class="item-header">
                      <img class="logo" src={breach.LogoPath} alt="{breach.Name} logo" />
                      <h2>{breach.Name} <br> {breach.BreachDate}</h2>
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
    <h1>{selected.Name}</h1>
    <p>Leaked on: {selected.BreachDate}</p>
    <h3>Leaked Information</h3>
    <ul>
        {#each selected.DataClasses as category}
            <li>
                {category}
            </li>
        {/each}
    </ul>   
  </main>
  

<style>

    img{
        object-fit: contain;
    }
    .timeline {
      list-style-type: none;
      position: relative;
    }
  
    .timeline::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #526488;
      left: 50%;
      margin-left: -2px;
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
    }

    main{
        padding: 0rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

    }
    ul{
        /* margin-left: 1rem; */
        padding: 1rem;
        display: flex;
        flex-direction: column;
        /* flex-wrap: wrap; */
        height: 100%;
        list-style-type:square
    }

    h1{
        text-decoration: underline;
    }

    aside{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        margin-left: 2rem;
        max-height: 28rem;
        overflow-y: scroll;
    }

    #scroll-indicator {
        position: absolute;
        bottom: -50px; /* Adjust as needed */
        /* right: 20%; */
        width:100%;
        display: none; /* Hidden by default */
        margin-left:1rem;
        align-items:center;
        justify-content: center;
    }

    aside > * > button{
        border: 2px solid var(--accent);
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 1s ease;

        
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

    
</style>