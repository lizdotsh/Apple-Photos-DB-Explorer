<script>
    export let name_count;
    export let elm_name;
    export let person;
    let filt;
    let selected_count;
    import * as aq from "arquero";

    $: name_count.then((d) => {
        filt = aq.from(d)
    }).catch((e) => {
        console.log(e)
    });
    $:{
        selected_count = filt
    ?.params({elm_name})
    .filter((d, $) => d.full_name === $.elm_name)
    .rollup({count: aq.op.sum("count")})
    .objects()[0]?.count ?? "error"
}

    $: console.log(selected_count, filt);
  </script>
  {#if filt && person}
  <div class="flex-container-col">
<!-- <div id="total-count">
    <b>Total Photos of {elm_name}: </b>{person?.count ?? "N/A"} 
  </div>
<div id="selected-count">
    <b>{selected_count} / {person?.count ?? "N/A"}</b> photos of {elm_name} selected.
  </div> -->
  <!-- <div id="end-date">
    <b>Earliest Photo: </b>{person?.start_date ?? "N/A"} 
  </div>
  <div id="end-date">

    <b>Latest Photo: </b>  {person?.end_date ?? "N/A"}
  </div> -->

  <div>
    Showing photos  of <b>{elm_name}</b>, you have selected <b>{selected_count}</b> of their <b>{person?.count ?? "N/A"}</b> total photos.
  </div>
<div>Note: graphs unreliable if no photos in date range</div>
  </div>  

  
{/if} 

<style>
    .flex-container-col {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }
</style>