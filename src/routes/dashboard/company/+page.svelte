<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { user } from "$lib/authStore";
  import { onMount } from "svelte";
  import { scanBatch } from '$lib/scan';
  import Table from "../../../components/Table.svelte";
  import Modal from "../../../components/Modal.svelte";
  import Loader from "../../../components/Loader.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Results from "../../../components/Results.svelte";
  let companyInfo: any;
  let isModalOpen = false;
  let loading = true;

  let employeeEmails = "";
  let companyName = "";
  let company_id: number;
  let domain = "";

  let emailSearching = false;
  let employeeEmailsFromSearch: any[] = [];

  let addEmailsModal = false;

  let newEmails = "";

  // $: console.log(companyInfo)

  async function updateCompanyEmails() {
    
    // Split the input by commas, then trim each email to remove whitespace
    const emailsCleaned = newEmails.split(",").map(email => email.trim());

    // Combine the old emails with the new ones
    let compoundEmails = [...new Set([...companyInfo[0].Company.employee_emails, ...emailsCleaned])];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validEmails = [...compoundEmails.filter(email => emailRegex.test(email))];


    // Uncomment the below code when you're ready to update the database
    supabase
      .from('Company')
      .update({ employee_emails: validEmails })
      .eq('id', company_id)
      .select()
      .then((res) => {
        closeEmailsModal()
      }) 
  } 

  async function removeEmail(emailToRemove:string) {
    supabase
      .from('Company')
      .update({ employee_emails: companyInfo[0].Company.employee_emails.filter((email:string) => email !== emailToRemove) })
      .eq('id', company_id)
      .select()
      .then((res) => { 
        console.log(res)
      }) 
  }



  let searchTerm = '';
  let filteredEmails = companyInfo && companyInfo[0].Company.employee_emails.filter((email: string | string[]) => email.includes(searchTerm));

  $: filteredEmails = companyInfo && companyInfo[0]?.Company?.employee_emails ? 
    companyInfo[0].Company.employee_emails.filter((email: string | string[]) => email.includes(searchTerm)) :
    [];

  const rowsPerPage = 10;
  let currentPage = 1;    
  let totalPages:number
  $: {
    totalPages = Math.ceil(filteredEmails.length / rowsPerPage)
  }

  function nextPage() {
      if (currentPage < totalPages) {
          currentPage += 1;
      }
  }

  function previousPage() {
      if (currentPage > 1) {
          currentPage -= 1;
      }
  }

  let displayedEmails:string[]

  $:{
    displayedEmails = filteredEmails.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }




  const searchdomainToemail = async (companyName:string) => {
    emailSearching = true
    try{
      const response = await fetch("/domainToEmail", {
        method: "POST",
        body: JSON.stringify({'employer': companyName}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json()
      // console.log(responseData)
      employeeEmailsFromSearch = responseData.profiles
    }
    catch(error){
      console.error(error)
    }
    emailSearching = false
    
  }

  async function handleSubmit() {
    const emailArray = employeeEmails.split(",").map((email) => email.trim());
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!domain.includes("http://") && !domain.includes("https://")) {
      alert('Invalid format: provide http:// or https://')
      throw Error("Invalid domain format: provide http:// or https://");
    }
    const validEmails = [...emailArray.filter(email => emailRegex.test(email)), $user?.user.email];


    supabase
      .from("Company")
      .upsert({
        company_name: companyName,
        company_admin: $user?.user.id,
        employee_emails: validEmails,
        domain: domain,
      })
      .select()
      .then((res) => {
        if (!res.error) {
          supabase
            .from("User_Company")
            .upsert({
              user_id: $user?.user.id,
              company_id: res.data[0].id,
              role: "admin",
              user_email: $user?.user.email,
            })
            .then((res) => {
              // console.log(res);
              isModalOpen = false;
            });
            goto("/dashboard/company");
          
        } else {
          console.log(res.error);
        }

      });

    
  }

  let downloadPresent = false

  $: if (company_id) {
    supabase
      .from("User_Company")
      .select(
        `
            *,
            Users ( FirstName, LastName, auth_uuid ),
            Company ( company_name, employee_emails )
        `
      )
      .eq("company_id", company_id)
      .then((res) => {
        if (res.data?.length && res.data.length > 0) {
          let counts;
          getUserBreachCounts(res.data).then((res) => {
            companyInfo = res;
          });
        }
      });
  }

  onMount(() => {
    supabase
      .from("Company")
      .select("id")
      .eq("company_admin", $user?.user.id)
      .then((res) => {
        if (res.data && res.data[0]) {
          company_id = res.data[0].id;
          if (company_id) {
            supabase
              .from("User_Company")
              .select(
                `
                    *,
                    Users ( FirstName, LastName, auth_uuid ),
                    Company ( company_name, employee_emails )
                `
              )
              .eq("company_id", company_id)
              .then((res) => {
                if (res.data?.length && res.data.length > 0) {
                  let counts;
                  getUserBreachCounts(res.data).then((res) => {
                    companyInfo = res;
                    supabase
                      .storage
                      .from('company_breaches')
                      .list(companyInfo[0].Company.company_name, {
                        limit: 100,
                        offset: 0,
                        sortBy: { column: 'name', order: 'asc' }
                      })
                      .then((res) => {
                        if(res.data && res.data.length > 0){
                          downloadPresent = true
                        }   
                      })
                      .catch((err) => {

                      })
                  });
                }
              });
          }
        }
        loading = false;
      });


    

    const Company = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Company' },
        (payload) => {
          if(payload.eventType = "UPDATE"){
            // @ts-ignore
            companyInfo[0].Company.employee_emails = payload.new.employee_emails
          }
        }
      )
      .subscribe()
  });

  async function getUserBreachCounts(data: any[]) {
    const output = await Promise.all(
      data.map(async (user) => {
        const { data: userData, error } = await supabase
          .from("User_Breaches")
          .select("*")
          .eq("user_identifier", user.user_id);

        // Append the length of the returned data to the original user object
        if (userData) {
          user["breach_count"] = userData.length;
        } else {
          user["breach_count"] = 0; // or any default value
        }

        return user;
      })
    );
    return output;
  }





  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function closeEmailsModal() {
    addEmailsModal = false;
  }

  function openEmailModal() {
    addEmailsModal = true
  }

  let uploadBlob: Blob | undefined = undefined
  let uploading = false;
  let uploaded = ''

  // Upload file using standard upload
  async function uploadFile(file: string | FormData | ArrayBuffer | ArrayBufferView | Blob | Buffer | File | NodeJS.ReadableStream | ReadableStream<Uint8Array> | URLSearchParams) {
    uploading = true
    const filePath = `${companyInfo[0].Company.company_name}/${companyInfo[0].Company.company_name}.json`;  // Define your file path and name
    supabase.storage.from('company_breaches').upload(filePath, file, {
      upsert: true
    })
    .then((res) => {
      console.log(res)
      uploading = false;
      console.log('File uplaoded successfully: ', res.data)
      goto('/dashboard/company')
    })
    .catch((err) => {
      alert('Error uploading file')
      console.error('Error uploading file:', err.err);
    })
  }

  async function downloadFile(){
    const { data, error } = await supabase
      .storage
      .from('company_breaches')
      .download(`${companyInfo[0].Company.company_name}/${companyInfo[0].Company.company_name}.json`)
    const fileBlob = data
    if(fileBlob){
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${companyInfo[0].Company.company_name}_breachdata.json`;

      // Append the anchor to the body and click it to start the download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  let batchScanResults: string | any[] = []
  let batchscanning = false;

  

  async function scanBatchEmails() {
    batchscanning = true;
    try {
        const res = await scanBatch(companyInfo[0].Company.employee_emails);
        batchScanResults = res;
        batchscanning = false;

        // Convert res to JSON string
        const jsonContent = JSON.stringify(res, null, 2);

        // Create a Blob from the JSON string
        const blob = new Blob([jsonContent], { type: 'application/json' });
        uploadBlob = blob
        // Upload this Blob to Supabase
    } catch (err) {
        console.error('Error:', err);
    }
  }


  

</script>

{#if loading}
  <div class="loader">
    <title>Company Security Dashboard | ISAIX Multi-Email Monitoring</title>

    <Loader />
  </div>
{:else}
  <main>
    <title>Company Security Dashboard | ISAIX Multi-Email Monitoring</title>

    {#if companyInfo}
      <h2>{companyInfo[0].Company.company_name}</h2>
      <h3>Registered Users</h3>
      <Table
        tableData={companyInfo}
        columns={[
          { key: "role", name: "Role" },
          { key: "Users.FirstName", name: "First Name" },
          { key: "Users.LastName", name: "LastName" },
          { key: "user_email", name: "Email" },
          { key: "breach_count", name: "Breach Count" },
        ]}
      />
      <section>
        {#if addEmailsModal}
          <Modal on:close={closeEmailsModal}>
            <div class="modal">
              <h2>Add Emails</h2>
              <form action="" on:submit|preventDefault={updateCompanyEmails}>
                <label for="emails" class="emailsTextAreaLabel">
                  Emails:
                  <textarea name="emails" id="" cols="30" rows="10" bind:value={newEmails} placeholder="Enter Emails separated by commas"></textarea>
                </label>
                <button type="submit" >Submit</button>
              </form>
            </div>
          </Modal>
        {/if}
        <div class="employeeEmails">
          <div class="emailsHeader">
            <h3>Employee Emails</h3>
            <button on:click={openEmailModal}>Add Emails</button>
            {#if batchscanning}
              <Loader />
            {:else}
              <button on:click={() => scanBatchEmails()} >Scan Emails</button>
            {/if}
            {#if uploadBlob}
              <button on:click={() => {
                if(uploadBlob){
                  uploadFile(uploadBlob)
                }
                }}>Upload data to storage</button>
            {:else if uploading}
              <p>Uploading</p>
            {/if}
            {#if downloadPresent}
                <button on:click={async () => {await downloadFile()}}>Download Breaches</button>
            {/if}
          </div>
          
          
          {#if companyInfo}
          <div class="tablecontainer">

          <div class="searchBar">
              <input bind:value={searchTerm} placeholder="Search by email" />
          </div>
            <table>
              <thead>
                  <tr>
                      <th>Email Addresses</th>
                      <th>Tools</th>
                  </tr>
              </thead>
              <tbody>
                {#if displayedEmails && displayedEmails.length}
                    {#each displayedEmails as email (email)}
                        <tr>
                            <td>{email}</td>
                            <td class="svgIcon">
                              <button on:click={() => removeEmail(email)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" fill="white"/>
                                </svg>
                              </button>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td>No emails found.</td>
                        <td></td>
                    </tr>
                {/if}
            
              </tbody>
            </table>
            <div class="pagination">
                <button on:click={previousPage}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button on:click={nextPage}>Next</button>
            </div>
            
          </div>
          {/if}
        </div>
        
        <!-- <div class="batchResults">
          {#if batchScanResults.length > 0}
            {#each batchScanResults as leaks}
            <h2>Leaks from {leaks.email}</h2>
              <div class="scanresults">
                <Results leaks={leaks.breaches}/>
              </div>
            {/each}
          {/if}
        </div> -->
        <h2>Employee Email Discovery</h2>
        <h4>Click below to scan for employee emails available on the web</h4>
        {#if !emailSearching}
          <button on:click|once={() => searchdomainToemail(companyInfo[0].Company.company_name)}>Search</button>
        {:else}
          <Loader />
        {/if}
        {#if employeeEmailsFromSearch}
          {#each employeeEmailsFromSearch as employee}
            <div>
              {employee.name}
            </div>
          {/each}
        {/if}
      </section>
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
                <input
                  type="text"
                  required
                  bind:value={companyName}
                  placeholder="ACME Inc"
                />
              </label>
              <label for="domain">
                Company Domain:
                <input type="text" bind:value={domain} placeholder="http://ACME.com" />
              </label>
              <label for="domain">
                Employee Emails:
                <input type="text" bind:value={employeeEmails} placeholder="example@example.com, example1@example1.com" />
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

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

  .svgIcon{
    justify-self: right;
  }

  svg{
    padding-top: 3px;
    width: 20px;
    height: 20px;
  }
  .emailsTextAreaLabel{
    display: flex;
    flex-direction: column;
  }

  .emailsTextAreaLabel > textarea {
    padding: 0.5rem;
    color: black;
  }

  .emailsHeader{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    padding-bottom: 1rem;
  }

.searchBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1rem;
}

.searchBar input {
    padding: 0.5rem;
    border: 1px solid var(--accent);
    transition: border 0.3s ease;
}

.searchBar input:focus {
    border: 1px solid var(--background);
    outline: none;
}


.tablecontainer {
  padding-top: 1rem;
  overflow-x: auto;
  grid-row: 1 / span 2; 
  grid-column: 1 / span 2;
  width: 100%;
}

    table {
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

    th:nth-child(2), td:nth-child(2) {
        width: 50px; /* This can be adjusted based on your needs */
        white-space: nowrap; /* Ensures the content does not wrap and the cell doesn't grow vertically */
        text-align: center;
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
  .employeeEmails{
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  section{
    width:100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  section > *{
    width: max-content;
  }
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }
  button {
    background-color: var(--accent);
    padding: 0.5rem 1.5rem;
    border-radius: 1rem;
    transition: all 1s ease;
    width: 150px;
  }

  .modal {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button:hover {
    transform: scale(1.05);
  }

  .modal > * {
    color: black;
  }

  label {
    color: black;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  input {
    color: black;
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid grey;
  }

  input:focus {
    outline: none;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1.5rem;
  }
  .loader {
    width: 100%;
    display: grid;
    place-content: center;
  }

  h3{
    width: 100%;
    justify-self: flex-start;
    text-decoration: underline;
    
  }

  .scanresults{
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 10rem;
    gap: 5rem;
    height: min-content;
  }
</style>
