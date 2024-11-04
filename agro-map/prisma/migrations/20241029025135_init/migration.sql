/*
  Warnings:

  - You are about to drop the column `usuarioEmail` on the `clima` table. All the data in the column will be lost.
  - Added the required column `usuario_id` to the `clima` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clima" DROP COLUMN "usuarioEmail",
ADD COLUMN     "usuario_id" INTEGER NOT NULL,
ALTER COLUMN "temperatura" DROP NOT NULL,
ALTER COLUMN "condicion" DROP NOT NULL,
ALTER COLUMN "condicion" SET DATA TYPE VARCHAR,
ALTER COLUMN "humedad" DROP NOT NULL,
ALTER COLUMN "viento" DROP NOT NULL,
ALTER COLUMN "presion" DROP NOT NULL,
ALTER COLUMN "visibilidad" DROP NOT NULL,
ALTER COLUMN "precipitacion" DROP NOT NULL,
ALTER COLUMN "recomendacion" SET DATA TYPE VARCHAR;

-- CreateTable
CREATE TABLE "recomendaciones" (
    "id" INTEGER NOT NULL,
    "cultivo" VARCHAR(100) NOT NULL,
    "temperatura_min" DOUBLE PRECISION,
    "temperatura_max" DOUBLE PRECISION,
    "humedad_min" DOUBLE PRECISION,
    "humedad_max" DOUBLE PRECISION,
    "condiciones" VARCHAR(255),
    "descripcion" TEXT,

    CONSTRAINT "recomendaciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clima" ADD CONSTRAINT "clima_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;
