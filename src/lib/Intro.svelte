<script>
  export let person;
  export let people;
  export let person_numeric_scores;

  // <!-- function getPerson(person_id) { -->
  //     // person = people[person_id];
  // // }
  // <!-- $: topPersonNotAll =  -->
  const scores = [
     "Overall Score",
    //   "Blurriness Score",
      "Pleasant Composition Score",
      "Pleasant Lighting Score",
      "Well Framed Subject Score",
      "Well Chosen Subject Score",
    //   "Interesting Subject Score",
      "Pleasant Symmetry Score",
      "Tastefully Blurred Score",



    ];
//   function extractScores(scoreObj) {
//     return .map((score) => {
//       if (!scoreObj) {
//         return {
//           name: score[1],
//           score: "N/A",
//         };
//       }
//       if (score[2]) {
//         return {
//           name: score[1],
//           score: ((scoreObj[score[0]] * 50) + 50).toFixed(2),
//           tooltip: "Higher is better",
//         };
//       }
//       return {
//         name: score[1],
//         score: (scoreObj[score[0]] * 100).toFixed(2),
//       };
//     });
  function format_scores(scoreObj) {
    return scores.map((score) => {
      if (!scoreObj) {
        return {
          name: score,
          score: "N/A",
        };
    }
      return {
        name: score,
        score: (scoreObj[score]).toFixed(1),
      };
    });
  }
  $: formattedScores = format_scores(person_numeric_scores);
</script>

<div class="instructions-flex">
  <div class="text-intro-flex">
    <div class="intro-section">
      <h1>
        Hello {Object.values(people)[1]["full_name"]}!<sup
          class="tooltip"
          title="If this is wrong, you have more photos of someone else than yourself :P"
          >[?]</sup
        >
      </h1>
    </div>
    <div>
      <p>You currently have {person.full_name} selected.</p>
    </div>

    <div>
      <p>
        {#if person.full_name === "All Photos"}
          <b>You currently have no face/name selected.</b> Showing stats for all
          photos in your library (many face-specific stats may be meaningless)
        {/if}
      </p>
    </div>
  </div>

  <!-- <div class="scores-div"> -->
  <div id="overall-score">
    <h2>Overall Score</h2>

    <span style="font-size: 5rem; text-align: center; display: block;">
      {formattedScores[0]["score"]}
    </span>
  </div>
  <div id="other-scores">
    <table>
      {#each formattedScores.slice(1) as score}
        <tr>
          <td>
            {score["name"]}
          </td>
          <td>
            {score["score"]}
          </td>
        </tr>
      {/each}
    </table>
  </div>
  <!-- {#if person_numeric_scores}
      {#each [
        ["curation_score", "Overall Photo: "]
    ] as score}
        {score[1]}: 
        {(person_numeric_scores[score[0]] * 100)?.toFixed(
          2
        )}
      {/each} -->

  <!-- {/if} -->
  <!-- </div> -->

  <div class="instructions-div">
    <h3>Instructions:</h3>
    <p>1. Select a name from the dropdown menu above.</p>
    <p>
      2. Click on the tabs below the app title to see different visualizations.
    </p>
    <p>3. Hover over the visualizations to see more information.</p>
    <p>
      4. Use the date selector to scrub through the stats over time as you wish.
      You can also hit 'play' and have it automatically move it for you :)
    </p>
  </div>
  <!-- 
    <div> 
        <h3>Stats:</h3>
    </div> -->
</div>

<style>
  .tooltip {
    position: relative;
    display: inline-block;
    /* border-bottom: 1px dotted black; */
    font-size: 12px;
  }

  .tooltip:hover::before {
    content: attr(title);
    position: absolute;
    top: -10px;
    left: 20px;
    /* background-color: #333; */
    /* color: #fff; */
    padding: 5px;
    width: 200px;
    border-radius: 50px;
  }
  .intro-section {
    text-align: left;
  }
  .instructions-flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    max-width: 80%;
    margin: 0 auto;
  }
  .text-intro-flex {
    display: flex;
    justify-content: start;
    align-items: flex-start;
    flex-direction: column;
    max-width: 20%;
    min-width: 10%;
    height: 100%;
    align-self: flex-start;
  }
  .instructions-div {
    max-width: 30%;
    margin-left: 20px;
  }
  .scores-div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-width: 30%;

    flex-direction: row;
  }
  #overall-score {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #other-scores {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #other-scores table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
  }
  #other-scores td {
    padding: 7px;
    border: 1px solid #ddd;
    text-align: left;
  }
  #other-scores tr:nth-child(even) {
    background-color: #f2f2f2;
  }

</style>
