window.myAPI.on("log-update", (message) => {
  console.log(`web-log: ${message}`);
  const logElement = document.getElementById("db-load-log");
  logElement.innerText += `\n${message}`;
  logElement.scrollTop = logElement.scrollHeight;
});
window.myAPI.on("error-update", (message) => {
  console.error(`error-log: ${message}`);
  const logElement = document.getElementById("db-load-log");
  logElement.innerHTML += `<div style="color: red; font-weight: bold;">\n${message}</div>`;
  logElement.scrollTop = logElement.scrollHeight;
});

// Function to update UI based on directory and validation status
async function updateUI(directory) {
  const dirPathElement = document.getElementById("dirPath");
  const statusElement = document.getElementById("status");
  dirPathElement.value = directory;

  const isValid = await myAPI.invoke("validate-directory", directory);
  if (isValid) {
    statusElement.textContent = "Valid directory.";
    statusElement.style.color = "green";
  } else {
    statusElement.textContent = "Invalid directory.";
    statusElement.style.color = "red";
  }
}

// Check default directory on app start
async function checkDefaultDirectory() {
  const defaultPath = await myAPI.invoke("get-default-directory");
  await updateUI(defaultPath);
}

// Existing directory selection logic
document.getElementById("selectDirBtn").addEventListener("click", async () => {
  const path = await myAPI.invoke("select-directory");
  if (path) {
    await updateUI(path);
  }
});

// Initialize default directory check
checkDefaultDirectory();

document
  .getElementById("generateReportBtn")
  .addEventListener("click", async () => {
    const dirPath = document.getElementById("dirPath").value;
    const isValid = await myAPI.invoke("validate-directory", dirPath);

    if (isValid) {
      await myAPI.invoke("generate-report", dirPath);
    } else {
      alert("Invalid directory. Can't generate report.");
    }
  });
