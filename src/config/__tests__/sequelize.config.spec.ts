import { sequelizeConfig } from '../sequelize.config';

describe('Sequelize Config', () => {
  it('should have correct dialect', () => {
    expect(sequelizeConfig.dialect).toBe('postgres');
  });

  it('should have host configuration', () => {
    expect(sequelizeConfig.host).toBeDefined();
    expect(typeof sequelizeConfig.host).toBe('string');
  });

  it('should have port configuration', () => {
    expect(sequelizeConfig.port).toBeDefined();
    expect(typeof sequelizeConfig.port).toBe('number');
  });

  it('should have username configuration', () => {
    expect(sequelizeConfig.username).toBeDefined();
    expect(typeof sequelizeConfig.username).toBe('string');
  });

  it('should have password configuration', () => {
    expect(sequelizeConfig.password).toBeDefined();
    expect(typeof sequelizeConfig.password).toBe('string');
  });

  it('should have database configuration', () => {
    expect(sequelizeConfig.database).toBeDefined();
    expect(typeof sequelizeConfig.database).toBe('string');
  });

  it('should have correct pool configuration', () => {
    expect(sequelizeConfig.pool).toEqual({
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    });
  });

  it('should have autoLoadModels enabled', () => {
    expect(sequelizeConfig.autoLoadModels).toBe(true);
  });

  it('should have synchronize configuration', () => {
    expect(typeof sequelizeConfig.synchronize).toBe('boolean');
  });

  it('should have logging configuration', () => {
    expect(sequelizeConfig.logging).toBeDefined();
  });

  it('should have correct define configuration', () => {
    expect(sequelizeConfig.define).toEqual({
      timestamps: true,
      paranoid: true,
      underscored: false,
      freezeTableName: true,
    });
  });

  it('should have correct timezone', () => {
    expect(sequelizeConfig.timezone).toBe('-03:00');
  });

  it('should be a valid SequelizeModuleOptions object', () => {
    expect(sequelizeConfig).toHaveProperty('dialect');
    expect(sequelizeConfig).toHaveProperty('host');
    expect(sequelizeConfig).toHaveProperty('port');
    expect(sequelizeConfig).toHaveProperty('username');
    expect(sequelizeConfig).toHaveProperty('password');
    expect(sequelizeConfig).toHaveProperty('database');
    expect(sequelizeConfig).toHaveProperty('pool');
    expect(sequelizeConfig).toHaveProperty('autoLoadModels');
    expect(sequelizeConfig).toHaveProperty('synchronize');
    expect(sequelizeConfig).toHaveProperty('logging');
    expect(sequelizeConfig).toHaveProperty('define');
    expect(sequelizeConfig).toHaveProperty('timezone');
  });
});