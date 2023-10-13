<script>
    export let name_count;
    export let elm_name;
    export let person;
    let filt;
    let selected_count;
    import * as aq from "arquero";

    $: name_count.then((d) => {
        filt = aq.from(d)
    })
    $: selected_count = filt
    ?.params({elm_name})
    ?.filter((d, $) => d.full_name === $.elm_name)
    ?.rollup({count: aq.op.sum("count")})
    ?.objects()[0]?.count ?? "error"

    $: console.log(selected_count, filt);
  </script>
  {#if filt && person}
    
  <h2>
    You have selected {elm_name}, they have {person?.count ?? "N/A"} Photos total. You have selected {selected_count} photos.
  </h2>
  <p>
    You first uploaded a photo of {elm_name} on {
        person?.start_date ?? "N/A"
    } and last uploaded a photo of {elm_name} on {
        person?.end_date ?? "N/A"
    }. 
  </p>

  
{/if} 