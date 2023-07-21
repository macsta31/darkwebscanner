<script lang="ts">
    import { user } from '$lib/authStore.js';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient.js';
    import Chart from '../../components/Chart.svelte';
    import Loader from '../../components/Loader.svelte';
    import BarChart from '../../components/BarChart.svelte';
    import Table from '../../components/Table.svelte';
    let breachData: any[] | null;








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
                breachData = res.data;
            })

            const User_Breaches = supabase.channel('custom-all-channel')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'User_Breaches' },
                    (payload) => {
                        if(payload.eventType === 'INSERT'){
                            // Inserted data will be in payload.new
                            const newData = supabase
                                .from('User_Breaches')
                                .select(`
                                    breach_identifier,
                                    IsAcknowledged,
                                    Breach ( Domain, PwnCount, LogoPath, IsVerified, BreachDate, dataClasses )
                                `)
                                .eq('user_identifier', $user?.user.id)
                                .eq('breach_identifier', payload.new.breach_identifier)
                                .then((res) => {
                                    if(res.data){
                                        if(breachData !== null){
                                            breachData = [...breachData, res.data[0]]
                            
                                        }
                                        else {
                                            breachData = [res.data];
                                        }
                                    }
                                })
                            
                        }
                    }
                )
                .subscribe();
    })


</script>


    {#if breachData}
        {#if breachData[0]}
            <main>
                <Table 
                tableData={breachData} 
                columns={[
                    {key: 'breach_identifier', name: 'Leak'},
                    {key: 'Breach.Domain', name: 'Domain', render: val => `<a href="https://${val}">${val}</a>`},
                    {key: 'Breach.PwnCount', name: 'Pwn Count'},
                    {key: 'Breach.IsVerified', name: 'Is Verified', render: val => val ? 'Verified' : 'Not Verified'},
                    {key: 'IsAcknowledged', name: 'Acknowledged', render: val => `<input type="checkbox" ${val ? "checked" : ""} disabled>`}
                ]} 
            />
            

            
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
        
        display: flex;
        flex-direction: column;
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

    @media only screen and (min-width: 800px){
        main{
            display: grid;
            grid-template-rows: 2fr 2fr;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            max-width: 100%;
        }   
    }

</style>