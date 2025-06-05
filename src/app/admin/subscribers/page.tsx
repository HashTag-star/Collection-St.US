
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Loader2, MailWarning, Download } from "lucide-react";
import { getAllNewsletterSubscriptions } from '@/lib/newsletter-service';
import type { NewsletterSubscription } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        const fetchedSubscribers = await getAllNewsletterSubscriptions();
        setSubscribers(fetchedSubscribers);
      } catch (error) {
        console.error("Failed to fetch subscribers:", error);
        toast({ title: "Error", description: "Could not load newsletter subscribers.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchSubscribers();
  }, [toast]);

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast({ title: "No Data", description: "There are no subscribers to export.", variant: "destructive" });
      return;
    }
    const headers = ['Email', 'Subscribed At'];
    const rows = subscribers.map(sub => [
      sub.email,
      format(new Date(sub.subscribedAt), "yyyy-MM-dd HH:mm:ss")
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'newsletter_subscribers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export Successful", description: "Subscribers list downloaded as CSV." });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-semibold">Newsletter Subscribers</h1>
           <Button disabled>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Subscriber List</CardTitle>
            <CardDescription>View all users subscribed to your newsletter.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading subscribers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Newsletter Subscribers</h1>
        <Button onClick={handleExportCSV} disabled={subscribers.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Subscriber List</CardTitle>
          <CardDescription>
            Total Subscribers: {subscribers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="text-right">Subscribed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(subscriber.subscribedAt), "PPP p")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MailWarning className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="font-headline text-xl font-semibold mb-2">No Subscribers Yet</h2>
              <p className="text-muted-foreground">Once users subscribe to your newsletter, they will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
