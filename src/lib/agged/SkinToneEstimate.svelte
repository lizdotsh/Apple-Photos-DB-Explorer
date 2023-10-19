<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte";
    export let person_group_stats;
    export let start_date;
    export let end_date;
    import { styleTitle, genDateSubtitle } from "../utils.js";  
    const tones =['Light to Pale White', 'White to Fair', 'Fair to Olive', 'Olive to Moderate Brown', 'Brown to Dark Brown', 'Very Dark Brown to Black', 'other/unknown'];
  
    const eachEthnicityZero = tones.map((d) => {
      return { skin_tone_estimate: d, count: 0, pct: 0 };
    });
    function fixthisshit(stats) {
      if (!stats) {
        return null;
      }
      // console.log(stats);
      const ethnic_estimate_stats = stats.map((d) => d.skin_tone_estimate);
      // console.log(ethnic_estimate_stats);
      eachEthnicityZero.forEach((e) => {
        if (!ethnic_estimate_stats.includes(e.skin_tone_estimate)) {
          stats.push(e);
        }
        
      });
      return stats;
    }
    let filt;
    $: {
      if (person_group_stats){
      filt = fixthisshit(person_group_stats?.skin_tone_estimate);
      }
     } //?.concat(eachEthnicityZero)

  </script>
  
  {#if filt}
    <PlotRender
      options={{
        x: { label: "Percent of selected photos", line: true, percent: false },
        title: styleTitle("Skin Tone"),
        subtitle: genDateSubtitle(start_date, end_date),
        height: 250,
        color: {
          legend: true,
          domain: tones,
          label: "Detected Skin Tone",
          columns: 4,
        },
        y: {
          label: "Detected Skin Tone",
          domain: tones,
        },
        
        marginLeft: 150,
        marginRight: 40,
  
        marks: [
          Plot.barX(filt, {
            x: "pct",
            y: "skin_tone_estimate",
            fill: "skin_tone_estimate",
            channels: { "Photo Count": "cnt" },
            tip: {
              format: {
                fill: true,
                x: (d) => `${d.toFixed(1)}%`,
                Count: true,
                y: false,
              },
            },
            label: true,
            //  sort: { y: "x", reverse: true },
          }),
          
          Plot.text(filt, {
            x: "pct",
            y: "skin_tone_estimate",
            text: (d) => `${d.pct.toFixed(0)}%`,
            dx: 15,
        
          }),
        ],
      }}
    />
  {:else}
    <p>Waiting for data...</p>
  {/if}
  