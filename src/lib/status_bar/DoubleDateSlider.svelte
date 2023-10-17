<script>
  import { get } from "svelte/store";
  // Editied to work with dates. Imported originally from https://svelte.dev/repl/75d34e46cbe64bb68b7c2ac2c61931ce?version=4.2.1
  // Unsure who created it, just found it on google. Wasn't on npm either. Otherwise would credit.
  import { clamp } from "yootils";
  //export let start = 0;
  //export let end = 1;
  export let dateMin;
  $: console.log(dateMin);
  export let dateMax;
  export let start_date_ms;
    export let end_date_ms;

  export let start_date_month;
  export let end_date_month;
  export let start_date_daily;
  export let end_date_daily;
  let isPlaying = false;
  let interval;
  let isOneWayMode;
  let ms_per_month = 100;
//   function toMonths(iso_months) {
//     const [year, month] = iso_months.split("-").map(Number);
//     return year * 12 + month - 1;
//   }
//   function toIso(month_cnt) {
//     const year = Math.trunc(month_cnt / 12);
//     const month = (month_cnt % 12) + 1;
//     return `${year}-${month.toString().padStart(2, "0")}`;
//   }
//   function remDays(iso_date_string) {
//     return iso_date_string.slice(0, 7);
//   }
//   function getDistInMonths(dateMin, dateMax) {
//     const [minCnt, maxCnt] = [dateMin, dateMax].map(remDays).map(toMonths);
//     return maxCnt - minCnt;
//   }
//   function formatDates(start, end, dateMin, dateMax) {
//     const [minCnt, maxCnt] = [dateMin, dateMax].map(remDays).map(toMonths);
//     const valToCount = (count) =>
//       minCnt + Math.floor(count * (maxCnt - minCnt));
//     return [valToCount(start), valToCount(end) + 1].map(toIso);
//   }
//   $: [start_date_month, end_date_month] = formatDates(
//     start,
//     end,
//     dateMin,
//     dateMax
//   );
let dateMinMs = new Date(dateMin).getTime();
let dateMaxMs = new Date(dateMax).getTime();

function getDistInMs(dateMinMs, dateMaxMs) {
  return dateMaxMs - dateMinMs;
}

function formatDates(start, end, dateMinMs, dateMaxMs) {
  const valToTime = (frac) => dateMinMs + Math.floor(frac * (dateMaxMs - dateMinMs));
  return [valToTime(start), valToTime(end)].map(ms => new Date(ms));
}

$: [start_date_ms, end_date_ms] = formatDates(start, end, dateMinMs, dateMaxMs);

// $: console.log(start_date_ms, end_date_ms)
// $: console.log(start_date_daily, end_date_daily)
    $: start_date_month = start_date_ms.toISOString().slice(0, 7);
    $: end_date_month = end_date_ms.toISOString().slice(0, 7);
    $: start_date_daily = start_date_ms.toISOString().slice(0, 10)
    $: end_date_daily = end_date_ms.toISOString().slice(0, 10)
  //$: end_date = formatEndDate(end, dateMin, dateMax)
  let start = 0;
//    $: console.log(start_date, end_date)
  let end = 1;
//   $: console.log(start, end);
  let leftHandle;
  let body;
  let slider;
  function draggable(node) {
    let x;
    let y;
    function handleMousedown(event) {
      if (event.type === "touchstart") {
        event = event.touches[0];
      }
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragstart", {
          detail: { x, y },
        })
      );
      window.addEventListener("mousemove", handleMousemove);
      window.addEventListener("mouseup", handleMouseup);
      window.addEventListener("touchmove", handleMousemove);
      window.addEventListener("touchend", handleMouseup);
    }
    function handleMousemove(event) {
      if (event.type === "touchmove") {
        event = event.changedTouches[0];
      }
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragmove", {
          detail: { x, y, dx, dy },
        })
      );
    }
    function handleMouseup(event) {
      x = event.clientX;
      y = event.clientY;
      node.dispatchEvent(
        new CustomEvent("dragend", {
          detail: { x, y },
        })
      );
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("mouseup", handleMouseup);
      window.removeEventListener("touchmove", handleMousemove);
      window.removeEventListener("touchend", handleMouseup);
    }
    node.addEventListener("mousedown", handleMousedown);
    node.addEventListener("touchstart", handleMousedown);
    return {
      destroy() {
        node.removeEventListener("mousedown", handleMousedown);
        node.removeEventListener("touchstart", handleMousedown);
      },
    };
  }
  function setHandlePosition(which) {
    return function (evt) {
      const { left, right } = slider.getBoundingClientRect();
      const parentWidth = right - left;
      const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
      if (which === "start") {
        start = p;
        end = Math.max(end, p);
      } else {
        start = Math.min(p, start);
        end = p;
      }
    };
  }
  function setHandlesFromBody(evt) {
    const { width } = body.getBoundingClientRect();
    const { left, right } = slider.getBoundingClientRect();
    const parentWidth = right - left;
    const leftHandleLeft = leftHandle.getBoundingClientRect().left;
    const pxStart = clamp(
      leftHandleLeft + event.detail.dx - left,
      0,
      parentWidth - width
    );
    const pxEnd = clamp(pxStart + width, width, parentWidth);
    const pStart = pxStart / parentWidth;
    const pEnd = pxEnd / parentWidth;
    start = pStart;
    end = pEnd;
  }
  function moveSlider(dist) {
    if (end + dist > 1) {
      clearInterval(interval);
      isPlaying = false;
      start += 1 - end;
      end = 1;
      return;
    }
    start += dist;
    end += dist;
  }
  function toggleSlider() {
    if (isPlaying) {
      clearInterval(interval);
      isPlaying = false;
      return;
    }
    if (end === 1 && start !== 0) {
      const dist = end - start;
      start = 0;
      end = dist;
    }
    interval = setInterval(
      moveSlider,
      ms_per_month,
      1 / getDistInMonths(dateMin, dateMax)
    );
    isPlaying = true;
  }
