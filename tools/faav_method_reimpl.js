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
                    } else
                        if (stagResp.status !== 404)
                        console.log(`API returned an error:\n${stagResp.status}`);
                }).catch(err => {
                    console.log(`API returned an error:\n${err}`);
                });
            } else
                if (prodResp.status !== 404)
                console.log(`API returned an error:\n${prodResp.status}`);
        }).catch(err => {
            console.log(`API returned an error:\n${err}`);
        });

        console.log(i);
        console.log(users);
        i++;
        if (i < 100) checkNamesPatternA(i);
    }, 200);
}