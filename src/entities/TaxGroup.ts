// src/entities/TaxGroup.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinTable,
} from 'typeorm';
import { TaxRate } from './TaxRate';

@Entity()
export class TaxGroup {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name!: string;  // e.g. "Standard VAT Group", "Reduced Rates"

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => TaxRate, (taxRate) => taxRate.groups, { eager: true })
    @JoinTable({
        name: 'tax_group_rates', // join table name
        joinColumn: { name: 'taxGroupId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'taxRateId', referencedColumnName: 'id' },
    })
    taxRates!: TaxRate[];

    @Column({ nullable: true })
    createdBy?: number;
    @Column({ nullable: true })
    updatedBy?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
