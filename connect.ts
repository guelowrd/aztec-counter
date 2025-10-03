import { createPXEClient } from '@aztec/aztec.js';

async function connectToSandbox() {
  try {
    // Step 2: Create PXE client connection
    const pxe = await createPXEClient("http://localhost:8080");
    
    // Step 4: Verify the connection
    const nodeInfo = await pxe.getNodeInfo();
    console.log('Connected to sandbox version:', nodeInfo.nodeVersion);
    
    // Load existing accounts
    const accounts = await pxe.getRegisteredAccounts();
    console.log(`Found ${accounts.length} accounts in the sandbox`);
    
    if (accounts.length > 0) {
      console.log('Available accounts:');
      accounts.forEach((account, index) => {
        console.log(`  ${index + 1}. ${account.address.toString()}`);
      });
    }
    
    return pxe;
  } catch (error) {
    console.error('Failed to connect to sandbox:', error);
    throw error;
  }
}

// Run the connection if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  connectToSandbox()
    .then(() => {
      console.log('Connection successful!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Connection failed:', error);
      process.exit(1);
    });
}

export { connectToSandbox };