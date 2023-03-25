import process from "node:process";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

import pattern_a_ignore from "../data/users_000_999.json" assert { type: "json" };
import pattern_b_ignore from "../data/users_0_99.json" assert { type: "json" };
const full_ignore = [...pattern_a_ignore, ...pattern_b_ignore];

let users = [];

checkTempNames(0);

function checkTempNames(i) {
    setTimeout(function () {
        if (!full_ignore.some(user => user.name === `tempusername${i}`)) {
            fetch(`https://api.mojang.com/users/profiles/minecraft/tempusername${i}`, {
                method: "GET"
            }).then(async response => {
                if (response.status === 200) {
                    const json = await response.json();
                    users.push(json);
                    fetch(process.env.DIFF_WEBHOOK_URL, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: "tempusername diffs",
                            avatar_url: "",
                            content: `New \`tempusername${i}\` was found!\n**UUID**: \`${json.id}\``
                        })
                    }).then(_res => {}).catch(_err => {});
                }
            }).catch(err => {
                console.log(`API returned an error:\n${err}`);
            });
        }

        i++;
        if (i < 100) checkTempNames(i);
        else checkTempNames(0);
    }, 1500);
    fs.writeFileSync("data/new_users_0_99.json", JSON.stringify(users), "utf-8");
}