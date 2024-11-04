-- AlterTable
CREATE SEQUENCE recomendaciones_id_seq;
ALTER TABLE "recomendaciones" ALTER COLUMN "id" SET DEFAULT nextval('recomendaciones_id_seq');
ALTER SEQUENCE recomendaciones_id_seq OWNED BY "recomendaciones"."id";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "codigo_postal" VARCHAR(20);