</script>

<div id="total">
  <div class="main">
    <div id="slider-labels">
      <div class="label-left">
        <b>Choose a date range</b>
        <span style="padding-right: 5px; padding-left: 5px;"
          ><button class="scrubber-button-toggle" on:click={toggleSlider}
            >{isPlaying ? "Pause" : "Play"}</button
          ></span>
          <span>

            delay (ms): 
            <input type = 'number' style = "font-size: 12px" bind:value={ms_per_month} min = 25 max = 1000 step = 25>
          </span>
        <input
          style="width: 20px;"
          type="checkbox"
          name="togglePlayMode"
          bind:checked={isOneWayMode}
        />
        <span style = 'font-size: 12px;'>Only move end of date range</span>
      </div>
      <div class="label-right">
        Note: graphs unreliable if no photos in date range
      </div>
    </div>

    <div class="main">
      <div class="double-range-container">
        <div class="slider" bind:this={slider}>
          <div
            class="body"
            bind:this={body}
            use:draggable
            on:dragmove|preventDefault|stopPropagation={setHandlesFromBody}
            style="
				left: {100 * start}%;
				right: {100 * (1 - end)}%;
			"
          />
          <div
            class="handle"
            bind:this={leftHandle}
            data-which="start"
            use:draggable
            on:dragmove|preventDefault|stopPropagation={setHandlePosition(
              "start"
            )}
            style="
				left: {100 * start}%
			"
          />
          <div
            class="handle"
            data-which="end"
            use:draggable
            on:dragmove|preventDefault|stopPropagation={setHandlePosition(
              "end"
            )}
            style="
				left: {100 * end}%
			"
          />
        </div>
      </div>
    </div>
    <div class="labels">
      <div class="label">{start_date_month}</div>
      <div class="label">{end_date_month}</div>
    </div>
  </div>
</div>

<style>
  .double-range-container {
    width: 100%;
    height: 15px;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
    margin-top: 0em;
  }
  .main {
    display: flex;
    flex-direction: column;
    padding: 5px;
    box-sizing: border-box;
  }
  .slider {
    position: relative;
    width: 100%;
    height: 6px;
    top: 50%;
    transform: translate(0, -50%);
    background-color: #e2e2e2;
    box-shadow: inset 0 7px 10px -5px #4a4a4a, inset 0 -1px 0px 0px #9c9c9c;
    border-radius: 1px;
  }
  .handle {
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
  }
  .handle:after {
    content: " ";
    box-sizing: border-box;
    position: absolute;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background-color: #fdfdfd;
    border: 1px solid #7b7b7b;
    transform: translate(-50%, -50%);
  }
  /* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
  .handle:active:after {
    background-color: #ddd;
    z-index: 9;
  }
  .body {
    top: 0;
    position: absolute;
    background-color: #34a1ff;
    bottom: 0;
  }
  .label:first-child {
    float: left;
    box-sizing: border-box;
  }
  .label:last-child {
    float: right;
    box-sizing: border-box;
  }
  .label-left {
    position: relative;
    left: 0;
    font-size: 16px;
    color: #333;
    text-align: left;
    box-sizing: border-box;
  }

  .label-right {
    position: absolute;
    right: 1em;
    font-size: 16px;
    color: #333;
    text-align: right;
    box-sizing: border-box;
  }
  #slider-labels {
    display: flex;
  }
  .scrubber-button-toggle {
    padding-right: 5px;
    padding-left: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
</style>
