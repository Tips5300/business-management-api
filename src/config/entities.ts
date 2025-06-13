/**
 * For each entity in src/entities/, import:
 *   - the Entity class
 *   - the corresponding CreateXDto and UpdateXDto from src/dtos/
 */

import { Account } from '../entities/Account';
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

import { Brand } from '../entities/Brand';
import { CreateBrandDto } from '../dtos/CreateBrandDto';
import { UpdateBrandDto } from '../dtos/UpdateBrandDto';

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

import { Income } from '../entities/Income';
import { CreateIncomeDto } from '../dtos/CreateIncomeDto';
import { UpdateIncomeDto } from '../dtos/UpdateIncomeDto';

import { IncomeType } from '../entities/IncomeType';
import { CreateIncomeTypeDto } from '../dtos/CreateIncomeTypeDto';
import { UpdateIncomeTypeDto } from '../dtos/UpdateIncomeTypeDto';

import { JournalEntry } from '../entities/JournalEntry';
import { CreateJournalEntryDto } from '../dtos/CreateJournalEntryDto';
import { UpdateJournalEntryDto } from '../dtos/UpdateJournalEntryDto';

import { LeaveRequest, LeaveStatus } from '../entities/LeaveRequest';
import { CreateLeaveRequestDto } from '../dtos/CreateLeaveRequestDto';
import { UpdateLeaveRequestDto } from '../dtos/UpdateLeaveRequestDto';

import { Note } from '../entities/Note';
import { CreateNoteDto } from '../dtos/CreateNoteDto';
import { UpdateNoteDto } from '../dtos/UpdateNoteDto';

import { PaymentMethod } from '../entities/PaymentMethod';
import { CreatePaymentMethodDto } from '../dtos/CreatePaymentMethodDto';
import { UpdatePaymentMethodDto } from '../dtos/UpdatePaymentMethodDto';

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

import { PurchaseReturn } from '../entities/PurchaseReturn';
import { CreatePurchaseReturnDto } from '../dtos/CreatePurchaseReturnDto';
import { UpdatePurchaseReturnDto } from '../dtos/UpdatePurchaseReturnDto';

import { PurchaseReturnProduct } from '../entities/PurchaseReturnProduct';
import { CreatePurchaseReturnProductDto } from '../dtos/CreatePurchaseReturnProductDto';
import { UpdatePurchaseReturnProductDto } from '../dtos/UpdatePurchaseReturnProductDto';

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

import { TaxGroup } from '../entities/TaxGroup';
import { CreateTaxGroupDto } from '../dtos/CreateTaxGroupDto';
import { UpdateTaxGroupDto } from '../dtos/UpdateTaxGroupDto';

import { TaxRate } from '../entities/TaxRate';
import { CreateTaxRateDto } from '../dtos/CreateTaxRateDto';
import { UpdateTaxRateDto } from '../dtos/UpdateTaxRateDto';

import { User } from "../entities/User";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { UpdateUserDto } from "../dtos/UpdateUserDto";

export const entitiesMap: Record<
  string,
  {
    entity: any;
    createDto: any;
    updateDto: any;
    searchableFields?: string[];
  }
> = {
  account: {
    entity: Account,
    createDto: CreateAccountDto,
    updateDto: UpdateAccountDto,
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
  brand: {
    entity: Brand,
    createDto: CreateBrandDto,
    updateDto: UpdateBrandDto,
    searchableFields: ['name', 'description'],
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
    searchableFields: ['description'],
  },
  income: {
    entity: Income,
    createDto: CreateIncomeDto,
    updateDto: UpdateIncomeDto,
    searchableFields: ['description'],
  },
  incomeType: {
    entity: IncomeType,
    createDto: CreateIncomeTypeDto,
    updateDto: UpdateIncomeTypeDto,
    searchableFields: ['name', 'description'],
  },
  journalEntry: {
    entity: JournalEntry,
    createDto: CreateJournalEntryDto,
    updateDto: UpdateJournalEntryDto,
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
  paymentMethod: {
    entity: PaymentMethod,
    createDto: CreatePaymentMethodDto,
    updateDto: UpdatePaymentMethodDto,
    searchableFields: ['name', 'description'],
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
  purchaseReturn: {
    entity: PurchaseReturn,
    createDto: CreatePurchaseReturnDto,
    updateDto: UpdatePurchaseReturnDto,
    searchableFields: [],
  },
  purchaseReturnProduct: {
    entity: PurchaseReturnProduct,
    createDto: CreatePurchaseReturnProductDto,
    updateDto: UpdatePurchaseReturnProductDto,
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
  taxGroup: {
    entity: TaxGroup,
    createDto: CreateTaxGroupDto,
    updateDto: UpdateTaxGroupDto,
    searchableFields: ['name', 'description'],
  },
  taxRate: {
    entity: TaxRate,
    createDto: CreateTaxRateDto,
    updateDto: UpdateTaxRateDto,
    searchableFields: ['description'],
  },
  user: {
    entity: User,
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
    searchableFields: ['name', 'email'],
  },
};