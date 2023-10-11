'use strict';

const getHex = async (address) => {
  const { toHex, fromBech32 } = await import('@cosmjs/encoding');
  const encodedData = fromBech32(address).data;
  const addressHex = toHex(encodedData);
  return addressHex;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE "Addresses" ADD COLUMN IF NOT EXISTS "hex" VARCHAR(64) NULL;
        `,
        { raw: true, transaction: t }
      );

      // get all cosmos addresses and assign a hex
      const [addresses] = await queryInterface.sequelize.query(
        `
        SELECT id, address
        FROM "Addresses"
        WHERE "wallet_id" IN ('keplr', 'cosm-metamask', 'terrastation', 'keplr-ethereum');     
          `,
        { transaction: t }
      );

      for (const address of addresses) {
        try {
          const hex = await getHex(address.address);

          //TODO: can we replicate the function in SQL?
          // get the migration declarative (instead of looping), down to 2 minutes in PROD
          // maybe batching

          await queryInterface.sequelize.query(
            `
            UPDATE "Addresses"
            SET hex = '${hex}'
            WHERE id = ${address.id};
            `,
            { transaction: t }
          );
        } catch (e) {
          console.log(
            `Error getting hex for ${address.address}. Not updating.`
          );
        }
      }
    });

    // TODO: this fails because there are some Cosmos addresses that couldn't be converted to hex
    // await queryInterface.sequelize.transaction(async (t) => {
    //   await queryInterface.sequelize.query(
    //     `
    //     ALTER TABLE "Addresses"
    //       ADD CONSTRAINT cosmos_requires_hex
    //       CHECK ((wallet_id NOT IN ('keplr', 'cosm-metamask', 'terrastation', 'keplr-ethereum')) OR (wallet_id IN ('keplr', 'cosm-metamask', 'terrastation', 'keplr-ethereum') AND hex IS NOT NULL));
    //     `,
    //     { raw: true, transaction: t }
    //   );
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "Addresses"
          DROP CONSTRAINT IF EXISTS "cosmos_requires_hex",
          DROP COLUMN "hex";
        `,
        { raw: true, transaction: t }
      );
    });
  },
};
