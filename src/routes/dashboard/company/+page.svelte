<script lang="ts">
    import { supabase } from '$lib/supabaseClient'
    import { user } from '$lib/authStore';
    import { onMount } from 'svelte';
    import Table from '../../../components/Table.svelte';
    import Modal from '../../../components/Modal.svelte';
    import Loader from '../../../components/Loader.svelte';
    import { set } from 'date-fns';
    import { goto } from '$app/navigation';
    let companyInfo:any
    let isModalOpen = false;
    let loading = true

    let employeeEmails = '';
    let companyName = ''
    let company_id:number;
    async function handleSubmit() {
        const emailArray = employeeEmails.split(',').map(email => email.trim());
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const validEmails = emailArray.filter(email => emailRegex.test(email));
        console.log(companyName)
        console.log(validEmails);

        supabase
            .from('Company')
            .upsert({
                'company_name': companyName,
                'company_admin': $user?.user.id
            })
            .select()
            .then((res) => {
                
                if (!res.error){
                    supabase
                        .from('User_Company')
                        .upsert({
                            user_id: $user?.user.id,
                            company_id: res.data[0].id,
                            role: 'admin',
                            user_email: $user?.user.email,

                        })
                        .then((res) => {
                            console.log(res)
                        })
                    isModalOpen = false
                }
                else{
                    console.log(res.error)
                }
            })

            goto('/dashboard/company')
        
    }

    

    onMount(() => {
        supabase
            .from('Company')
            .select('id')
            .eq('company_admin', $user?.user.id)
            .then((res) => {
                if(res.data && res.data[0]){
                    console.log(res.data)
                    company_id = res.data[0].id
                }
                loading = false
            })
        
    })

    $: if(company_id){
        console.log(company_id)
        supabase
        .from('User_Company')
        .select(`
            *,
            Users ( FirstName, LastName, email ),
            Company ( company_name )
        `)
        .eq('company_id', company_id)
        .then((res) => {
            console.log(res)
            if(res.data?.length && res.data.length > 0){
            companyInfo = res.data[0];
            console.log(res.data[0]);
            }   
        })
    }
    


  
    function openModal() {
      isModalOpen = true;
    }
  
    function closeModal() {
      isModalOpen = false;
    }

  </script>
  {#if loading}
    <div class="loader">
        <Loader />
    </div>
    
  {:else}
  <main>
    {#if companyInfo}
      <h2>{companyInfo.Company.company_name}</h2>
      <Table 
      tableData={[companyInfo]} 
      columns={[
          {key: 'role', name: 'User email'},
          {key: 'Users.FirstName', name: 'First Name'},
          {key: 'Users.LastName', name: 'LastName'},
          {key: 'user_email', name: 'Email'}
      ]} 
  />
  
    {:else}
      <h2>You have not set up a company yet</h2>
      <button on:click={openModal}>
        <h2>Click here to begin</h2>
      </button>
      {#if isModalOpen}
        <Modal on:close={closeModal}>
          <div class="modal">
            <h2>Company Creation</h2>
            <form on:submit|preventDefault={handleSubmit}>
                <label for="name">
                  Company Name:
                  <input type="text" required bind:value={companyName} placeholder="ACME Inc">
                </label>
                <label for="emails">
                  Employee emails:
                  <input type="text" bind:value={employeeEmails} placeholder="Enter emails separated by commas">
                </label>
                <button type="submit">Submit</button>
              </form>
          </div>
        </Modal>
      {/if}
    {/if}
  </main>
  {/if}
  

<style>
    main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }
    button{
        background-color: var(--accent);
        padding: 0.5rem 1.5rem;
        border-radius: 1rem;
        transition: all 1s ease;

    }

    .modal{
        display: flex;
        flex-direction: column;
        gap: 2rem;display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    button:hover{
        transform: scale(1.05)
    }

    .modal > * {
        color: black;
        
    }

    label{
        color: black;
        display: flex;
        flex-wrap:wrap;
        gap: 1rem;
    }
    input {
        color: black;
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid grey;
    }

    input:focus{
        outline: none;
    }

    form{
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1.5rem;

    }
    .loader{
        width:100%;
        display: grid;
        place-content: center;
    }
</style>