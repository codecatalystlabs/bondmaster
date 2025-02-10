import { CarInventory } from '@/components/cars/car-inventory';

const CarInventoryPage: React.FC = () => {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-6">Car Inventory Management</h1>
      <CarInventory />
    </div>
  );
};
export default CarInventoryPage;
