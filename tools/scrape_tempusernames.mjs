import fs from "node:fs";

let users = [];

checkNamesPatternA(0);

function checkNamesPatternA(i) {
    const suffix = (i < 10 ? `00${i}` : i < 100 ? `0${i}` : i);
    setTimeout(function () {
        fetch(`https://api.mojang.com/users/profiles/minecraft/tempusername${suffix}`, {
            method: "GET"
        }).then(async response => {
            if (response.status === 200) {
                const json = await response.json();
                users.push(json);
            }
        }).catch(err => {
            console.log(`API returned an error:\n${err}`);
        });

        i++;
        if (i < 1000) checkNamesPatternA(i);
        else {
            users = [];
            checkNamesPatternB(0);
        }
    }, 400);
    fs.writeFileSync("data/users_000_999.json", JSON.stringify(users), "utf-8");
}

function checkNamesPatternB(i) {
    setTimeout(function () {
        fetch(`https://api.mojang.com/users/profiles/minecraft/tempusername${i}`, {
            method: "GET"
        }).then(async response => {
            if (response.status === 200) {
                const json = await response.json();
                users.push(json);
            }
        }).catch(err => {
            console.log(`API returned an error:\n${err}`);
        });

        i++;
        if (i < 100) checkNamesPatternB(i);
    }, 400);
    fs.writeFileSync("data/users_0_99.json", JSON.stringify(users), "utf-8");
}