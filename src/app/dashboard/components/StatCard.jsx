import { Card, CardContent } from "@/components/ui/card";



export function StatCard({ title, value, isCurrency = false }) {
  const formattedValue = isCurrency 
    ? `₹${value.toLocaleString()}` 
    : value.toLocaleString();
  
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-3xl font-bold">{formattedValue}</p>
      </CardContent>
    </Card>
  );
}
