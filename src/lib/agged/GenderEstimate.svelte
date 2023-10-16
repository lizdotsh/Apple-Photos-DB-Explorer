<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let person_group_stats;
    import * as aq from "arquero";

    // let gender;
    // $: person_group_stats.then((data) => {
  
    //   gender = aq.from(data)
    //     .groupby("gender_estimate")
    //     .rollup({ cnt: (d) => aq.op.sum(d.count) })
    //     .orderby("cnt")
    //     .ungroup()
    //     .derive({ pct: (d) => d.cnt / aq.op.sum(d.cnt) })
    //     .orderby()
    
      // face_expression_estimate
  
      //   console.log(df);
    // }).catch((e) => {
    //     console.log(e);
    //   });
  </script>
  
  {#if person_group_stats}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", percent: false },
      //correct capitalization
      title: "Gender", 
      height: 100,
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
        Plot.barX(person_group_stats.gender_estimate, {
          x: "pct",
          fill: "gender_estimate",
          tip: {
            format: {
              x: (d) => `${d.toFixed(1)}%`,
            },
          },
          percent: true,
          order: ['Male', "unknown", "Female"]
         // sort: true,
        }),
        Plot.text(person_group_stats.gender_estimate, {
            x: "pct",
            
            text: (d) => `${((d.pct)).toFixed(0)}%`,
            //center text
            lineAnchor: "middle",
            textAnchor: "beginning",
            frameAnchor: "middle",
            fill: "white",
            //textAnchor: "middle",
        })
      ],
    }}
  />
  {:else}
    <p>Waiting for data...</p>
  {/if}
  