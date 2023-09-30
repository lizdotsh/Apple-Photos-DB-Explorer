
window.myAPI.on('log-update', (message) => { 
  console.log(`web-log: ${message}`);
  const logElement = document.getElementById("db-load-log");
  logElement.innerText += `\n${message}`;
  logElement.scrollTop = logElement.scrollHeight;
});
window.myAPI.on('error-update', (message) => { 
    console.error(`error-log: ${message}`);
    const logElement = document.getElementById("db-load-log");
    logElement.innerHTML += `<div style="color: red; font-weight: bold;">\n${message}</div>`;
    logElement.scrollTop = logElement.scrollHeight;
  });