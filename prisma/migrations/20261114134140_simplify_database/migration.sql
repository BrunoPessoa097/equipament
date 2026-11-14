/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderEquipamentUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StorageEquipament` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_id_equipament_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_id_storage_fkey";

-- DropForeignKey
ALTER TABLE "OrderEquipamentUser" DROP CONSTRAINT "OrderEquipamentUser_id_order_fkey";

-- DropForeignKey
ALTER TABLE "OrderEquipamentUser" DROP CONSTRAINT "OrderEquipamentUser_id_user_fkey";

-- DropForeignKey
ALTER TABLE "StorageEquipament" DROP CONSTRAINT "StorageEquipament_id_equipament_fkey";

-- DropForeignKey
ALTER TABLE "StorageEquipament" DROP CONSTRAINT "StorageEquipament_id_storage_fkey";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderEquipamentUser";

-- DropTable
DROP TABLE "StorageEquipament";

-- CreateTable
CREATE TABLE "StorageEquipUser" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_storage" INTEGER NOT NULL,
    "id_equipament" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageEquipUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorageEquipUser_id_equipament_key" ON "StorageEquipUser"("id_equipament");

-- AddForeignKey
ALTER TABLE "StorageEquipUser" ADD CONSTRAINT "StorageEquipUser_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageEquipUser" ADD CONSTRAINT "StorageEquipUser_id_storage_fkey" FOREIGN KEY ("id_storage") REFERENCES "Storage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageEquipUser" ADD CONSTRAINT "StorageEquipUser_id_equipament_fkey" FOREIGN KEY ("id_equipament") REFERENCES "Equipament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
