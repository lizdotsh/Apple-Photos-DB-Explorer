<script>
    let name;
    import * as Plot from "@observablehq/plot";
    import PlotRender from './Plot.svelte';
    // arquero
    import * as aq from "arquero";
    
    import * as d3 from 'd3';
  import { not_equal } from "svelte/internal";
  import SortedPhotosBar from "./person_agnostic/SortedPhotosBar.svelte";
  
    let photos_per_user;
    let names_ids;
    window.myAPI.sendSQL(`select person_uuid, full_name, sum(count) as count
    from photo_info_rollup
    where person_uuid != 'no_person'
    and full_name != 'no_name'
    group by 1,2
    order by count desc;`);

    window.myAPI.receiveSQLResults((results) => {
      names_ids = (results);  // Notice the change here
      console.log(names_ids);
    });
 
    // Send SQL query to main process
    window.myAPI.sendSQL(`
    SELECT full_name, gender_estimate, year_month, SUM(count) AS count FROM photo_info_rollup GROUP BY 1,2 ORDER BY count DESC;`);
  
    // Receive SQL results
    window.myAPI.receiveSQLResults((results) => {
      photos_per_user = aq.from(results);  // Notice the change here
      console.log(photos_per_user);
    });
    
    
    

  </script>
  
  <!-- Random Normal -->
  
  {name}
  <p>{photos_per_user}</p>
 
  
  <!-- Title and basic description of page -->
    <h1>Apple Photos DB Explorer</h1>

  <!-- Selector of unique names in names_ids -->
  {#if names_ids} 
    <select bind:value={name}>
        {#each names_ids as name}
        <option value={name.full_name}>{name.full_name}</option>
        {/each}
    </select>
    {:else}
    <p>Waiting for data...</p>
{/if}

 <p>   Hello {name.full_name} with {name.count} photos! </p>
<!-- get selected option value-->


  <div class="container">
    <div class="column">
      <div class="col-md-6">
        <h2>Photos per User</h2>
        <p>Number of photos per user</p>
        <SortedPhotosBar name_count={photos_per_user} />
      </div>
      <div class="col-md-6">
        <h2>Photos per User</h2>
        <p>Number of photos per user</p>
        <SortedPhotosBar name_count={photos_per_user} />
      </div>
    </div>  
    </div>
    
