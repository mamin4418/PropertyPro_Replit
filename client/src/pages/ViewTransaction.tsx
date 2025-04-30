
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ArrowUp, ArrowDown, Calendar, Building, User, Home } from "lucide-react";
import { Link, useParams } from "wouter";

export default function ViewTransaction() {
  const [, params] = useParams();
  const transactionId = params?.id;

  // Mock transaction data (in a real app, you would fetch this from an API)
  const transaction = {
    id: 1,
    date: "2023-05-01",
    description: "Rent Payment - Unit 303",
    amount: 1850.00,
    type: "income",
    category: "Rent",
    accountId: 1,
    accountName: "Operating Account",
    bankName: "First National Bank",
    reconciled: true,
    tenantId: 12,
    tenantName: "John Smith",
    propertyId: 3,
    propertyName: "Sunset Heights",
    notes: "Monthly rent payment for May",
    referenceNumber: "REF-20230501-303",
    matchStatus: "Matched",
    matchedTo: "Rent payment from John Smith for May 2023"
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/banking/transactions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Transaction Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold flex items-center ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount > 0 ? (
                <ArrowUp className="h-5 w-5 mr-1" />
              ) : (
                <ArrowDown className="h-5 w-5 mr-1" />
              )}
              ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {transaction.date}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Match Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-md font-medium ${transaction.matchStatus === "Matched" ? "text-green-600" : "text-amber-600"}`}>
              {transaction.matchStatus}
            </div>
            {transaction.matchedTo && (
              <p className="text-sm text-muted-foreground mt-1">{transaction.matchedTo}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
          <CardDescription>Details about this bank transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p>{transaction.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <p>{transaction.category}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Reference Number</h3>
                <p>{transaction.referenceNumber}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Notes</h3>
                <p>{transaction.notes}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Building className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Account Information</h3>
                  <p className="text-sm">{transaction.accountName}</p>
                  <p className="text-sm text-muted-foreground">{transaction.bankName}</p>
                </div>
              </div>

              {transaction.propertyName && (
                <div className="flex items-start gap-2">
                  <Home className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Property</h3>
                    <p className="text-sm">{transaction.propertyName}</p>
                  </div>
                </div>
              )}

              {transaction.tenantName && (
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Tenant</h3>
                    <p className="text-sm">{transaction.tenantName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 mt-6">
        <Link href={`/banking/transactions/${transaction.id}/match`}>
          <Button>Match Transaction</Button>
        </Link>
      </div>
    </div>
  );
}
