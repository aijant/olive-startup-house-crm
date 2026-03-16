import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const occupancyPercent = Math.round((property.occupiedBeds / property.totalBeds) * 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOccupancyColor = (percent: number) => {
    if (percent >= 90) return "bg-emerald-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover-elevate"
      onClick={onClick}
      data-testid={`property-card-${property.id}`}
    >
      <div className="relative h-40 bg-muted">
        {property.image ? (
          <img 
            src={property.image} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <Badge 
          className={`absolute top-3 right-3 ${getOccupancyColor(occupancyPercent)} text-white border-0`}
        >
          {occupancyPercent}% Full
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-base">{property.name}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3" />
          {property.location}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Beds</p>
            <p className="text-sm font-medium">{property.occupiedBeds}/{property.totalBeds}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rooms</p>
            <p className="text-sm font-medium">{property.occupiedRooms}/{property.totalRooms}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-sm font-medium text-primary">{formatCurrency(property.monthlyRevenue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
