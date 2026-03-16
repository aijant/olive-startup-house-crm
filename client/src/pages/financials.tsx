import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  PieChart,
  BarChart3,
  Building2,
} from "lucide-react";
import type { 
  FinancialData, 
  RevenueByProperty, 
  MonthlyFinancial,
  RevenueBreakdown,
  ExpenseBreakdown,
} from "@shared/schema";

export default function FinancialsPage() {
  const { data: financials } = useQuery<FinancialData>({
    queryKey: ["/api/financials"],
  });

  const { data: revenueByProperty } = useQuery<RevenueByProperty[]>({
    queryKey: ["/api/financials/by-property"],
  });

  const { data: monthlyData } = useQuery<MonthlyFinancial[]>({
    queryKey: ["/api/financials/monthly"],
  });

  const { data: revenueBreakdown } = useQuery<RevenueBreakdown[]>({
    queryKey: ["/api/financials/revenue-breakdown"],
  });

  const { data: expenseBreakdown } = useQuery<ExpenseBreakdown[]>({
    queryKey: ["/api/financials/expense-breakdown"],
  });

  const currentMonth = monthlyData?.find(m => m.isCurrent);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial Reporting</h1>
          <p className="text-muted-foreground">Revenue analytics, P&L statements, and financial performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Jan 2026
          </Button>
          <Button data-testid="button-export-report">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                {financials?.revenueChange || 0}%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2">${((financials?.totalRevenue || 0) / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                {financials?.profitChange || 0}%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2">${((financials?.netProfit || 0) / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{financials?.marginChange || 0}%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2">{financials?.profitMargin || 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Avg Occupancy</p>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold mt-2">{financials?.avgOccupancy || 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all properties</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Property */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue by Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueByProperty?.map((prop) => (
              <div key={prop.propertyId} className="p-4 rounded-md border border-border hover-elevate">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{prop.propertyName}</h4>
                  <Badge 
                    variant="secondary" 
                    className={prop.change >= 0 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }
                  >
                    {prop.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(prop.change)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{prop.location}</p>
                <p className="text-2xl font-bold mt-3 text-primary">${(prop.revenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">{prop.occupiedRooms}/{prop.totalRooms} rooms ({Math.round((prop.occupiedRooms / prop.totalRooms) * 100)}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Period Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Period Performance (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData?.map((month) => (
              <div 
                key={`${month.month}-${month.year}`} 
                className={`p-4 rounded-md border ${month.isCurrent ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{month.month} {month.year}</span>
                    {month.isCurrent && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Current</Badge>
                    )}
                  </div>
                  <span className="text-sm font-medium">{month.margin}% margin</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-lg font-bold">${(month.revenue / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                    <p className="text-lg font-bold">${(month.expenses / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="text-lg font-bold text-primary">${(month.profit / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* P&L Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue Breakdown
              </CardTitle>
              <span className="text-lg font-bold text-primary">
                ${((currentMonth?.revenue || 0) / 1000).toFixed(1)}k
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.category}</span>
                      <Badge 
                        variant="secondary" 
                        className={item.change >= 0 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {item.change >= 0 ? "+" : ""}{item.change}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold">${(item.amount / 1000).toFixed(1)}k</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Breakdown
              </CardTitle>
              <span className="text-lg font-bold">
                ${((currentMonth?.expenses || 0) / 1000).toFixed(1)}k
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.category}</span>
                      <Badge 
                        variant="secondary" 
                        className={item.change <= 0 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {item.change >= 0 ? "+" : ""}{item.change}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold">${(item.amount / 1000).toFixed(1)}k</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Net Profit Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Net Profit - Jan 2026</h3>
              <p className="text-3xl font-bold mt-1">${((currentMonth?.profit || 0) / 1000).toFixed(1)}k</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-xl font-bold">{currentMonth?.margin || 0}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">vs Last Month</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+{financials?.profitChange || 0}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
