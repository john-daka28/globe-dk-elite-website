"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, CreditCard, Smartphone, Building2, DollarSign, AlertCircle } from "lucide-react"

export default function PaymentPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const packages = [
    {
      id: "single",
      name: "Single Subject",
      price: "$30",
      period: "per month",
      description: "Perfect for focusing on one subject",
      features: [
        "1 Subject of your choice",
        "2 hours per week",
        "Access to notes & materials",
        "Online & physical classes",
      ],
      popular: false,
    },
    {
      id: "double",
      name: "Two Subjects",
      price: "$55",
      period: "per month",
      description: "Save $5 with two subjects",
      features: [
        "2 Subjects of your choice",
        "4 hours per week",
        "Access to notes & materials",
        "Online & physical classes",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "full",
      name: "Full Package",
      price: "$100",
      period: "per month",
      description: "Best value for comprehensive learning",
      features: [
        "All available subjects",
        "Unlimited class hours",
        "Complete study materials",
        "Online & physical classes",
        "Priority support",
        "One-on-one tutoring sessions",
      ],
      popular: false,
    },
  ]

  const paymentMethods = [
    {
      id: "ecocash",
      name: "EcoCash",
      icon: Smartphone,
      description: "Mobile money payment",
      details: "Send to: +263 78 605 3315",
    },
    {
      id: "innbucks",
      name: "Innbucks",
      icon: Smartphone,
      description: "Mobile wallet payment",
      details: "Send to: +263 78 605 3315",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Building2,
      description: "Direct bank deposit",
      details: "Contact us for bank details",
    },
    {
      id: "usd",
      name: "USD Cash",
      icon: DollarSign,
      description: "Pay in person",
      details: "At our Epworth location",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Flexible Payment Options</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Choose a package that fits your needs and pay using your preferred method. Quality education made
              affordable.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Package</h2>
            <p className="text-muted-foreground leading-relaxed">
              Select the package that best suits your learning goals. All packages include access to expert tutors and
              comprehensive materials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`border-border relative ${
                  pkg.popular ? "border-primary border-2 shadow-lg" : ""
                } ${selectedPackage === pkg.id ? "ring-2 ring-primary" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                    <span className="text-muted-foreground ml-2">{pkg.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={selectedPackage === pkg.id ? "default" : "outline"}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Payment Methods</h2>
              <p className="text-muted-foreground leading-relaxed">
                We accept multiple payment methods for your convenience
              </p>
            </div>

            <Tabs defaultValue="mobile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="mobile" className="text-sm">
                  Mobile Money
                </TabsTrigger>
                <TabsTrigger value="bank" className="text-sm">
                  Bank Transfer
                </TabsTrigger>
                <TabsTrigger value="cash" className="text-sm">
                  Cash
                </TabsTrigger>
                <TabsTrigger value="online" className="text-sm">
                  Online
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mobile" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {paymentMethods.slice(0, 2).map((method) => (
                    <Card key={method.id} className="border-border">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <method.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{method.name}</CardTitle>
                            <CardDescription>{method.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium mb-4">{method.details}</p>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`${method.id}-amount`}>Amount</Label>
                            <Input id={`${method.id}-amount`} placeholder="Enter amount" type="number" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${method.id}-ref`}>Reference Number</Label>
                            <Input id={`${method.id}-ref`} placeholder="Transaction reference" />
                          </div>
                          <Button className="w-full">Confirm Payment</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bank">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Bank Transfer Details</CardTitle>
                        <CardDescription>Transfer directly to our bank account</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bank Name:</span>
                        <span className="text-sm font-medium">Contact us for details</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account Name:</span>
                        <span className="text-sm font-medium">GlobeDk Elite</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account Number:</span>
                        <span className="text-sm font-medium">Contact us for details</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Please contact us at +263 78 605 3315 or johnariphiosd@gmail.com to get our current bank account
                        details before making a transfer.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cash">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Cash Payment</CardTitle>
                        <CardDescription>Pay in person at our location</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Visit Our Office</p>
                          <p className="text-sm text-muted-foreground">Epworth, Harare, Zimbabwe</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Office Hours</p>
                          <p className="text-sm text-muted-foreground">Saturday: 8:00 AM - 6:00 PM</p>
                          <p className="text-sm text-muted-foreground">Sunday: 8:00 AM - 4:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Accepted Currency</p>
                          <p className="text-sm text-muted-foreground">USD and ZWL accepted</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="/contact">Get Directions</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="online">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Online Payment</CardTitle>
                        <CardDescription>Pay securely with card or online wallet</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Online payment integration coming soon! For now, please use mobile money, bank transfer, or cash
                        payment options.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Payment Instructions */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Payment Instructions</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Choose Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Select the package that best fits your learning needs from the options above.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Make Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use your preferred payment method to complete the transaction.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Step 3: Confirm Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Send payment confirmation (screenshot or reference number) to +263 78 605 3315 via WhatsApp.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Step 4: Get Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Once verified, you'll receive your login credentials and class schedule within 24 hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
