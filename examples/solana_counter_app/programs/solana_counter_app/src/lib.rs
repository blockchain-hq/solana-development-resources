use anchor_lang::prelude::*;

declare_id!("82QnUPKg6dpnDCN6kQCrTmbo1WjkktTq3yUSLmNYrz3n");

#[program]
pub mod solana_counter_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
