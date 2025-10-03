import { createPXEClient } from "@aztec/aztec.js";
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { CounterContract } from "./src/artifacts/Counter.js";
import fs from 'fs';

async function interactWithContract() {
  try {
    // Connect to sandbox
    const pxe = await createPXEClient("http://localhost:8080");
    console.log('Connected to sandbox');
    
    // Get test accounts (Alice and Bob)
    const alice = (await getDeployedTestAccountsWallets(pxe))[0];
    console.log(`Using account: ${alice.getAddress().toString()}`);
    
    // Read contract address from file
    let contractAddress: string;
    try {
      contractAddress = fs.readFileSync('./contract-address.txt', 'utf8').trim();
    } catch (error) {
      console.log('No contract address found. Please deploy the contract first with: yarn deploy');
      return;
    }
    
    console.log(`Connecting to contract at: ${contractAddress}`);
    
    // Get the deployed contract instance
    const contract = await CounterContract.at(contractAddress, alice);
    console.log(`Connected to contract at: ${contract.address.toString()}`);
    
    // Call get_counter to read the current value
    console.log('\n--- Reading current counter value ---');
    const currentValue = await contract.methods.get_counter(alice.getAddress()).simulate({ from: alice.getAddress() });
    console.log(`Current counter value: ${currentValue}`);
    
    // Call increment function
    console.log('\n--- Incrementing counter ---');
    const incrementTx = contract.methods.increment(alice.getAddress()).send({ from: alice.getAddress() });
    await incrementTx.wait();
    console.log('Counter incremented successfully!');
    
    // Read the counter value again to verify the increment
    console.log('\n--- Reading counter value after increment ---');
    const newValue = await contract.methods.get_counter(alice.getAddress()).simulate({ from: alice.getAddress() });
    console.log(`New counter value: ${newValue}`);
    
  } catch (error) {
    console.error('Error interacting with contract:', error);
    throw error;
  }
}

// Run the interaction
interactWithContract()
  .then(() => {
    console.log('\nContract interaction completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Contract interaction failed:', error);
    process.exit(1);
  });
