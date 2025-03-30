'use client';
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">Help & Support</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 px-6 py-8 w-[80%] mx-auto">
          <h1 className="text-2xl font-bold">Help & Support</h1>

          {/* Contact Support */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
            <p className="text-sm text-gray-500 mb-4">Need assistance? Our support team is here to help.</p>
            <Button className="w-full">Contact Us</Button>
          </div>

          {/* FAQ Section */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                <AccordionContent>
                  Go to the settings page and click on "Reset Password." Follow the instructions sent to your email.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>How do I upgrade my subscription?</AccordionTrigger>
                <AccordionContent>
                  Visit the profile page and select a new tier under "Subscription Tier."
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept all major credit cards, PayPal, and bank transfers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Payment & Billing */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Payment & Billing</h2>
            <p className="text-sm text-gray-500">For inquiries related to billing, refunds, and invoices:</p>
            <ul className="list-disc list-inside text-sm mt-3 space-y-1">
              <li>View your billing history in the Profile page.</li>
              <li>Refund requests can be submitted via Contact Support.</li>
              <li>Invoices are automatically sent to your registered email.</li>
            </ul>
          </div>

          {/* Reference Links */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Helpful Links</h2>
            <ul className="list-none text-sm space-y-2 mt-2">
              <li><a href="#" className="text-blue-500 hover:underline">📖 User Guide</a></li>
              <li><a href="#" className="text-blue-500 hover:underline">📜 Terms of Service</a></li>
              <li><a href="#" className="text-blue-500 hover:underline">🔒 Privacy Policy</a></li>
            </ul>
          </div>

          {/* Feedback */}
          <div className="border p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Give Feedback</h2>
            <p className="text-sm text-gray-500 mb-4">We value your feedback! Let us know how we can improve.</p>
            <Button className="w-full">Submit Feedback</Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
