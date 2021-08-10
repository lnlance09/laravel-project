import pbkdf2 from "pbkdf2"
import aesjs from "aes-js"

export const decrypt = (keystoreFile, password) => {
	const options = keystoreFile.Crypto.kdfparams
	const key = pbkdf2.pbkdf2Sync(password, options.salt, options.c, options.dklen, options.prf)

	const encryptedBytes = aesjs.utils.hex.toBytes(keystoreFile.Crypto.ciphertext)
	const counter = keystoreFile.Crypto.cipherparams.counter
	const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(counter))
	const decryptedBytes = aesCtr.decrypt(encryptedBytes)

	return decryptedBytes
}
