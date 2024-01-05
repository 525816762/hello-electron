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
