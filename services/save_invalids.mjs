import process from "node:process";
import dotenv from "dotenv";
dotenv.config();

(function checkUsername() {
    setTimeout(function () {
        fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${process.env.QUEUE_UUID}`, {
            method: "GET"
        }).then(async response => {
            if (!response.ok) return console.log(response.status);
            const json = await response.json();
            if (json.name !== process.env.QUEUE_NAME) {
                fetch(process.env.IS_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        username: "invalid saver",
                        avatar_url: "",
                        content: `@everyone \`${process.env.QUEUE_NAME}\` was changed to \`${json.name}\`.\nAttempting to save the username...`
                    })
                }).then(_res => {}).catch(_err => {});
                setTimeout(function () {
                    fetch(`https://api.minecraftservices.com/minecraft/profile/name/${process.env.QUEUE_NAME}`, {
                        method: "PUT",
                        headers: {"Authorization": `Bearer ${process.env.BEARER_TOKEN}`},
                    }).then(async response => {
                        if (response.ok) {
                            console.log(`SUCCESSFULLY SAVED ${process.env.QUEUE_NAME}`);
                            fetch(process.env.IS_WEBHOOK_URL, {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({
                                    username: "invalid saver",
                                    avatar_url: "",
                                    content: `SUCCESSFULLY SAVED \`${process.env.QUEUE_NAME}\``
                                })
                            }).then(_res => {}).catch(_err => {});
                        } else {
                            console.log(`Couldn't save ${process.env.QUEUE_NAME} because server returned: ${response.status} :(`);
                            return fetch(process.env.DIFF_WEBHOOK_URL, {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({
                                    username: "invalid saver",
                                    avatar_url: "",
                                    content: `Couldn't save \`${process.env.QUEUE_NAME}\` because server returned: ${json} :(`
                                })
                            }).then(_res => {}).catch(_err => {});
                        }
                    }).catch(err => {
                        console.log(`API returned an error:\n${err}`);
                    });
                }, 1500);
            }
        });

        checkUsername();
    }, 1000);
})();