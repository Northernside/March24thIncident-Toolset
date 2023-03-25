import process from "node:process";
import dotenv from "dotenv";

dotenv.config();

fetch(`https://api.mojang.com/profiles/minecraft`, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.BEARER_TOKEN}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify([
        "",
    ])
}).then(async response => {
    const json = await response.json();
    console.log(json);
}).catch(err => {
    console.log(`API returned an error:\n${err}`);
});