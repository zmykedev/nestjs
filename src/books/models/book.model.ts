import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';

@Table({
  tableName: 'books',
  timestamps: true,
  paranoid: false, // Disabled until deleted_at column is added via migration
})
export class Book extends Model<Book> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  author: string;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  publisher: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  availability: boolean;

  @Index
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  genre: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  imageUrl?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  // @DeletedAt - will be added via migration later
  // @Column(DataType.DATE)
  // deletedAt?: Date;

  // Métodos de instancia para lógica de negocio
  get isAvailable(): boolean {
    return this.availability && this.stock > 0;
  }

  get formattedPrice(): string {
    return `$${this.price.toLocaleString('es-CL')}`;
  }

  // Scopes para consultas comunes
  static scopes = {
    available: {
      where: {
        availability: true,
        stock: { $gt: 0 },
      },
    },
    byGenre: (genre: string) => ({
      where: { genre },
    }),
    withStock: {
      where: {
        stock: { $gt: 0 },
      },
    },
  };
}
