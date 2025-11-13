import * as readline from 'readline';
import * as fs from 'fs/promises';
import { parseInstagramJson, extractUsernames } from './services/jsonParser';
import { addToWhitelist, getWhitelist, removeFromWhitelist } from './services/whitelist';
import { addNonFollowers, getNonFollowers } from './services/nonFollowers';
import { moveToExFollowers, getExFollowers } from './services/exFollowers';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function displayMenu() {
  console.log('\n=== Instagram Follower Tracker ===');
  console.log('1. Load JSON file');
  console.log('2. View extracted usernames');
  console.log('3. Add username to whitelist');
  console.log('4. View whitelist');
  console.log('5. Remove from whitelist');
  console.log('6. Insert data to non-followers list');
  console.log('7. View non-followers');
  console.log('8. Move user to ex-followers');
  console.log('9. View ex-followers');
  console.log('0. Exit');
  console.log('===================================\n');
}

let extractedUsernames: string[] = [];

async function loadJsonFile() {
  const filePath = await question('Enter JSON file path: ');

  try {
    const jsonContent = await fs.readFile(filePath.trim(), 'utf-8');
    const data = parseInstagramJson(jsonContent);
    extractedUsernames = extractUsernames(data);

    console.log(`✓ Loaded ${extractedUsernames.length} usernames from JSON`);
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function viewExtractedUsernames() {
  if (extractedUsernames.length === 0) {
    console.log('No usernames loaded. Please load a JSON file first.');
    return;
  }

  console.log(`\nExtracted Usernames (${extractedUsernames.length}):`);
  extractedUsernames.slice(0, 20).forEach((username, index) => {
    console.log(`${index + 1}. ${username}`);
  });

  if (extractedUsernames.length > 20) {
    console.log(`... and ${extractedUsernames.length - 20} more`);
  }
}

async function addToWhitelistMenu() {
  const username = await question('Enter username to add to whitelist: ');

  try {
    await addToWhitelist(username.trim());
    console.log(`✓ Added "${username}" to whitelist`);
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function viewWhitelistMenu() {
  try {
    const whitelist = await getWhitelist();

    if (whitelist.length === 0) {
      console.log('Whitelist is empty');
      return;
    }

    console.log(`\nWhitelist (${whitelist.length}):`);
    whitelist.forEach((username, index) => {
      console.log(`${index + 1}. ${username}`);
    });
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function removeFromWhitelistMenu() {
  const username = await question('Enter username to remove from whitelist: ');

  try {
    await removeFromWhitelist(username.trim());
    console.log(`✓ Removed "${username}" from whitelist`);
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function insertDataMenu() {
  if (extractedUsernames.length === 0) {
    console.log('No usernames loaded. Please load a JSON file first.');
    return;
  }

  try {
    await addNonFollowers(extractedUsernames);
    console.log(`✓ Inserted ${extractedUsernames.length} usernames to non-followers list (excluding whitelisted)`);
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function viewNonFollowersMenu() {
  try {
    const nonFollowers = await getNonFollowers();

    if (nonFollowers.length === 0) {
      console.log('No non-followers found');
      return;
    }

    console.log(`\nNon-Followers (${nonFollowers.length}):`);
    nonFollowers.slice(0, 20).forEach((username, index) => {
      console.log(`${index + 1}. ${username}`);
    });

    if (nonFollowers.length > 20) {
      console.log(`... and ${nonFollowers.length - 20} more`);
    }
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function moveToExFollowersMenu() {
  const username = await question('Enter username to move to ex-followers: ');

  try {
    await moveToExFollowers(username.trim());
    console.log(`✓ Moved "${username}" to ex-followers`);
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function viewExFollowersMenu() {
  try {
    const exFollowers = await getExFollowers();

    if (exFollowers.length === 0) {
      console.log('No ex-followers found');
      return;
    }

    console.log(`\nEx-Followers (${exFollowers.length}):`);
    exFollowers.slice(0, 20).forEach((item, index) => {
      console.log(`${index + 1}. ${item.username} (unfollowed: ${item.unfollowed_at})`);
    });

    if (exFollowers.length > 20) {
      console.log(`... and ${exFollowers.length - 20} more`);
    }
  } catch (error: any) {
    console.log(`✗ Error: ${error.message}`);
  }
}

async function main() {
  console.log('Welcome to Instagram Follower Tracker!');

  let running = true;

  while (running) {
    await displayMenu();
    const choice = await question('Select an option: ');

    switch (choice.trim()) {
      case '1':
        await loadJsonFile();
        break;
      case '2':
        await viewExtractedUsernames();
        break;
      case '3':
        await addToWhitelistMenu();
        break;
      case '4':
        await viewWhitelistMenu();
        break;
      case '5':
        await removeFromWhitelistMenu();
        break;
      case '6':
        await insertDataMenu();
        break;
      case '7':
        await viewNonFollowersMenu();
        break;
      case '8':
        await moveToExFollowersMenu();
        break;
      case '9':
        await viewExFollowersMenu();
        break;
      case '0':
        console.log('Goodbye!');
        running = false;
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
  }

  rl.close();
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});