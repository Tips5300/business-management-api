import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { User } from '../entities/User';
import { PaymentMethod } from '../entities/PaymentMethod';
import { Account, AccountType } from '../entities/Account';
import { ExpenseType } from '../entities/ExpenseType';
import { IncomeType } from '../entities/IncomeType';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create default accounts
    const accountRepo = AppDataSource.getRepository(Account);
    const accounts = [
      { name: 'Cash', accountType: AccountType.ASSET, currency: 'USD', isActive: true },
      { name: 'Bank Account', accountType: AccountType.ASSET, currency: 'USD', isActive: true },
      { name: 'Accounts Receivable', accountType: AccountType.ASSET, currency: 'USD', isActive: true },
      { name: 'Inventory', accountType: AccountType.ASSET, currency: 'USD', isActive: true },
      { name: 'Accounts Payable', accountType: AccountType.LIABILITY, currency: 'USD', isActive: true },
      { name: 'Sales Revenue', accountType: AccountType.REVENUE, currency: 'USD', isActive: true },
      { name: 'Cost of Goods Sold', accountType: AccountType.EXPENSE, currency: 'USD', isActive: true },
      { name: 'Operating Expenses', accountType: AccountType.EXPENSE, currency: 'USD', isActive: true },
    ];

    for (const accountData of accounts) {
      const existing = await accountRepo.findOne({ where: { name: accountData.name } });
      if (!existing) {
        await accountRepo.save(accountRepo.create(accountData));
      }
    }

    // Create default payment methods
    const paymentMethodRepo = AppDataSource.getRepository(PaymentMethod);
    const paymentMethods = [
      { name: 'Cash', description: 'Cash payment' },
      { name: 'Credit Card', description: 'Credit card payment' },
      { name: 'Bank Transfer', description: 'Bank transfer payment' },
      { name: 'Check', description: 'Check payment' },
    ];

    for (const pmData of paymentMethods) {
      const existing = await paymentMethodRepo.findOne({ where: { name: pmData.name } });
      if (!existing) {
        await paymentMethodRepo.save(paymentMethodRepo.create(pmData));
      }
    }

    // Create default expense types
    const expenseTypeRepo = AppDataSource.getRepository(ExpenseType);
    const expenseTypes = [
      { name: 'Office Supplies', description: 'Office supplies and materials' },
      { name: 'Utilities', description: 'Electricity, water, internet' },
      { name: 'Rent', description: 'Office or store rent' },
      { name: 'Marketing', description: 'Marketing and advertising expenses' },
      { name: 'Travel', description: 'Business travel expenses' },
    ];

    for (const etData of expenseTypes) {
      const existing = await expenseTypeRepo.findOne({ where: { name: etData.name } });
      if (!existing) {
        await expenseTypeRepo.save(expenseTypeRepo.create(etData));
      }
    }

    // Create default income types
    const incomeTypeRepo = AppDataSource.getRepository(IncomeType);
    const incomeTypes = [
      { name: 'Product Sales', description: 'Revenue from product sales' },
      { name: 'Service Revenue', description: 'Revenue from services' },
      { name: 'Interest Income', description: 'Interest earned on investments' },
      { name: 'Other Income', description: 'Miscellaneous income' },
    ];

    for (const itData of incomeTypes) {
      const existing = await incomeTypeRepo.findOne({ where: { name: itData.name } });
      if (!existing) {
        await incomeTypeRepo.save(incomeTypeRepo.create(itData));
      }
    }

    // Create default permissions
    const permissionRepo = AppDataSource.getRepository(Permission);
    const modules = [
      'account', 'attendance', 'badge', 'batch', 'brand', 'category', 'customer',
      'department', 'employee', 'expense', 'expenseType', 'income', 'incomeType',
      'journalEntry', 'leaveRequest', 'note', 'paymentMethod', 'permission',
      'position', 'product', 'purchase', 'purchaseProduct', 'purchaseReturn',
      'purchaseReturnProduct', 'role', 'sale', 'saleProduct', 'saleReturn',
      'saleReturnProduct', 'setting', 'stock', 'stockAdjustment', 'stockTransfer',
      'store', 'subCategory', 'supplier', 'taxGroup', 'taxRate', 'user'
    ];
    const actions = ['create', 'read', 'update', 'delete', 'restore', 'hardDelete', 'viewTrash', 'export', 'import'];

    for (const module of modules) {
      for (const action of actions) {
        const existing = await permissionRepo.findOne({ 
          where: { module, action } 
        });
        if (!existing) {
          await permissionRepo.save(permissionRepo.create({
            module,
            action,
            isAllowed: true
          }));
        }
      }
    }

    // Create admin role with all permissions
    const roleRepo = AppDataSource.getRepository(Role);
    let adminRole = await roleRepo.findOne({ 
      where: { name: 'Admin' },
      relations: ['permissions']
    });
    
    if (!adminRole) {
      const allPermissions = await permissionRepo.find();
      adminRole = roleRepo.create({
        name: 'Admin',
        description: 'Administrator with full access',
        isSystemRole: true,
        permissions: allPermissions
      });
      await roleRepo.save(adminRole);
    }

    // Create default admin user
    const userRepo = AppDataSource.getRepository(User);
    const adminUser = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await userRepo.save(userRepo.create({
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: adminRole
      }));
    }

    console.log('Database seeding completed successfully!');
    console.log('Default admin user: admin@example.com / password123');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}