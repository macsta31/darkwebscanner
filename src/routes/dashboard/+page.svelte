<script lang="ts">
    import { user } from '$lib/authStore.js';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient.js';
    import Chart from '../../components/Chart.svelte';
    import Loader from '../../components/Loader.svelte';
    import BarChart from '../../components/BarChart.svelte';

    export let data;
    let breachData: any[] | null

    onMount(() => {
        const breachOutput = supabase
            .from('User_Breaches')
            .select(`
                breach_identifier,
                IsAcknowledged,
                Breach ( Domain, PwnCount, LogoPath, IsVerified, BreachDate, dataClasses )
            `)
            .eq('user_identifier', $user?.user.id)
            .then((res) => {
                breachData = res.data
            })
    })
    

    
</script>


    {#if breachData}
        {#if breachData[0]}
        <main>
            <div class="tablecontainer"></div>
                <table>
                    <thead>
                        <tr>
                            <th>Leak</th>
                            <th>Domain</th>
                            <th>Pwn Count</th>
                            <!-- <th>Logo</th> -->
                            <th>Is Verified</th>
                            <th>Acknowledged</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each breachData as item (item.breach_identifier)}
                            <tr>
                                <td>{item.breach_identifier}</td>
                                <td><a href="https://{item.Breach.Domain}">{item.Breach.Domain}</a></td>
                                <td>{item.Breach.PwnCount}</td>
                                <!-- <td><img src={item.Breach.LogoPath} alt={item.breach_identifier} width="50" height="50"/></td> -->
                                <td>{item.Breach.IsVerified ? 'Verified' : 'Not Verified'}</td>
                                <td><input type="checkbox" value={item.IsAcknowledged}></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="otherinfo">
                    <BarChart chartData={breachData}/>
                </div>
                <div class="chart">
                    <Chart chartData={breachData}/>
                </div>
            </main>
            {:else}
                <div class="nodata">
                    <h3>No Leaks are saved for this email address!</h3>
                    <p>Leaks will be updated if they are found upon the completion of scans</p>
                    <p>If you would like the run a scan, return to the home page!</p>
                </div>
            {/if}
    {:else}
        <div class="loader">
            <Loader />
        </div>
    {/if}

<style>
    main{
        display: grid;
        grid-template-rows: 2fr 2fr;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 100%;
    }

    .nodata{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .loader{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    table {
        grid-row: 1 / span 2; 
        grid-column: 1 / span 2; 

        background-color: var(--background);
        color: white;
        width:100%;
        border-collapse: collapse;
        border-spacing: 0;
        border-radius: 10px;
        overflow: hidden;
    }
    th, td {
        padding: 10px;
        border: none;
    }
    th {
        text-align: left;
        background-color: var(--accent);
        color: white;
    }
    tr:nth-child(even) td {
        background-color: #033349; /* Shade for even rows */
    }
    tr:nth-child(odd) td {
        background-color: #022439; /* Shade for odd rows */
    }

    .chart{
        grid-row: 3 / span 2;
        grid-column: 2;
        min-height: 350px;
    }
    .otherinfo{
        grid-row: 3 / span 2;
        grid-column: 1;
        min-height: 350px;
    }

</style>