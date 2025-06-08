/**
 * For each entity in src/entities/, import:
 *   - the Entity class
 *   - the corresponding CreateXDto and UpdateXDto from src/dtos/
 *
 * Optionally, if an entity requires automatic journal entries, 
 * supply a `journalConfig.getEntryPayload()` function.
 */

import { Account, AccountType } from '../entities/Account';
import { CreateAccountDto } from '../dtos/CreateAccountDto';
import { UpdateAccountDto } from '../dtos/UpdateAccountDto';

import { Attendance } from '../entities/Attendance';
import { CreateAttendanceDto } from '../dtos/CreateAttendanceDto';
import { UpdateAttendanceDto } from '../dtos/UpdateAttendanceDto';

import { Badge } from '../entities/Badge';
import { CreateBadgeDto } from '../dtos/CreateBadgeDto';
import { UpdateBadgeDto } from '../dtos/UpdateBadgeDto';

import { Batch } from '../entities/Batch';
import { CreateBatchDto } from '../dtos/CreateBatchDto';
import { UpdateBatchDto } from '../dtos/UpdateBatchDto';

import { Category } from '../entities/Category';
import { CreateCategoryDto } from '../dtos/CreateCategoryDto';
import { UpdateCategoryDto } from '../dtos/UpdateCategoryDto';

import { Customer } from '../entities/Customer';
import { CreateCustomerDto } from '../dtos/CreateCustomerDto';
import { UpdateCustomerDto } from '../dtos/UpdateCustomerDto';

import { Department } from '../entities/Department';
import { CreateDepartmentDto } from '../dtos/CreateDepartmentDto';
import { UpdateDepartmentDto } from '../dtos/UpdateDepartmentDto';

import { Employee } from '../entities/Employee';
import { CreateEmployeeDto } from '../dtos/CreateEmployeeDto';
import { UpdateEmployeeDto } from '../dtos/UpdateEmployeeDto';

import { Expense } from '../entities/Expense';
import { CreateExpenseDto } from '../dtos/CreateExpenseDto';
import { UpdateExpenseDto } from '../dtos/UpdateExpenseDto';

import { Incharge } from '../entities/Incharge';
import { CreateInchargeDto } from '../dtos/CreateInchargeDto';
import { UpdateInchargeDto } from '../dtos/UpdateInchargeDto';

import { JournalEntry } from '../entities/JournalEntry';
// (no DTO for JournalEntry; likely internal)

import { LeaveRequest, LeaveStatus } from '../entities/LeaveRequest';
import { CreateLeaveRequestDto } from '../dtos/CreateLeaveRequestDto';
import { UpdateLeaveRequestDto } from '../dtos/UpdateLeaveRequestDto';

import { Note } from '../entities/Note';
import { CreateNoteDto } from '../dtos/CreateNoteDto';
import { UpdateNoteDto } from '../dtos/UpdateNoteDto';

import { Permission } from '../entities/Permission';
import { CreatePermissionDto } from '../dtos/CreatePermissionDto';
import { UpdatePermissionDto } from '../dtos/UpdatePermissionDto';

import { Position } from '../entities/Position';
import { CreatePositionDto } from '../dtos/CreatePositionDto';
import { UpdatePositionDto } from '../dtos/UpdatePositionDto';

import { Product } from '../entities/Product';
import { CreateProductDto } from '../dtos/CreateProductDto';
import { UpdateProductDto } from '../dtos/UpdateProductDto';

import { Purchase } from '../entities/Purchase';
import { CreatePurchaseDto } from '../dtos/CreatePurchaseDto';
import { UpdatePurchaseDto } from '../dtos/UpdatePurchaseDto';

import { PurchaseProduct } from '../entities/PurchaseProduct';
import { CreatePurchaseProductDto } from '../dtos/CreatePurchaseProductDto';
import { UpdatePurchaseProductDto } from '../dtos/UpdatePurchaseProductDto';

import { Role } from '../entities/Role';
import { CreateRoleDto } from '../dtos/CreateRoleDto';
import { UpdateRoleDto } from '../dtos/UpdateRoleDto';

