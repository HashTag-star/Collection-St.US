
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, ShoppingBag, Users, TrendingUp, DollarSign, Activity } from "lucide-react";

// Mock data for demonstration
const overviewStats = [
  { title: "Total Revenue", value: "GH₵ 125,670", change: "+15.2% MoM", icon: DollarSign, dataAiHint: "revenue graph" },
  { title: "Total Orders", value: "1,890", change: "+8.5% MoM", icon: ShoppingBag, dataAiHint: "orders chart"},
  { title: "New Customers", value: "320", change: "+5.1% MoM", icon: Users, dataAiHint: "customer growth"},
  { title: "Conversion Rate", value: "3.45%", change: "+0.2% MoM", icon: TrendingUp, dataAiHint: "conversion funnel"},
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Analytics Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-b-lg">
            {/* Placeholder for Line Chart */}
            <div className="text-center">
              <LineChart className="h-16 w-16 text-primary mx-auto mb-2" data-ai-hint="sales line chart" />
              <p className="text-muted-foreground">Sales Line Chart (Coming Soon)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Top Product Categories</CardTitle>
            <CardDescription>Distribution of sales by product category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-b-lg">
            {/* Placeholder for Pie Chart */}
             <div className="text-center">
              <PieChart className="h-16 w-16 text-primary mx-auto mb-2" data-ai-hint="category pie chart" />
              <p className="text-muted-foreground">Category Pie Chart (Coming Soon)</p>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">User Activity</CardTitle>
            <CardDescription>Site visits and user engagement.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted rounded-b-lg">
            {/* Placeholder for Bar Chart */}
            <div className="text-center">
              <BarChart className="h-16 w-16 text-primary mx-auto mb-2" data-ai-hint="activity bar chart" />
              <p className="text-muted-foreground">User Activity Bar Chart (Coming Soon)</p>
            </div>
          </CardContent>
        </Card>
        
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Advanced Analytics</CardTitle>
          <CardDescription>
            More detailed reports and custom analytics dashboards will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" data-ai-hint="analytics dashboard"/>
          <p className="text-muted-foreground">Feature Under Development</p>
        </CardContent>
      </Card>
    </div>
  );
}
