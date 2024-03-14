import type { BuildOptions, DataTypes, Model } from 'sequelize';
import type { DB } from '.';

export type ModelInstance<Attrs extends Record<string, unknown>> =
  Model<Attrs> & Attrs;

export type ModelStatic<T extends Model> = typeof Model & {
  associate: (models: DB) => void;
} & { new (values?: Record<string, unknown>, options?: BuildOptions): T };

export type CanvasModelAttributes = {
  canvas_signed_data: string;
  canvas_hash: string;
};

export const canvasModelSequelizeColumns = (dataTypes: typeof DataTypes) => ({
  canvas_signed_data: { type: dataTypes.JSONB, allowNull: true },
  canvas_hash: { type: dataTypes.STRING, allowNull: true },
});
