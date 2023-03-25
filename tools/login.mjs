import {Auth} from "msmc";

const authManager = new Auth("select_account");
const xboxManager = await authManager.launch("raw");
const token = await xboxManager.getMinecraft();

console.log(token.mclc());