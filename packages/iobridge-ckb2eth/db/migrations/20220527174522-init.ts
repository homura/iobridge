// table schema, it may only work in PostgreSQL

// to store a big integer,
// we use decimal with 78 precision and 0 scale which is up to 78 digits, is enabled to hold an uint256
// https://www.postgresql.org/docs/current/datatype-numeric.html

// to store a BytesLike type, we use bytea

// to store a ckb address, we split it into 3 bytea, code_hash, hash_type and args

import { Knex } from 'knex';

export function up(knex: Knex): Promise<unknown> {
  return knex.schema
    .createTable('ckb2eth', (table) => {
      table.increments();
      table.enum('deposit_state', ['Confirmed']).notNullable();
      table.integer('deposit_block_number').notNullable().comment('deposit at which block number');
      table.binary('deposit_tx_hash', 32).index().notNullable().comment('deposit transaction hash');
      table.integer('deposit_tx_index_of_block').notNullable().comment('deposit transaction index of a block');
      table
        .integer('deposit_sequence_number')
        .comment('the index of all deposit records, for deriving a bridge fee recipient address');

      /* deposit from */
      table.binary('deposit_from_code_hash', 32);
      table.binary('deposit_from_hash_type', 1);
      table.binary('deposit_from_args', 255);
      table.index(['deposit_from_code_hash', 'deposit_from_hash_type', 'deposit_from_args'], 'deposit_from');

      /* deposit to bridge lock */
      table.binary('deposit_to_code_hash', 32);
      table.binary('deposit_to_hash_type', 1);
      table.binary('deposit_to_args', 255);
      table.index(['deposit_to_code_hash', 'deposit_to_hash_type', 'deposit_to_args'], 'deposit_to');

      table.string('deposit_nft_id').index().comment('deposited NFT TokenID');
      table.tinyint('deposit_nft_proposal_type').comment('0x01 for mNFT, 0x02 for CoTA');

      table.enum('bridge_fee_state', ['Uncompleted', 'Completed']);
      table.decimal('bridge_fee_needed_amount', 78);

      /* bridge fee recipient */
      table.binary('bridge_fee_recipient_code_hash', 32);
      table.binary('bridge_fee_recipient_hash_type', 1);
      table.binary('bridge_fee_recipient_args', 255);
      table.index(
        ['bridge_fee_recipient_code_hash', 'bridge_fee_recipient_hash_type', 'bridge_fee_recipient_args'],
        'bridge_fee_recipient'
      );

      table.enum('bridge_message_state', ['NotSubmitted', 'Submitted']);
      table.binary('bridge_message_signature');
      table.binary('bridge_message_mint_nft_recipient', 20);

      table.enum('mint_state', ['NotReady', 'ReadyToMint', 'Committed', 'Confirmed']).notNullable();
      table.binary('mint_tx_hash', 32).index().comment('mint transaction hash on Ethereum');
      table.integer('mint_tx_nonce').comment('mint transaction nonce').nullable();
      table.binary('mint_signed_tx').comment('signed mint transaction');
      table.binary('mint_mapped_nft_id', 64).index();
    })
    .createTable('ckb2eth_bridge_fee', (table) => {
      table.increments();
      table.binary('ckb2eth_deposit_tx_hash', 32).comment('pay for deposit transaction hash');
      table.binary('tx_hash', 32).comment('bridge fee paid transaction hash');
      table.decimal('amount', 78);
      table.binary('recipient_code_hash', 32);
      table.binary('recipient_hash_type', 1);
      table.binary('recipient_args', 255);
    });
}

export function down(knex: Knex): Promise<unknown> {
  return knex.schema.dropTable('ckb2eth').dropTable('ckb2eth_bridge_fee');
}
