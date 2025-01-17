# Instagram Follower Export Tool

A JavaScript-based tool for exporting a list of Instagram followers to a text file. This tool runs in the browser console and demonstrates interaction with Instagram's GraphQL API.

⚠️ **Disclaimer**: This tool is for educational purposes only. Please ensure you comply with Instagram's Terms of Service and API usage guidelines. Excessive API requests may result in rate limiting or account restrictions.

## Features
- Export followers from any public Instagram account
- Choose between two output formats:
  - Username only (e.g., `username`)
  - Full Instagram profile URL (e.g., `https://www.instagram.com/username`)
- Progress tracking during export
- Automatic file download
- 
## Usage
1. Open your browser's developer tools (F12 or Right Click -> Inspect)
2. Navigate to the Console tab
3. Copy and paste the script below
4. Type in the user
5. Select the export format
6. Press Enter to run

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
