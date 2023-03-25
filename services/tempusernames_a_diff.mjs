import process from "node:process";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

import pattern_a_ignore from "../data/users_000_100.json" assert { type: "json" };
import pattern_b_ignore from "../data/users_0_99.json" assert { type: "json" };
let newIgnores_a = JSON.parse(fs.readFileSync("data/new_users_000_99.json", "utf-8")),
    full_ignore = [...pattern_a_ignore, ...pattern_b_ignore, ...newIgnores_a];

let users = [];

checkTempNames(0);

function checkTempNames(i) {
    const suffix = (i < 10 ? `00${i}` : i < 100 ? `0${i}` : i);
    setTimeout(function () {
        if (!full_ignore.some(user => user.name === `tempusername${suffix}`)) {
            fetch(`https://api.mojang.com/users/profiles/minecraft/tempusername${suffix}`, {
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
                            content: `New \`tempusername${suffix}\` was found!\n**UUID**: \`${json.id}\``
                        })
                    }).then(_res => {}).catch(_err => {}).finally(() => {
                        newIgnores_a = fs.readFileSync("data/new_users_000_100.json");
                        full_ignore = [...pattern_a_ignore, ...pattern_b_ignore, ...newIgnores_a];
                        fs.writeFileSync("data/new_users_000_100.json", JSON.stringify(users), "utf-8");
                    });
                }
            }).catch(err => {
                console.log(`API returned an error:\n${err}`);
            });
        }

        i++;
        if (i < 101) checkTempNames(i);
        else checkTempNames(0);
    }, 900);
}