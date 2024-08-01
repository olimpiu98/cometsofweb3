use anchor_lang::prelude::*;

declare_id!("ETLVU9vnsPbpZ5F7dCWtv8wxsaLANYsG6ctrbapywG4Z");

#[program]
pub mod favorites {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
