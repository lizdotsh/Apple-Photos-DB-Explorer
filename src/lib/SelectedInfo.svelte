<script>
    export let name_count;
    export let elm_name;
    export let person;
    let filt;
    let selected_count;
    import * as aq from "arquero";
    function process_filt(flt, name){
        flt.then(d => {
            selected_count = aq.from(d)
            .params({name})
            .filter((d, $) => d.full_name === $.name)
            .rollup({count: aq.op.sum("count")})
            .objects()[0]?.count ?? "error"
        }).catch(e => {
            console.log(e)
        });
    }
    $: name_count.then((d) => {
        filt = aq.from(d)
    }).catch((e) => {
        console.log(e)
    });
   

    $: console.log(selected_count, filt);
  </script>
  {#if filt && person}
  <div class = "flex-container-col">
    {selected_count} of {person?.count ?? "N/A"} photos selected.
  </div>

  
{/if} 

<style>
    .flex-container-col {
    box-sizing: border-box;
    width: 100%;
  }
</style>