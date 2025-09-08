'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add deleted_at column to users table
    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp for users'
    });

    // Add deleted_at column to books table
    await queryInterface.addColumn('books', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp for books'
    });

    // Add deleted_at column to audit_logs table
    await queryInterface.addColumn('audit_logs', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp for audit logs'
    });

    // Add indexes for deleted_at columns for better performance
    await queryInterface.addIndex('users', ['deleted_at'], {
      name: 'idx_users_deleted_at'
    });

    await queryInterface.addIndex('books', ['deleted_at'], {
      name: 'idx_books_deleted_at'
    });

    await queryInterface.addIndex('audit_logs', ['deleted_at'], {
      name: 'idx_audit_logs_deleted_at'
    });

    console.log('✅ Soft delete columns and indexes added successfully');
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('users', 'idx_users_deleted_at');
    await queryInterface.removeIndex('books', 'idx_books_deleted_at');
    await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_deleted_at');

    // Remove columns
    await queryInterface.removeColumn('users', 'deleted_at');
    await queryInterface.removeColumn('books', 'deleted_at');
    await queryInterface.removeColumn('audit_logs', 'deleted_at');

    console.log('✅ Soft delete columns and indexes removed successfully');
  }
};
