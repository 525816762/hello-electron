const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) {
    element.innerText = text;
  }
};

for (const dependency of ["chrome", "node", "electron"]) {
  replaceText(`${dependency}-version`, versions[dependency]());
}

const func = async () => {
  const reponse = await window.versions.ping();
  console.log(reponse);
};

func();

const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
setButton.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});
