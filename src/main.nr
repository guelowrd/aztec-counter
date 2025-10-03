use dep::aztec::macros::aztec;

#[aztec]
pub contract Counter {
    use aztec::{
        macros::{functions::{initializer, private, utility}, storage::storage},
        oracle::debug_log::debug_log_format,
        protocol_types::{address::AztecAddress, traits::ToField},
        state_vars::Map,
    };
    use easy_private_state::EasyPrivateUint;
    
    #[storage]
    struct Storage<Context> {
        counters: Map<AztecAddress, EasyPrivateUint<Context>, Context>,
    }

    #[initializer]
    #[private]
    // We can name our initializer anything we want as long as it's marked as aztec(initializer)
    fn initialize(headstart: u64, owner: AztecAddress) {
        let counters = storage.counters;
        counters.at(owner).add(headstart, owner);
    }
    
    #[private]
    fn increment(owner: AztecAddress) {
        debug_log_format("Incrementing counter for owner {0}", [owner.to_field()]);
        let counters = storage.counters;
        counters.at(owner).add(1, owner);
    }

    #[utility]
    unconstrained fn get_counter(owner: AztecAddress) -> Field {
        storage.counters.at(owner).get_value()
    }
}