import { Sale } from '../entities/Sale';
import { CreateSaleDto } from '../dtos/CreateSaleDto';
import { UpdateSaleDto } from '../dtos/UpdateSaleDto';

import { SaleProduct } from '../entities/SaleProduct';
import { CreateSaleProductDto } from '../dtos/CreateSaleProductDto';
import { UpdateSaleProductDto } from '../dtos/UpdateSaleProductDto';

import { SaleReturn } from '../entities/SaleReturn';
import { CreateSaleReturnDto } from '../dtos/CreateSaleReturnDto';
import { UpdateSaleReturnDto } from '../dtos/UpdateSaleReturnDto';

import { SaleReturnProduct } from '../entities/SaleReturnProduct';
import { CreateSaleReturnProductDto } from '../dtos/CreateSaleReturnProductDto';
import { UpdateSaleReturnProductDto } from '../dtos/UpdateSaleReturnProductDto';

import { Setting } from '../entities/Setting';
import { CreateSettingDto } from '../dtos/CreateSettingDto';
import { UpdateSettingDto } from '../dtos/UpdateSettingDto';

import { Stock } from '../entities/Stock';
import { CreateStockDto } from '../dtos/CreateStockDto';
import { UpdateStockDto } from '../dtos/UpdateStockDto';

import { StockAdjustment } from '../entities/StockAdjustment';
import { CreateStockAdjustmentDto } from '../dtos/CreateStockAdjustmentDto';
import { UpdateStockAdjustmentDto } from '../dtos/UpdateStockAdjustmentDto';

import { StockTransfer } from '../entities/StockTransfer';
import { CreateStockTransferDto } from '../dtos/CreateStockTransferDto';
import { UpdateStockTransferDto } from '../dtos/UpdateStockTransferDto';

import { Store } from '../entities/Store';
import { CreateStoreDto } from '../dtos/CreateStoreDto';
import { UpdateStoreDto } from '../dtos/UpdateStoreDto';

import { SubCategory } from '../entities/SubCategory';
import { CreateSubCategoryDto } from '../dtos/CreateSubCategoryDto';
import { UpdateSubCategoryDto } from '../dtos/UpdateSubCategoryDto';

import { Supplier } from '../entities/Supplier';
import { CreateSupplierDto } from '../dtos/CreateSupplierDto';
import { UpdateSupplierDto } from '../dtos/UpdateSupplierDto';

import { TaxRate } from '../entities/TaxRate';
import { CreateTaxRateDto } from '../dtos/CreateTaxRateDto';
import { UpdateTaxRateDto } from '../dtos/UpdateTaxRateDto';

import { Transaction, TransactionType } from '../entities/Transaction';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';
import { UpdateTransactionDto } from '../dtos/UpdateTransactionDto';

export interface JournalPayload {
  date: string;
  refType: string;
  refId: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  description: string;
}

const expenseJournalConfig = {
  getEntryPayload: (expense: Expense): JournalPayload => ({
    date: expense.createdAt.toISOString().split('T')[0],
    refType: 'EXPENSE',
    refId: expense.id,
    debitAccountId: expense.account.id,
    creditAccountId: 'CASH_ACCOUNT_UUID',
    amount: Number(expense.amount),
    description: expense.description,
  }),
};

const purchaseJournalConfig = {
  getEntryPayload: (purchase: Purchase): JournalPayload => ({
    date: purchase.createdAt.toISOString().split('T')[0],
    refType: 'PURCHASE',
    refId: purchase.id,
    debitAccountId: purchase.inventoryAccountId,
    creditAccountId: purchase.payableAccountId,
    amount: Number(purchase.totalAmount),
    description: `Purchase #${purchase.id}`,
  }),
};

const saleJournalConfig = {
  getEntryPayload: (sale: Sale): JournalPayload => ({
    date: sale.createdAt.toISOString().split('T')[0],
    refType: 'SALE',
    refId: sale.id,
    debitAccountId: sale.receivableAccountId,
    creditAccountId: sale.revenueAccountId,
    amount: Number(sale.totalAmount),
    description: `Sale #${sale.id}`,
  }),
};

