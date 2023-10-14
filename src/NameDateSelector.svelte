<script>
    export let names_ids;
    export let today;
    export let start_date;
    export let end_date;
    export let elm_name;
</script>

<h1>Apple Photos DB Explorer</h1>
<!-- ... -->
<div class="flex-container-title">
  {#if typeof names_ids !== "undefined"}
    <div class="flex-container-col">
      <div id="title-text">
        <b>Select a name</b>
      </div>
      <div id="selector" class="text-intro">
        <select bind:value={elm_name}>
          {#each names_ids as name_entry}
            <option value={name_entry.full_name}>{name_entry.full_name}</option>
          {/each}
        </select>
      </div>
    </div>
    <div id="date-selector">
      <div class="flex-container-col">
        <div id="date-selector-title">
          <b>Choose a date range: </b>
        </div>
        <div id="date-selector">
          <!-- // starting and ending date selectors svelte -->

          <input
            type="month"
            bind:value={start_date_month}
            max={// minus one month
            d3.timeFormat("%Y-%m")(
              new Date(
                (end_date_month ?? today.toISOString().slice(0, 7)) + "-01"
              ).setMonth(
                new Date(
                  (end_date_month ?? today.toISOString().slice(0, 7)) + "-01"
                ).getMonth()
              )
            )}
          />

          <input
            type="month"
            bind:value={end_date_month}
            min={start_date_month}
            max={today.toISOString().slice(0, 7)}
          />
        </div>
      </div>
    </div>
  {:else}
    <p>Waiting for data...</p>
  {/if}
</div>
