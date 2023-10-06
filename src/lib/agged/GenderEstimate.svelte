<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let person_group_stats;
    import * as aq from "arquero";

    let gender;
    $: person_group_stats.then((data) => {
  
      gender = aq.from(data)
        .groupby("gender_estimate")
        .rollup({ cnt: (d) => aq.op.sum(d.count) })
        .orderby("cnt")
        .ungroup()
        .derive({ pct: (d) => d.cnt / aq.op.sum(d.cnt) })
        .orderby()
    
      // face_expression_estimate
  
      //   console.log(df);
    });
  </script>
  
  {#if gender}
  <PlotRender
    options={{
      x: { label: "Percent of Total", percent: true },
      marginBottom: 120,
      color: {
        legend: true,
        type: "categorical",
        domain: ["Male", "unknown", "Female"],
        range: ["#5778a4", "#6a9f58", "#f1a2a9"],
      },
      tip: {
        format: {
          name: true,
          fill: (d) => `${d}%`,
        },
      },
      marks: [
        Plot.barX(gender, {
          x: "pct",
          fill: "gender_estimate",
          tip: {
            format: {
              x: (d) => `${d.toFixed(2)}%`,
            },
          },
          percent: true,
          order: ['Male', "unknown", "Female"]
         // sort: true,
        }),
      ],
    }}
  />
  {:else}
    <p>Waiting for data...</p>
  {/if}
  