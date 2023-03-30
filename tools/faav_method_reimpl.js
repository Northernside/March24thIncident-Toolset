let users = [];

checkNamesPatternA(0);
function checkNamesPatternA(i) {
    const suffix = (i < 10 ? `00${i}` : i < 100 ? `0${i}` : i);
    setTimeout(function () {
        fetch(`https://api.mojang.com/users/profiles/minecraft/tempusername${suffix}`, {
            method: "GET"
        }).then(async prodResp => {
            if (prodResp.status === 200) {
                const prodJson = await prodResp.json();
                fetch(`https://api-staging.mojang.com/user/profile/${prodJson.id}`, {
                    method: "GET"
                }).then(async stagResp => {
                    if (stagResp.status === 200) {
                        const stagJson = await stagResp.json();
                        users.push(stagJson);
                    }
                }).catch(err => {
                    console.log(`API returned an error:\n${err}`);
                });
            }
        }).catch(err => {
            console.log(`API returned an error:\n${err}`);
        });

        i++;
        if (i < 1000) checkNamesPatternA(i);
    }, 300);
}

console.log(users);