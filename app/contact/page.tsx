import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us | Smart Cart",
  description: "Get in touch with the Smart Cart team for inquiries and support",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        We're here to help with any questions or feedback you might have.
      </p>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-3 bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
          
          <form className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Your email address" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="What is this regarding?" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Please describe your question or feedback in detail" 
                rows={6} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full">
              Send Message
            </Button>
            
            <p className="text-sm text-muted-foreground text-center mt-4">
              We'll get back to you as soon as possible.
            </p>
          </form>
        </div>

        {/* Contact Information */}
        <div className="md:col-span-2">
          <div className="bg-card border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">hello@smartcart.lol</p>
                  <p className="text-sm text-muted-foreground mt-1">We typically respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">SmartCart Inc.</p>
                  <p className="text-muted-foreground">1831 McAlpin rd.</p>
                  <p className="text-muted-foreground">Midlothian, TX 76065</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium">Company Information</h3>
                  <p className="text-muted-foreground">SmartCart Inc.</p>
                  <p className="text-muted-foreground">C Corporation in Delaware</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Customer Support Hours</h2>
            <p className="mb-4">We're available to assist you:</p>
            <div className="space-y-1">
              <p><span className="font-medium">Monday-Friday:</span> 9:00 AM - 6:00 PM EST</p>
              <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM EST</p>
              <p><span className="font-medium">Sunday:</span> Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 