# Aztec Counter Contract

A simple counter smart contract built with Aztec Protocol using Noir.

## Overview

This contract demonstrates basic private state management using Aztec's privacy features. It allows users to:

- Initialize a counter with a headstart value
- Increment their private counter
- Read their counter value

## Features

- **Private State**: Uses `EasyPrivateUint` for private counter storage
- **Initialization**: Set an initial counter value for an owner
- **Increment**: Privately increment the counter by 1
- **Read**: Unconstrained function to read counter values

## Contract Structure

The contract includes:

- `initialize(headstart: u64, owner: AztecAddress)`: Initialize a counter with a starting value
- `increment(owner: AztecAddress)`: Increment the counter by 1
- `get_counter(owner: AztecAddress) -> Field`: Read the current counter value

## Dependencies

- Aztec Protocol v2.0.2
- Easy Private State for simplified private state management

## Building

This project uses Nargo (Noir package manager). To build:

```bash
nargo compile
```

## License

MIT
