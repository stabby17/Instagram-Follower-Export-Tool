# Instagram Follower Export Tool

A JavaScript-based tool for exporting a list of Instagram followers to a text file. This tool runs in the browser console and demonstrates interaction with Instagram's GraphQL API.

⚠️ **Disclaimer**: This tool is for educational purposes only. Please ensure you comply with Instagram's Terms of Service and API usage guidelines. Excessive API requests may result in rate limiting or account restrictions.

## Features

- Fetches complete list of followers for a specified Instagram account
- Uses pagination to handle large follower lists
- Exports results to a text file with one username per line
- Provides progress feedback in the console

## Usage

1. Open your browser's developer tools (F12 or Right Click -> Inspect)
2. Navigate to the Console tab
3. Copy and paste the script below
4. Replace `"target_user"` with the target username
5. Press Enter to run

```javascript
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
```

## How It Works

1. **User ID Lookup**: First, the script queries Instagram's search API to convert the username to a user ID
2. **Follower Fetching**: Uses Instagram's GraphQL API to fetch followers in batches of 50
3. **Pagination**: Continues fetching until all followers are retrieved
4. **Export**: Creates a text file with the results and triggers a download

## Technical Details

- Uses the browser's built-in `fetch` API for requests
- Implements pagination using GraphQL cursor-based pagination
- Handles the download using Blob and URL.createObjectURL
- Compatible with modern browsers (Chrome, Firefox, Safari, Edge)

## Rate Limiting and Performance

- The script fetches followers in batches of 50 to minimize API load
- Console logs provide progress updates during execution
- If rate limited, the script will throw an error which is caught and logged

## Error Handling

The script includes basic error handling for:
- User not found
- Network errors
- API response errors
- Invalid JSON responses

## Limitations

- Requires user to be logged into Instagram in the browser
- Subject to Instagram's rate limiting
- May not work if Instagram changes their API structure
- Only exports usernames (not other user data)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
