const { promises: fs } = require("fs");
const fss = require("fs");

const filePath = '.data/passphrase.txt';

const getPassPhrase = () => {
    if (!filePath) {
        throw new Error("filePath required");
    }

    return fss.readFileSync(filePath, "utf-8" );
}

const setPassPhrase = async (passPhrase) => {
    if (!filePath) {
        throw new Error("filePath required");
    }

    await fs.writeFile(filePath, passPhrase, { encoding:"utf-8" });
}

module.exports = {
  getPassPhrase: getPassPhrase,
  setPassPhrase: setPassPhrase
};