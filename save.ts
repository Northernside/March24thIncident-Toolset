import process from "node:process";

(function checkUsername() {
    setTimeout(function () {
        fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${process.env.QUEUE_UUID}`, {
            method: "GET"
        }).then(async response => {
            if (!response.ok) return console.log(response.status);
            const json = await response.json();
            if (json.name !== process.env.QUEUE_NAME) {
                setTimeout(function () {
                    fetch(`https://api.minecraftservices.com/minecraft/profile/name/${process.env.QUEUE_NAME}`, {
                        method: "PUT",
                        headers: {"Authorization": `Bearer ${process.env.BEARER_TOKEN}`},
                    }).then(async response => {
                        if (response.ok) return console.log(`SUCCESSFULLY SAVED ${process.env.QUEUE_NAME}`);
                        else return console.log(`Couldn't save ${process.env.QUEUE_NAME} because server returned: ${response.status} :(`);
                    });
                }, 500);
            }
        });

        checkUsername();
    }, 5000);
})();