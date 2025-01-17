const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = async () => {
    try {
        const username = await new Promise((resolve) => {
            rl.question('Enter the target username: ', resolve);
        });

        const format = await new Promise((resolve) => {
            rl.question('Choose output format:\n1. Username only\n2. Full Instagram Link\nEnter 1 or 2: ', (answer) => {
                resolve(answer === '2' ? 'link' : 'username');
            });
        });

        let followers = [];
        console.log(`Fetching followers for user: ${username}`);
        
        // Step 1: Get user ID
        const userQueryRes = await fetch(
            `https://www.instagram.com/web/search/topsearch/?query=${username}`
        );
        const userQueryJson = await userQueryRes.json();
        const user = userQueryJson.users.find((u) => u.user.username === username);
        
        if (!user) {
            console.error("User not found");
            return;
        }

        const userId = user.user.pk;
        console.log(`User ID found: ${userId}`);

        // Step 2: Fetch followers
        let after = null;
        let has_next = true;

        while (has_next) {
            const response = await fetch(
                `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
                encodeURIComponent(
                    JSON.stringify({
                        id: userId,
                        include_reel: true,
                        fetch_mutual: true,
                        first: 50,
                        after: after,
                    })
                )
            );
            const json = await response.json();
            
            has_next = json.data.user.edge_followed_by.page_info.has_next_page;
            after = json.data.user.edge_followed_by.page_info.end_cursor;
            
            const newFollowers = json.data.user.edge_followed_by.edges.map(({ node }) => 
                format === 'link' ? `https://www.instagram.com/${node.username}` : node.username
            );
            followers = followers.concat(newFollowers);
            
            console.log(`Fetched ${followers.length} followers so far...`);
        }

        // Create and download the file
        const textContent = followers.join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${username}_followers.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log("Follower list exported as TXT.");
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        rl.close();
    }
};

main();
