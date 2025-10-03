import { createPXEClient } from "@aztec/aztec.js";
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { CounterContract } from "./src/artifacts/Counter.js";

async function deployContract() {
  try {
    // Connect to sandbox
    const pxe = await createPXEClient("http://localhost:8080");
    console.log('Connected to sandbox');
    
    // Get test accounts (Alice and Bob)
    const alice = (await getDeployedTestAccountsWallets(pxe))[0];
    console.log(`Using account: ${alice.getAddress().toString()}`);
    
    // Deploy the contract with initial parameters
    const headstart = 10; // Initial counter value
    const owner = alice.getAddress(); // Owner of the counter
    
    console.log(`Deploying contract with headstart: ${headstart}, owner: ${owner.toString()}`);
    
    // Deploy using the contract's static deploy method (following the token contract pattern)
    const contract = await CounterContract.deploy(
      alice,
      headstart,
      owner
    )
      .send({ from: alice.getAddress() })
      .deployed();
    
    console.log(`\nContract deployed successfully!`);
    console.log(`Contract address: ${contract.address.toString()}`);
    
    // Save the contract address to a file for easy reference
    const fs = await import('fs');
    fs.writeFileSync('./contract-address.txt', contract.address.toString());
    console.log(`Contract address saved to contract-address.txt`);
    
    return contract;
    
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
}

// Run the deployment
deployContract()
  .then((contract) => {
    console.log('\nDeployment completed successfully!');
    console.log(`You can now use this address in your interaction scripts: ${contract.address.toString()}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
