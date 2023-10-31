<script>
  export let person_numeric_scores;
  // import * as aq from "arquero";
  let use_global_scores = false;
  function toggleScores() {
    use_global_scores = !use_global_scores;
  }
  const tableStyles = {
    table:
      "width: 100%; border-collapse: separate; border-spacing: 0; margin: 20px 0; font-family: Arial, sans-serif;",
    thead: {
      th: "background-color: #4CAF50; color: white; padding: 14px 20px;",
    },
    tbody: {
      td: "padding: 14px 20px; border-bottom: 1px solid #f2f2f2;",
      "tr:nth-child(even)": "background-color: #f2f2f2;",
      "tr:hover": "background-color: #ddd;",
      "tr:last-child": {
        td: "border-bottom: none;",
      },
    },
  };
</script>

{#if person_numeric_scores}
  <div class='numeric-table'>
    <div>Note: Some of the raw scores were from -1 to 1 -- I linearly transformed it to be from 0-100 instead </div>
    <table>
      <thead>
        <tr>
          <th>Score</th>
          <th>Value</th>
          <!-- <th>Value (Percent)</th> -->
        </tr>
      </thead>
      <tbody>
        {#each Object.entries(person_numeric_scores) as [score, value]}
          <tr>
            <td>{score}</td>
            <td>{Number(value).toFixed(3)}</td>
            <!-- <td>{(Number(value) * 100).toFixed(2)}%</td> -->
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
.numeric-table {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
  
}
  /* General Table Styling */
  table {
    width: 40%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 20px 0;
    font-family: Arial, sans-serif;
  }

  /* Table Header */
  thead th {
    background-color: #333;
    color: #fff;
    font-weight: bold;
    padding: 12px 20px;
    text-align: center;
    border-bottom: 2px solid #fff;
  }

  /* Table Body */
  tbody td {
    padding: 5px 5px;
    border-bottom: 1px solid #f2f2f2;
  
  }

  /* Zebra Striping */
  tbody tr:nth-child(even) {
    background-color: #f2f2f2;
    
  }
  /* second and third columns right aligned */
    tbody td:nth-child(2),
    tbody td:nth-child(3) {
      text-align: right;
    }
  /* Hover Effect */
  tbody tr:hover {
    background-color: #ddd;
  }

  /* Remove border for the last row */
  tbody tr:last-child td {
    border-bottom: none;
  }
</style>
