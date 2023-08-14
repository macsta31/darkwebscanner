<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { user } from "$lib/authStore";
  import { onMount } from "svelte";
  import Table from "../../../components/Table.svelte";
  import Modal from "../../../components/Modal.svelte";
  import Loader from "../../../components/Loader.svelte";
  import { goto } from "$app/navigation";
  let companyInfo: any;
  let isModalOpen = false;
  let loading = true;

  let employeeEmails = "";
  let companyName = "";
  let company_id: number;
  let domain = "";

  let emailSearching = false;
  let employeeEmailsFromSearch: any[] = [];

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
      throw Error("Invalid email format: provide http:// or https://");
    }
    // const validEmails = [...emailArray.filter(email => emailRegex.test(email)), $user?.user.email];
    // console.log(companyName)
    // console.log(validEmails);

    supabase
      .from("Company")
      .upsert({
        company_name: companyName,
        company_admin: $user?.user.id,
        employee_emails: [$user?.user.email],
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
              console.log(res);
            });
          isModalOpen = false;
        } else {
          console.log(res.error);
        }
      });

    goto("/dashboard/company");
  }

  onMount(() => {
    supabase
      .from("Company")
      .select("id")
      .eq("company_admin", $user?.user.id)
      .then((res) => {
        if (res.data && res.data[0]) {
          company_id = res.data[0].id;
        }
        loading = false;
      });
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

  $: if (company_id) {
    supabase
      .from("User_Company")
      .select(
        `
            *,
            Users ( FirstName, LastName, auth_uuid ),
            Company ( company_name )
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
      <h2>{companyInfo[0].Company.company_name}</h2>
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
                <input type="text" bind:value={domain} placeholder="ACME.com" />
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

  section{
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
    border-radius: 0.5rem;
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
</style>
