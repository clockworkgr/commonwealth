'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
          DELETE
          FROM "EvmEventSources"
          WHERE event_signature NOT IN (?);
      `,
        {
          replacements: [
            [
              '0x2f0d66b98c7708890a982e2194479b066a117a6f9a8f418f7f14c6001965b78b',
              '0x32391ebd47fc736bb885d21a45d95c3da80aef6987aa90a5c6e747e9bc755bc9',
              '0x68d40dd5e34d499a209946f8e381c1258bdeff6dea4e96e9ab921da385c03667',
              '0x002817006cf5e3f9ac0de6817ca39830ac7e731a4949a59e4ac3c8bef988b20c',
              '0xba2ce2b4fab99c4186fd3e0a8e93ffb61e332d0c4709bd01d01e7ac60631437a',
            ],
          ],
          transaction,
        },
      );
      await queryInterface.addColumn(
        'EvmEventSources',
        'contract_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'EvmEventSources',
        {
          contract_name: 'SingleContest',
        },
        {
          abi_id: 55,
        },
        { transaction },
      );
      await queryInterface.bulkUpdate(
        'EvmEventSources',
        {
          contract_name: 'RecurringContest',
        },
        {
          abi_id: 54,
        },
        { transaction },
      );

      await queryInterface.removeColumn('EvmEventSources', 'abi_id', {
        transaction,
      });

      await queryInterface.dropTable('Templates', { transaction });
      await queryInterface.dropTable('ContractAbis', { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
