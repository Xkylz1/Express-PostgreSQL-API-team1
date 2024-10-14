"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Cars", "images", {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true, 
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Cars", "images");
    },
};