const saleReturnJournalConfig = {
  getEntryPayload: (returnItem: SaleReturn): JournalPayload => ({
    date: returnItem.createdAt.toISOString().split('T')[0],
    refType: 'SALE_RETURN',
    refId: returnItem.id,
    debitAccountId: returnItem.returnAccountId,
    creditAccountId: returnItem.receivableAccountId,
    amount: Number(returnItem.returnAmount),
    description: `Sale Return #${returnItem.id}`,
  }),
};

const transactionJournalConfig = {
  getEntryPayload: (tx: Transaction): JournalPayload => ({
    date: tx.date.toISOString().split('T')[0],
    refType: 'TRANSACTION',
    refId: tx.id,
    debitAccountId:
      tx.type === TransactionType.CREDIT ? tx.accountId : 'OTHER_DEBIT_ACCOUNT_UUID',
    creditAccountId:
      tx.type === TransactionType.DEBIT ? tx.accountId : 'OTHER_CREDIT_ACCOUNT_UUID',
    amount: Number(tx.amount),
    description: tx.description,
  }),
};

const stockAdjustmentJournalConfig = {
  getEntryPayload: (adj: StockAdjustment): JournalPayload => ({
    date: adj.createdAt.toISOString().split('T')[0],
    refType: 'STOCK_ADJUSTMENT',
    refId: adj.id,
    debitAccountId: adj.isIncrease
      ? adj.inventoryAccountId
      : 'ADJUSTMENT_LOSS_ACCOUNT_UUID',
    creditAccountId: adj.isIncrease
      ? 'ADJUSTMENT_GAIN_ACCOUNT_UUID'
      : adj.inventoryAccountId,
    amount: Number(adj.adjustedValue),
    description: `Stock Adjustment #${adj.id}`,
  }),
};

const stockTransferJournalConfig = {
  getEntryPayload: (st: StockTransfer): JournalPayload => ({
    date: st.createdAt.toISOString().split('T')[0],
    refType: 'STOCK_TRANSFER',
    refId: st.id,
    debitAccountId: st.destinationWarehouseAccountId,
    creditAccountId: st.sourceWarehouseAccountId,
    amount: Number(st.transferValue),
    description: `Transfer #${st.id} from ${st.sourceWarehouseId} to ${st.destinationWarehouseId}`,
  }),
};

export const entitiesMap: Record<
  string,
  {
    entity: any;
    createDto: any;
    updateDto: any;
    journalConfig?: { getEntryPayload: (arg: any) => JournalPayload };
    // You can add other metadata (e.g. which fields to “search” on)
    searchableFields?: string[];
  }
