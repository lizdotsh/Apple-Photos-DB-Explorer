<script>
  let name;
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./lib/Plot.svelte";
  // arquero
  import * as aq from "arquero";
  import * as d3 from "d3";
  import SortedPhotosBar from "./lib/person_agnostic/SortedPhotosBar.svelte";
  import SortedPhotosTimeLine from "./lib/SortedPhotosTimeLine.svelte";
  import SortedPhotosTimeLinePlotly from "./lib/SortedPhotosTimeLinePlotly.svelte";

  let photos_per_user;
  let names_ids;
  let elm_name;

  // Send SQL query to main process
  window.myAPI.sendSQL([
    {
      name: "photos_per_user",
      query: `
        select 
        full_name, 
        year_month,
        sum(count) as count
        from photo_info_rollup_monthly
        group by 1,2
        order by count desc;
      
      `
    },
    {
      name: "names_ids",
      query: `select person_uuid, full_name, sum(count) as count
                from photo_info_rollup_monthly where person_uuid != "no_person"
                and full_name != "no_name"
                and full_name != "no_face"
                group by 1,2 order by count desc;`,
    },
    {
        name: "photos_per_user_daily",
        query: `
          select 
          full_name, 
          date,
          sum(count) as count
          from photo_info_rollup_daily
          group by 1,2
          order by count desc
        
        `
    }
  ]);
  let photos_per_user_daily;
  const ym_to_dt = d3.timeParse("%Y-%m");
  // Receive SQL results
  window.myAPI.receiveSQLResults((results) => {
    console.log(results);
    photos_per_user = aq.from(
      results.photos_per_user
    ).orderby("year_month");
    photos_per_user_daily = aq.from(
      results.photos_per_user_daily
    ).orderby("date");
  //  .derive({rolling_count: aq.rolling(d => aq.op.average(d.count), [-60, 0])});
    names_ids = results.names_ids;
    console.log(photos_per_user);
    //  user_time = results.photos_per_user;
  });
  $: console.log(photos_per_user);
  $: console.log(elm_name);
  $: console.log(filtered_photos);

  $: filtered_photos = photos_per_user?.params({ name: elm_name })
    .filter((d, $) => d.full_name === $.name)
    .orderby("year_month");
    //.derive({
     // year_month: (d) => faq.op.parse_date(d.year_month),
   // }).orderby("year_month");
  /*   $: filtered_photos_daily = photos_per_user_daily
    ?.params({ name: elm_name })
    .filter((d, $) => d.full_name === $.name)
    .derive({
      date: (d) => aq.op.parse_date(d.date),
    }).orderby("date"); */
    $: filtered_photos_daily = photos_per_user_daily
    ?.params({ name: elm_name })
    .filter((d, $) => d.full_name === $.name)
    .orderby("date");
    $: console.log(filtered_photos_daily)
</script>

<!-- Random Normal -->

<h1>Apple Photos DB Explorer</h1>
<!-- ... -->
{#if typeof names_ids !== "undefined"}
  <select bind:value={elm_name}>
    {#each names_ids as name_entry}
      <option value={name_entry.full_name}>{name_entry.full_name}</option>
    {/each}
  </select>
  <h2>
    You have selected {elm_name}, they have {names_ids?.find(
      (e) => e.full_name === elm_name
    )?.count ?? "N/A"} Photos!
  </h2>
{:else}
  <p>Waiting for data...</p>
{/if}

<!-- ... -->

<!-- make component smaller -->




<SortedPhotosBar name_count={photos_per_user} />

{#if filtered_photos}
<!--  <SortedPhotosTimeLine filt_tab={filtered_photos} /> -->
  <SortedPhotosTimeLinePlotly table={filtered_photos_daily} width = "20%"/>
{:else}
  <p>Waiting for data...</p>
{/if}
