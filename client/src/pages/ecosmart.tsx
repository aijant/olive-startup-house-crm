import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Key,
  Eye,
  Building2,
  BedDouble,
  DoorOpen,
  DollarSign,
  Settings,
  Plus,
} from "lucide-react";
import type { Property, Room } from "@shared/schema";

export default function EcoSmartPage() {
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const totalBeds = properties?.reduce((sum, p) => sum + p.totalBeds, 0) || 0;
  const occupiedBeds = properties?.reduce((sum, p) => sum + p.occupiedBeds, 0) || 0;
  const totalRooms = properties?.reduce((sum, p) => sum + p.totalRooms, 0) || 0;
  const occupiedRooms = properties?.reduce((sum, p) => sum + p.occupiedRooms, 0) || 0;
  const totalRevenue = properties?.reduce((sum, p) => sum + p.monthlyRevenue, 0) || 0;
  const smartLockRooms = rooms?.filter(r => r.hasSmartLock).length || 0;

  const bedOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const roomOccupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">EcoSmart</h1>
          <p className="text-muted-foreground">Property management, reservations, and smart access control</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button data-testid="button-add-property">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Reservation Calendar</h3>
                <p className="text-sm text-muted-foreground">Room and bed availability tracking</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <Key className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Smart Keys</h3>
                <p className="text-sm text-muted-foreground">{smartLockRooms} rooms with smart locks</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <Eye className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Computer Vision</h3>
                <p className="text-sm text-muted-foreground">Space monitoring and analytics</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-2xl font-bold mt-2">{properties?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BedDouble className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-2xl font-bold mt-2">{bedOccupancy}%</p>
            <p className="text-sm text-muted-foreground">Bed Occupancy ({occupiedBeds}/{totalBeds})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DoorOpen className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-2xl font-bold mt-2">{roomOccupancy}%</p>
            <p className="text-sm text-muted-foreground">Room Occupancy ({occupiedRooms}/{totalRooms})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Key className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-2xl font-bold mt-2">{smartLockRooms}</p>
            <p className="text-sm text-muted-foreground">Smart Locks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-2xl font-bold mt-2">${(totalRevenue / 1000).toFixed(1)}k</p>
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties & Rooms */}
      <Tabs defaultValue="properties">
        <TabsList>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="rooms">Rooms ({rooms?.length || 0})</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertiesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-md" />
              ))
            ) : (
              properties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomsLoading ? (
                  Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-md" />
                  ))
                ) : rooms?.length === 0 ? (
                  <div className="col-span-3 text-center py-12">
                    <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mt-4">No rooms configured</p>
                  </div>
                ) : (
                  rooms?.map((room) => (
                    <div 
                      key={room.id} 
                      className="p-4 rounded-md border border-border hover-elevate cursor-pointer"
                      data-testid={`room-card-${room.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{room.name}</h4>
                        <Badge 
                          variant="secondary" 
                          className={room.isOccupied 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                            : "bg-muted text-muted-foreground"
                          }
                        >
                          {room.isOccupied ? "Occupied" : "Available"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{room.type}</span>
                        <span>{room.beds} bed{room.beds > 1 ? "s" : ""}</span>
                        {room.hasSmartLock && (
                          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <Key className="h-3 w-3" />
                            Smart Lock
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-medium text-primary">${room.monthlyRate}/mo</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mt-4">Reservation Calendar</p>
                <p className="text-sm text-muted-foreground">Full calendar view coming soon</p>
                <Button className="mt-4" variant="outline">
                  View Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
