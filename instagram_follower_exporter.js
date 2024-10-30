(async () => {
    const username = "target_user"; // Replace with the target username
    // Initialize an empty array to store followers
    let followers = [];
    try {
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
            // Update the `has_next` and `after` variables for pagination
            has_next = json.data.user.edge_followed_by.page_info.has_next_page;
            after = json.data.user.edge_followed_by.page_info.end_cursor;
            // Extract followers from the response
            followers = followers.concat(
                json.data.user.edge_followed_by.edges.map(({ node }) => node.username)
            );
            console.log(`Fetched ${followers.length} followers so far...`);
        }
        // Step 3: Create a text string with one username per line
        const textContent = followers.join('\n');
        // Step 4: Create a download link and trigger it
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${username}_followers.txt`);
        document.body.appendChild(link); // Required for Firefox
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(url); // Clean up the URL object
        console.log("Follower list exported as TXT.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
