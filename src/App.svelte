<script>
  let name;
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./Plot.svelte";
  // arquero
  import * as aq from "arquero";

  import SortedPhotosBar from "./person_agnostic/SortedPhotosBar.svelte";
  import SortedPhotosTimeLine from "./SortedPhotosTimeLine.svelte";

  let photos_per_user;
  let names_ids;

  // Send SQL query to main process
  window.myAPI.sendSQL([
    {
        name: 'photos_per_user',
        query: `SELECT full_name, gender_estimate, year_month, SUM(count) 
        AS count FROM photo_info_rollup GROUP BY 1,2 ORDER BY count DESC;`,
    },
    {
        name: 'names_ids',
        query: `select person_uuid, full_name, sum(count) as count
                from photo_info_rollup where person_uuid != "no_person"
                and full_name != "no_name"
                and full_name != "no_face"
                group by 1,2 order by count desc;`,
    }
]);

  // Receive SQL results
  window.myAPI.receiveSQLResults((results) => {
    console.log(results)
    photos_per_user = aq.from(results.photos_per_user); // Notice the change here
    names_ids = results.names_ids;
    console.log(photos_per_user);
  });
let elm_name = 'Waiting...'
</script>

<!-- Random Normal -->


<h1>Apple Photos DB Explorer</h1>
<!-- ... -->
{#if typeof names_ids !== 'undefined'}
  <select bind:value={elm_name}>
    {#each names_ids as name_entry}
      <option value={name_entry.full_name}>{name_entry.full_name}</option>
    {/each}
  </select>
  <h2>You have selected {elm_name}, they have {names_ids?.find(e => e.full_name === elm_name)?.count ?? 'N/A'} Photos!</h2>
{:else}
  <p>Waiting for data...</p>
{/if}


<!-- ... -->

<!-- get selected option value-->

<SortedPhotosBar name_count={photos_per_user} />


  <SortedPhotosTimeLine olap_table={photos_per_user?.filter(
    d => d.full_name == elm_name)
  } chosen_name={elm_name} />


