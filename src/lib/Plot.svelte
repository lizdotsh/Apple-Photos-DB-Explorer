<script>
    import * as Plot from "@observablehq/plot";
    export let options;
    function addChart(node) { node.appendChild(Plot.plot(options)); }
  </script>
 
 
  {#key options}
    <div use:addChart {...$$restProps} />
  {/key}