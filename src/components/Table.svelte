<script lang="ts">
    import { onMount } from "svelte";
    
  
    export let tableData: any[];
    export let columns: {key: string, name: string, render?: (val: any) => string}[];
    let filteredData: any[] = [];
    let searchQuery = '';
    let searchColumn = columns[0].key; // default search column
    let currentPage = 0;
    const itemsPerPage = 10;
    let maxPages = 0;
  
    function getNestedProp(obj: any, path: string) {
      return path.split('.').reduce((o, p) => (o && o[p] ? o[p] : ''), obj);
    }

  
    const searchFunction = (item:any) => {
      const columnData = getNestedProp(item, searchColumn).toString();
      return columnData.toLowerCase().includes(searchQuery.toLowerCase());
    }
  
    $: {
      if(tableData && searchQuery) {
        
        filteredData = tableData.filter(searchFunction);
      } else {
        filteredData = tableData;
      }
    }
  
    function goToPage(page: number) {
      currentPage = page;
    }
  
    onMount(() => {
      maxPages = Math.ceil(tableData.length / itemsPerPage);
    })

    function nextPage() {
      if (currentPage < maxPages - 1) {
        currentPage++;
      }
    }

    function prevPage() {
      if (currentPage > 0) {
        currentPage--;
      }
    }

    // If using reactive statements to compute maxPages
    $: maxPages = tableData ? Math.ceil(tableData.length / itemsPerPage) : 0;
</script>
  
  {#if tableData && filteredData}
    <div class="tablecontainer">
        {#if maxPages > 1}
          <div class="pagination">
              <button on:click={prevPage} disabled={currentPage === 0}>Previous</button>
              <span>Page {currentPage + 1} of {maxPages}</span>
              <button on:click={nextPage} disabled={currentPage === maxPages - 1}>Next</button>
          </div>
        {/if}
        <div class="tablecontrols">
            <input type="text" bind:value={searchQuery} placeholder="Search..." />
            <select bind:value={searchColumn}>
                {#each columns as column (column.key)}
                <option value={column.key}>{column.name}</option>
                {/each}
            </select>
        </div>
        <table>
        <thead>
          <tr>
            {#each columns as {name}}
              <th>{name}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) as item, index (index)}
            <tr>
              {#each columns as column}
                <td>
                  {@html column.render 
                    ? column.render(getNestedProp(item, column.key)) 
                    : getNestedProp(item, column.key)
                  }
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  <!-- your styles go here -->
  

<style>

  .pagination button{
      background-color: var(--accent);
      padding: 0.5rem 1rem;
    }

  .pagination button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
  }

  

    .tablecontrols{
        display: flex;

    }
    select{
        color: black;
        padding: 0.5rem;
    }
    select:focus{
        outline: none;
    }
    .tablecontrols {
        margin-bottom: 1em;
    }

    .tablecontrols input {
        padding: 0.5em;
        width: 100%;
        box-sizing: border-box;
        color: black;
    }

    input:focus{
        outline: none;
    }

    .pagination {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 1rem 0;
        align-items: center;
        overflow: scroll;        
    }

    .pagination > button{
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
    }

    .pagination > .active{
        background-color: var(--accent)
    }

    .tablecontainer {
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
        width: min-content;
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
</style>
