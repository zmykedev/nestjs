import * as bcrypt from 'bcrypt';
import {
  Column,
  Model,
  Table,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: false, // Disabled until deleted_at column is added
  underscored: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'refresh_token',
  })
  refreshToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  updatedAt: Date;

  // deletedAt column will be added via migration later
  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  //   field: 'deleted_at',
  // })
  // deletedAt: Date;

  // Hash password before creating user
  @BeforeCreate
  static async hashPasswordOnCreate(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 12);
    }
  }

  // Hash password before updating user
  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User) {
    if (instance.changed('password') && instance.password) {
      instance.password = await bcrypt.hash(instance.password, 12);
    }
  }
}
