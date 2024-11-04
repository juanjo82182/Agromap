-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "direccion" VARCHAR(255) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "clima" (
    "id" SERIAL NOT NULL,
    "usuarioEmail" VARCHAR(255) NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "condicion" TEXT NOT NULL,
    "humedad" DOUBLE PRECISION NOT NULL,
    "viento" DOUBLE PRECISION NOT NULL,
    "presion" DOUBLE PRECISION NOT NULL,
    "visibilidad" DOUBLE PRECISION NOT NULL,
    "precipitacion" DOUBLE PRECISION NOT NULL,
    "recomendacion" VARCHAR(255),

    CONSTRAINT "clima_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clima_usuarioEmail_key" ON "clima"("usuarioEmail");