> = {
  account: {
    entity: Account,
    createDto: CreateAccountDto,
    updateDto: UpdateAccountDto,
    journalConfig: undefined, // Account itself doesn’t auto‐create journal entries
    searchableFields: ['name', 'description'],
  },
  attendance: {
    entity: Attendance,
    createDto: CreateAttendanceDto,
    updateDto: UpdateAttendanceDto,
    searchableFields: [], // no text fields
  },
  badge: {
    entity: Badge,
    createDto: CreateBadgeDto,
    updateDto: UpdateBadgeDto,
    searchableFields: ['code', 'description'],
  },
  batch: {
    entity: Batch,
    createDto: CreateBatchDto,
    updateDto: UpdateBatchDto,
    searchableFields: [],
  },
  category: {
    entity: Category,
    createDto: CreateCategoryDto,
    updateDto: UpdateCategoryDto,
    searchableFields: ['name', 'description'],
  },
  customer: {
    entity: Customer,
    createDto: CreateCustomerDto,
    updateDto: UpdateCustomerDto,
    searchableFields: ['name', 'phone', 'address'],
  },
  department: {
    entity: Department,
    createDto: CreateDepartmentDto,
    updateDto: UpdateDepartmentDto,
    searchableFields: ['name'],
  },
  employee: {
    entity: Employee,
    createDto: CreateEmployeeDto,
    updateDto: UpdateEmployeeDto,
    searchableFields: ['name', 'email'],
  },
  expense: {
    entity: Expense,
    createDto: CreateExpenseDto,
    updateDto: UpdateExpenseDto,
    journalConfig: expenseJournalConfig,
    searchableFields: ['description'],
  },
  incharge: {
    entity: Incharge,
    createDto: CreateInchargeDto,
    updateDto: UpdateInchargeDto,
    searchableFields: ['name', 'email'],
  },
  journalEntry: {
    entity: JournalEntry,
    // no public create/update – managed internally
    createDto: undefined,
    updateDto: undefined,
    searchableFields: ['refType', 'description', 'transactionReference'],
  },
  leaveRequest: {
    entity: LeaveRequest,
    createDto: CreateLeaveRequestDto,
    updateDto: UpdateLeaveRequestDto,
    searchableFields: ['reason', 'status'],
  },
  note: {
    entity: Note,
    createDto: CreateNoteDto,
    updateDto: UpdateNoteDto,
    searchableFields: ['content'],
  },
  permission: {
    entity: Permission,
    createDto: CreatePermissionDto,
    updateDto: UpdatePermissionDto,
    searchableFields: ['module', 'action'],
  },
  position: {
    entity: Position,
    createDto: CreatePositionDto,
    updateDto: UpdatePositionDto,
    searchableFields: ['title', 'description'],
  },
  product: {
    entity: Product,
    createDto: CreateProductDto,
    updateDto: UpdateProductDto,
    searchableFields: ['name', 'description'],
  },
  purchase: {
    entity: Purchase,
    createDto: CreatePurchaseDto,
    updateDto: UpdatePurchaseDto,
    searchableFields: [],
  },
  purchaseProduct: {
    entity: PurchaseProduct,
    createDto: CreatePurchaseProductDto,
    updateDto: UpdatePurchaseProductDto,
    searchableFields: [],
  },
  role: {
    entity: Role,
    createDto: CreateRoleDto,
    updateDto: UpdateRoleDto,
    searchableFields: ['name', 'description'],
  },
  sale: {
    entity: Sale,
    createDto: CreateSaleDto,
    updateDto: UpdateSaleDto,
    searchableFields: [],
  },
  saleProduct: {
    entity: SaleProduct,
    createDto: CreateSaleProductDto,
    updateDto: UpdateSaleProductDto,
    searchableFields: [],
  },
  saleReturn: {
    entity: SaleReturn,
    createDto: CreateSaleReturnDto,
    updateDto: UpdateSaleReturnDto,
    searchableFields: [],
  },
  saleReturnProduct: {
    entity: SaleReturnProduct,
    createDto: CreateSaleReturnProductDto,
    updateDto: UpdateSaleReturnProductDto,
    searchableFields: [],
  },
  setting: {
    entity: Setting,
    createDto: CreateSettingDto,
    updateDto: UpdateSettingDto,
    searchableFields: ['key', 'value'],
  },
  stock: {
    entity: Stock,
    createDto: CreateStockDto,
    updateDto: UpdateStockDto,
    searchableFields: ['warehouse'],
  },
  stockAdjustment: {
    entity: StockAdjustment,
    createDto: CreateStockAdjustmentDto,
    updateDto: UpdateStockAdjustmentDto,
    searchableFields: ['reason'],
  },
  stockTransfer: {
    entity: StockTransfer,
    createDto: CreateStockTransferDto,
    updateDto: UpdateStockTransferDto,
    searchableFields: ['fromLocation', 'toLocation'],
  },
  store: {
    entity: Store,
    createDto: CreateStoreDto,
    updateDto: UpdateStoreDto,
    searchableFields: ['name'],
  },
  subCategory: {
    entity: SubCategory,
    createDto: CreateSubCategoryDto,
    updateDto: UpdateSubCategoryDto,
    searchableFields: ['name', 'description'],
  },
  supplier: {
    entity: Supplier,
    createDto: CreateSupplierDto,
    updateDto: UpdateSupplierDto,
    searchableFields: ['name', 'phone', 'address'],
  },
  taxRate: {
    entity: TaxRate,
    createDto: CreateTaxRateDto,
    updateDto: UpdateTaxRateDto,
    searchableFields: ['description'],
  },
  transaction: {
    entity: Transaction,
    createDto: CreateTransactionDto,
    updateDto: UpdateTransactionDto,
    searchableFields: ['description', 'transactionReference'],
  },
};