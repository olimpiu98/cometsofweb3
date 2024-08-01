use anchor_lang::prelude::*;

declare_id!("AY2HyHk6N25zKX81erE7hb1rxZRm6cLJ8w9rDjNdQAJT");

#[program]
pub mod temp_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
